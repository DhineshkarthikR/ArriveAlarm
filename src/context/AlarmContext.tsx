import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ActivePage, Alarm, AlarmHistory, Coordinates, SavedPlace } from '../types';
import { calculateDistance } from '../utils/distance';
import { playAlarmSound, stopAlarmSound, triggerVibration } from '../utils/audio';
import {
  addHistoryEntry,
  getActiveAlarmFromStorage,
  getAlarmHistory,
  getSavedPlaces,
  saveActiveAlarmToStorage,
} from '../utils/storage';

interface AlarmContextType {
  activeAlarm: Alarm | null;
  currentLocation: Coordinates | null;
  currentDistance: number | null;
  initialDistance: number | null;
  isTracking: boolean;
  isArrivedModalOpen: boolean;
  isEarlyAlertTriggered: boolean;
  gpsError: string | null;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  // Actions
  startAlarm: (alarm: Alarm) => void;
  stopAlarm: () => void;
  snoozeAlarm: (minutes?: number) => void;
  keepTracking: () => void;
  requestCurrentLocation: () => Promise<Coordinates | null>;

  // Data lists
  history: AlarmHistory[];
  savedPlaces: SavedPlace[];
  refreshStorageData: () => void;

  // Demo Mode
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  demoDistance: number;
  setDemoDistance: (distanceMeters: number) => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

// Default starting fallback location (Bengaluru City Center)
const DEFAULT_COORDS: Coordinates = { lat: 12.9716, lng: 77.5946 };

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(() => getActiveAlarmFromStorage());
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [isArrivedModalOpen, setIsArrivedModalOpen] = useState<boolean>(false);
  const [isEarlyAlertTriggered, setIsEarlyAlertTriggered] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Storage states
  const [history, setHistory] = useState<AlarmHistory[]>(() => getAlarmHistory());
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(() => getSavedPlaces());

  // Demo Mode states
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [demoDistance, setDemoDistanceState] = useState<number>(2000); // meters

  // Geolocation watcher ref
  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const refreshStorageData = () => {
    setHistory(getAlarmHistory());
    setSavedPlaces(getSavedPlaces());
  };

  // Request browser current location
  const requestCurrentLocation = (): Promise<Coordinates | null> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setGpsError('Geolocation is not supported by your browser.');
        resolve(DEFAULT_COORDS);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentLocation(coords);
          setGpsError(null);
          resolve(coords);
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
          setGpsError('Could not get current location. Using map center.');
          // Resolve default coords so app gracefully functions
          resolve(currentLocation || DEFAULT_COORDS);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    });
  };

  // Synchronize Demo Mode distance changes
  const setDemoDistance = (dist: number) => {
    setDemoDistanceState(dist);
    if (activeAlarm) {
      // Calculate a simulated coordinate based on destination & requested distance
      const destLat = activeAlarm.latitude;
      const destLng = activeAlarm.longitude;
      // 1 degree lat is approx 111,000 meters
      const offsetLat = dist / 111000;
      const simCoords = { lat: destLat + offsetLat, lng: destLng };
      setCurrentLocation(simCoords);
      updateProximity(simCoords, activeAlarm);
    }
  };

  // Start tracking
  const startAlarm = (alarmData: Alarm) => {
    const trackingAlarm: Alarm = {
      ...alarmData,
      status: 'tracking',
      createdAt: new Date().toISOString(),
    };

    setActiveAlarm(trackingAlarm);
    saveActiveAlarmToStorage(trackingAlarm);
    setIsArrivedModalOpen(false);
    setIsEarlyAlertTriggered(false);
    startTimeRef.current = Date.now();

    // Get immediate location to compute initial distance
    requestCurrentLocation().then((coords) => {
      const activeCoords = coords || DEFAULT_COORDS;
      const dist = calculateDistance(
        activeCoords.lat,
        activeCoords.lng,
        trackingAlarm.latitude,
        trackingAlarm.longitude
      );
      setInitialDistance(dist);
      setCurrentDistance(dist);

      if (demoMode) {
        setDemoDistance(2000);
      }
    });

    setActivePage('active');
  };

  // Stop tracking
  const stopAlarm = () => {
    stopAlarmSound();
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (activeAlarm && startTimeRef.current) {
      const durationMins = Math.max(
        1,
        Math.round((Date.now() - startTimeRef.current) / 60000)
      );

      // Add to history log
      addHistoryEntry({
        destinationName: activeAlarm.destinationName,
        address: activeAlarm.address,
        latitude: activeAlarm.latitude,
        longitude: activeAlarm.longitude,
        radius: activeAlarm.radius,
        startedAt: activeAlarm.createdAt,
        arrivedAt: new Date().toISOString(),
        durationMinutes: durationMins,
      });

      refreshStorageData();
    }

    setActiveAlarm(null);
    saveActiveAlarmToStorage(null);
    setCurrentDistance(null);
    setInitialDistance(null);
    setIsArrivedModalOpen(false);
    setIsEarlyAlertTriggered(false);
    startTimeRef.current = null;
  };

  // Snooze alarm for 1 min
  const snoozeAlarm = (minutes = 1) => {
    stopAlarmSound();
    setIsArrivedModalOpen(false);
    if (activeAlarm) {
      const snoozedAlarm = { ...activeAlarm, status: 'snoozed' as const };
      setActiveAlarm(snoozedAlarm);
      saveActiveAlarmToStorage(snoozedAlarm);

      setTimeout(() => {
        if (activeAlarm) {
          triggerArrivalAlert(activeAlarm);
        }
      }, minutes * 60 * 1000);
    }
  };

  // Keep tracking after arrival
  const keepTracking = () => {
    stopAlarmSound();
    setIsArrivedModalOpen(false);
  };

  // Helper to process proximity & trigger alarms
  const updateProximity = (coords: Coordinates, alarm: Alarm) => {
    const dist = calculateDistance(
      coords.lat,
      coords.lng,
      alarm.latitude,
      alarm.longitude
    );
    setCurrentDistance(dist);

    // 1. Early alert check
    if (
      alarm.earlyAlertEnabled &&
      dist <= alarm.earlyAlertDistance &&
      dist > alarm.radius &&
      !isEarlyAlertTriggered
    ) {
      setIsEarlyAlertTriggered(true);
      if (Notification.permission === 'granted') {
        new Notification('🚨 ArriveAlarm Early Warning', {
          body: `You are approximately ${Math.round(dist)} meters away from ${alarm.destinationName}.`,
        });
      }
    }

    // 2. Arrival check
    if (dist <= alarm.radius && alarm.status !== 'arrived') {
      triggerArrivalAlert(alarm);
    }
  };

  // Trigger arrival notifications, audio, vibration, and UI modal
  const triggerArrivalAlert = (alarm: Alarm) => {
    const arrivedAlarm: Alarm = { ...alarm, status: 'arrived' };
    setActiveAlarm(arrivedAlarm);
    saveActiveAlarmToStorage(arrivedAlarm);
    setIsArrivedModalOpen(true);

    // Audio sound
    playAlarmSound(alarm.sound, alarm.volume, alarm.durationSeconds);

    // Vibration
    if (alarm.vibrationEnabled) {
      triggerVibration();
    }

    // Web Notification
    if (alarm.notificationEnabled && Notification.permission === 'granted') {
      new Notification('🎉 You have arrived!', {
        body: `You are within ${alarm.radius} meters of ${alarm.destinationName}.`,
        icon: '/favicon.ico',
      });
    }

    if (alarm.autoStop) {
      // Auto stop handling if user configured auto stop
    }
  };

  // Real Geolocation watch position effect
  useEffect(() => {
    if (!activeAlarm || demoMode) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentLocation(coords);
          setGpsError(null);
          updateProximity(coords, activeAlarm);
        },
        (err) => {
          console.warn('WatchPosition error:', err.message);
          setGpsError('GPS signal weak or unavailable. Using estimated coordinates.');
        },
        {
          enableHighAccuracy: activeAlarm.batteryMode === 'normal',
          maximumAge: activeAlarm.batteryMode === 'saver' ? 15000 : 3000,
          timeout: 15000,
        }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [activeAlarm, demoMode]);

  return (
    <AlarmContext.Provider
      value={{
        activeAlarm,
        currentLocation,
        currentDistance,
        initialDistance,
        isTracking: !!activeAlarm,
        isArrivedModalOpen,
        isEarlyAlertTriggered,
        gpsError,
        activePage,
        setActivePage,
        startAlarm,
        stopAlarm,
        snoozeAlarm,
        keepTracking,
        requestCurrentLocation,
        history,
        savedPlaces,
        refreshStorageData,
        demoMode,
        setDemoMode,
        demoDistance,
        setDemoDistance,
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarm = () => {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
};
