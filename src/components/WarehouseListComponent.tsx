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
}

// Define a type for days of the week
type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

const WarehouseList: React.FC<WarehouseListProps> = ({
  cityRef,
  onWarehouseSelect,
}) => {
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined,
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredWarehouses, setFilteredWarehouses] = useState<any[]>([]);

  const {data, isLoading, error} = useGetWarehousesQuery(
    {
      cityRef,
      warehouseType: selectedType,
    },
    {
      skip: !cityRef,
    },
  );

  useEffect(() => {
    if (data?.data) {
      const filtered = data.data.filter(warehouse => {
        const query = searchQuery.toLowerCase();
        const matchesNumber = warehouse.Number.toLowerCase().includes(query);
        const matchesAddress =
          warehouse.ShortAddress.toLowerCase().includes(query);
        const matchesDescription =
          warehouse.Description.toLowerCase().includes(query);
        return (
          !searchQuery || matchesNumber || matchesAddress || matchesDescription
        );
      });
      setFilteredWarehouses(filtered);
    }
  }, [data?.data, searchQuery]);

  const getDayName = (): DayOfWeek => {
    const dayIndex = new Date().getDay();

    switch (dayIndex) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      default:
        return 'Monday';
    }
  };

  const todayName = getDayName();

  const filterOptions = [
    {label: 'All', value: undefined},
    {label: 'Post Offices', value: WarehouseType.BRANCH},
    {label: 'Cargo Offices', value: WarehouseType.CARGO},
    {label: 'Parcel Lockers', value: WarehouseType.PARCEL_LOCKER},
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
      <Text style={styles.title}>Warehouses in the selected city</Text>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  searchContainer: {
    marginHorizontal: 16,
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
  filterContainer: {
    marginBottom: 12,
  },
  filterList: {
    paddingHorizontal: 16,
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
});

export default WarehouseList;
