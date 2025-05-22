import React, {forwardRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Marker, Callout} from 'react-native-maps';
import {openGoogleMapsDirections} from '../../utils/mapUtils';

interface WarehouseMarkerProps {
  warehouse: {
    Ref: string;
    Number: string;
    Description: string;
    Latitude: string;
    Longitude: string;
  };
  isSelected?: boolean;
}

const WarehouseMarker = forwardRef<Marker, WarehouseMarkerProps>(
  ({warehouse, isSelected = false}, ref) => {
    const lat = parseFloat(warehouse.Latitude);
    const lng = parseFloat(warehouse.Longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return null;
    }

    return (
      <Marker
        ref={ref}
        coordinate={{
          latitude: lat,
          longitude: lng,
        }}
        pinColor={isSelected ? '#00F5F5' : '#f54b00'}
        tracksViewChanges={false}
        flat={true}>
        <Callout
          tooltip
          tappable={true}
          onPress={() => {
            openGoogleMapsDirections(lat, lng);
          }}>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutTitle}>
              Nova Post #{warehouse.Number}
            </Text>
            <Text style={styles.calloutDescription}>
              {warehouse.Description}
            </Text>
            <View style={styles.calloutButton}>
              <Text style={styles.calloutButtonText}>Navigate</Text>
            </View>
          </View>
        </Callout>
      </Marker>
    );
  },
);

const styles = StyleSheet.create({
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  calloutButton: {
    backgroundColor: '#f54b00',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 4,
  },
  calloutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default WarehouseMarker;
