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
    Ref?: string;
  } | null;
  defaultLocation?: {
    ref: string;
    name: string;
  } | null;
  showAllWarehouses?: boolean;
  onClose?: () => void;
}

const isPointInViewport = (
  lat: number,
  lng: number,
  region: Region,
  buffer: number = 0.1,
) => {
  const latBuffer = region.latitudeDelta * buffer;
  const lngBuffer = region.longitudeDelta * buffer;

  const minLat = region.latitude - region.latitudeDelta / 2 - latBuffer;
  const maxLat = region.latitude + region.latitudeDelta / 2 + latBuffer;
  const minLng = region.longitude - region.longitudeDelta / 2 - lngBuffer;
  const maxLng = region.longitude + region.longitudeDelta / 2 + lngBuffer;

  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
};

const WarehouseMap: React.FC<WarehouseMapProps> = ({
  warehouse,
  defaultLocation,
  showAllWarehouses = false,
  onClose,
}) => {
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [visibleWarehouses, setVisibleWarehouses] = useState<any[]>([]);
  const mapRef = useRef<MapView | null>(null);
  const selectedMarkerRef = useRef<Marker | null>(null);

  // Индикатор загрузки и счетчик видимых маркеров
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Добавляем состояние для отслеживания уровня зума
  const [zoomLevel, setZoomLevel] = useState<number>(15);

  // Добавляем состояние для хранения выбранного отделения
  const [selectedWarehouseData, setSelectedWarehouseData] = useState<any>(null);

  // Fetch warehouses if showAllWarehouses is true and we have a city reference
  const {data: warehousesData, isLoading} = useGetWarehousesQuery(
    {cityRef: defaultLocation?.ref || ''},
    {skip: !showAllWarehouses || !defaultLocation?.ref},
  );

  const calculateZoomLevel = (latitudeDelta: number): number => {
    if (latitudeDelta > 0.5) return 8; // Сильно отдалено
    if (latitudeDelta > 0.2) return 10; // Отдалено
    if (latitudeDelta > 0.1) return 12; // Средний масштаб
    if (latitudeDelta > 0.05) return 14; // Приближено
    if (latitudeDelta > 0.02) return 15; // Сильно приближено
    return 16; // Очень сильное приближение
  };

  // Загрузка данных о складах
  useEffect(() => {
    if (showAllWarehouses && warehousesData?.data) {
      // Фильтрация складов с некорректными координатами
      const validWarehouses = warehousesData.data.filter(wh => {
        const lat = parseFloat(wh.Latitude);
        const lng = parseFloat(wh.Longitude);
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
      });

      setWarehouses(validWarehouses);
      setTotalCount(validWarehouses.length);
      setLoading(false);

      // Установка начального региона карты
      if (validWarehouses.length > 0) {
        const newRegion = {
          latitude: parseFloat(validWarehouses[0].Latitude),
          longitude: parseFloat(validWarehouses[0].Longitude),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        setMapRegion(newRegion);
        setCurrentRegion(newRegion);
        setZoomLevel(calculateZoomLevel(newRegion.latitudeDelta));
      }
    }
  }, [warehousesData, showAllWarehouses]);

  // Обработка изменений видимой области карты
  useEffect(() => {
    if (!currentRegion || !warehouses.length) return;

    // Обновляем уровень зума при изменении региона
    setZoomLevel(calculateZoomLevel(currentRegion.latitudeDelta));

    // Фильтрация складов, находящихся в видимой области
    const inViewport = warehouses.filter(wh => {
      const lat = parseFloat(wh.Latitude);
      const lng = parseFloat(wh.Longitude);

      return (
        !isNaN(lat) && !isNaN(lng) && isPointInViewport(lat, lng, currentRegion)
      );
    });

    // Добавляем выбранное отделение, если оно существует и отсутствует в отфильтрованном списке
    if (warehouse && warehouse.Ref) {
      const selectedInList = inViewport.some(wh => wh.Ref === warehouse.Ref);

      if (!selectedInList) {
        const selectedWarehouse = warehouses.find(
          wh => wh.Ref === warehouse.Ref,
        );
        if (selectedWarehouse) {
          inViewport.push(selectedWarehouse);
        }
      }
    }

    setVisibleWarehouses(inViewport);
    setVisibleCount(inViewport.length);
  }, [currentRegion, warehouses, warehouse]);

  // Отдельный эффект для обновления выбранного отделения
  useEffect(() => {
    if (warehouse && warehouses.length) {
      const selectedData = warehouses.find(wh => wh.Ref === warehouse.Ref);
      setSelectedWarehouseData(selectedData || warehouse);
    } else {
      setSelectedWarehouseData(null);
    }
  }, [warehouse, warehouses]);

  // Обработка выбранного склада
  useEffect(() => {
    if (warehouse && warehouse.Latitude && warehouse.Longitude) {
      const latitude = parseFloat(warehouse.Latitude);
      const longitude = parseFloat(warehouse.Longitude);

      if (
        !isNaN(latitude) &&
        !isNaN(longitude) &&
        latitude !== 0 &&
        longitude !== 0
      ) {
        // Сначала обновляем регион с немного большим охватом
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        // Установка состояний и задержка для загрузки маркеров
        setMapRegion(newRegion);
        setCurrentRegion(newRegion);

        // Даем компонентам немного времени обновиться
        setTimeout(() => {
          try {
            // Делаем анимацию к выбранной точке, с меньшим охватом
            if (
              mapRef.current &&
              typeof mapRef.current.animateToRegion === 'function'
            ) {
              const animationRegion = {
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              };

              mapRef.current.animateToRegion(animationRegion, 1000);

              // Логируем для отладки
              console.log('Animating to warehouse:', warehouse.Number);

              // Немного подождем и покажем выноску
              setTimeout(() => {
                if (selectedMarkerRef.current) {
                  selectedMarkerRef.current.showCallout();
                  console.log(
                    'Showing callout for warehouse:',
                    warehouse.Number,
                  );
                } else {
                  console.warn('Selected marker ref not available');
                }
              }, 1500);
            } else {
              console.warn('Map animation not available');
            }
          } catch (err) {
            console.error('Animation error:', err);
          }
        }, 500); // Даем больше времени для загрузки компонентов
      }
    }
  }, [warehouse, showAllWarehouses]);

  // Add a new effect to handle city changes
  useEffect(() => {
    if (defaultLocation && defaultLocation.ref) {
      // If we have warehouses data for this city already
      if (warehouses.length > 0) {
        // Use the first warehouse position or a fallback positioning
        const targetWarehouse = warehouses[0];
        if (targetWarehouse) {
          const latitude = parseFloat(targetWarehouse.Latitude);
          const longitude = parseFloat(targetWarehouse.Longitude);
          
          if (!isNaN(latitude) && !isNaN(longitude) && latitude !== 0 && longitude !== 0) {
            // Create a new region focusing on the city
            const newRegion = {
              latitude,
              longitude,
              latitudeDelta: 0.05, // Start with a wider view of the city
              longitudeDelta: 0.05,
            };
            
            // Update state
            setMapRegion(newRegion);
            setCurrentRegion(newRegion);
            
            // Animate to the new region if map is ready
            if (mapRef.current) {
              mapRef.current.animateToRegion(newRegion, 1000);
              console.log('Animating to new city:', defaultLocation.name);
            }
          }
        }
      } else if (!isLoading && warehousesData?.data) {
        // If we just received the warehouse data but haven't processed it yet
        const validWarehouses = warehousesData.data.filter(wh => {
          const lat = parseFloat(wh.Latitude);
          const lng = parseFloat(wh.Longitude);
          return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
        });
        
        if (validWarehouses.length > 0) {
          const latitude = parseFloat(validWarehouses[0].Latitude);
          const longitude = parseFloat(validWarehouses[0].Longitude);
          
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          
          setMapRegion(newRegion);
          setCurrentRegion(newRegion);
          
          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
        }
      }
    }
  }, [defaultLocation, warehouses.length, isLoading, warehousesData]);

  // Функция открытия маршрута в Google Maps
  const openGoogleMapsDirections = (lat: number, lng: number) => {
    if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid coordinates for navigation');
      return;
    }

    // Формирование URL для Google Maps
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

  // Обработчик изменения видимой области карты
  const handleRegionChange = (region: Region) => {
    setCurrentRegion(region);
    setZoomLevel(calculateZoomLevel(region.latitudeDelta));
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
        initialRegion={mapRegion}
        onRegionChangeComplete={handleRegionChange}>
        {/* Показываем все маркеры отделений */}
        {showAllWarehouses &&
          visibleWarehouses.map(wh => {
            const lat = parseFloat(wh.Latitude);
            const lng = parseFloat(wh.Longitude);

            // Проверяем, является ли текущее отделение выбранным
            const isSelected = warehouse && wh.Ref === warehouse.Ref;

            return (
              <Marker
                ref={isSelected ? selectedMarkerRef : undefined}
                key={`warehouse-${wh.Ref}`}
                coordinate={{
                  latitude: lat,
                  longitude: lng,
                }}
                pinColor={isSelected ? '#00F5F5' : '#f54b00'}
                tracksViewChanges={false}>
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

        {/* Показ отдельного склада когда showAllWarehouses=false */}
        {!showAllWarehouses &&
          warehouse &&
          warehouse.Latitude &&
          warehouse.Longitude && (
            <Marker
              ref={selectedMarkerRef}
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

      {/* Индикатор количества видимых отделений */}
      {showAllWarehouses && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {loading
              ? 'Loading...'
              : `${visibleCount} of ${totalCount} visible`}
          </Text>
        </View>
      )}
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
  statsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default WarehouseMap;
