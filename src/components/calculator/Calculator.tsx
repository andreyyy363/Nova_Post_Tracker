import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native'; // Заменили ScrollView на View
import { useCalculateShippingPriceMutation } from '../../services/api/calculatorService';
import CitySelector from './CitySelector';
import WeightInput from './WeightInput';
import DimensionsInput from './DimensionsInput';
import ServiceTypeSelector from './ServiceTypeSelector';
import PriceResult from './PriceResult';
import { City, InternetDocumentProps, PriceData } from '../../types/calculator';

const Calculator: React.FC = () => {
  const [citySender, setCitySender] = useState<City | null>(null);
  const [cityRecipient, setCityRecipient] = useState<City | null>(null);
  const [weight, setWeight] = useState<string>('0.5');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [declaredValue, setDeclaredValue] = useState<string>('100');
  const [serviceType, setServiceType] = useState<string>('WarehouseWarehouse');
  const [seatsAmount, setSeatsAmount] = useState<string>('1');
  const [priceResult, setPriceResult] = useState<PriceData | null>(null);

  const [calculatePrice, { isLoading }] = useCalculateShippingPriceMutation();

  const handleCalculate = async () => {
  if (!citySender || !cityRecipient) {
    Alert.alert('Помилка', 'Будь ласка, оберіть міста відправлення та отримання');
    return;
  }

  try {
    // Подготовка данных для запроса
    const payload: InternetDocumentProps = {
      CitySender: citySender.ref,
      CityRecipient: cityRecipient.ref,
      Weight: parseFloat(weight) || 0.5,
      ServiceType: serviceType,
      Cost: parseFloat(declaredValue) || 100,
      SeatsAmount: parseInt(seatsAmount) || 1,
      // Добавляем обязательные свойства
      PayerType: "Sender", // Отправитель оплачивает
      PaymentMethod: "Cash", // Наличными
      CargoType: "Cargo", // Типовой груз
      Description: "Посилка" // Описание посылки
    };

    // Добавляем габариты, если они указаны
    if (length && width && height) {
      const weightValue = parseFloat(weight) || 0.5;
      payload.OptionsSeat = [{
        volumetricLength: parseInt(length) || 0,
        volumetricWidth: parseInt(width) || 0,
        volumetricHeight: parseInt(height) || 0,
        weight: weightValue // Добавляем обязательное свойство weight
      }];
    }

    // Вызываем API для расчета стоимости
    const result = await calculatePrice(payload).unwrap();
    
    // Обрабатываем результат
    if (result.success && result.data && result.data.length > 0) {
      setPriceResult(result.data[0]);
    } else {
      Alert.alert('Помилка', result.errors?.join('\n') || 'Не вдалося розрахувати вартість');
    }
  } catch (error) {
    console.error('Error calculating price:', error);
    Alert.alert('Помилка', 'Сталася помилка під час розрахунку вартості');
  }
};

  return (
    <View style={styles.container}>
      <CitySelector
        label="Місто відправлення"
        onCitySelect={setCitySender}
        selectedCity={citySender}
      />
      
      <CitySelector
        label="Місто отримання"
        onCitySelect={setCityRecipient}
        selectedCity={cityRecipient}
      />
      
      <ServiceTypeSelector 
        selectedType={serviceType}
        onSelect={setServiceType}
      />
      
      <WeightInput 
        weight={weight} 
        setWeight={setWeight}
        seatsAmount={seatsAmount}
        setSeatsAmount={setSeatsAmount}
        declaredValue={declaredValue}
        setDeclaredValue={setDeclaredValue}
      />
      
      <DimensionsInput 
        length={length}
        width={width}
        height={height}
        setLength={setLength}
        setWidth={setWidth}
        setHeight={setHeight}
      />
      
      <PriceResult
        price={priceResult}
        onCalculate={handleCalculate}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // Занимаем всю ширину родительского контейнера
  },
});

export default Calculator;