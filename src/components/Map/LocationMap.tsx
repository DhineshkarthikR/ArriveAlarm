import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibreglModule from 'maplibre-gl';
import type { Map as MapLibreMap, Marker as MapLibreMarker, ErrorEvent as MapLibreErrorEvent, MapMouseEvent, GeoJSONSource } from 'maplibre-gl';
const maplibregl = maplibreglModule;
import 'maplibre-gl/dist/maplibre-gl.css';

import type { Coordinates } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getMapStyle, isMapTilerKeyConfigured } from '../../services/map/maptiler';
import { reverseGeocode } from '../../services/map/geocoding';
import { createGeoJSONCircle } from '../../utils/distance';
import { Plus, Minus, Locate, Navigation, AlertTriangle } from 'lucide-react';

interface LocationMapProps {
  destination: Coordinates;
  currentLocation?: Coordinates | null;
  radius: number; // in meters
  earlyAlertEnabled?: boolean;
  earlyAlertDistance?: number; // in meters
  onDestinationChange?: (newCoords: Coordinates, newAddress?: string) => void;
  onUseCurrentLocation?: () => void;
  destinationName?: string;
  isInteractive?: boolean;
  followUser?: boolean;
  onToggleFollowUser?: (follow: boolean) => void;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  destination,
  currentLocation,
  radius,
  earlyAlertEnabled = false,
  earlyAlertDistance = 1000,
  onDestinationChange,
  onUseCurrentLocation,
  destinationName = 'Destination',
  isInteractive = true,
  followUser = false,
  onToggleFollowUser,
}) => {
  const { isDarkMode } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const destMarkerRef = useRef<MapLibreMarker | null>(null);
  const userMarkerRef = useRef<MapLibreMarker | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const hasConfiguredKey = isMapTilerKeyConfigured();

  // Helper to update or create GeoJSON geofence circles on MapLibre
  const updateGeofenceLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // 1. Arrival Geofence Circle
    const arrivalCircle = createGeoJSONCircle([destination.lng, destination.lat], radius);
    const arrivalSource = map.getSource('arrival-geofence-source') as GeoJSONSource;

    if (arrivalSource) {
      arrivalSource.setData(arrivalCircle);
    } else {
      map.addSource('arrival-geofence-source', {
        type: 'geojson',
        data: arrivalCircle,
      });

      map.addLayer({
        id: 'arrival-geofence-fill',
        type: 'fill',
        source: 'arrival-geofence-source',
        paint: {
          'fill-color': '#6366f1',
          'fill-opacity': 0.18,
        },
      });

      map.addLayer({
        id: 'arrival-geofence-outline',
        type: 'line',
        source: 'arrival-geofence-source',
        paint: {
          'line-color': '#4f46e5',
          'line-width': 2.5,
        },
      });
    }

    // 2. Early Alert Geofence Circle
    if (earlyAlertEnabled && earlyAlertDistance > radius) {
      const earlyCircle = createGeoJSONCircle([destination.lng, destination.lat], earlyAlertDistance);
      const earlySource = map.getSource('early-alert-source') as GeoJSONSource;

      if (earlySource) {
        earlySource.setData(earlyCircle);
      } else {
        map.addSource('early-alert-source', {
          type: 'geojson',
          data: earlyCircle,
        });

        map.addLayer({
          id: 'early-alert-fill',
          type: 'fill',
          source: 'early-alert-source',
          paint: {
            'fill-color': '#f59e0b',
            'fill-opacity': 0.08,
          },
        });

        map.addLayer({
          id: 'early-alert-outline',
          type: 'line',
          source: 'early-alert-source',
          paint: {
            'line-color': '#f59e0b',
            'line-width': 1.5,
            'line-dasharray': [3, 2],
          },
        });
      }
    } else {
      // Remove early alert layers if disabled
      if (map.getLayer('early-alert-outline')) map.removeLayer('early-alert-outline');
      if (map.getLayer('early-alert-fill')) map.removeLayer('early-alert-fill');
      if (map.getSource('early-alert-source')) map.removeSource('early-alert-source');
    }
  }, [destination, radius, earlyAlertEnabled, earlyAlertDistance]);

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const initialStyle = getMapStyle(isDarkMode);

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: initialStyle,
        center: [destination.lng, destination.lat],
        zoom: 14,
        attributionControl: false,
      });

      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

      map.on('load', () => {
        setIsMapLoaded(true);
        updateGeofenceLayers();
      });

      map.on('error', (e: MapLibreErrorEvent) => {
        console.warn('MapLibre load warning:', e);
      });

      // Map Click Handler to select destination
      if (isInteractive) {
        map.on('click', async (e: MapMouseEvent) => {
          const newCoords: Coordinates = { lat: e.lngLat.lat, lng: e.lngLat.lng };
          const address = await reverseGeocode(newCoords.lat, newCoords.lng);
          if (onDestinationChange) {
            onDestinationChange(newCoords, address);
          }
        });
      }

      mapRef.current = map;
    } catch (err: any) {
      console.error('Failed to initialize MapLibre map:', err);
      setMapError('Unable to load interactive map tiles.');
    }

    return () => {
      if (destMarkerRef.current) destMarkerRef.current.remove();
      if (userMarkerRef.current) userMarkerRef.current.remove();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Update map style on Theme Change (Light -> Dark / Dark -> Light)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    const newStyle = getMapStyle(isDarkMode);
    map.setStyle(newStyle);

    map.once('style.load', () => {
      updateGeofenceLayers();
    });
  }, [isDarkMode, isMapLoaded, updateGeofenceLayers]);

  // Sync Geofence Circles whenever destination or radius changes
  useEffect(() => {
    if (isMapLoaded) {
      updateGeofenceLayers();
    }
  }, [destination, radius, earlyAlertEnabled, earlyAlertDistance, isMapLoaded, updateGeofenceLayers]);

  // Update Destination Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!destMarkerRef.current) {
      // Create custom Destination Marker DOM element
      const el = document.createElement('div');
      el.className = 'custom-destination-marker flex flex-col items-center cursor-pointer transform -translate-y-1/2 group';
      el.innerHTML = `
        <div class="bg-indigo-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-lg border border-white whitespace-nowrap mb-1">
          📍 ${destinationName}
        </div>
        <div class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white transform transition-transform group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      `;

      const marker = new maplibregl.Marker({
        element: el,
        draggable: isInteractive,
      })
        .setLngLat([destination.lng, destination.lat])
        .addTo(map);

      if (isInteractive) {
        marker.on('dragend', async () => {
          const lngLat = marker.getLngLat();
          const newCoords: Coordinates = { lat: lngLat.lat, lng: lngLat.lng };
          const addr = await reverseGeocode(newCoords.lat, newCoords.lng);
          if (onDestinationChange) {
            onDestinationChange(newCoords, addr);
          }
        });
      }

      destMarkerRef.current = marker;
    } else {
      destMarkerRef.current.setLngLat([destination.lng, destination.lat]);
    }
  }, [destination, destinationName, isInteractive, onDestinationChange]);

  // Update User Location Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (currentLocation) {
      if (!userMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'custom-user-marker relative flex items-center justify-center';
        el.innerHTML = `
          <div class="absolute w-8 h-8 bg-sky-500/30 rounded-full animate-ping"></div>
          <div class="w-6 h-6 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white text-[10px] font-bold">
            🔵
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([currentLocation.lng, currentLocation.lat])
          .addTo(map);

        userMarkerRef.current = marker;
      } else {
        userMarkerRef.current.setLngLat([currentLocation.lng, currentLocation.lat]);
      }

      // Follow user if enabled
      if (followUser) {
        map.easeTo({ center: [currentLocation.lng, currentLocation.lat], duration: 800 });
      }
    }
  }, [currentLocation, followUser]);

  // Zoom Handlers
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  return (
    <div className="relative w-full h-full min-h-[350px] sm:min-h-[420px] rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group">
      {/* Missing API Key Developer Notification Banner */}
      {!hasConfiguredKey && (
        <div className="absolute top-3 left-3 right-3 z-30 bg-amber-950/90 text-amber-100 border border-amber-500/50 rounded-2xl p-2.5 px-3.5 shadow-xl backdrop-blur-md text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>MapTiler API Key Missing:</strong> Add <code className="bg-amber-900/60 px-1 py-0.5 rounded text-[11px]">VITE_MAPTILER_API_KEY</code> to <code className="bg-amber-900/60 px-1 py-0.5 rounded text-[11px]">.env</code> for MapTiler tiles.
            </span>
          </div>
        </div>
      )}

      {/* Loading state indicator */}
      {!isMapLoaded && !mapError && (
        <div className="absolute inset-0 z-20 bg-slate-100/90 dark:bg-slate-900/90 flex flex-col items-center justify-center gap-3 backdrop-blur-xs">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Initializing MapTiler Vector Map...
          </span>
        </div>
      )}

      {/* Error state indicator */}
      {mapError && (
        <div className="absolute inset-0 z-20 bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
          <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{mapError}</p>
        </div>
      )}

      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] sm:min-h-[420px]" />

      {/* Map Control Floating Buttons */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow-md border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md flex items-center justify-center transition-all"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow-md border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md flex items-center justify-center transition-all"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>

        {onUseCurrentLocation && (
          <button
            onClick={onUseCurrentLocation}
            className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md flex items-center justify-center transition-all mt-1"
            title="◎ Use My Current Location"
          >
            <Locate className="w-4 h-4" />
          </button>
        )}

        {onToggleFollowUser && (
          <button
            onClick={() => onToggleFollowUser(!followUser)}
            className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center transition-all border ${
              followUser
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title="Follow My Location"
          >
            <Navigation className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md rounded-2xl p-2.5 px-3 text-[11px] shadow-lg flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <span>Arrival Zone ({radius >= 1000 ? `${radius / 1000}km` : `${radius}m`})</span>
        </span>

        {earlyAlertEnabled && (
          <span className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-400 border-dashed" />
            <span>Early Alert ({earlyAlertDistance >= 1000 ? `${earlyAlertDistance / 1000}km` : `${earlyAlertDistance}m`})</span>
          </span>
        )}

        {currentLocation && (
          <span className="flex items-center gap-1 font-semibold text-sky-500">
            <span>🔵</span>
            <span>Your Location</span>
          </span>
        )}
      </div>
    </div>
  );
};
