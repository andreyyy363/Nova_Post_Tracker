import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  Platform,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
  Callout,
} from 'react-native-maps';
import {useGetWarehousesQuery} from '../services/api/api';

interface WarehouseMapProps {
  warehouse?: {
    Description: string;
    Number: string;
    Latitude: string;
    Longitude: string;
  } | null;
  defaultLocation?: {
    ref: string;
    name: string;
  } | null;
  showAllWarehouses?: boolean;
  onClose?: () => void;
}

const WarehouseMap: React.FC<WarehouseMapProps> = ({
  warehouse,
  defaultLocation,
  showAllWarehouses = false,
  onClose,
}) => {
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const mapRef = useRef<MapView | null>(null);

  // Fetch warehouses if showAllWarehouses is true and we have a city reference
  const {data: warehousesData} = useGetWarehousesQuery(
    {cityRef: defaultLocation?.ref || ''},
    {skip: !showAllWarehouses || !defaultLocation?.ref},
  );

  useEffect(() => {
    if (showAllWarehouses && warehousesData?.data) {
      // Filter out warehouses without valid coordinates
      const validWarehouses = warehousesData.data.filter(wh => {
        const lat = parseFloat(wh.Latitude);
        const lng = parseFloat(wh.Longitude);
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
      });

      setWarehouses(validWarehouses);

      // Set initial region based on first warehouse with valid coordinates
      if (validWarehouses.length > 0) {
        const firstWh = validWarehouses[0];
        setMapRegion({
          latitude: parseFloat(firstWh.Latitude),
          longitude: parseFloat(firstWh.Longitude),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    }
  }, [warehousesData, showAllWarehouses]);

  useEffect(() => {
    // When a specific warehouse is selected, update the map region
    if (warehouse && warehouse.Latitude && warehouse.Longitude) {
      const latitude = parseFloat(warehouse.Latitude);
      const longitude = parseFloat(warehouse.Longitude);

      if (
        !isNaN(latitude) &&
        !isNaN(longitude) &&
        latitude !== 0 &&
        longitude !== 0
      ) {
        // Wait for next render cycle to update region
        setTimeout(() => {
          setMapRegion({
            latitude,
            longitude,
            latitudeDelta: 0.005, // Slightly zoomed in to make marker clearly visible
            longitudeDelta: 0.005,
          });

          // Animate map to show the selected marker
          if (mapRef.current) {
            mapRef.current.animateToRegion(
              {
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              },
              1000,
            ); // 1 second animation
          }
        }, 0);
      }
    }
  }, [warehouse]);

  const openGoogleMapsDirections = (lat: number, lng: number) => {
    if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid coordinates for navigation');
      return;
    }

    // For direct Google Maps navigation
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

    Linking.canOpenURL(googleMapsUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(googleMapsUrl);
        } else {
          const scheme = Platform.select({ios: 'maps://', android: 'geo:'});
          const url = Platform.select({
            ios: `${scheme}?q=${lat},${lng}`,
            android: `${scheme}${lat},${lng}`,
          });
          if (url) return Linking.openURL(url);
          console.log("Can't open maps app");
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  if (!mapRegion) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}>
        {/* Show all warehouses if requested */}
        {showAllWarehouses &&
          warehouses.map(wh => {
            // Skip warehouses without valid coordinates
            if (!wh.Latitude || !wh.Longitude) return null;

            const lat = parseFloat(wh.Latitude);
            const lng = parseFloat(wh.Longitude);

            if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;

            const isSelected = warehouse && warehouse.Number === wh.Number;

            return (
              <Marker
                key={`warehouse-${wh.Ref}-${
                  isSelected ? 'selected' : 'normal'
                }`}
                coordinate={{
                  latitude: lat,
                  longitude: lng,
                }}
                pinColor={isSelected ? '#00F5F5' : undefined}>
                <Callout
                  tooltip
                  tappable={true}
                  onPress={() => {
                    console.log('Callout pressed, navigating to:', lat, lng);
                    openGoogleMapsDirections(lat, lng);
                  }}>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>
                      Nova Post #{wh.Number}
                    </Text>
                    <Text style={styles.calloutDescription}>
                      {wh.Description}
                    </Text>
                    <View style={styles.calloutButton}>
                      <Text style={styles.calloutButtonText}>Navigate</Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          })}

        {/* Show selected warehouse with a different pin color */}
        {warehouse &&
          warehouse.Latitude &&
          warehouse.Longitude &&
          !showAllWarehouses && (
            <Marker
              key={`selected-warehouse-${warehouse.Number}`}
              coordinate={{
                latitude: parseFloat(warehouse.Latitude),
                longitude: parseFloat(warehouse.Longitude),
              }}
              pinColor="#f54b00">
              <Callout
                tooltip
                tappable={true}
                onPress={() => {
                  const lat = parseFloat(warehouse.Latitude);
                  const lng = parseFloat(warehouse.Longitude);
                  console.log(
                    'Selected warehouse callout pressed, navigating to:',
                    lat,
                    lng,
                  );
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
          )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navigationButton: {
    backgroundColor: '#f54b00',
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
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // New styles for the callout
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

export default WarehouseMap;
