import type { Alarm, AlarmHistory, SavedPlace, UserSettings } from '../types';

const KEYS = {
  SAVED_PLACES: 'arrivealarm_saved_places',
  HISTORY: 'arrivealarm_history',
  SETTINGS: 'arrivealarm_settings',
  ACTIVE_ALARM: 'arrivealarm_active_alarm',
};

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  defaultRadius: 200,
  defaultSound: 'default',
  defaultVibration: true,
  defaultDurationSeconds: 30,
  batteryMode: 'normal',
  autoStop: true,
  onboardingCompleted: false,
};

const SAMPLE_SAVED_PLACES: SavedPlace[] = [
  {
    id: 'place-1',
    name: 'College',
    address: 'Christ University, Hosur Road, Bengaluru',
    latitude: 12.9345,
    longitude: 77.6060,
    defaultRadius: 200,
    earlyAlertEnabled: true,
    earlyAlertDistance: 1000,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'place-2',
    name: 'Railway Station',
    address: 'KSR Bengaluru City Railway Station',
    latitude: 12.9781,
    longitude: 77.5697,
    defaultRadius: 300,
    earlyAlertEnabled: true,
    earlyAlertDistance: 2000,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'place-3',
    name: 'Gym',
    address: 'Gold Fitness, Koramangala, Bengaluru',
    latitude: 12.9300,
    longitude: 77.6200,
    defaultRadius: 100,
    earlyAlertEnabled: false,
    earlyAlertDistance: 500,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const SAMPLE_HISTORY: AlarmHistory[] = [
  {
    id: 'hist-1',
    destinationName: 'College',
    address: 'Christ University, Hosur Road, Bengaluru',
    latitude: 12.9345,
    longitude: 77.6060,
    radius: 200,
    startedAt: new Date(Date.now() - 86400000 - 3600000 * 3).toISOString(),
    arrivedAt: new Date(Date.now() - 86400000 - 3600000 * 2.5).toISOString(),
    durationMinutes: 28,
  },
  {
    id: 'hist-2',
    destinationName: 'Railway Station',
    address: 'KSR Bengaluru City Railway Station',
    latitude: 12.9781,
    longitude: 77.5697,
    radius: 300,
    startedAt: new Date(Date.now() - 86400000 * 2 - 3600000 * 5).toISOString(),
    arrivedAt: new Date(Date.now() - 86400000 * 2 - 3600000 * 4.2).toISOString(),
    durationMinutes: 45,
  },
];

export function getSavedPlaces(): SavedPlace[] {
  try {
    const raw = localStorage.getItem(KEYS.SAVED_PLACES);
    if (!raw) {
      localStorage.setItem(KEYS.SAVED_PLACES, JSON.stringify(SAMPLE_SAVED_PLACES));
      return SAMPLE_SAVED_PLACES;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_SAVED_PLACES;
  }
}

export function savePlace(place: Omit<SavedPlace, 'id' | 'createdAt'>): SavedPlace {
  const places = getSavedPlaces();
  const newPlace: SavedPlace = {
    ...place,
    id: `place-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newPlace, ...places];
  localStorage.setItem(KEYS.SAVED_PLACES, JSON.stringify(updated));
  return newPlace;
}

export function deleteSavedPlace(id: string): SavedPlace[] {
  const places = getSavedPlaces().filter((p) => p.id !== id);
  localStorage.setItem(KEYS.SAVED_PLACES, JSON.stringify(places));
  return places;
}

export function getAlarmHistory(): AlarmHistory[] {
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    if (!raw) {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(SAMPLE_HISTORY));
      return SAMPLE_HISTORY;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_HISTORY;
  }
}

export function addHistoryEntry(entry: Omit<AlarmHistory, 'id'>): AlarmHistory {
  const history = getAlarmHistory();
  const newEntry: AlarmHistory = {
    ...entry,
    id: `hist-${Date.now()}`,
  };
  const updated = [newEntry, ...history];
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  return newEntry;
}

export function deleteHistoryEntry(id: string): AlarmHistory[] {
  const history = getAlarmHistory().filter((h) => h.id !== id);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  return history;
}

export function clearAllHistory(): void {
  localStorage.setItem(KEYS.HISTORY, JSON.stringify([]));
}

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: Partial<UserSettings>): UserSettings {
  const current = getUserSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
}

export function getActiveAlarmFromStorage(): Alarm | null {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_ALARM);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveActiveAlarmToStorage(alarm: Alarm | null): void {
  if (!alarm) {
    localStorage.removeItem(KEYS.ACTIVE_ALARM);
  } else {
    localStorage.setItem(KEYS.ACTIVE_ALARM, JSON.stringify(alarm));
  }
}
