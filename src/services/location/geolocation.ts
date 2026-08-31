import type { Coordinates } from '../../types';

export interface GeolocationPositionResult {
  coords: Coordinates;
  accuracy: number;
}

/**
 * Get current browser GPS location with accuracy details
 */
export function getCurrentLocation(): Promise<GeolocationPositionResult | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Start watching browser location updates
 */
export function watchLocationUpdates(
  onUpdate: (result: GeolocationPositionResult) => void,
  onError?: (error: string) => void
): number | null {
  if (!navigator.geolocation) {
    if (onError) onError('Geolocation is not supported by your browser.');
    return null;
  }

  return navigator.geolocation.watchPosition(
    (pos) => {
      onUpdate({
        coords: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        },
        accuracy: pos.coords.accuracy,
      });
    },
    (err) => {
      let msg = 'Failed to obtain GPS position.';
      if (err.code === err.PERMISSION_DENIED) {
        msg = 'Location permission was denied. Please enable location permissions in your browser.';
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        msg = 'GPS signal unavailable.';
      } else if (err.code === err.TIMEOUT) {
        msg = 'GPS location request timed out.';
      }
      if (onError) onError(msg);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );
}

/**
 * Clear a location watch process
 */
export function clearLocationWatch(watchId: number | null): void {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}
