import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type {
  ActivePage,
  Alarm,
  AlarmHistory,
  Coordinates,
  SavedPlace,
  TimeAlarm,
  UserSettings,
} from '../types';
import { calculateDistance } from '../utils/distance';
import { playAlarmSound, stopAlarmSound, triggerVibration } from '../utils/audio';
import { calculateNextRingTimestamp } from '../utils/timeAlarm';
import {
  addHistoryEntry,
  getActiveAlarmFromStorage,
  getAlarmHistory,
  getSavedPlaces,
  getTimeAlarms,
  getUserSettings,
  saveActiveAlarmToStorage,
  saveTimeAlarms,
  saveUserSettings,
} from '../utils/storage';

interface AlarmContextType {
  // Live Clock & User Settings
  nowMs: number;
  userSettings: UserSettings;
  setTimeFormat: (format: '12h' | '24h') => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  notificationPermission: NotificationPermission;
  requestNotificationPermission: () => Promise<NotificationPermission>;

  // Time Alarms (Multi-alarm management)
  timeAlarms: TimeAlarm[];
  ringingTimeAlarm: TimeAlarm | null;
  addTimeAlarm: (alarmData: Omit<TimeAlarm, 'id' | 'createdAt' | 'status' | 'nextRingTimestamp'>) => TimeAlarm;
  updateTimeAlarm: (id: string, alarmData: Partial<TimeAlarm>) => void;
  deleteTimeAlarm: (id: string) => void;
  toggleTimeAlarm: (id: string) => void;
  snoozeTimeAlarm: (minutes?: number) => void;
  stopRingingTimeAlarm: () => void;
  quickAddAlarm: (minutesFromNow: number, label?: string) => void;

  // Location Alarm (Backward compatible)
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

  // Storage Lists
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

const DEFAULT_COORDS: Coordinates = { lat: 12.9716, lng: 77.5946 };

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [userSettings, setUserSettingsState] = useState<UserSettings>(() => getUserSettings());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  // Time Alarms state
  const [timeAlarms, setTimeAlarmsState] = useState<TimeAlarm[]>(() => {
    const rawAlarms = getTimeAlarms();
    // Recalculate nextRingTimestamp for loaded alarms
    return rawAlarms.map((a) => {
      const computed = calculateNextRingTimestamp(a.hour, a.minute, a.repeat, a.customDays);
      return { ...a, nextRingTimestamp: computed };
    });
  });
  const [ringingTimeAlarm, setRingingTimeAlarm] = useState<TimeAlarm | null>(null);

  // Location Alarm state
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

  // Demo Mode
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [demoDistance, setDemoDistanceState] = useState<number>(2000);

  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Save time alarms state to localStorage whenever changed
  const updateTimeAlarmsList = (newList: TimeAlarm[]) => {
    setTimeAlarmsState(newList);
    saveTimeAlarms(newList);
  };

  // User Settings updates
  const setTimeFormat = (format: '12h' | '24h') => {
    const updated = saveUserSettings({ timeFormat: format });
    setUserSettingsState(updated);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = saveUserSettings(newSettings);
    setUserSettingsState(updated);
  };

  // Request browser notification permission
  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      return perm;
    }
    return 'denied';
  };

  // Add a new Time Alarm
  const addTimeAlarm = (
    alarmData: Omit<TimeAlarm, 'id' | 'createdAt' | 'status' | 'nextRingTimestamp'>
  ): TimeAlarm => {
    const nextRingTimestamp = calculateNextRingTimestamp(
      alarmData.hour,
      alarmData.minute,
      alarmData.repeat,
      alarmData.customDays
    );

    const newAlarm: TimeAlarm = {
      ...alarmData,
      id: `time-alarm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'idle',
      nextRingTimestamp,
      createdAt: new Date().toISOString(),
    };

    const updated = [...timeAlarms, newAlarm];
    updateTimeAlarmsList(updated);
    return newAlarm;
  };

  // Quick add alarm (e.g. +5 min, +10 min)
  const quickAddAlarm = (minutesFromNow: number, label?: string) => {
    const targetDate = new Date(Date.now() + minutesFromNow * 60 * 1000);
    const hour = targetDate.getHours();
    const minute = targetDate.getMinutes();
    const autoLabel = label || `Quick +${minutesFromNow}m`;

    addTimeAlarm({
      type: 'time',
      label: autoLabel,
      hour,
      minute,
      enabled: true,
      sound: userSettings.defaultSound || 'classic',
      volume: userSettings.defaultVolume || 80,
      snoozeDuration: userSettings.defaultSnoozeDuration || 5,
      repeat: 'once',
      customDays: [],
    });
  };

  // Update existing Time Alarm
  const updateTimeAlarm = (id: string, alarmData: Partial<TimeAlarm>) => {
    const updated = timeAlarms.map((alarm) => {
      if (alarm.id !== id) return alarm;
      const merged = { ...alarm, ...alarmData };
      const nextRingTimestamp = calculateNextRingTimestamp(
        merged.hour,
        merged.minute,
        merged.repeat,
        merged.customDays
      );
      return { ...merged, nextRingTimestamp };
    });
    updateTimeAlarmsList(updated);
  };

  // Delete Time Alarm
  const deleteTimeAlarm = (id: string) => {
    const updated = timeAlarms.filter((a) => a.id !== id);
    if (ringingTimeAlarm?.id === id) {
      stopRingingTimeAlarm();
    }
    updateTimeAlarmsList(updated);
  };

  // Toggle Time Alarm ON/OFF
  const toggleTimeAlarm = (id: string) => {
    const updated = timeAlarms.map((alarm) => {
      if (alarm.id !== id) return alarm;
      const nextEnabled = !alarm.enabled;
      const nextRingTimestamp = nextEnabled
        ? calculateNextRingTimestamp(alarm.hour, alarm.minute, alarm.repeat, alarm.customDays)
        : alarm.nextRingTimestamp;
      return { ...alarm, enabled: nextEnabled, status: 'idle' as const, nextRingTimestamp };
    });
    updateTimeAlarmsList(updated);
  };

  // Snooze ringing Time Alarm
  const snoozeTimeAlarm = (customMinutes?: number) => {
    if (!ringingTimeAlarm) return;
    stopAlarmSound();
    setIsArrivedModalOpen(false);

    const snoozeMins = customMinutes || ringingTimeAlarm.snoozeDuration || 5;
    const snoozedUntil = Date.now() + snoozeMins * 60 * 1000;

    const updated = timeAlarms.map((alarm) => {
      if (alarm.id === ringingTimeAlarm.id) {
        return {
          ...alarm,
          status: 'snoozed' as const,
          snoozedUntil,
        };
      }
      return alarm;
    });

    updateTimeAlarmsList(updated);
    setRingingTimeAlarm(null);
  };

  // Stop ringing Time Alarm
  const stopRingingTimeAlarm = () => {
    stopAlarmSound();
    setIsArrivedModalOpen(false);

    if (ringingTimeAlarm) {
      const updated = timeAlarms.map((alarm) => {
        if (alarm.id === ringingTimeAlarm.id) {
          const isOnce = alarm.repeat === 'once';
          const nextRingTimestamp = calculateNextRingTimestamp(
            alarm.hour,
            alarm.minute,
            alarm.repeat,
            alarm.customDays,
            new Date(Date.now() + 60000) // calculate from next minute onwards
          );
          return {
            ...alarm,
            enabled: isOnce ? false : alarm.enabled,
            status: 'idle' as const,
            snoozedUntil: undefined,
            nextRingTimestamp,
          };
        }
        return alarm;
      });
      updateTimeAlarmsList(updated);
      setRingingTimeAlarm(null);
    }
  };

  // Single Core Engine Ticker (Runs every 1 sec)
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const currentMs = Date.now();
      setNowMs(currentMs);

      // Check Time Alarms
      if (!ringingTimeAlarm && !activeAlarm) {
        timeAlarms.forEach((alarm) => {
          if (!alarm.enabled) return;

          const targetTime =
            alarm.status === 'snoozed' && alarm.snoozedUntil
              ? alarm.snoozedUntil
              : alarm.nextRingTimestamp;

          if (currentMs >= targetTime && targetTime > 0) {
            // Trigger Ringing Alarm!
            setRingingTimeAlarm(alarm);
            setIsArrivedModalOpen(true);

            playAlarmSound(alarm.sound, alarm.volume, 0);
            triggerVibration();

            if (notificationPermission === 'granted') {
              new Notification(`⏰ Alarm: ${alarm.label}`, {
                body: `It's time! (${alarm.label})`,
                icon: '/favicon.ico',
              });
            }
          }
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeAlarms, ringingTimeAlarm, activeAlarm, notificationPermission]);

  const refreshStorageData = () => {
    setHistory(getAlarmHistory());
    setSavedPlaces(getSavedPlaces());
  };

  // Geolocation request
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
          resolve(currentLocation || DEFAULT_COORDS);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    });
  };

  // Synchronize Demo Mode distance
  const setDemoDistance = (dist: number) => {
    setDemoDistanceState(dist);
    if (activeAlarm) {
      const destLat = activeAlarm.latitude;
      const destLng = activeAlarm.longitude;
      const offsetLat = dist / 111000;
      const simCoords = { lat: destLat + offsetLat, lng: destLng };
      setCurrentLocation(simCoords);
      updateProximity(simCoords, activeAlarm);
    }
  };

  // Start tracking Location Alarm
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

  // Stop Location Alarm tracking
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

  // Snooze Location Alarm
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

  // Keep tracking after location arrival
  const keepTracking = () => {
    stopAlarmSound();
    setIsArrivedModalOpen(false);
  };

  // Proximity update helper for Location Alarm
  const updateProximity = (coords: Coordinates, alarm: Alarm) => {
    const dist = calculateDistance(
      coords.lat,
      coords.lng,
      alarm.latitude,
      alarm.longitude
    );
    setCurrentDistance(dist);

    if (
      alarm.earlyAlertEnabled &&
      dist <= alarm.earlyAlertDistance &&
      dist > alarm.radius &&
      !isEarlyAlertTriggered
    ) {
      setIsEarlyAlertTriggered(true);
      if (notificationPermission === 'granted') {
        new Notification('🚨 ArriveAlarm Early Warning', {
          body: `You are approximately ${Math.round(dist)} meters away from ${alarm.destinationName}.`,
        });
      }
    }

    if (dist <= alarm.radius && alarm.status !== 'arrived') {
      triggerArrivalAlert(alarm);
    }
  };

  // Trigger arrival alert for Location Alarm
  const triggerArrivalAlert = (alarm: Alarm) => {
    const arrivedAlarm: Alarm = { ...alarm, status: 'arrived' };
    setActiveAlarm(arrivedAlarm);
    saveActiveAlarmToStorage(arrivedAlarm);
    setIsArrivedModalOpen(true);

    playAlarmSound(alarm.sound, alarm.volume, alarm.durationSeconds);

    if (alarm.vibrationEnabled) {
      triggerVibration();
    }

    if (alarm.notificationEnabled && notificationPermission === 'granted') {
      new Notification('🎉 You have arrived!', {
        body: `You are within ${alarm.radius} meters of ${alarm.destinationName}.`,
        icon: '/favicon.ico',
      });
    }
  };

  // Geolocation watch position
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
        nowMs,
        userSettings,
        setTimeFormat,
        updateSettings,
        notificationPermission,
        requestNotificationPermission,
        timeAlarms,
        ringingTimeAlarm,
        addTimeAlarm,
        updateTimeAlarm,
        deleteTimeAlarm,
        toggleTimeAlarm,
        snoozeTimeAlarm,
        stopRingingTimeAlarm,
        quickAddAlarm,
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
