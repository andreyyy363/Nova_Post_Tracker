import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTrackDocumentMutation} from '../services/api/api';
import {TrackingResponse, TrackingData} from '../types/tracking';
import PhoneInputModal from '../components/tracking/PhoneInputModal';
import PackageCard from '../components/tracking/PackageCard';
import TrackingForm from '../components/tracking/TrackingForm';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_PACKAGES_KEY = 'saved_packages';

const TrackScreen = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trackDocument, {isLoading}] = useTrackDocumentMutation();
  const [trackingResult, setTrackingResult] = useState<TrackingResponse | null>(
    null,
  );
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [hasEnteredPhone, setHasEnteredPhone] = useState(false);
  const [prevTrackingNumber, setPrevTrackingNumber] = useState('');
  const [activeTab, setActiveTab] = useState('track');
  const [myPackages, setMyPackages] = useState<TrackingData[]>([]);
  const [isLoadingMyPackages, setIsLoadingMyPackages] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TrackingData | null>(
    null,
  );
  const [pendingPackage, setPendingPackage] = useState<TrackingData | null>(
    null,
  );
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);

  useEffect(() => {
    loadSavedPackages();
  }, []);

  const loadSavedPackages = async () => {
    try {
      const savedPackagesStr = await AsyncStorage.getItem(SAVED_PACKAGES_KEY);
      if (savedPackagesStr) {
        const savedPackages = JSON.parse(savedPackagesStr);
        setMyPackages(savedPackages);
      }
    } catch (error) {
      console.error('Помилка при завантаженні посилок:', error);
    }
  };

  const savePackages = async (packages: TrackingData[]) => {
    try {
      await AsyncStorage.setItem(SAVED_PACKAGES_KEY, JSON.stringify(packages));
    } catch (error) {
      console.error('Помилка при збереженні посилок:', error);
    }
  };

  const addToMyPackages = (packageData: TrackingData) => {
    const exists = myPackages.some(pkg => pkg.Number === packageData.Number);

    if (!exists) {
      const updatedPackages = [...myPackages, packageData];
      setMyPackages(updatedPackages);
      savePackages(updatedPackages);
      console.log('Посилку додано до збережених:', packageData.Number);
    }
  };

  const deletePackage = (packageNumber: string) => {
    Alert.alert(
      'Видалення посилки',
      'Ви дійсно хочете видалити цю посилку з вашого списку?',
      [
        {
          text: 'Скасувати',
          style: 'cancel',
        },
        {
          text: 'Видалити',
          onPress: () => {
            const updatedPackages = myPackages.filter(
              pkg => pkg.Number !== packageNumber,
            );
            setMyPackages(updatedPackages);
            savePackages(updatedPackages);
          },
          style: 'destructive',
        },
      ],
    );
  };

  useEffect(() => {
    if (trackingNumber !== prevTrackingNumber && prevTrackingNumber !== '') {
      setShowFullInfo(false);
      setHasEnteredPhone(false);
    }
  }, [trackingNumber, prevTrackingNumber]);

  const handleTrackingNumberChange = (value: string) => {
    setPrevTrackingNumber(trackingNumber);
    setTrackingNumber(value);
  };

  const handleTrack = async (phoneNum?: string) => {
    if (trackingNumber.trim() === '') {
      return;
    }

    try {
      const requestParams = {
        documentNumber: trackingNumber,
        phone: phoneNum ? phoneNum.replace(/[^0-9]/g, '') : undefined,
      };

      const result = await trackDocument(requestParams).unwrap();
      console.log('API response:', JSON.stringify(result, null, 2));

      if (result && result.success && result.data && result.data.length > 0) {
        setTrackingResult(result as unknown as TrackingResponse);

        addToMyPackages(result.data[0]);
      } else {
        setTrackingResult(result as unknown as TrackingResponse);
      }
    } catch (err) {
      console.error('Failed to track document:', err);
      setTrackingResult({
        success: false,
        data: [],
        errors: [
          'Помилка при пошуку відправлення. Перевірте номер ТТН та спробуйте ще раз.',
        ],
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    if (tab === 'myPackages') {
      setSelectedPackage(null);
    }
  };

  const handleFullInfoClick = () => {
    if (showFullInfo) {
      setShowFullInfo(false);
    } else {
      if (
        trackingNumber.trim() !== '' &&
        !hasEnteredPhone &&
        activeTab === 'track'
      ) {
        setShowPhoneModal(true);
      } else {
        setShowFullInfo(true);
      }
    }
  };

  const verifyPhoneForPackage = async (
    packageData: TrackingData,
    phone: string,
  ) => {
    try {
      const result = await trackDocument({
        documentNumber: packageData.Number,
        phone: phone.replace(/[^0-9]/g, ''),
      }).unwrap();

      if (result && result.success && result.data && result.data.length > 0) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to verify phone for package:', err);
      return false;
    }
  };

  const handlePhoneSubmit = async () => {
    if (phoneNumber.trim().length >= 10) {
      setHasEnteredPhone(true);

      if (isVerifyingPhone && pendingPackage) {
        setIsLoadingMyPackages(true);
        const isValid = await verifyPhoneForPackage(
          pendingPackage,
          phoneNumber,
        );
        setIsLoadingMyPackages(false);

        if (isValid) {
          setSelectedPackage(pendingPackage);
          setPendingPackage(null);
          setIsVerifyingPhone(false);
          setShowPhoneModal(false);
        } else {
          Alert.alert(
            'Невірний номер телефону',
            'Введений вами номер не відповідає даній посилці. Перевірте та спробуйте ще раз.',
          );
          return;
        }
      } else if (activeTab === 'track') {
        setShowFullInfo(true);
        handleTrack(phoneNumber);
        setShowPhoneModal(false);
      } else {
        setShowPhoneModal(false);
      }
    }
  };

  const handlePackageSelect = (packageData: TrackingData) => {
    setSelectedPackage(packageData);
  };

  const getPackageStatus = (packageData: TrackingData): string => {
    const status = (packageData as any).Status;
    const statusDescription =
      packageData.StatusDescription || (packageData as any).StatusDescription;

    if (status && status.includes('Інформація прихована')) {
      return 'Посилка в дорозі';
    }

    if (
      statusDescription &&
      statusDescription.includes('Інформація прихована')
    ) {
      return 'Посилка в дорозі';
    }

    if (status) return status;
    if (statusDescription) return statusDescription;
    if (packageData.StatusCode) return `Статус: ${packageData.StatusCode}`;

    return 'Статус невідомий';
  };

  const renderTrackingTab = () => (
    <>
      <TrackingForm
        trackingNumber={trackingNumber}
        setTrackingNumber={handleTrackingNumberChange}
        onTrack={() => {
          if (hasEnteredPhone) {
            handleTrack(phoneNumber);
          } else {
            handleTrack();
          }
        }}
        isLoading={isLoading}
      />

      <ScrollView style={styles.scrollView}>
        {trackingResult &&
          trackingResult.success &&
          trackingResult.data &&
          trackingResult.data.length > 0 && (
            <View style={styles.resultContainer}>
              <Text style={styles.sectionTitle}>
                Інформація про відправлення:
              </Text>

              <PackageCard
                data={trackingResult.data[0]}
                isDemo={false}
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
    </>
  );

  const renderMyPackagesTab = () => (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.sectionTitle}>Мої посилки:</Text>

      {isLoadingMyPackages ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingMessage}>
            Завантажуємо ваші посилки...
          </Text>
        </View>
      ) : myPackages.length > 0 && !selectedPackage ? (
        // Відображаємо список посилок як кнопок
        <View style={styles.packageButtonsContainer}>
          {myPackages.map((pkg, index) => (
            <View key={pkg.Number || index} style={styles.packageButtonWrapper}>
              <TouchableOpacity
                style={styles.packageButton}
                onPress={() => handlePackageSelect(pkg)}>
                <View style={styles.packageButtonLeft}>
                  <Text style={styles.packageButtonNumber}>№ {pkg.Number}</Text>
                  <Text style={styles.packageButtonStatus}>
                    {getPackageStatus(pkg)}
                  </Text>
                </View>
                <View style={styles.packageButtonRight}>
                  <Text style={styles.packageButtonIcon}>📦</Text>
                  <Text style={styles.packageButtonArrow}>›</Text>
                </View>
              </TouchableOpacity>

              {/* Кнопка видалення */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deletePackage(pkg.Number)}>
                <Text style={styles.deleteButtonText}>🚮</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : selectedPackage ? (
        // Відображаємо повну інформацію про вибрану посилку
        <View style={styles.resultContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedPackage(null)}>
            <Text style={styles.backButtonText}>‹ Назад до списку посилок</Text>
          </TouchableOpacity>

          <PackageCard
            data={selectedPackage}
            isDemo={false}
            showFullInfo={true}
            hasEnteredPhone={true}
            onFullInfoClick={() => {}}
            onPhoneModalShow={() => {}}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyMessage}>
            У вас поки немає збережених посилок. Відстежте свою першу посилку на
            вкладці "Відстеження".
          </Text>
          <TouchableOpacity
            style={styles.findPackageButton}
            onPress={() => setActiveTab('track')}>
            <Text style={styles.findPackageButtonText}>Відстежити посилку</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>
        {activeTab === 'track'
          ? 'Відстеження відправлень'
          : 'Мої посилки'}
      </Text>

      {/* Tab selector for track vs. my packages */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'track' && styles.activeTab]}
          onPress={() => handleTabChange('track')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'track' && styles.activeTabText,
            ]}>
            Відстеження
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'myPackages' && styles.activeTab]}
          onPress={() => handleTabChange('myPackages')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'myPackages' && styles.activeTabText,
            ]}>
            Мої посилки
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'track' ? renderTrackingTab() : renderMyPackagesTab()}

      <PhoneInputModal
        visible={showPhoneModal}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        onClose={() => {
          setShowPhoneModal(false);
          if (isVerifyingPhone) {
            setPendingPackage(null);
            setIsVerifyingPhone(false);
          }
        }}
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
    marginTop: 20,
    backgroundColor: '#ffeeee',
    borderRadius: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  loadingMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  findPackageButton: {
    backgroundColor: '#FF6B08',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  findPackageButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  packageButtonsContainer: {
    marginTop: 10,
  },
  packageButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  packageButtonLeft: {
    flex: 1,
  },
  packageButtonNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  packageButtonStatus: {
    fontSize: 14,
    color: '#666',
  },
  packageButtonRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageButtonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  packageButtonArrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffeeee',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  backButton: {
    marginBottom: 16,
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6B08',
    fontWeight: '500',
  },
  tabSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FF6B08',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
});

export default TrackScreen;
