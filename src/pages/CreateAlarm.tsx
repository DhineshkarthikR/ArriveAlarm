import React, { useState } from 'react';
import { MapPin, AlertCircle, BellRing, Smartphone, Star, Square, Layers } from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { MapView } from '../components/Map/MapView';
import { LocationSearch } from '../components/Map/LocationSearch';
import { RadiusSelector } from '../components/Alarm/RadiusSelector';
import { SoundSelector } from '../components/Alarm/SoundSelector';
import type { Alarm, AlarmSoundType, Coordinates } from '../types';
import { savePlace } from '../utils/storage';

export const CreateAlarm: React.FC = () => {
  const {
    startAlarm,
    stopAlarm,
    isTracking,
    requestCurrentLocation,
    currentLocation,
    refreshStorageData,
  } = useAlarm();

  // State for location details
  const [destinationName, setDestinationName] = useState<string>('Christ University');
  const [address, setAddress] = useState<string>('Bengaluru, Karnataka');
  const [coords, setCoords] = useState<Coordinates>({ lat: 12.9345, lng: 77.6060 });

  // Geofence states
  const [radius, setRadius] = useState<number>(200);
  const [earlyAlertEnabled, setEarlyAlertEnabled] = useState<boolean>(false);
  const [earlyAlertDistance, setEarlyAlertDistance] = useState<number>(1000);

  // Alarm sound & vibration states
  const [sound, setSound] = useState<AlarmSoundType>('default');
  const [volume, setVolume] = useState<number>(80);
  const [durationSeconds, setDurationSeconds] = useState<number>(30);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(true);
  const [autoStop, setAutoStop] = useState<boolean>(true);

  // Save place toggle
  const [isSavePlace, setIsSavePlace] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle location search selection
  const handleSelectSearchResult = (loc: { name: string; address: string; lat: number; lng: number }) => {
    setDestinationName(loc.name);
    setAddress(loc.address);
    setCoords({ lat: loc.lat, lng: loc.lng });
  };

  // Handle use current location button
  const handleUseCurrentLocation = async () => {
    const userCoords = await requestCurrentLocation();
    if (userCoords) {
      setCoords(userCoords);
      setDestinationName('Current Location');
      setAddress('Your GPS Position');
    }
  };

  // Handle Start Alarm submit
  const handleStartAlarm = () => {
    if (!destinationName.trim()) {
      setValidationError('Please specify a destination name.');
      return;
    }
    if (radius <= 0) {
      setValidationError('Please specify a valid radius.');
      return;
    }

    setValidationError(null);

    // Save place if toggled
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
      sound,
      volume,
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

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Create Location Alarm
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick your destination on the map, set radius geofence, and configure alerts.
          </p>
        </div>
      </div>

      {/* Main 2-Section Grid (Map Left, Controls Right on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Map Section */}
        <div className="lg:col-span-7 space-y-3">
          <LocationSearch onSelectLocation={handleSelectSearchResult} />

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
            onUseCurrentLocation={handleUseCurrentLocation}
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
          {/* Destination Details */}
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

          {/* Radius Selector */}
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

          {/* Sound & Sound Test */}
          <SoundSelector
            sound={sound}
            volume={volume}
            durationSeconds={durationSeconds}
            onChangeSound={setSound}
            onChangeVolume={setVolume}
            onChangeDuration={setDurationSeconds}
          />

          {/* Toggles: Vibration, Notifications, AutoStop, Save Place */}
          <div className="space-y-3 pt-2">
            {/* Vibration */}
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

            {/* Notifications */}
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

            {/* Auto Stop after arrival */}
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

            {/* Save Place */}
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

          {/* Validation Error alert if present */}
          {validationError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Action CTA Button */}
          {isTracking ? (
            <button
              onClick={stopAlarm}
              className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Active Alarm</span>
            </button>
          ) : (
            <button
              onClick={handleStartAlarm}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <BellRing className="w-5 h-5" />
              <span>🔔 START LOCATION ALARM</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
