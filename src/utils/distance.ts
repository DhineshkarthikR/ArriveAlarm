/**
 * Calculate distance between two coordinate points using Haversine formula
 * @returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance in meters to clean human-readable text (m or km)
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

/**
 * Calculate percentage progress towards destination geofence
 * 0% = initial distance or far away, 100% = inside radius
 */
export function calculateApproachProgress(
  initialDistance: number,
  currentDistance: number,
  radius: number
): number {
  if (currentDistance <= radius) return 100;
  if (initialDistance <= radius) return 0;
  
  const distanceToCover = initialDistance - radius;
  const distanceCovered = initialDistance - currentDistance;
  
  const pct = (distanceCovered / distanceToCover) * 100;
  return Math.min(100, Math.max(0, Math.round(pct)));
}

/**
 * Helper to estimate travel time at walking/transit speed
 */
export function estimateEtaMinutes(distanceMeters: number): number {
  // Assume average urban commute speed ~ 25 km/h (416 m/min)
  const speedMetersPerMin = 400;
  const mins = Math.ceil(distanceMeters / speedMetersPerMin);
  return Math.max(1, mins);
}

/**
 * Create a GeoJSON Feature Polygon representing a geographic circle
 * @param center [longitude, latitude]
 * @param radiusInMeters Radius of circle in meters
 * @param points Number of polygon vertices (default 64)
 */
export function createGeoJSONCircle(
  center: [number, number],
  radiusInMeters: number,
  points: number = 64
) {
  const coords = {
    latitude: center[1],
    longitude: center[0],
  };

  const km = radiusInMeters / 1000;
  const ret: [number, number][] = [];
  const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);

  return {
    type: 'Feature' as const,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [ret],
    },
    properties: {},
  };
}

