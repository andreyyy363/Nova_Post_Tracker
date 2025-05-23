import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import CitySearch from '../components/CitySearchComponent';
import WarehouseList from '../components/WarehouseListComponent';
import WarehouseMap from '../components/WarehouseMapComponent';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const COLLAPSED_HEIGHT = 120;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.7;

const CitySearchScreen = () => {
  const [selectedCity, setSelectedCity] = useState<{
    name: string;
    ref: string;
  } | null>(null);

  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [isListExpanded, setIsListExpanded] = useState(false);

  const handleCitySelect = (city: {name: string; ref: string}) => {
    setSelectedCity(city);
  };

  const handleWarehouseSelect = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setIsListExpanded(false);
  };

  const toggleList = () => {
    setIsListExpanded(prev => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Відділення Нової пошти</Text>
      <View style={styles.searchContainer}>
        <CitySearch onCitySelect={handleCitySelect} />
      </View>

      {selectedCity && (
        <>
          <View style={styles.mapContainer}>
            <WarehouseMap
              warehouse={selectedWarehouse}
              defaultLocation={selectedCity}
              showAllWarehouses={true}
            />
          </View>

          <View
            style={[
              styles.listPanel,
              {height: isListExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT},
            ]}>
            {/* Кнопка для сворачивания/разворачивания */}
            <TouchableOpacity
              style={styles.handleContainer}
              onPress={toggleList}
              activeOpacity={0.7}>
              <View style={styles.handle} />
            </TouchableOpacity>

            <View style={styles.warehousesContainer}>
              <WarehouseList
                cityRef={selectedCity.ref}
                onWarehouseSelect={handleWarehouseSelect}
                condensedView={!isListExpanded}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 10,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  listPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    overflow: 'hidden',
  },
  handleContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  warehousesContainer: {
    flex: 1,
  },
});

export default CitySearchScreen;
