import { useState, useCallback } from 'react';
import type { Coordinates } from '../types';
import { calculateDistance } from '../utils/distance';

export interface GeofenceState {
  distance: number | null;
  isInsideArrival: boolean;
  isInsideEarlyAlert: boolean;
}

export function useGeofence(
  destination: Coordinates | null,
  radius: number,
  earlyAlertDistance: number,
  earlyAlertEnabled: boolean
) {
  const [consecutiveInRadiusCount, setConsecutiveInRadiusCount] = useState<number>(0);

  const evaluatePosition = useCallback(
    (currentPosition: Coordinates): GeofenceState => {
      if (!destination) {
        return { distance: null, isInsideArrival: false, isInsideEarlyAlert: false };
      }

      const dist = calculateDistance(
        currentPosition.lat,
        currentPosition.lng,
        destination.lat,
        destination.lng
      );

      const insideArrival = dist <= radius;
      const insideEarlyAlert = earlyAlertEnabled ? dist <= earlyAlertDistance : false;

      if (insideArrival) {
        setConsecutiveInRadiusCount((prev) => prev + 1);
      } else {
        setConsecutiveInRadiusCount(0);
      }

      return {
        distance: dist,
        isInsideArrival: insideArrival,
        isInsideEarlyAlert: insideEarlyAlert,
      };
    },
    [destination, radius, earlyAlertDistance, earlyAlertEnabled]
  );

  return {
    evaluatePosition,
    consecutiveInRadiusCount,
  };
}
