import React, {useState, useEffect} from 'react';
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
  condensedView?: boolean; // new prop for when list is collapsed
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

  const {data, isLoading, error} = useGetWarehousesQuery(
    {cityRef},
    {skip: !cityRef},
  );

  useEffect(() => {
    if (data?.data) {
      const filtered = data.data.filter(warehouse => {
        const matchesType =
          !selectedType || warehouse.TypeOfWarehouse === selectedType;

        const query = searchQuery.toLowerCase();
        const matchesNumber = warehouse.Number.toLowerCase().includes(query);
        const matchesAddress =
          warehouse.ShortAddress.toLowerCase().includes(query);
        const matchesDescription =
          warehouse.Description.toLowerCase().includes(query);

        return (
          matchesType &&
          (!searchQuery ||
            matchesNumber ||
            matchesAddress ||
            matchesDescription)
        );
      });

      setFilteredWarehouses(filtered);
    }
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

      {/* Only show results count when in condensed view */}
      {condensedView ? (
        <>
          <Text style={styles.countText}>
            {filteredWarehouses.length} warehouses found
          </Text>
          {filteredWarehouses.length > 0 && (
            <FlatList
              data={filteredWarehouses.slice(0, 1)} // Take only the first item
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
              contentContainerStyle={[styles.listContent, styles.condensedList]}
              scrollEnabled={false}
            />
          )}
        </>
      ) : (
        <View style={styles.listContainer}>
          {filteredWarehouses.length === 0 && searchQuery ? (
            <Text style={styles.messageText}>No matching warehouses found</Text>
          ) : (
            <FlatList
              data={filteredWarehouses}
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
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      )}
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
    maxHeight: 80, // Approximate height of one warehouse card
    paddingHorizontal: 16,
  },
});

export default WarehouseList;
