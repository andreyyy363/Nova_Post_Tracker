import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

interface DimensionsInputProps {
  length: string;
  width: string;
  height: string;
  setLength: (length: string) => void;
  setWidth: (width: string) => void;
  setHeight: (height: string) => void;
}

const DimensionsInput: React.FC<DimensionsInputProps> = ({
  length,
  width,
  height,
  setLength,
  setWidth,
  setHeight,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Габарити (см)</Text>
      <Text style={styles.subtitle}>
        Необов'язково. Додайте, щоб розрахувати об'ємну вагу
      </Text>

      <View style={styles.dimensionsRow}>
        <View style={styles.dimensionInput}>
          <Text style={styles.dimensionLabel}>Довжина</Text>
          <TextInput
            style={styles.input}
            value={length}
            onChangeText={setLength}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>

        <View style={styles.dimensionInput}>
          <Text style={styles.dimensionLabel}>Ширина</Text>
          <TextInput
            style={styles.input}
            value={width}
            onChangeText={setWidth}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>

        <View style={styles.dimensionInput}>
          <Text style={styles.dimensionLabel}>Висота</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  dimensionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dimensionInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  dimensionLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    textAlign: 'center',
  },
});

export default DimensionsInput;
