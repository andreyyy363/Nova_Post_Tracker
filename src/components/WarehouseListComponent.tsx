import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useGetWarehousesQuery} from '../services/api/api';
import WarehouseCard from './WarehouseCardComponent';
import {WarehouseType} from '../services/api/types';

interface WarehouseListProps {
  cityRef: string;
  onWarehouseSelect?: (warehouse: any) => void;
  condensedView?: boolean;
}

const WarehouseList: React.FC<WarehouseListProps> = ({
  cityRef,
  onWarehouseSelect,
  condensedView = false,
}) => {
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined,
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredWarehouses, setFilteredWarehouses] = useState<any[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const {data, isLoading, error} = useGetWarehousesQuery(
    {cityRef},
    {skip: !cityRef},
  );

  // Use memoization for filtering large datasets
  useEffect(() => {
    if (!data?.data) return;

    setIsFiltering(true);

    // Use a small timeout to prevent UI blocking during filtering
    const filterTimeout = setTimeout(() => {
      try {
        const filtered = data.data.filter(warehouse => {
          const matchesType =
            !selectedType || warehouse.TypeOfWarehouse === selectedType;

          // Only apply text search if a query exists
          if (!searchQuery) return matchesType;

          const query = searchQuery.toLowerCase();
          return (
            matchesType &&
            (warehouse.Number.toLowerCase().includes(query) ||
              warehouse.ShortAddress.toLowerCase().includes(query) ||
              warehouse.Description.toLowerCase().includes(query))
          );
        });

        setFilteredWarehouses(filtered);
      } finally {
        setIsFiltering(false);
      }
    }, 100);

    return () => clearTimeout(filterTimeout);
  }, [data?.data, selectedType, searchQuery]);

  const getDayName = () => {
    const dayIndex = new Date().getDay();
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[dayIndex];
  };

  const todayName = getDayName();

  const filterOptions = [
    {label: 'All', value: undefined},
    {label: 'Post Offices', value: WarehouseType.BRANCH},
    {label: 'Cargo Offices', value: WarehouseType.CARGO},
    {label: 'Postomats', value: WarehouseType.POSTOMAT},
  ];

  // Add memo for visible warehouses
  const visibleWarehouses = useMemo(() => {
    return condensedView && filteredWarehouses.length > 0
      ? filteredWarehouses.slice(0, 1)
      : filteredWarehouses;
  }, [filteredWarehouses, condensedView]);

  if (!cityRef) {
    return <Text style={styles.messageText}>Please select a city first</Text>;
  }

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#f54b00" style={styles.loader} />
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error loading warehouses</Text>;
  }

  if (!data?.data?.length) {
    return <Text style={styles.messageText}>No warehouses found</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header section with filters always visible */}
      <View style={styles.headerContainer}>
        {/* Search input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by number or address..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Type filter */}
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            data={filterOptions}
            keyExtractor={item => item.label}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedType === item.value && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedType(item.value)}>
                <Text
                  style={[
                    styles.filterText,
                    selectedType === item.value && styles.filterTextActive,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          />
        </View>
      </View>

      {/* Filter status */}
      {isFiltering ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#f54b00" />
          <Text style={styles.loadingText}>Filtering warehouses...</Text>
        </View>
      ) : (
        <Text style={styles.countText}>
          {filteredWarehouses.length} warehouses found
        </Text>
      )}

      {/* List content */}
      <View style={styles.listContainer}>
        {filteredWarehouses.length === 0 && searchQuery && !isFiltering ? (
          <Text style={styles.messageText}>No matching warehouses found</Text>
        ) : (
          <FlatList
            data={visibleWarehouses}
            keyExtractor={item => item.Ref}
            renderItem={({item}) => (
              <WarehouseCard
                name={item.Description}
                address={item.ShortAddress}
                number={item.Number}
                schedule={item.Schedule?.[todayName]}
                onPress={() => onWarehouseSelect && onWarehouseSelect(item)}
              />
            )}
            contentContainerStyle={[
              styles.listContent,
              condensedView && styles.condensedList,
            ]}
            scrollEnabled={!condensedView}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  searchContainer: {
    marginBottom: 8,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  messageText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  countText: {
    textAlign: 'center',
    paddingVertical: 8,
    color: '#666',
    fontSize: 14,
  },
  filterContainer: {
    marginBottom: 4,
  },
  filterList: {
    paddingVertical: 4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#f54b00',
  },
  filterText: {
    color: '#333',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  condensedList: {
    maxHeight: 80,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
});

export default WarehouseList;
