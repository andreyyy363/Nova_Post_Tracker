import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import CitySearch from '../components/CitySearchComponent';
import WarehouseList from '../components/WarehouseListComponent';

const CitySearchScreen = () => {
  const [selectedCity, setSelectedCity] = useState<{
    name: string;
    ref: string;
  } | null>(null);

const handleCitySelect = (city: {name: string; ref: string}) => {
  console.log('Selected city reference:', city.ref);
  setSelectedCity(city);
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
            onWarehouseSelect={warehouse => {
              console.log('Selected warehouse:', warehouse);
            }}
          />
        </View>
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
