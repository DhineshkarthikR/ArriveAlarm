import { getMapTilerKey } from './maptiler';
import type { SearchResultItem } from '../../types';

/**
 * Forward Geocoding: Search places using MapTiler Geocoding API (or Nominatim fallback)
 */
export async function searchPlaces(query: string): Promise<SearchResultItem[]> {
  if (!query || query.trim().length < 2) return [];

  const apiKey = getMapTilerKey();

  if (apiKey) {
    try {
      const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${apiKey}&limit=5`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.features && Array.isArray(data.features)) {
          return data.features.map((item: any, idx: number) => {
            const [lng, lat] = item.center || [0, 0];
            return {
              id: item.id || `maptiler-${idx}`,
              name: item.text || item.place_name || query,
              address: item.place_name || item.text || '',
              latitude: lat,
              longitude: lng,
            };
          });
        }
      }
    } catch (err) {
      console.warn('MapTiler Geocoding error, falling back to Nominatim:', err);
    }
  }

  // Fallback to OSM Nominatim API if MapTiler key is missing or fails
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.place_id ? String(item.place_id) : `nom-${Math.random()}`,
      name: item.display_name.split(',')[0],
      address: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    }));
  } catch (err) {
    console.error('Geocoding fallback failed:', err);
    return [];
  }
}

/**
 * Reverse Geocoding: Given lat/lng, get human-readable location name
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const apiKey = getMapTilerKey();

  if (apiKey) {
    try {
      const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          return data.features[0].place_name || data.features[0].text || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
      }
    } catch (err) {
      console.warn('MapTiler Reverse Geocoding error:', err);
    }
  }

  // Fallback to Nominatim Reverse Geocode
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (res.ok) {
      const data = await res.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  } catch (err) {
    // Ignore
  }

  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
