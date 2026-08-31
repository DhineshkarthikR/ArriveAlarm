import React from 'react';
import { Radio, MapPin, Square, Timer, AlertCircle } from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { MapView } from '../components/Map/MapView';
import { EmptyState } from '../components/Common/EmptyState';
import { formatDistance, calculateApproachProgress, estimateEtaMinutes } from '../utils/distance';

export const ActiveAlarm: React.FC = () => {
  const {
    activeAlarm,
    currentLocation,
    currentDistance,
    initialDistance,
    isTracking,
    stopAlarm,
    setActivePage,
    gpsError,
  } = useAlarm();

  if (!isTracking || !activeAlarm) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Active Alarm Tracking
        </h1>
        <EmptyState
          icon={Timer}
          title="No Location Alarm Active"
          description="You don't have any location tracking active right now. Pick a destination on the map to start tracking."
          actionText="+ Create Location Alarm"
          onAction={() => setActivePage('create')}
        />
      </div>
    );
  }

  const formattedDist = currentDistance !== null ? formatDistance(currentDistance) : 'Calculating...';
  const progressPct =
    currentDistance !== null && initialDistance !== null
      ? calculateApproachProgress(initialDistance, currentDistance, activeAlarm.radius)
      : 0;

  const etaMins = currentDistance !== null ? estimateEtaMinutes(currentDistance) : null;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Tracking Proximity
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time proximity monitoring towards {activeAlarm.destinationName}
          </p>
        </div>

        <button
          onClick={stopAlarm}
          className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Square className="w-4 h-4 fill-current" />
          <span>Stop Alarm</span>
        </button>
      </div>

      {/* GPS Error Alert if any */}
      {gpsError && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Proximity Hero Status */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE GPS TRACKING</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {activeAlarm.destinationName}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/80 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>{activeAlarm.address || 'Target Location'}</span>
              <span>•</span>
              <Radio className="w-4 h-4 text-indigo-400" />
              <span>{activeAlarm.radius} m arrival radius</span>
            </p>
          </div>

          {/* Large Live Distance Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center min-w-[200px]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-200/70">
              Distance Remaining
            </span>
            <div className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-1">
              {formattedDist}
            </div>
            {etaMins !== null && (
              <span className="inline-block mt-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                ~{etaMins} mins travel time
              </span>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between text-xs text-indigo-200/80 mb-1.5 font-medium">
            <span>Progress towards arrival geofence</span>
            <span className="font-bold text-white">{progressPct}%</span>
          </div>
          <div className="w-full h-3 bg-slate-950/50 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 via-emerald-400 to-emerald-300 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(4, progressPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Live Map */}
      <div className="space-y-2">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Live Geofence Map</span>
        </h3>
        <div className="h-[350px] sm:h-[450px]">
          <MapView
            destination={{ lat: activeAlarm.latitude, lng: activeAlarm.longitude }}
            currentLocation={currentLocation}
            radius={activeAlarm.radius}
            earlyAlertEnabled={activeAlarm.earlyAlertEnabled}
            earlyAlertDistance={activeAlarm.earlyAlertDistance}
            destinationName={activeAlarm.destinationName}
            isInteractive={true}
          />
        </div>
      </div>
    </div>
  );
};
