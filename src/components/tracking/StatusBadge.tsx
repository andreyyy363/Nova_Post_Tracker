import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {trackingStatuses} from '../../constants/statusCodes';

interface StatusBadgeProps {
  statusCode: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({statusCode}) => {
  const getStatusDescription = (code: string): string => {
    const status = trackingStatuses.find(s => s.code.toString() === code);
    return status ? status.description : 'Неизвестный статус';
  };

  return (
    <View style={styles.statusBadge}>
      <Text style={styles.statusBadgeText}>
        {getStatusDescription(statusCode)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBadge: {
    backgroundColor: '#FF6B08',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default StatusBadge;
