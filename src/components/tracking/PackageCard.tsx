import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import StatusBadge from './StatusBadge';
import {TrackingData} from '../../types/tracking';
import {samplePackage} from '../../constants/sampleData';

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
  onPhoneModalShow,
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

    if (!response) {
      return 'Інформація недоступна • Дані відсутні';
    }

    const senderDesc = (response as any).CounterpartySenderDescription;
    const senderType = (response as any).CounterpartySenderType;
    const senderFullName = (response as any).SenderFullNameEW;

    if (senderDesc && senderDesc !== 'Приватна особа') {
      if (
        senderType === 'Organization' &&
        senderFullName &&
        senderFullName.trim() !== ''
      ) {
        return `${senderDesc} (контактна особа: ${senderFullName.trim()})`;
      }
      return senderDesc;
    }

    if (senderFullName && senderFullName.trim() !== '') {
      return senderFullName.trim();
    }

    return 'Інформація прихована • Для повної інформації зверніться до відділення';
  };

  const getRecipientInfo = (response: TrackingData): string => {
    if (isDemo) return samplePackage.recipient;

    if (!response) {
      return 'Інформація недоступна • Дані відсутні';
    }

    const recipientDesc = (response as any).CounterpartyRecipientDescription;
    const recipientFullName = (response as any).RecipientFullName;
    const recipientFullNameEW = (response as any).RecipientFullNameEW;

    if (recipientDesc && recipientDesc !== 'Приватна особа') {
      return recipientDesc;
    }

    if (recipientFullNameEW && recipientFullNameEW.trim() !== '') {
      return recipientFullNameEW.trim();
    }

    if (recipientFullName && recipientFullName.trim() !== '') {
      return recipientFullName.trim();
    }

    return 'Інформація прихована • Для повної інформації зверніться до відділення';
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
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Звідки:</Text>
          <Text style={styles.detailValue}>
            {getValueOrDefault(data.WarehouseSenderAddress, samplePackage.from)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Куди:</Text>
          <Text style={styles.detailValue}>
            {getValueOrDefault(
              data.WarehouseRecipientAddress,
              samplePackage.to,
            )}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Очікувана доставка:</Text>
          <Text style={styles.detailValue}>
            {getValueOrDefault(
              data.ScheduledDeliveryDate,
              samplePackage.estimatedDelivery,
            )}
          </Text>
        </View>

        {!showFullInfo && (
          <TouchableOpacity
            style={styles.fullInfoButton}
            onPress={onFullInfoClick}>
            <Text style={styles.fullInfoButtonText}>Повна інформація</Text>
          </TouchableOpacity>
        )}

        {showFullInfo && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Створено:</Text>
              <Text style={styles.detailValue}>
                {isDemo
                  ? samplePackage.created
                  : getValueOrDefault(
                      data.CreatedAt ||
                        data.DateCreated ||
                        (data as any).CreateTime,
                      'Не вказано',
                    )}
              </Text>
            </View>

            {(hasEnteredPhone || isDemo) && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Відправник:</Text>
                  <Text style={styles.detailValue}>{getSenderInfo(data)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Отримувач:</Text>
                  <Text style={styles.detailValue}>
                    {getRecipientInfo(data)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Вага:</Text>
                  <Text style={styles.detailValue}>
                    {isDemo
                      ? samplePackage.weight
                      : getValueOrDefault(
                          data.DocumentWeight || data.Weight,
                          'Не вказано',
                        )}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Оголошена вартість:</Text>
                  <Text style={styles.detailValue}>
                    {isDemo
                      ? samplePackage.price
                      : getValueOrDefault(
                          data.DocumentCost || data.Cost || data.AnnouncedPrice,
                          'Не вказано',
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
                          'Не вказано',
                        )}
                  </Text>
                </View>
              </>
            )}

            {!hasEnteredPhone && !isDemo && (
              <TouchableOpacity
                style={styles.phonePromptButton}
                onPress={onPhoneModalShow}>
                <Text style={styles.phonePromptText}>
                  Введіть номер телефону для отримання повної інформації
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.fullInfoButton, styles.hideInfoButton]}
              onPress={onFullInfoClick}>
              <Text style={styles.fullInfoButtonText}>Сховати деталі</Text>
            </TouchableOpacity>
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
    shadowOffset: {width: 0, height: 2},
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
  hideInfoButton: {
    marginTop: 24,
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
