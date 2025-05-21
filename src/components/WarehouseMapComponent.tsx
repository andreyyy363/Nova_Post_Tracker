import React, {useEffect, useState, useRef, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MapView, {Region} from 'react-native-maps';
import {useGetWarehousesQuery} from '../services/api/api';
import WarehouseMarker from './map/WarehouseMarker';
import MapStatusBar from './map/MapStatusBar';
import {
  isPointInViewport,
  calculateZoomLevel,
  getMaxMarkersForZoom,
} from '../utils/mapUtils';

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
  const selectedMarkerRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [processingMarkers, setProcessingMarkers] = useState(false);

  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [selectedWarehouseData, setSelectedWarehouseData] = useState<any>(null);

  const {data: warehousesData, isLoading} = useGetWarehousesQuery(
    {cityRef: defaultLocation?.ref || ''},
    {skip: !showAllWarehouses || !defaultLocation?.ref},
  );

  useEffect(() => {
    if (showAllWarehouses && warehousesData?.data) {
      const validWarehouses = warehousesData.data.filter(wh => {
        const lat = parseFloat(wh.Latitude);
        const lng = parseFloat(wh.Longitude);
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
      });

      setWarehouses(validWarehouses);
      setTotalCount(validWarehouses.length);
      setLoading(false);

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

  const [debouncedRegion, setDebouncedRegion] = useState<Region | null>(null);
  useEffect(() => {
    if (!currentRegion) return;

    const handler = setTimeout(() => {
      setDebouncedRegion(currentRegion);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [currentRegion]);

  useEffect(() => {
    if (!debouncedRegion || !warehouses.length) return;

    setProcessingMarkers(true);

    setTimeout(() => {
      try {
        const newZoomLevel = calculateZoomLevel(debouncedRegion.latitudeDelta);
        setZoomLevel(newZoomLevel);

        const maxMarkers = getMaxMarkersForZoom(newZoomLevel);

        let inViewport = warehouses.filter(wh => {
          const lat = parseFloat(wh.Latitude);
          const lng = parseFloat(wh.Longitude);

          return (
            !isNaN(lat) &&
            !isNaN(lng) &&
            isPointInViewport(lat, lng, debouncedRegion)
          );
        });

        if (inViewport.length > maxMarkers) {
          console.log(
            `Limiting visible warehouses from ${inViewport.length} to ${maxMarkers}`,
          );
          inViewport = inViewport.slice(0, maxMarkers);
        }

        if (warehouse && warehouse.Ref) {
          const selectedInList = inViewport.some(
            wh => wh.Ref === warehouse.Ref,
          );

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
      } finally {
        setProcessingMarkers(false);
      }
    }, 0);
  }, [debouncedRegion, warehouses, warehouse]);

  useEffect(() => {
    if (warehouse && warehouses.length) {
      const selectedData = warehouses.find(wh => wh.Ref === warehouse.Ref);
      setSelectedWarehouseData(selectedData || warehouse);
    } else {
      setSelectedWarehouseData(null);
    }
  }, [warehouse, warehouses]);

  useEffect(() => {
    if (warehouse && warehouse.Latitude && warehouse.Longitude) {
      const lat = parseFloat(warehouse.Latitude);
      const lng = parseFloat(warehouse.Longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current?.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500,
        );

        setTimeout(() => {
          selectedMarkerRef.current?.showCallout();
        }, 1000);
      }
    }
  }, [warehouse]);

  const handleRegionChange = (region: Region) => {
    setCurrentRegion(region);
  };

  const markerElements = useMemo(() => {
    if (!showAllWarehouses || visibleWarehouses.length === 0) return [];

    return visibleWarehouses.map(wh => {
      const isSelected = warehouse && wh.Ref === warehouse.Ref;

      return (
        <WarehouseMarker
          key={`warehouse-${wh.Ref}`}
          warehouse={wh}
          isSelected={isSelected}
          ref={isSelected ? selectedMarkerRef : undefined}
        />
      );
    });
  }, [visibleWarehouses, warehouse]);

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
        provider="google"
        initialRegion={mapRegion}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}>
        {markerElements}

        {!showAllWarehouses &&
          warehouse &&
          warehouse.Latitude &&
          warehouse.Longitude && (
            <WarehouseMarker
              ref={selectedMarkerRef}
              warehouse={warehouse}
              isSelected={true}
            />
          )}
      </MapView>

      <MapStatusBar
        loading={loading}
        processingMarkers={processingMarkers}
        visibleCount={visibleCount}
        totalCount={totalCount}
        zoomLevel={zoomLevel}
      />
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
});

export default WarehouseMap;
