import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

interface WeightInputProps {
  weight: string;
  setWeight: (weight: string) => void;
  seatsAmount: string;
  setSeatsAmount: (seats: string) => void;
  declaredValue: string;
  setDeclaredValue: (value: string) => void;
}

const WeightInput: React.FC<WeightInputProps> = ({
  weight,
  setWeight,
  seatsAmount,
  setSeatsAmount,
  declaredValue,
  setDeclaredValue
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Вага (кг)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="0.1"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Кількість місць</Text>
        <TextInput
          style={styles.input}
          value={seatsAmount}
          onChangeText={setSeatsAmount}
          keyboardType="numeric"
          placeholder="1"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Оголошена вартість (грн)</Text>
        <TextInput
          style={styles.input}
          value={declaredValue}
          onChangeText={setDeclaredValue}
          keyboardType="numeric"
          placeholder="100"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 16,
  },
});

export default WeightInput;