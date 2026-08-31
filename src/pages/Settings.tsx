import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Laptop, Locate, Bell, Battery, ShieldCheck, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAlarm } from '../context/AlarmContext';
import { Card } from '../components/Common/Card';
import { getUserSettings, saveUserSettings } from '../utils/storage';
import type { BatteryMode } from '../types';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { requestCurrentLocation } = useAlarm();

  const [settings, setSettings] = useState(() => getUserSettings());
  const [locCheckMsg, setLocCheckMsg] = useState<string | null>(null);
  const [notifMsg, setNotifMsg] = useState<string | null>(null);

  const updateSettingField = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    const updated = saveUserSettings({ [key]: value });
    setSettings(updated);
  };

  const handleCheckLocationPermission = async () => {
    setLocCheckMsg('Checking location permission...');
    const coords = await requestCurrentLocation();
    if (coords) {
      setLocCheckMsg(`✅ Location permission active! (Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)})`);
    } else {
      setLocCheckMsg('❌ Location permission denied or unavailable.');
    }
  };

  const handleTestNotification = async () => {
    if (typeof Notification === 'undefined') {
      setNotifMsg('❌ Web Notifications not supported in this browser.');
      return;
    }

    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      new Notification('🔔 ArriveAlarm Test', {
        body: 'Browser notifications are properly configured!',
      });
      setNotifMsg('✅ Notification sent successfully!');
    } else {
      setNotifMsg('⚠️ Notification permission was denied.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          <span>Settings & Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize application theme, default geofence parameters, battery options, and diagnostics.
        </p>
      </div>

      {/* Appearance Theme Selector */}
      <Card className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Appearance</span>
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Laptop },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTheme(item.id as 'light' | 'dark' | 'system')}
                className={`py-3 px-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Location Diagnostic */}
      <Card className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Locate className="w-4 h-4 text-indigo-500" />
          <span>Location Accuracy & GPS Diagnostic</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          ArriveAlarm uses device GPS high-accuracy geolocation to detect proximity to your geofence.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleCheckLocationPermission}
            className="py-2.5 px-4 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 font-bold text-xs rounded-xl transition-all"
          >
            Check Location Permission
          </button>
          {locCheckMsg && <span className="text-xs font-semibold">{locCheckMsg}</span>}
        </div>
      </Card>

      {/* Browser Notification Diagnostics */}
      <Card className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          <span>Notifications</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Test browser push notifications to ensure you receive arrival alerts.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleTestNotification}
            className="py-2.5 px-4 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 font-bold text-xs rounded-xl transition-all"
          >
            Test Browser Notification
          </button>
          {notifMsg && <span className="text-xs font-semibold">{notifMsg}</span>}
        </div>
      </Card>

      {/* Battery Saver Modes */}
      <Card className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Battery className="w-4 h-4 text-emerald-500" />
          <span>Battery Optimization</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'normal',
              label: 'Normal',
              desc: 'High frequency updates, highest accuracy.',
            },
            {
              id: 'balanced',
              label: 'Balanced',
              desc: 'Balanced update frequency and battery life.',
            },
            {
              id: 'saver',
              label: 'Battery Saver',
              desc: 'Less frequent GPS checks to conserve power.',
            },
          ].map((mode) => {
            const isSelected = settings.batteryMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => updateSettingField('batteryMode', mode.id as BatteryMode)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-200 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{mode.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{mode.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Privacy Guarantee Banner */}
      <Card className="bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>Privacy & Client-Side Architecture</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Your location coordinates are processed 100% locally inside your browser to calculate proximity. No location coordinates or tracking history are transmitted to any external server.
        </p>
      </Card>
    </div>
  );
};
