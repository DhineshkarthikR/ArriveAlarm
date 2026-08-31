import { useState, useCallback } from 'react';
import type { Coordinates } from '../types';
import { getCurrentLocation } from '../services/location/geolocation';

export function useGeolocation() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async (): Promise<Coordinates | null> => {
    setLoading(true);
    setError(null);
    const res = await getCurrentLocation();
    setLoading(false);

    if (res) {
      setUserLocation(res.coords);
      setAccuracy(res.accuracy);
      return res.coords;
    } else {
      setError('Could not retrieve current location.');
      return null;
    }
  }, []);

  return {
    userLocation,
    accuracy,
    loading,
    error,
    requestLocation,
  };
}
