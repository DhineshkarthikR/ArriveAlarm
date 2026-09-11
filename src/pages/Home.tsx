import React from 'react';
import {
  PlusCircle,
  MapPin,
  Bell,
  Star,
  Navigation,
  Compass,
  Radio,
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
    <div className="space-y-10 animate-slide-up pb-16">
      <BannerLimitation />

      {/* ================= VERCEL HERO SECTION ================= */}
      <section className="vercel-card p-6 sm:p-10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                SMART ARRIVAL ENGINE
              </span>
            </div>

            {/* Vercel Clean Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white font-sans">
              Arrive. Relax. <br />
              <span className="text-zinc-400 font-normal">Never Miss Your Stop.</span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              Set your destination and we&apos;ll alert you when you&apos;re almost there. Precise GPS geofences and instant audio alerts for your daily transit or travel.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setActivePage('create')}
                className="py-3 px-5 bg-white text-black font-semibold text-xs sm:text-sm rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-black" />
                <span>Create Arrival Alarm</span>
              </button>

              <button
                onClick={() => setActivePage('active')}
                className="py-3 px-4 bg-[#111111] text-white font-medium text-xs sm:text-sm rounded-xl border border-[#222222] hover:border-[#333333] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-blue-400" />
                <span>View Live Tracker</span>
              </button>
            </div>

            {/* Vercel Metric Strip */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1C1C1C] max-w-md">
              <div>
                <p className="text-[11px] font-mono text-zinc-500 uppercase">GEOFENCE</p>
                <p className="text-sm font-bold font-mono text-white mt-0.5">&lt; 15m Precision</p>
              </div>
              <div>
                <p className="text-[11px] font-mono text-zinc-500 uppercase">ACCURACY</p>
                <p className="text-sm font-bold font-mono text-white mt-0.5">99.9% Reliability</p>
              </div>
              <div>
                <p className="text-[11px] font-mono text-zinc-500 uppercase">COMMUTES</p>
                <p className="text-sm font-bold font-mono text-white mt-0.5">1.2M+ Secured</p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Journey Pipeline Graphic */}
          <div className="lg:col-span-5 bg-[#000000] border border-[#222222] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3">
              <span className="text-xs font-mono font-semibold text-zinc-400 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>JOURNEY PIPELINE</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#161616] text-zinc-300 border border-[#262626]">
                ACTIVE
              </span>
            </div>

            <div className="space-y-4 py-2">
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#222222] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-mono text-zinc-500">START</span>
                  <h4 className="text-xs font-semibold text-white">Current Location</h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">GPS Locked</span>
              </div>

              {/* Connector line */}
              <div className="ml-4 w-0.5 h-3 bg-[#222222]" />

              {/* Step 2 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#222222] flex items-center justify-center shrink-0">
                  <Navigation className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-mono text-zinc-500">RADIUS</span>
                  <h4 className="text-xs font-semibold text-white">500m Geofence Perimeter</h4>
                </div>
                <span className="text-[10px] font-mono text-blue-400">Monitoring</span>
              </div>

              {/* Connector line */}
              <div className="ml-4 w-0.5 h-3 bg-[#222222]" />

              {/* Step 3 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#222222] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-mono text-zinc-500">ALERT</span>
                  <h4 className="text-xs font-semibold text-white">High-Frequency Audio Alarm</h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Instant Alert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIVE CLOCK & QUICK PRESETS ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <LiveClock />
        </div>
        <div className="lg:col-span-5">
          <QuickAlarmButtons />
        </div>
      </section>

      {/* ================= ACTIVE TRACKING STATUS ================= */}
      {isTracking && activeAlarm && (
        <section className="space-y-3">
          <h2 className="text-sm font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Active Journey Telemetry
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

      {/* ================= TIME ALARM LIST ================= */}
      <section className="space-y-3">
        <TimeAlarmList />
      </section>

      {/* ================= SAVED PLACES ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Saved Destinations</span>
          </h2>
          <button
            onClick={() => setActivePage('saved')}
            className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {savedPlaces.length === 0 ? (
          <div className="vercel-card p-6 text-center space-y-3">
            <p className="text-xs font-mono text-zinc-500">No saved places found.</p>
            <button
              onClick={() => setActivePage('create')}
              className="px-3.5 py-1.5 bg-[#111111] text-white border border-[#222222] hover:border-[#333333] rounded-xl text-xs font-mono cursor-pointer"
            >
              + Save Your First Destination
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPlaces.slice(0, 3).map((place) => (
              <div
                key={place.id}
                onClick={() => setActivePage('create')}
                className="vercel-card p-4 space-y-2.5 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#222222] text-blue-400 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Radius: {place.defaultRadius}m
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white group-hover:text-blue-400 transition-colors">
                    {place.name}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{place.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= VERCEL HOW IT WORKS ================= */}
      <section className="vercel-card p-6 sm:p-8 space-y-5">
        <h2 className="text-sm font-mono font-semibold text-zinc-400 uppercase tracking-wider text-center">
          HOW ARRIVE ALARM WORKS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#000000] p-4 rounded-xl border border-[#1C1C1C] space-y-2">
            <span className="text-[10px] font-mono font-bold text-blue-400">STEP 01</span>
            <h3 className="font-semibold text-xs text-white">Select Destination</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Search any address or pin your arrival stop directly on the interactive map.
            </p>
          </div>

          <div className="bg-[#000000] p-4 rounded-xl border border-[#1C1C1C] space-y-2">
            <span className="text-[10px] font-mono font-bold text-blue-400">STEP 02</span>
            <h3 className="font-semibold text-xs text-white">Set Geofence Radius</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Define your preferred wake-up boundary (from 100m up to 5.0 km) before arriving.
            </p>
          </div>

          <div className="bg-[#000000] p-4 rounded-xl border border-[#1C1C1C] space-y-2">
            <span className="text-[10px] font-mono font-bold text-blue-400">STEP 03</span>
            <h3 className="font-semibold text-xs text-white">Arrive Fully Alerted</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Loud Web Audio synth tones and browser alerts trigger the moment you cross the radius.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};


