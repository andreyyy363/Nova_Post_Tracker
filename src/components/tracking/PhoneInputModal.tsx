import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface PhoneInputModalProps {
  visible: boolean;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const PhoneInputModal: React.FC<PhoneInputModalProps> = ({
  visible,
  phoneNumber,
  setPhoneNumber,
  onClose,
  onSubmit
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Введіть номер телефону</Text>
          <Text style={styles.modalDescription}>
            Для отримання повної інформації про відправлення необхідно ввести номер телефону отримувача або відправника
          </Text>
          
          <TextInput
            style={styles.phoneInput}
            placeholder="0991234567"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={13}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={onClose}
            >
              <Text style={styles.modalCancelText}>Скасувати</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalSubmitButton}
              onPress={onSubmit}
            >
              <Text style={styles.modalSubmitText}>Підтвердити</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  phoneInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    flex: 0.48,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: 'bold',
  },
  modalSubmitButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FF6B08',
    flex: 0.48,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PhoneInputModal;