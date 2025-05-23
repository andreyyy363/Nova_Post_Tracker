import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const SAVED_PACKAGES_KEY = 'saved_packages';
const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [greeting, setGreeting] = useState('');
  const [packageCount, setPackageCount] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const tips = [
    'Вказуйте номер телефону для отримання максимальної інформації про відправлення',
    'Для пошуку відділення виберіть спочатку місто у вкладці «Відділення»',
    'Скануйте QR-код на терміналах самообслуговування для швидкого отримання',
    'Перевіряйте адресу отримання перед замовленням доставки додому',
    'У вкладці «Калькулятор» можна дізнатися приблизну вартість відправлення',
  ];

  useEffect(() => {
    setTimeBasedGreeting();
    loadSavedPackages();

    const interval = setInterval(() => {
      animateToNextTip();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate to the next tip with a sliding effect
  const animateToNextTip = () => {
    // Start sliding out current tip
    Animated.timing(slideAnim, {
      toValue: -width, // Slide to left
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      // Update tip index
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
      
      // Reset position instantly (not visible to user)
      slideAnim.setValue(width);
      
      // Slide in the new tip
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    });
  };

  const setTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Доброго ранку');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Доброго дня');
    } else {
      setGreeting('Доброго вечора');
    }
  };

  const loadSavedPackages = async () => {
    try {
      const savedPackagesStr = await AsyncStorage.getItem(SAVED_PACKAGES_KEY);
      if (savedPackagesStr) {
        const savedPackages = JSON.parse(savedPackagesStr);
        setPackageCount(savedPackages.length);
      }
    } catch (error) {
      console.error('Помилка при завантаженні посилок:', error);
    }
  };

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header with Logo */}
        <View style={styles.header}>
          {/* <Image
            source={require('../assets/images/nova-post-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          /> */}
          <Text style={styles.greeting}>{greeting}!</Text>
        </View>

        {/* Main Dashboard Section */}
        <View style={styles.dashboardContainer}>
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigateTo('Track')}>
              <Text style={styles.statTitle}>Відстеження</Text>
              <Text style={styles.statIcon}>🔍</Text>
              <Text style={styles.statDescription}>
                Перевірте статус відправлення за номером ТТН
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigateTo('CitySearch')}>
              <Text style={styles.statTitle}>Відділення</Text>
              <Text style={styles.statIcon}>📍</Text>
              <Text style={styles.statDescription}>
                Знайдіть найближче відділення на карті
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigateTo('Track')}>
              <Text style={styles.statTitle}>Мої посилки</Text>
              <Text style={styles.statIcon}>📦</Text>
              <Text style={styles.statCount}>{packageCount}</Text>
              <Text style={styles.statDescription}>
                {packageCount > 0
                  ? 'активних відправлень'
                  : 'немає активних відправлень'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigateTo('Calculator')}>
              <Text style={styles.statTitle}>Калькулятор</Text>
              <Text style={styles.statIcon}>🧮</Text>
              <Text style={styles.statDescription}>Розрахуйте вартість доставки</Text>
            </TouchableOpacity>
          </View>

          {/* Tips Carousel with Animation */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>📝 Поради</Text>
            <View style={styles.tipCardContainer}>
              <Animated.View
                style={[
                  styles.tipCard,
                  {transform: [{translateX: slideAnim}]}
                ]}>
                <Text style={styles.tipText}>{tips[currentTipIndex]}</Text>
              </Animated.View>
            </View>
            <View style={styles.dotContainer}>
              {tips.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentTipIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Nova Post Promo */}
          <View style={styles.promoContainer}>
            <Text style={styles.promoTitle}>Нова Пошта завжди поруч</Text>
            <Text style={styles.promoDescription}>
              Більше 10000 відділень по всій Україні.
              Швидка та надійна доставка ваших відправлень.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 120,
    height: 60,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  dashboardContainer: {
    marginVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: (width - 40) / 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B08',
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 12,
    color: '#666',
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipCardContainer: {
    overflow: 'hidden',
    height: 100,  // Fixed height for better animation
  },
  tipCard: {
    backgroundColor: '#FFF9F2',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B08',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF6B08',
    width: 12,
  },
  promoContainer: {
    backgroundColor: '#FF6B08',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
});

export default HomeScreen;
