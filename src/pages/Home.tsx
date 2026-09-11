import React from 'react';
import {
  PlusCircle,
  MapPin,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { LiveClock } from '../components/Clock/LiveClock';
import { QuickAlarmButtons } from '../components/Clock/QuickAlarmButtons';
import { TimeAlarmList } from '../components/Alarm/TimeAlarmList';
import { ActiveAlarmCard } from '../components/Alarm/ActiveAlarmCard';
import { BannerLimitation } from '../components/Common/BannerLimitation';

export const Home: React.FC = () => {
  const {
    setActivePage,
    isTracking,
    activeAlarm,
    currentDistance,
    initialDistance,
    savedPlaces,
    stopAlarm,
  } = useAlarm();

  return (
    <div className="space-y-8 animate-slide-up pb-16">
      <BannerLimitation />

      {/* Hero — focused and honest */}
      <section className="pt-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
          Never miss your stop.
        </h1>
        <p className="text-sm text-[#888888] mt-2 max-w-lg leading-relaxed">
          Set a destination, define a radius, and get alerted when you arrive. Works with GPS geofencing or time-based alarms.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-5">
          <button
            onClick={() => setActivePage('create')}
            className="py-2.5 px-4 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Alarm</span>
          </button>

          <button
            onClick={() => setActivePage('active')}
            className="py-2.5 px-4 bg-[#111111] text-white font-medium text-sm rounded-md border border-[#1a1a1a] hover:border-[#333333] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>View Tracker</span>
          </button>
        </div>
      </section>

      {/* Live Clock & Quick Presets */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <LiveClock />
        </div>
        <div className="lg:col-span-5">
          <QuickAlarmButtons />
        </div>
      </section>

      {/* Active Tracking Status */}
      {isTracking && activeAlarm && (
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-[#888888] uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Active Alarm
          </h2>
          <ActiveAlarmCard
            alarm={activeAlarm}
            currentDistance={currentDistance}
            initialDistance={initialDistance}
            onViewAlarm={() => setActivePage('active')}
            onStopAlarm={stopAlarm}
          />
        </section>
      )}

      {/* Time Alarm List */}
      <section>
        <TimeAlarmList />
      </section>

      {/* Saved Places */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium text-[#888888] uppercase tracking-wider flex items-center gap-2">
            <Star className="w-3.5 h-3.5" />
            <span>Saved Destinations</span>
          </h2>
          <button
            onClick={() => setActivePage('saved')}
            className="text-xs text-[#666666] hover:text-white flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {savedPlaces.length === 0 ? (
          <div className="border border-[#1a1a1a] rounded-md p-5 text-center">
            <p className="text-xs text-[#555555]">No saved places yet.</p>
            <button
              onClick={() => setActivePage('create')}
              className="mt-3 px-3 py-1.5 bg-[#111111] text-white border border-[#1a1a1a] hover:border-[#333333] rounded-md text-xs cursor-pointer transition-colors"
            >
              Save Your First Destination
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedPlaces.slice(0, 3).map((place) => (
              <div
                key={place.id}
                onClick={() => setActivePage('create')}
                className="border border-[#1a1a1a] rounded-md p-4 space-y-2 cursor-pointer group hover:border-[#2a2a2a] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <MapPin className="w-4 h-4 text-[#555555]" />
                  <span className="text-[10px] text-[#555555]">
                    {place.defaultRadius}m
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white group-hover:text-neutral-300 transition-colors">
                    {place.name}
                  </h4>
                  <p className="text-xs text-[#555555] truncate mt-0.5">{place.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How It Works — clean, minimal */}
      <section className="border border-[#1a1a1a] rounded-md p-5 sm:p-6 space-y-4">
        <h2 className="text-xs font-medium text-[#888888] uppercase tracking-wider text-center">
          How it works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-medium text-[#555555]">01</span>
            <h3 className="font-medium text-sm text-white">Select Destination</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Search any address or pin a location on the map.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-medium text-[#555555]">02</span>
            <h3 className="font-medium text-sm text-white">Set Alert Radius</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Define your wake-up boundary from 50m to 5km.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-medium text-[#555555]">03</span>
            <h3 className="font-medium text-sm text-white">Get Alerted</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Audio alarm and notification trigger when you arrive.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
