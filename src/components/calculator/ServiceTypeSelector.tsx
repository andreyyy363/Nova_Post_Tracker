import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface ServiceTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  const serviceTypes = [
    {id: 'WarehouseWarehouse', label: 'Відділення → Відділення'},
    {id: 'WarehouseDoors', label: 'Відділення → Адреса'},
    {id: 'DoorsWarehouse', label: 'Адреса → Відділення'},
    {id: 'DoorsDoors', label: 'Адреса → Адреса'},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Тип доставки</Text>

      <View style={styles.buttonContainer}>
        {serviceTypes.map(type => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeButton,
              selectedType === type.id && styles.selectedButton,
            ]}
            onPress={() => onSelect(type.id)}>
            <Text
              style={[
                styles.typeText,
                selectedType === type.id && styles.selectedText,
              ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  buttonContainer: {
    flexDirection: 'column',
  },
  typeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: '#FF6B08',
  },
  typeText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ServiceTypeSelector;
