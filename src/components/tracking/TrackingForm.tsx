import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface TrackingFormProps {
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  onTrack: () => void;
  isLoading: boolean;
}

const TrackingForm: React.FC<TrackingFormProps> = ({ 
  trackingNumber, 
  setTrackingNumber, 
  onTrack, 
  isLoading 
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Введіть номер накладної"
        value={trackingNumber}
        onChangeText={setTrackingNumber}
        keyboardType="numeric"
      />
      <TouchableOpacity 
        style={styles.trackButton}
        onPress={onTrack}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Відстежити</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginRight: 8,
  },
  trackButton: {
    backgroundColor: '#FF6B08',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 48,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TrackingForm;