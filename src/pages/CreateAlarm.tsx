import React, { useState } from 'react';
import {
  MapPin,
  AlertCircle,
  BellRing,
  Smartphone,
  Star,
  Square,
  Layers,
  AlarmClock,
  Clock,
  Repeat,
  PlusCircle,
} from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { MapView } from '../components/Map/MapView';
import { LocationSearch } from '../components/Map/LocationSearch';
import { RadiusSelector } from '../components/Alarm/RadiusSelector';
import { SoundSelector } from '../components/Alarm/SoundSelector';
import type { Alarm, AlarmSoundType, Coordinates, RepeatOption } from '../types';
import { calculateNextRingTimestamp, getCountdownText } from '../utils/timeAlarm';
import { savePlace } from '../utils/storage';

export const CreateAlarm: React.FC = () => {
  const {
    addTimeAlarm,
    startAlarm,
    stopAlarm,
    isTracking,
    requestCurrentLocation,
    currentLocation,
    refreshStorageData,
    userSettings,
    setActivePage,
    nowMs,
  } = useAlarm();

  // Active creation mode tab ('time' vs 'location')
  const [activeTab, setActiveTab] = useState<'time' | 'location'>('time');

  // Time Alarm Form States
  const defaultHour = new Date(Date.now() + 15 * 60000).getHours();
  const defaultMinute = new Date(Date.now() + 15 * 60000).getMinutes();

  const [timeLabel, setTimeLabel] = useState<string>('Morning Alarm');
  const [hour, setHour] = useState<number>(defaultHour);
  const [minute, setMinute] = useState<number>(defaultMinute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(defaultHour >= 12 ? 'PM' : 'AM');
  const [repeat, setRepeat] = useState<RepeatOption>('once');
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [timeSound, setTimeSound] = useState<AlarmSoundType>(userSettings.defaultSound || 'classic');
  const [timeVolume, setTimeVolume] = useState<number>(userSettings.defaultVolume || 80);
  const [snoozeDuration, setSnoozeDuration] = useState<number>(userSettings.defaultSnoozeDuration || 5);

  // Location Alarm Form States
  const [destinationName, setDestinationName] = useState<string>('Christ University');
  const [address, setAddress] = useState<string>('Bengaluru, Karnataka');
  const [coords, setCoords] = useState<Coordinates>({ lat: 12.9345, lng: 77.6060 });
  const [radius, setRadius] = useState<number>(200);
  const [earlyAlertEnabled, setEarlyAlertEnabled] = useState<boolean>(false);
  const [earlyAlertDistance, setEarlyAlertDistance] = useState<number>(1000);
  const [locationSound, setLocationSound] = useState<AlarmSoundType>('classic');
  const [locationVolume, setLocationVolume] = useState<number>(80);
  const [durationSeconds, setDurationSeconds] = useState<number>(30);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(true);
  const [autoStop, setAutoStop] = useState<boolean>(true);
  const [isSavePlace, setIsSavePlace] = useState<boolean>(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  // Computed 24-hour value for Time Alarm
  const computed24Hour = (): number => {
    if (userSettings.timeFormat === '24h') return hour;
    let h24 = hour % 12;
    if (period === 'PM') h24 += 12;
    return h24;
  };

  // Calculate live next ring timestamp & countdown for preview
  const live24Hour = computed24Hour();
  const nextRingTimestamp = calculateNextRingTimestamp(live24Hour, minute, repeat, customDays);
  const liveCountdownText = getCountdownText(nextRingTimestamp, nowMs);

  const toggleDay = (dayIndex: number) => {
    if (customDays.includes(dayIndex)) {
      setCustomDays(customDays.filter((d) => d !== dayIndex));
    } else {
      setCustomDays([...customDays, dayIndex]);
    }
  };

  // Submit Time Alarm
  const handleSaveTimeAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeLabel.trim()) {
      setValidationError('Please enter a label for your alarm.');
      return;
    }
    setValidationError(null);

    addTimeAlarm({
      type: 'time',
      label: timeLabel,
      hour: live24Hour,
      minute,
      enabled: true,
      sound: timeSound,
      volume: timeVolume,
      snoozeDuration,
      repeat,
      customDays,
    });

    setActivePage('home');
  };

  // Submit Location Alarm
  const handleStartLocationAlarm = () => {
    if (!destinationName.trim()) {
      setValidationError('Please specify a destination name.');
      return;
    }
    if (radius <= 0) {
      setValidationError('Please specify a valid radius.');
      return;
    }
    setValidationError(null);

    if (isSavePlace) {
      savePlace({
        name: destinationName,
        address,
        latitude: coords.lat,
        longitude: coords.lng,
        defaultRadius: radius,
        earlyAlertEnabled,
        earlyAlertDistance,
      });
      refreshStorageData();
    }

    const newAlarm: Alarm = {
      id: `alarm-${Date.now()}`,
      destinationName,
      address,
      latitude: coords.lat,
      longitude: coords.lng,
      radius,
      earlyAlertEnabled,
      earlyAlertDistance,
      sound: locationSound,
      volume: locationVolume,
      durationSeconds,
      vibrationEnabled,
      notificationEnabled,
      autoStop,
      batteryMode: 'normal',
      createdAt: new Date().toISOString(),
      status: 'idle',
    };

    startAlarm(newAlarm);
  };

  // Stepped wizard step state (1: Destination, 2: Radius, 3: Sound & Config, 4: Confirmation)
  const [currentStep, setCurrentStep] = useState<number>(1);

  return (
    <div className="space-y-6 animate-slide-up pb-12">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hud-card p-6 rounded-3xl border border-cyan-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
            GUIDED ALARM SETUP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Choose between Location Arrival Geofence (GPS) or Precise Time Alarm.
          </p>
        </div>

        {/* Tab Selection Switch */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-cyan-500/20">
          <button
            onClick={() => setActiveTab('time')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'time'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlarmClock className="w-4 h-4" />
            <span>Time Alarm</span>
          </button>

          <button
            onClick={() => setActiveTab('location')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'location'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Location Alarm</span>
          </button>
        </div>
      </div>

      {/* Stepped Wizard Progress Indicator for Location Alarms */}
      {activeTab === 'location' && (
        <div className="grid grid-cols-4 gap-2 hud-card p-4 rounded-2xl border border-cyan-500/20">
          {[
            { num: 1, title: '01. DESTINATION' },
            { num: 2, title: '02. RADIUS' },
            { num: 3, title: '03. ALERT SOUND' },
            { num: 4, title: '04. ACTIVATE' },
          ].map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`py-2.5 px-3 rounded-xl text-[11px] font-mono font-bold transition-all text-center border cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,242,255,0.3)]'
                    : isDone
                    ? 'bg-slate-900/80 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-900/40 text-slate-500 border-slate-800'
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      )}

      {/* ================= TIME ALARM TAB ================= */}
      {activeTab === 'time' && (
        <form onSubmit={handleSaveTimeAlarm} className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Hour & Minute Picker */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Set Alarm Time
              </label>

              <div className="flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                {userSettings.timeFormat === '12h' ? (
                  <>
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] text-slate-400 font-semibold mb-1">Hour</span>
                      <select
                        value={hour}
                        onChange={(e) => setHour(parseInt(e.target.value))}
                        className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-3xl font-black font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                          <option key={h} value={h}>
                            {h.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="text-3xl font-black text-indigo-500 pt-5">:</span>

                    <div className="flex flex-col items-center">
                      <span className="text-[11px] text-slate-400 font-semibold mb-1">Minute</span>
                      <select
                        value={minute}
                        onChange={(e) => setMinute(parseInt(e.target.value))}
                        className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-3xl font-black font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                          <option key={m} value={m}>
                            {m.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col items-center pl-2 pt-5">
                      <div className="flex flex-col bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl border border-slate-300 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => setPeriod('AM')}
                          className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all ${
                            period === 'AM'
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          AM
                        </button>
                        <button
                          type="button"
                          onClick={() => setPeriod('PM')}
                          className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all ${
                            period === 'PM'
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          PM
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] text-slate-400 font-semibold mb-1">Hour (24H)</span>
                      <select
                        value={hour}
                        onChange={(e) => setHour(parseInt(e.target.value))}
                        className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-3xl font-black font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                          <option key={h} value={h}>
                            {h.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="text-3xl font-black text-indigo-500 pt-5">:</span>

                    <div className="flex flex-col items-center">
                      <span className="text-[11px] text-slate-400 font-semibold mb-1">Minute</span>
                      <select
                        value={minute}
                        onChange={(e) => setMinute(parseInt(e.target.value))}
                        className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-3xl font-black font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                          <option key={m} value={m}>
                            {m.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Live Countdown Banner */}
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>{liveCountdownText}</span>
              </div>
            </div>

            {/* Label Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Alarm Label
              </label>
              <input
                type="text"
                value={timeLabel}
                onChange={(e) => setTimeLabel(e.target.value)}
                placeholder="Label (e.g. Morning Routine, Work, Gym)"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Repeat Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-indigo-500" />
                <span>Repeat Option</span>
              </label>

              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as RepeatOption)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="once">Once</option>
                <option value="daily">Every day</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="weekends">Weekends (Sat-Sun)</option>
                <option value="custom">Custom Days</option>
              </select>

              {repeat === 'custom' && (
                <div className="grid grid-cols-7 gap-1.5 pt-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => {
                    const isSelected = customDays.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {dayName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sound Selector */}
            <SoundSelector
              sound={timeSound}
              volume={timeVolume}
              onChangeSound={setTimeSound}
              onChangeVolume={setTimeVolume}
            />

            {/* Snooze Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Default Snooze Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSnoozeDuration(mins)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      snoozeDuration === mins
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Validation Error alert */}
            {validationError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>SAVE ALARM</span>
            </button>
          </div>
        </form>
      )}

      {/* ================= LOCATION ALARM TAB ================= */}
      {activeTab === 'location' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Map Section */}
          <div className="lg:col-span-7 space-y-3">
            <LocationSearch
              onSelectLocation={(loc) => {
                setDestinationName(loc.name);
                setAddress(loc.address);
                setCoords({ lat: loc.lat, lng: loc.lng });
              }}
            />

            <MapView
              destination={coords}
              currentLocation={currentLocation}
              radius={radius}
              earlyAlertEnabled={earlyAlertEnabled}
              earlyAlertDistance={earlyAlertDistance}
              onDestinationChange={(newCoords, newAddr) => {
                setCoords(newCoords);
                if (newAddr) setAddress(newAddr);
              }}
              onUseCurrentLocation={async () => {
                const userCoords = await requestCurrentLocation();
                if (userCoords) {
                  setCoords(userCoords);
                  setDestinationName('Current Location');
                  setAddress('Your GPS Position');
                }
              }}
              destinationName={destinationName}
            />

            <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>Click map or drag pin to update destination & coordinates</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Right Configuration Section */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Destination Information
              </label>
              <div>
                <input
                  type="text"
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  placeholder="Destination Name (e.g. College)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-slate-400 mt-1 truncate">📍 {address}</p>
              </div>
            </div>

            <RadiusSelector radius={radius} onChange={(r) => setRadius(r)} />

            {/* Early Alert Toggle */}
            <div className="pt-2 pb-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <span>🚨 Alert before reaching</span>
                  </label>
                  <p className="text-[11px] text-slate-400">Receive an early warning before arrival</p>
                </div>

                <button
                  type="button"
                  onClick={() => setEarlyAlertEnabled(!earlyAlertEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    earlyAlertEnabled ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      earlyAlertEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {earlyAlertEnabled && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 space-y-2 animate-fadeIn">
                  <label className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Early Alert Distance
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2000, 5000].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setEarlyAlertDistance(d)}
                        className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                          earlyAlertDistance === d
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                        }`}
                      >
                        {d >= 1000 ? `${d / 1000} km` : `${d} m`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <SoundSelector
              sound={locationSound}
              volume={locationVolume}
              durationSeconds={durationSeconds}
              onChangeSound={setLocationSound}
              onChangeVolume={setLocationVolume}
              onChangeDuration={setDurationSeconds}
            />

            {/* Checkbox Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <span>Vibrate when arriving</span>
                </span>
                <input
                  type="checkbox"
                  checked={vibrationEnabled}
                  onChange={(e) => setVibrationEnabled(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <BellRing className="w-4 h-4 text-indigo-400" />
                  <span>Browser notification</span>
                </span>
                <input
                  type="checkbox"
                  checked={notificationEnabled}
                  onChange={(e) => setNotificationEnabled(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Stop tracking after arrival</span>
                </span>
                <input
                  type="checkbox"
                  checked={autoStop}
                  onChange={(e) => setAutoStop(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Save to My Places</span>
                </span>
                <input
                  type="checkbox"
                  checked={isSavePlace}
                  onChange={(e) => setIsSavePlace(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </label>
            </div>

            {validationError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {isTracking ? (
              <button
                onClick={stopAlarm}
                className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Active Location Alarm</span>
              </button>
            ) : (
              <button
                onClick={handleStartLocationAlarm}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 transform active:scale-98"
              >
                <BellRing className="w-5 h-5" />
                <span>🔔 START LOCATION ALARM</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
