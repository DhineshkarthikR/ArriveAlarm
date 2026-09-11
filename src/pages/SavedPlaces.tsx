import React from 'react';
import { Star, Radio, BellRing, Trash2, PlusCircle } from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { EmptyState } from '../components/Common/EmptyState';
import { deleteSavedPlace } from '../utils/storage';
import type { Alarm } from '../types';

export const SavedPlaces: React.FC = () => {
  const { savedPlaces, refreshStorageData, startAlarm, setActivePage } = useAlarm();

  const handleDelete = (id: string) => {
    deleteSavedPlace(id);
    refreshStorageData();
  };

  const handleStartSavedAlarm = (place: (typeof savedPlaces)[0]) => {
    const alarmData: Alarm = {
      id: `alarm-${Date.now()}`,
      destinationName: place.name,
      address: place.address,
      latitude: place.latitude,
      longitude: place.longitude,
      radius: place.defaultRadius,
      earlyAlertEnabled: place.earlyAlertEnabled,
      earlyAlertDistance: place.earlyAlertDistance,
      sound: 'default',
      volume: 80,
      durationSeconds: 30,
      vibrationEnabled: true,
      notificationEnabled: true,
      autoStop: true,
      batteryMode: 'normal',
      createdAt: new Date().toISOString(),
      status: 'idle',
    };
    startAlarm(alarmData);
  };

  return (
    <div className="space-y-5 animate-slide-up pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Star className="w-5 h-5 text-[#888888]" />
            <span>Saved Places</span>
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Quick-start alarms for frequent destinations.
          </p>
        </div>

        <button
          onClick={() => setActivePage('create')}
          className="py-2 px-3 bg-white hover:bg-neutral-200 text-black font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Place</span>
        </button>
      </div>

      {savedPlaces.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No Saved Places"
          description="Save frequently visited destinations for one-click alarms."
          actionText="Create Location Alarm"
          onAction={() => setActivePage('create')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {savedPlaces.map((place) => (
            <div key={place.id} className="border border-[#1a1a1a] rounded-md p-4 flex flex-col justify-between space-y-4 hover:border-[#2a2a2a] transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#888888]" />
                    <h3 className="font-medium text-sm text-white">
                      {place.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(place.id)}
                    className="p-1 text-[#555555] hover:text-red-400 rounded transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-[#555555] truncate">
                  {place.address || 'Saved Location'}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#111111] text-[#888888] border border-[#1a1a1a]">
                    <Radio className="w-3 h-3" />
                    <span>{place.defaultRadius}m</span>
                  </span>

                  {place.earlyAlertEnabled && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/5 text-amber-400/80 border border-amber-500/10">
                      Early: {place.earlyAlertDistance >= 1000 ? `${place.earlyAlertDistance / 1000}km` : `${place.earlyAlertDistance}m`}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleStartSavedAlarm(place)}
                className="w-full py-2 px-3 bg-white hover:bg-neutral-200 text-black font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Start Alarm</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
