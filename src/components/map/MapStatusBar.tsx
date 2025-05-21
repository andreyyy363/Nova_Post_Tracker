import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface MapStatusBarProps {
  loading: boolean;
  processingMarkers: boolean;
  visibleCount: number;
  totalCount: number;
  zoomLevel?: number;
  showZoomLevel?: boolean;
}

const MapStatusBar: React.FC<MapStatusBarProps> = ({
  loading,
  processingMarkers,
  visibleCount,
  totalCount,
  zoomLevel,
  showZoomLevel = __DEV__,
}) => {
  return (
    <>
      <View style={styles.statsContainer}>
        {loading ? (
          <Text style={styles.statsText}>Loading warehouses...</Text>
        ) : processingMarkers ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#f54b00" />
            <Text style={[styles.statsText, styles.loadingText]}>
              Processing markers...
            </Text>
          </View>
        ) : (
          <Text style={styles.statsText}>
            {`${visibleCount} of ${totalCount} visible`}
          </Text>
        )}
      </View>

      {showZoomLevel && zoomLevel !== undefined && (
        <View style={styles.zoomIndicator}>
          <Text style={styles.zoomText}>Zoom: {zoomLevel}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 5,
  },
  zoomIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  zoomText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MapStatusBar;
