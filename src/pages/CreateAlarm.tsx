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

  const computed24Hour = (): number => {
    if (userSettings.timeFormat === '24h') return hour;
    let h24 = hour % 12;
    if (period === 'PM') h24 += 12;
    return h24;
  };

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

  const [currentStep, setCurrentStep] = useState<number>(1);

  return (
    <div className="space-y-5 animate-slide-up pb-12">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Set New Alarm
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Choose between a time-based alarm or location-based geofence.
          </p>
        </div>

        {/* Tab Switch */}
        <div className="flex items-center bg-[#0a0a0a] p-0.5 rounded-md border border-[#1a1a1a]">
          <button
            onClick={() => setActiveTab('time')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'time'
                ? 'bg-white text-black'
                : 'text-[#666666] hover:text-white'
            }`}
          >
            <AlarmClock className="w-3.5 h-3.5" />
            <span>Time</span>
          </button>

          <button
            onClick={() => setActiveTab('location')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'location'
                ? 'bg-white text-black'
                : 'text-[#666666] hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Location</span>
          </button>
        </div>
      </div>

      {/* Wizard Steps for Location */}
      {activeTab === 'location' && (
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { num: 1, title: '1. Destination' },
            { num: 2, title: '2. Radius' },
            { num: 3, title: '3. Sound' },
            { num: 4, title: '4. Activate' },
          ].map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`py-2 px-2 rounded-md text-[11px] font-medium transition-colors text-center border cursor-pointer ${
                  isCurrent
                    ? 'bg-white/5 text-white border-[#333333]'
                    : isDone
                    ? 'bg-[#0A0A0A] text-white border-[#333333]'
                    : 'bg-[#0a0a0a] text-[#555555] border-[#1a1a1a]'
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      )}

      {/* TIME ALARM TAB */}
      {activeTab === 'time' && (
        <form onSubmit={handleSaveTimeAlarm} className="max-w-2xl mx-auto space-y-5">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-md p-5 sm:p-6 space-y-5">
            {/* Time Picker */}
            <div className="space-y-3">
              <label className="text-xs font-medium uppercase tracking-wider text-[#888888]">
                Set Alarm Time
              </label>

              <div className="flex items-center justify-center gap-3 bg-black p-5 rounded-md border border-[#1a1a1a]">
                {userSettings.timeFormat === '12h' ? (
                  <>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-[#555555] mb-1">Hour</span>
                      <select
                        value={hour}
                        onChange={(e) => setHour(parseInt(e.target.value))}
                        className="px-3 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md text-2xl font-bold font-mono text-white focus:outline-none focus:border-[#333333]"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                          <option key={h} value={h}>
                            {h.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="text-2xl font-bold text-[#555555] pt-4">:</span>

                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-[#555555] mb-1">Minute</span>
                      <select
                        value={minute}
                        onChange={(e) => setMinute(parseInt(e.target.value))}
                        className="px-3 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md text-2xl font-bold font-mono text-white focus:outline-none focus:border-[#333333]"
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                          <option key={m} value={m}>
                            {m.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col items-center pl-2 pt-4">
                      <div className="flex flex-col bg-[#0a0a0a] p-0.5 rounded-md border border-[#1a1a1a]">
                        <button
                          type="button"
                          onClick={() => setPeriod('AM')}
                          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            period === 'AM'
                              ? 'bg-white text-black'
                              : 'text-[#555555]'
                          }`}
                        >
                          AM
                        </button>
                        <button
                          type="button"
                          onClick={() => setPeriod('PM')}
                          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            period === 'PM'
                              ? 'bg-white text-black'
                              : 'text-[#555555]'
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
                      <span className="text-[10px] text-[#555555] mb-1">Hour (24H)</span>
                      <select
                        value={hour}
                        onChange={(e) => setHour(parseInt(e.target.value))}
                        className="px-3 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md text-2xl font-bold font-mono text-white focus:outline-none focus:border-[#333333]"
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                          <option key={h} value={h}>
                            {h.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="text-2xl font-bold text-[#555555] pt-4">:</span>

                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-[#555555] mb-1">Minute</span>
                      <select
                        value={minute}
                        onChange={(e) => setMinute(parseInt(e.target.value))}
                        className="px-3 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md text-2xl font-bold font-mono text-white focus:outline-none focus:border-[#333333]"
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

              {/* Countdown */}
              <div className="p-2.5 bg-[#0a0a0a] border border-[#1a1a1a] text-[#888888] rounded-md text-xs font-medium flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{liveCountdownText}</span>
              </div>
            </div>

            {/* Label */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#888888] uppercase tracking-wider">
                Alarm Label
              </label>
              <input
                type="text"
                value={timeLabel}
                onChange={(e) => setTimeLabel(e.target.value)}
                placeholder="Label (e.g. Morning Routine, Work, Gym)"
                className="w-full px-3 py-2.5 bg-black border border-[#1a1a1a] rounded-md text-sm text-white placeholder:text-[#555555] focus:outline-none focus:border-[#333333]"
              />
            </div>

            {/* Repeat */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#888888] uppercase tracking-wider flex items-center gap-1.5">
                <Repeat className="w-3 h-3" />
                <span>Repeat</span>
              </label>

              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as RepeatOption)}
                className="w-full px-3 py-2.5 bg-black border border-[#1a1a1a] rounded-md text-sm text-white focus:outline-none focus:border-[#333333]"
              >
                <option value="once">Once</option>
                <option value="daily">Every day</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="weekends">Weekends (Sat-Sun)</option>
                <option value="custom">Custom Days</option>
              </select>

              {repeat === 'custom' && (
                <div className="grid grid-cols-7 gap-1.5 pt-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => {
                    const isSelected = customDays.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                          isSelected
                            ? 'bg-white text-black'
                            : 'bg-[#0a0a0a] text-[#555555] border border-[#1a1a1a]'
                        }`}
                      >
                        {dayName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <SoundSelector
              sound={timeSound}
              volume={timeVolume}
              onChangeSound={setTimeSound}
              onChangeVolume={setTimeVolume}
            />

            {/* Snooze */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#888888] uppercase tracking-wider">
                Snooze Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSnoozeDuration(mins)}
                    className={`py-2 text-xs font-medium rounded-md border transition-colors ${
                      snoozeDuration === mins
                        ? 'bg-white text-black border-white'
                        : 'bg-[#0a0a0a] border-[#1a1a1a] text-[#888888] hover:border-[#333333]'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {validationError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 bg-white hover:bg-neutral-200 text-black font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Save Alarm</span>
            </button>
          </div>
        </form>
      )}

      {/* LOCATION ALARM TAB */}
      {activeTab === 'location' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Map */}
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

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-md p-2.5 text-[11px] text-[#555555] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                <span>Click map or drag pin to set destination</span>
              </span>
              <span className="font-mono text-[10px]">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Config Panel */}
          <div className="lg:col-span-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md p-5 space-y-5">
            <div className="space-y-2 pb-4 border-b border-[#1a1a1a]">
              <label className="text-xs font-medium uppercase tracking-wider text-[#888888]">
                Destination
              </label>
              <div>
                <input
                  type="text"
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  placeholder="Destination Name"
                  className="w-full px-3 py-2 bg-black border border-[#1a1a1a] rounded-md text-sm font-medium text-white focus:outline-none focus:border-[#333333]"
                />
                <p className="text-xs text-[#555555] mt-1 truncate">{address}</p>
              </div>
            </div>

            <RadiusSelector radius={radius} onChange={(r) => setRadius(r)} />

            {/* Early Alert */}
            <div className="pt-2 pb-4 border-b border-[#1a1a1a] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#888888]" />
                    <span>Early alert</span>
                  </label>
                  <p className="text-[11px] text-[#555555]">Warning before reaching destination</p>
                </div>

                <button
                  type="button"
                  onClick={() => setEarlyAlertEnabled(!earlyAlertEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    earlyAlertEnabled ? 'bg-white' : 'bg-[#333333]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow transition ${
                      earlyAlertEnabled ? 'translate-x-4 bg-black' : 'translate-x-0 bg-[#666666]'
                    }`}
                  />
                </button>
              </div>

              {earlyAlertEnabled && (
                <div className="bg-[#111111] border border-[#333333] rounded-md p-3 space-y-2">
                  <label className="text-xs font-medium text-[#A3A3A3]">
                    Early Alert Distance
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2000, 5000].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setEarlyAlertDistance(d)}
                        className={`py-1.5 text-xs font-medium rounded-md border transition-colors ${
                          earlyAlertDistance === d
                            ? 'bg-white text-black border-white'
                            : 'bg-black border-[#1a1a1a] text-[#888888]'
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

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              {[
                { label: 'Vibrate on arrival', icon: Smartphone, checked: vibrationEnabled, onChange: setVibrationEnabled },
                { label: 'Browser notification', icon: BellRing, checked: notificationEnabled, onChange: setNotificationEnabled },
                { label: 'Stop after arrival', icon: Layers, checked: autoStop, onChange: setAutoStop },
                { label: 'Save to My Places', icon: Star, checked: isSavePlace, onChange: setIsSavePlace },
              ].map(({ label, icon: Icon, checked, onChange }) => (
                <label key={label} className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-xs sm:text-sm text-[#888888]">
                    <Icon className="w-4 h-4 text-[#555555]" />
                    <span>{label}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="w-4 h-4 accent-white rounded"
                  />
                </label>
              ))}
            </div>

            {validationError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {isTracking ? (
              <button
                onClick={stopAlarm}
                className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Active Alarm</span>
              </button>
            ) : (
              <button
                onClick={handleStartLocationAlarm}
                className="w-full py-3 px-6 bg-white hover:bg-neutral-200 text-black font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <BellRing className="w-4 h-4" />
                <span>Start Location Alarm</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
