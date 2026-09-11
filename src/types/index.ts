export type AlarmStatus = 'idle' | 'tracking' | 'early_alert_triggered' | 'arrived' | 'completed' | 'snoozed';

export type AlarmSoundType =
  | 'classic'
  | 'loud_beep'
  | 'beep'
  | 'digital'
  | 'high_pitch'
  | 'rapid_beep'
  | 'emergency'
  | 'bell'
  | 'electronic'
  | 'morning'
  | 'double_beep'
  | 'default'
  | 'siren';

export type RepeatOption = 'once' | 'daily' | 'weekdays' | 'weekends' | 'custom';

export type BatteryMode = 'normal' | 'balanced' | 'saver';

export type ActivePage = 'home' | 'create' | 'active' | 'history' | 'saved' | 'settings';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TimeAlarm {
  id: string;
  type: 'time' | 'location';
  label: string;
  hour: number; // 0-23
  minute: number; // 0-59
  enabled: boolean;
  sound: AlarmSoundType;
  volume: number; // 0 to 100
  snoozeDuration: number; // in minutes (1, 5, 10, 15)
  repeat: RepeatOption;
  customDays: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  nextRingTimestamp: number; // milliseconds unix timestamp
  status: 'idle' | 'ringing' | 'snoozed';
  createdAt: string;
  snoozedUntil?: number;
  // Optional fields for location alarms if type === 'location'
  destinationName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
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
  timeFormat: '12h' | '24h';
  defaultRadius: number;
  defaultSound: AlarmSoundType;
  defaultVolume: number;
  defaultSnoozeDuration: number;
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


