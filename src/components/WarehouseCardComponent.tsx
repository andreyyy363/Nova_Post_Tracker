import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface WarehouseCardProps {
  name: string;
  address: string;
  number: string;
  schedule?: string;
  onPress?: () => void;
}

const WarehouseCard: React.FC<WarehouseCardProps> = ({
  name,
  address,
  number,
  schedule,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.numberContainer}>
        <Text style={styles.number}>№{number}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.address} numberOfLines={2}>
          {address}
        </Text>
        {schedule && <Text style={styles.schedule}>Today: {schedule}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  numberContainer: {
    backgroundColor: '#f54b00',
    borderRadius: 4,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    alignSelf: 'flex-start',
  },
  number: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  address: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  schedule: {
    fontSize: 12,
    color: '#888',
  },
});

export default WarehouseCard;
