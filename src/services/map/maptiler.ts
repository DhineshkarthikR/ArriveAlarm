/**
 * MapTiler Service configuration & map style providers
 */

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

export function getMapTilerKey(): string {
  if (!MAPTILER_KEY || MAPTILER_KEY === 'YOUR_MAPTILER_API_KEY') {
    return '';
  }
  return MAPTILER_KEY;
}

export function isMapTilerKeyConfigured(): boolean {
  const key = getMapTilerKey();
  return Boolean(key && key.trim().length > 0);
}

/**
 * Returns MapTiler vector tile style JSON URL or fallback style
 */
export function getMapStyle(isDarkMode: boolean): string {
  const apiKey = getMapTilerKey();

  if (apiKey) {
    return isDarkMode
      ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${apiKey}`
      : `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;
  }

  // Fallback demo style when no API key is provided (MapLibre compatible OSM tile style)
  return isDarkMode
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
}
