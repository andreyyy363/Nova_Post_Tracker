import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

interface WarehouseMapProps {
  warehouse: {
    Description: string;
    Number: string;
    Latitude: string;
    Longitude: string;
  };
  onClose?: () => void;
}

const WarehouseMap: React.FC<WarehouseMapProps> = ({warehouse, onClose}) => {
  // Convert string coordinates to numbers
  const latitude = parseFloat(warehouse.Latitude);
  const longitude = parseFloat(warehouse.Longitude);

  // Check if coordinates are valid
  const hasValidCoordinates =
    !isNaN(latitude) && !isNaN(longitude) && latitude !== 0 && longitude !== 0;

  const openGoogleMapsDirections = () => {
    const scheme = Platform.select({ios: 'maps://', android: 'geo:'});
    const url = Platform.select({
      ios: `${scheme}?q=${latitude},${longitude}`,
      android: `${scheme}${latitude},${longitude}`,
    });

    // For direct Google Maps navigation
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

    Linking.canOpenURL(googleMapsUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(googleMapsUrl);
        } else if (url) {
          return Linking.openURL(url);
        }
        console.log("Can't open maps app");
      })
      .catch(err => console.error('An error occurred', err));
  };

  if (!hasValidCoordinates) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No valid coordinates available for this warehouse
        </Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}>
        <Marker
          coordinate={{latitude, longitude}}
          title={`Nova Post #${warehouse.Number}`}
          description={warehouse.Description}
        />
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={openGoogleMapsDirections}>
          <Text style={styles.buttonText}>Navigate</Text>
        </TouchableOpacity>

        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navigationButton: {
    backgroundColor: '#f54b00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
  },
  closeButton: {
    backgroundColor: '#888',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default WarehouseMap;
