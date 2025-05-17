import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CitySearchComponent from '../CitySearchComponent';
import { City } from '../../types/calculator';

interface CitySelectorProps {
  label: string;
  selectedCity: City | null;
  onCitySelect: (city: City) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ 
  label, 
  selectedCity, 
  onCitySelect 
}) => {
  const [showSearch, setShowSearch] = useState(false);

  const handleSelect = (city: {name: string; ref: string}) => {
    onCitySelect({
      name: city.name,
      ref: city.ref
    });
    setShowSearch(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {selectedCity ? (
        <View style={styles.selectedCity}>
          <View style={styles.cityNameContainer}>
            <Text 
              style={styles.cityName} 
              numberOfLines={1} 
              ellipsizeMode="tail"
            >
              {selectedCity.name}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.changeButton}
            onPress={() => setShowSearch(true)}
          >
            <Text style={styles.changeButtonText}>Змінити</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => setShowSearch(true)}
        >
          <Text style={styles.selectButtonText}>Обрати місто</Text>
        </TouchableOpacity>
      )}
      
      {showSearch && (
        <View style={styles.searchContainer}>
          <CitySearchComponent onCitySelect={handleSelect} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  selectedCity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
  },
  cityNameContainer: {
    flex: 1,
    marginRight: 10, 
  },
  cityName: {
    fontSize: 16,
    color: '#333',
  },
  changeButton: {
    backgroundColor: '#FF6B08',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    width: 80, 
    alignItems: 'center', 
  },
  changeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#FF6B08',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchContainer: {
    marginTop: 8,
  },
});

export default CitySelector;