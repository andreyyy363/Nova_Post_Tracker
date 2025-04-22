import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, Modal} from 'react-native';
import CitySearch from '../components/CitySearchComponent';
import WarehouseList from '../components/WarehouseListComponent';
import WarehouseMap from '../components/WarehouseMapComponent';

const CitySearchScreen = () => {
  const [selectedCity, setSelectedCity] = useState<{
    name: string;
    ref: string;
  } | null>(null);

  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const handleCitySelect = (city: {name: string; ref: string}) => {
    console.log('Selected city reference:', city.ref);
    setSelectedCity(city);
  };

  const handleWarehouseSelect = (warehouse: any) => {
    console.log('Selected warehouse:', warehouse);
    setSelectedWarehouse(warehouse);
    setIsMapVisible(true);
  };

  const closeMap = () => {
    setIsMapVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <CitySearch onCitySelect={handleCitySelect} />
      </View>

      {selectedCity && (
        <View style={styles.warehousesContainer}>
          <WarehouseList
            cityRef={selectedCity.ref}
            onWarehouseSelect={handleWarehouseSelect}
          />
        </View>
      )}

      {selectedWarehouse && (
        <Modal
          visible={isMapVisible}
          animationType="slide"
          onRequestClose={closeMap}>
          <WarehouseMap warehouse={selectedWarehouse} onClose={closeMap} />
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  warehousesContainer: {
    flex: 1,
  },
});

export default CitySearchScreen;
