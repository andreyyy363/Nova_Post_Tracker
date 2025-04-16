import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import StatusBadge from './StatusBadge';
import { TrackingData } from '../../types/tracking';
import { samplePackage } from '../../constants/sampleData';

interface PackageCardProps {
  data: TrackingData;
  isDemo: boolean;
  showFullInfo: boolean;
  hasEnteredPhone: boolean;
  onFullInfoClick: () => void;
  onPhoneModalShow: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ 
  data, 
  isDemo, 
  showFullInfo, 
  hasEnteredPhone, 
  onFullInfoClick,
  onPhoneModalShow
}) => {
  const getValueOrDefault = (value: any, defaultValue: string): string => {
    if (value === undefined || value === null) return defaultValue;
    if (typeof value === 'string') {
      return value.trim() !== '' ? value : defaultValue;
    }
    return String(value) || defaultValue;
  };

  const getSenderInfo = (response: TrackingData): string => {
    if (isDemo) return samplePackage.sender;
  
    const items = response.Items || [];
  
    if (!Array.isArray(items) || items.length === 0) {
      return 'Інформація недоступна • Дані відсутні';
    }
  
    const senderList: string[] = [];
  
    for (const item of items) {
      if (item.StatusCode === "3") continue;
  
      const {
        Sender,
        SenderFullNameEW,
        CounterpartySenderDescription,
        CounterpartySenderType
      } = item;
  
      if (
        CounterpartySenderDescription &&
        CounterpartySenderDescription !== "Приватна особа"
      ) {
        if (
          CounterpartySenderType === "Organization" &&
          SenderFullNameEW &&
          SenderFullNameEW.trim() !== ''
        ) {
          senderList.push(`${CounterpartySenderDescription} (контактна особа: ${SenderFullNameEW.trim()})`);
        } else {
          senderList.push(CounterpartySenderDescription);
        }
      } else if (SenderFullNameEW && SenderFullNameEW.trim() !== '') {
        senderList.push(SenderFullNameEW.trim());
      } else if (Sender && Sender.trim() !== '') {
        senderList.push(Sender.trim());
      }
    }
  
    if (senderList.length === 0) {
      return 'Інформація прихована • Для повної інформації зверніться до відділення';
    }
  
    const uniqueSenders = [...new Set(senderList)];
    return uniqueSenders.join(', ');
  };
  
  return (
    <View style={styles.packageCard}>
      <View style={styles.packageHeader}>
        <View>
          <Text style={styles.packageNumber}>№ {data.Number}</Text>
          <StatusBadge statusCode={data.StatusCode} />
        </View>
        <View style={styles.packageIconPlaceholder}>
          <Text style={styles.packageIconText}>📦</Text>
        </View>
      </View>
      
      <View style={styles.packageDetails}>
        {/* Основные поля - 3 обязательных поля */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Звідки:</Text>
          <Text style={styles.detailValue}>
            {getValueOrDefault(data.WarehouseSenderAddress, samplePackage.from)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Куди:</Text>
          <Text style={styles.detailValue}>
            {getValueOrDefault(data.WarehouseRecipientAddress, samplePackage.to)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Очікувана доставка:</Text>
          <Text style={styles.detailValue}>
            {getValueOrDefault(data.ScheduledDeliveryDate, samplePackage.estimatedDelivery)}
          </Text>
        </View>
        
        {/* Кнопка "Полная информация" */}
        <TouchableOpacity 
          style={styles.fullInfoButton}
          onPress={onFullInfoClick}
        >
          <Text style={styles.fullInfoButtonText}>
            {showFullInfo ? 'Сховати деталі' : 'Повна інформація'}
          </Text>
        </TouchableOpacity>
        
        {/* Полная информация */}
        {showFullInfo && (
          <>
            {/* Створено теперь в полной информации */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Створено:</Text>
              <Text style={styles.detailValue}>
                {isDemo 
                  ? samplePackage.created 
                  : getValueOrDefault(
                      data.CreatedAt || 
                      data.DateCreated || 
                      (data as any).CreateTime,
                      'Не вказано'
                    )}
              </Text>
            </View>
            
            {/* Дополнительная информация доступна только если введен номер телефона или это демо */}
            {(hasEnteredPhone || isDemo) && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Відправник:</Text>
                  <Text style={styles.detailValue}>
                    {getSenderInfo(data)}
                  </Text>
                </View>
                
                {/* Получатель */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Отримувач:</Text>
                  <Text style={styles.detailValue}>
                    {isDemo 
                      ? samplePackage.recipient 
                      : getValueOrDefault(
                          data.RecipientFullName || 
                          data.Recipient ||
                          (data as any).RecipientName,
                          'Не вказано'
                        )}
                  </Text>
                </View>
                
                {/* Вес, стоимость и описание */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Вага:</Text>
                  <Text style={styles.detailValue}>
                    {isDemo 
                      ? samplePackage.weight 
                      : getValueOrDefault(
                          data.DocumentWeight || 
                          data.Weight, 
                          'Не вказано'
                        )}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Оголошена вартість:</Text>
                  <Text style={styles.detailValue}>
                    {isDemo 
                      ? samplePackage.price 
                      : getValueOrDefault(
                          data.DocumentCost || 
                          data.Cost || 
                          data.AnnouncedPrice,
                          'Не вказано'
                        )}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Опис:</Text>
                  <Text style={styles.detailValue}>
                    {isDemo 
                      ? samplePackage.description 
                      : getValueOrDefault(
                          data.CargoDescription || 
                          (data as any).CargoDescriptionString, 
                          'Не вказано'
                        )}
                  </Text>
                </View>
              </>
            )}
            
            {/* Сообщение о необходимости ввода телефона */}
            {!hasEnteredPhone && !isDemo && (
              <TouchableOpacity 
                style={styles.phonePromptButton}
                onPress={onPhoneModalShow}
              >
                <Text style={styles.phonePromptText}>
                  Введіть номер телефону для отримання повної інформації
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  packageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  packageHeader: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  packageNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  packageDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    flex: 0.4,
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    flex: 0.6,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  packageIconPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#FF6B08',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageIconText: {
    fontSize: 24,
    color: 'white',
  },
  fullInfoButton: {
    backgroundColor: '#FF6B08',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  fullInfoButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  phonePromptButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  phonePromptText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PackageCard;