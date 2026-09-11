import React, { useState } from 'react';
import { Settings as SettingsIcon, Locate, Bell, Battery, ShieldCheck, Check } from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { getUserSettings, saveUserSettings } from '../utils/storage';
import type { BatteryMode } from '../types';

export const Settings: React.FC = () => {
  const { requestCurrentLocation } = useAlarm();

  const [settings, setSettings] = useState(() => getUserSettings());
  const [locCheckMsg, setLocCheckMsg] = useState<string | null>(null);
  const [notifMsg, setNotifMsg] = useState<string | null>(null);

  const updateSettingField = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    const updated = saveUserSettings({ [key]: value });
    setSettings(updated);
  };

  const handleCheckLocationPermission = async () => {
    setLocCheckMsg('Checking...');
    const coords = await requestCurrentLocation();
    if (coords) {
      setLocCheckMsg(`Location active (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
    } else {
      setLocCheckMsg('Location permission denied or unavailable.');
    }
  };

  const handleTestNotification = async () => {
    if (typeof Notification === 'undefined') {
      setNotifMsg('Notifications not supported in this browser.');
      return;
    }

    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      new Notification('ArriveAlarm Test', {
        body: 'Browser notifications are working.',
      });
      setNotifMsg('Notification sent.');
    } else {
      setNotifMsg('Notification permission denied.');
    }
  };

  return (
    <div className="space-y-5 animate-slide-up pb-12 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-[#888888]" />
          <span>Settings</span>
        </h1>
        <p className="text-xs text-[#888888] mt-1">
          Configure preferences, diagnostics, and battery options.
        </p>
      </div>

      {/* Location Diagnostic */}
      <div className="border border-[#1a1a1a] rounded-md p-5 space-y-3">
        <h2 className="text-sm font-medium text-white flex items-center gap-2">
          <Locate className="w-4 h-4 text-[#888888]" />
          <span>Location & GPS</span>
        </h2>
        <p className="text-xs text-[#555555]">
          ArriveAlarm uses device GPS to detect proximity to your geofence.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleCheckLocationPermission}
            className="py-2 px-3 bg-[#111111] hover:bg-[#1a1a1a] text-white font-medium text-xs rounded-md border border-[#1a1a1a] transition-colors cursor-pointer"
          >
            Check Permission
          </button>
          {locCheckMsg && <span className="text-xs text-[#888888]">{locCheckMsg}</span>}
        </div>
      </div>

      {/* Notifications */}
      <div className="border border-[#1a1a1a] rounded-md p-5 space-y-3">
        <h2 className="text-sm font-medium text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#888888]" />
          <span>Notifications</span>
        </h2>
        <p className="text-xs text-[#555555]">
          Test browser notifications to ensure you receive alerts.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleTestNotification}
            className="py-2 px-3 bg-[#111111] hover:bg-[#1a1a1a] text-white font-medium text-xs rounded-md border border-[#1a1a1a] transition-colors cursor-pointer"
          >
            Test Notification
          </button>
          {notifMsg && <span className="text-xs text-[#888888]">{notifMsg}</span>}
        </div>
      </div>

      {/* Battery Mode */}
      <div className="border border-[#1a1a1a] rounded-md p-5 space-y-4">
        <h2 className="text-sm font-medium text-white flex items-center gap-2">
          <Battery className="w-4 h-4 text-[#888888]" />
          <span>Battery Optimization</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { id: 'normal', label: 'Normal', desc: 'High accuracy updates.' },
            { id: 'balanced', label: 'Balanced', desc: 'Balanced accuracy and battery.' },
            { id: 'saver', label: 'Battery Saver', desc: 'Less frequent GPS checks.' },
          ].map((mode) => {
            const isSelected = settings.batteryMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => updateSettingField('batteryMode', mode.id as BatteryMode)}
                className={`p-3 rounded-md border cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#111111] border-[#333333] text-white'
                    : 'border-[#1a1a1a] text-[#888888] hover:border-[#2a2a2a]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-xs">{mode.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <p className="text-[11px] text-[#555555]">{mode.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy */}
      <div className="border border-[#1a1a1a] rounded-md p-5 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Privacy</span>
        </div>
        <p className="text-xs text-[#555555] leading-relaxed">
          All location data is processed locally in your browser. No coordinates or tracking history are sent to any server.
        </p>
      </div>
    </div>
  );
};
