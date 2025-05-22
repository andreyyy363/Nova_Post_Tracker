import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {PriceData} from '../../types/calculator';

interface PriceResultProps {
  price: PriceData | null;
  onCalculate: () => void;
  isLoading: boolean;
}

const PriceResult: React.FC<PriceResultProps> = ({
  price,
  onCalculate,
  isLoading,
}) => {
  const calculateTotalCost = (priceData: PriceData): number => {
    const baseCost = priceData.Cost || 0;
    const packCost = priceData.CostPack || 0;
    const overWeightCost = priceData.CostOverWeight || 0;
    const overSizeCost = priceData.CostOverSize || 0;

    if (priceData.TotalCost && priceData.TotalCost > 0) {
      return priceData.TotalCost;
    }

    return baseCost + packCost + overWeightCost + overSizeCost;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.calculateButton}
        onPress={onCalculate}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.calculateButtonText}>Розрахувати вартість</Text>
        )}
      </TouchableOpacity>

      {price && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Результат розрахунку</Text>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Вартість доставки:</Text>
            <Text style={styles.resultValue}>{price.Cost.toFixed(2)} грн</Text>
          </View>

          {price.CostPack > 0 && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Вартість пакування:</Text>
              <Text style={styles.resultValue}>
                {price.CostPack.toFixed(2)} грн
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Загальна вартість:</Text>
            <Text style={styles.totalValue}>
              {calculateTotalCost(price).toFixed(2)} грн
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  calculateButton: {
    backgroundColor: '#FF6B08',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
  },
  resultValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B08',
  },
});

export default PriceResult;
