import { Region } from 'react-native-maps';
import { Platform, Linking } from 'react-native';

/**
 * Checks if a geographical point is within the current map viewport
 */
export const isPointInViewport = (
  lat: number,
  lng: number,
  region: Region,
  buffer: number = 0.1,
): boolean => {
  const latBuffer = region.latitudeDelta * buffer;
  const lngBuffer = region.longitudeDelta * buffer;

  const minLat = region.latitude - region.latitudeDelta / 2 - latBuffer;
  const maxLat = region.latitude + region.latitudeDelta / 2 + latBuffer;
  const minLng = region.longitude - region.longitudeDelta / 2 - lngBuffer;
  const maxLng = region.longitude + region.longitudeDelta / 2 + lngBuffer;

  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
};

/**
 * Calculates the appropriate zoom level based on the latitude delta
 */
export const calculateZoomLevel = (latitudeDelta: number): number => {
  if (latitudeDelta > 0.5) return 8;
  if (latitudeDelta > 0.2) return 10;
  if (latitudeDelta > 0.1) return 12;
  if (latitudeDelta > 0.05) return 14;
  if (latitudeDelta > 0.02) return 15;
  return 16;
};

/**
 * Returns the maximum number of markers to display based on zoom level
 */
export const getMaxMarkersForZoom = (zoomLevel: number): number => {
  if (zoomLevel <= 10) return 20;
  if (zoomLevel <= 12) return 50;
  if (zoomLevel <= 14) return 100;
  if (zoomLevel <= 16) return 200;
  return 500;
};

/**
 * Opens Google Maps directions to a specific location
 */
export const openGoogleMapsDirections = (lat: number, lng: number): void => {
  if (isNaN(lat) || isNaN(lng)) {
    console.error('Invalid coordinates for navigation');
    return;
  }

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

  Linking.canOpenURL(googleMapsUrl)
    .then(supported => {
      if (supported) {
        return Linking.openURL(googleMapsUrl);
      } else {
        const scheme = Platform.select({ ios: 'maps://', android: 'geo:' });
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
