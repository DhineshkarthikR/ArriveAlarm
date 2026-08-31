export type AlarmStatus = 'idle' | 'tracking' | 'early_alert_triggered' | 'arrived' | 'completed' | 'snoozed';

export type AlarmSoundType = 'default' | 'beep' | 'digital' | 'bell' | 'siren';

export type BatteryMode = 'normal' | 'balanced' | 'saver';

export type ActivePage = 'home' | 'create' | 'active' | 'history' | 'saved' | 'settings';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Alarm {
  id: string;
  destinationName: string;
  address?: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  earlyAlertEnabled: boolean;
  earlyAlertDistance: number; // in meters
  sound: AlarmSoundType;
  volume: number; // 0 to 100
  durationSeconds: number; // 10, 30, 60, or 0 (until dismissed)
  vibrationEnabled: boolean;
  notificationEnabled: boolean;
  autoStop: boolean;
  batteryMode: BatteryMode;
  createdAt: string;
  status: AlarmStatus;
}

export interface SavedPlace {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  defaultRadius: number;
  earlyAlertEnabled: boolean;
  earlyAlertDistance: number;
  createdAt: string;
}

export interface AlarmHistory {
  id: string;
  destinationName: string;
  address?: string;
  latitude: number;
  longitude: number;
  radius: number;
  startedAt: string;
  arrivedAt: string;
  durationMinutes: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  defaultRadius: number;
  defaultSound: AlarmSoundType;
  defaultVibration: boolean;
  defaultDurationSeconds: number;
  batteryMode: BatteryMode;
  autoStop: boolean;
  onboardingCompleted: boolean;
}

export interface SearchResultItem {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  place_id?: number;
  display_name?: string;
  lat?: string;
  lon?: string;
}

