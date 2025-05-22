import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {PackageService} from '../../services/api/PackageService';

interface TrackingFormProps {
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  onTrack: () => void;
  isLoading: boolean;
  errorMessage?: string;
  setErrorMessage?: (message: string) => void;
}

const TrackingForm: React.FC<TrackingFormProps> = ({
  trackingNumber,
  setTrackingNumber,
  onTrack,
  isLoading,
  errorMessage,
  setErrorMessage,
}) => {
  const [localError, setLocalError] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    if (trackingNumber.trim()) {
      const validation = PackageService.validateTrackingNumber(trackingNumber);
      setIsValid(validation.isValid);
      setLocalError(validation.isValid ? '' : validation.message);

      if (setErrorMessage) {
        setErrorMessage(validation.isValid ? '' : validation.message);
      }
    } else {
      setIsValid(false);
      setLocalError('');
      if (setErrorMessage) setErrorMessage('');
    }
  }, [trackingNumber]);

  const handleTrack = () => {
    const validation = PackageService.validateTrackingNumber(trackingNumber);
    if (validation.isValid) {
      onTrack();
    } else {
      Alert.alert('Помилка валідації', validation.message);
      setLocalError(validation.message);
      if (setErrorMessage) setErrorMessage(validation.message);
    }
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            !isValid && trackingNumber.trim() ? styles.inputError : null,
          ]}
          placeholder="Введіть номер накладної"
          value={trackingNumber}
          onChangeText={setTrackingNumber}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[
            styles.trackButton,
            !isValid || !trackingNumber.trim() ? styles.disabledButton : null,
          ]}
          onPress={handleTrack}
          disabled={isLoading || !isValid || !trackingNumber.trim()}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Відстежити</Text>
          )}
        </TouchableOpacity>
      </View>

      {localError && trackingNumber.trim() ? (
        <Text style={styles.errorText}>{localError}</Text>
      ) : errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
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
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  trackButton: {
    backgroundColor: '#FF6B08',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 48,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFF0F0',
    padding: 8,
    borderRadius: 4,
  },
});

export default TrackingForm;
