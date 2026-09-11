import React from 'react';
import { MapPin, Square, AlertCircle } from 'lucide-react';
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
      <div className="space-y-5 animate-slide-up">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Active Alarm
        </h1>
        <EmptyState
          icon={MapPin}
          title="No Active Alarm"
          description="Start a location alarm to track your proximity to a destination in real-time."
          actionText="Create Location Alarm"
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
    <div className="space-y-5 animate-slide-up pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Tracking
            </h1>
          </div>
          <p className="text-xs text-[#888888] mt-1">
            Real-time proximity to {activeAlarm.destinationName}
          </p>
        </div>

        <button
          onClick={stopAlarm}
          className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Stop</span>
        </button>
      </div>

      {/* GPS Error */}
      {gpsError && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Status Card */}
      <div className="bg-[#0a0a0a] rounded-md border border-[#1a1a1a] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              GPS TRACKING
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {activeAlarm.destinationName}
            </h2>
            <p className="text-xs text-[#555555] flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeAlarm.address || 'Target Location'}</span>
              <span className="text-[#333333]">•</span>
              <span>{activeAlarm.radius}m radius</span>
            </p>
          </div>

          {/* Distance Display */}
          <div className="bg-black rounded-md p-4 border border-[#1a1a1a] text-center min-w-[180px]">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#555555]">
              Distance
            </span>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-0.5">
              {formattedDist}
            </div>
            {etaMins !== null && (
              <span className="inline-block mt-1.5 text-xs text-[#888888]">
                ~{etaMins} min
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#1a1a1a]">
          <div className="flex items-center justify-between text-xs text-[#555555] mb-1.5">
            <span>Progress</span>
            <span className="text-white font-medium">{progressPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, progressPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#888888]" />
          <span>Live Map</span>
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
