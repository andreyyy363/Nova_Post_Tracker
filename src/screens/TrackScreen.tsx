import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTrackDocumentMutation } from '../services/api/api';
import { TrackingResponse } from '../types/tracking';
import { samplePackage } from '../constants/sampleData';
import PhoneInputModal from '../components/tracking/PhoneInputModal';
import PackageCard from '../components/tracking/PackageCard';
import TrackingForm from '../components/tracking/TrackingForm';

const TrackScreen = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trackDocument, { isLoading }] = useTrackDocumentMutation();
  const [trackingResult, setTrackingResult] = useState<TrackingResponse | null>(null);
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [hasEnteredPhone, setHasEnteredPhone] = useState(false);

  const handleTrack = async (phoneNum?: string) => {
    if (trackingNumber.trim() === '') {
        setTrackingResult({
            success: true,
            data: [{
                Number: samplePackage.number,
                StatusCode: samplePackage.statusCode,
                StatusDescription: samplePackage.status,
                ScheduledDeliveryDate: samplePackage.estimatedDelivery,
                WarehouseSenderAddress: samplePackage.from,
                WarehouseRecipientAddress: samplePackage.to,
                CreatedAt: samplePackage.created,
                RecipientFullName: samplePackage.recipient,
                Recipient: samplePackage.recipient,
                SenderFullNameEW: samplePackage.sender,
                DocumentWeight: samplePackage.weight,
                DocumentCost: samplePackage.price,
                CargoDescription: samplePackage.description
            }],
            errors: []
        });
        return;
    }
    try {
        const requestParams = {
            documentNumber: trackingNumber,
            phone: phoneNum ? phoneNum.replace(/[^0-9]/g, '') : undefined
        };
        
        const result = await trackDocument(requestParams).unwrap();
        console.log("API response:", JSON.stringify(result, null, 2));
        
        if (result && result.success && result.data && result.data.length > 0) {
            setTrackingResult(result as unknown as TrackingResponse);
        } else {
            setTrackingResult(result as unknown as TrackingResponse);
        }
    } catch (err) {
        console.error('Failed to track document:', err);
        setTrackingResult({
            success: false,
            data: [],
            errors: ['Помилка при пошуку відправлення.']
        });
    }
  };

  const handleFullInfoClick = () => {
    if (showFullInfo) {
      setShowFullInfo(false);
    } else {
      if (trackingNumber.trim() !== '' && !hasEnteredPhone) {
        setShowPhoneModal(true);
      } else {
        setShowFullInfo(true);
      }
    }
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.trim().length >= 10) {
      setHasEnteredPhone(true);
      setShowPhoneModal(false);
      setShowFullInfo(true);
      
      handleTrack(phoneNumber);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Відстеження відправлень</Text>
      
      <TrackingForm 
        trackingNumber={trackingNumber}
        setTrackingNumber={setTrackingNumber}
        onTrack={() => handleTrack()}
        isLoading={isLoading}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Результаты поиска */}
        {trackingResult && trackingResult.success && trackingResult.data && trackingResult.data.length > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.sectionTitle}>Інформація про відправлення:</Text>
            
            <PackageCard 
              data={trackingResult.data[0]}
              isDemo={trackingNumber.trim() === ''}
              showFullInfo={showFullInfo}
              hasEnteredPhone={hasEnteredPhone}
              onFullInfoClick={handleFullInfoClick}
              onPhoneModalShow={() => setShowPhoneModal(true)}
            />
          </View>
        )}
        
        {trackingResult && !trackingResult.success && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {trackingResult.errors && trackingResult.errors.length > 0 
                ? trackingResult.errors[0] 
                : 'Помилка при пошуку відправлення.'}
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Модальное окно для ввода номера телефона */}
      <PhoneInputModal
        visible={showPhoneModal}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        onClose={() => setShowPhoneModal(false)}
        onSubmit={handlePhoneSubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  resultContainer: {
    paddingBottom: 20,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default TrackScreen;