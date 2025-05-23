import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useSearchCitiesMutation} from '../services/api/api';

interface CitySearchProps {
  onCitySelect: (city: {name: string; ref: string}) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({onCitySelect}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState<Array<{name: string; ref: string}>>([]);

  const [searchCities, {isLoading}] = useSearchCitiesMutation();

  const handleSearch = async (text: string) => {
    setSearchQuery(text);

    if (text.length < 3) {
      setCities([]);
      return;
    }

    try {
      const response = await searchCities(text).unwrap();

      if (response.success && response.data[0]?.Addresses) {
        const formattedCities = response.data[0].Addresses.map(city => ({
          name: city.Present,
          ref: city.Ref,
        }));
        setCities(formattedCities);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Failed to search cities:', error);
      setCities([]);
    }
  };

  const handleCitySelect = (city: {name: string; ref: string}) => {
    onCitySelect(city);
    setSearchQuery(city.name);
    setCities([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Введіть назву міста..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {isLoading && <ActivityIndicator style={styles.loader} />}

      {cities.length > 0 && (
        <FlatList
          data={cities}
          keyExtractor={item => item.ref}
          style={styles.resultsList}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.cityItem}
              onPress={() => handleCitySelect(item)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  loader: {
    marginTop: 10,
  },
  resultsList: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 4,
  },
  cityItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default CitySearch;
