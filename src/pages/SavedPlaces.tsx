import React from 'react';
import { Star, Radio, BellRing, Trash2, PlusCircle } from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { Card } from '../components/Common/Card';
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
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Star className="w-7 h-7 text-amber-400 fill-current" />
            <span>Saved Places</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quickly trigger location alarms for your frequent destinations.
          </p>
        </div>

        <button
          onClick={() => setActivePage('create')}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Place</span>
        </button>
      </div>

      {savedPlaces.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No Saved Places"
          description="Save frequently visited destinations like Home, College, or Gym for one-click alarms."
          actionText="+ Create Location Alarm"
          onAction={() => setActivePage('create')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPlaces.map((place) => (
            <Card key={place.id} className="flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-amber-500 flex items-center justify-center">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {place.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(place.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                    title="Delete saved place"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  📍 {place.address || 'Saved Location'}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-100 dark:border-indigo-900/50">
                    <Radio className="w-3 h-3" />
                    <span>{place.defaultRadius} m radius</span>
                  </span>

                  {place.earlyAlertEnabled && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-semibold border border-amber-100 dark:border-amber-900/50">
                      <span>Early alert: {place.earlyAlertDistance >= 1000 ? `${place.earlyAlertDistance / 1000}km` : `${place.earlyAlertDistance}m`}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Start Alarm CTA */}
              <button
                onClick={() => handleStartSavedAlarm(place)}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <BellRing className="w-4 h-4" />
                <span>Start Location Alarm</span>
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
