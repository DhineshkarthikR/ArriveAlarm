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

  // Determine greeting based on local time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'MORNING COMMUTE' : hour < 18 ? 'AFTERNOON TRANSIT' : 'EVENING NAVIGATION';

  return (
    <div className="space-y-12 animate-slide-up pb-16">
      <BannerLimitation />

      {/* ================= STITCH HERO SECTION ================= */}
      <section className="relative overflow-hidden rounded-3xl hud-card p-6 sm:p-12 border border-cyan-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Hero Typography & Primary Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                {greeting}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-slate-400 border border-slate-800 bg-slate-950/60">
                <Radio className="w-3 h-3 text-cyan-400" />
                GPS RTK ACTIVE
              </span>
            </div>

            {/* STITCH MANDATED HERO HEADLINE */}
            <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight leading-[1.05] text-white">
              ARRIVE. <br />
              <span className="text-cyan-400 text-cyan-glow">RELAX.</span> <br />
              NEVER MISS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                YOUR STOP.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              Set your destination and we&apos;ll alert you when you&apos;re almost there. Perfect for commuting, traveling, sleeping on transit, or long journeys.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActivePage('create')}
                className="py-4 px-8 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-slate-950 font-mono font-black text-sm rounded-2xl shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all flex items-center gap-3 transform active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5 text-slate-950" />
                <span>CREATE ARRIVAL ALARM</span>
              </button>

              <button
                onClick={() => setActivePage('active')}
                className="py-4 px-6 bg-slate-900/90 hover:bg-slate-800 text-white font-mono font-bold text-sm rounded-2xl border border-cyan-500/30 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer hover:border-cyan-400"
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>VIEW MY ALARMS</span>
              </button>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <p className="text-[11px] font-mono uppercase text-slate-400">Geofence</p>
                <p className="text-lg font-black font-mono text-cyan-400 mt-0.5">&lt; 15m</p>
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase text-slate-400">Accuracy</p>
                <p className="text-lg font-black font-mono text-cyan-400 mt-0.5">99.9%</p>
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase text-slate-400">Commutes</p>
                <p className="text-lg font-black font-mono text-cyan-400 mt-0.5">1.2M+</p>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Vector Journey Visualization */}
          <div className="lg:col-span-5 bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 space-y-6 shadow-[0_0_30px_rgba(0,242,255,0.1)] relative overflow-hidden">
            {/* Header Tag */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>JOURNEY VECTOR PIPELINE</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE HUD
              </span>
            </div>

            {/* Graphical Vector Route */}
            <div className="py-4 space-y-6 relative">
              {/* Point 1: Current Location */}
              <div className="flex items-start gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="w-0.5 h-12 bg-gradient-to-b from-cyan-400 via-blue-500 to-cyan-500 my-1 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">START WAYPOINT</span>
                  <h4 className="text-sm font-bold text-white font-mono">CURRENT LOCATION</h4>
                  <p className="text-xs text-slate-400 mt-0.5">GPS Signal Lock • Transit Mode</p>
                </div>
              </div>

              {/* Point 2: Destination & Pulsing Geofence */}
              <div className="flex items-start gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] relative">
                    <Navigation className="w-4 h-4 text-blue-300" />
                    <div className="absolute inset-0 rounded-xl border border-blue-400 animate-ping opacity-50" />
                  </div>
                  <div className="w-0.5 h-12 bg-gradient-to-b from-blue-500 via-amber-500 to-rose-500 my-1" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-blue-400 tracking-wider">TARGET DESTINATION</span>
                  <h4 className="text-sm font-bold text-white font-mono">GEOFENCE RADIUS PERIMETER</h4>
                  <p className="text-xs text-slate-400 mt-0.5">500m Arrival Boundary • Sensor Active</p>
                </div>
              </div>

              {/* Point 3: Alert Trigger */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-rose-500/30 border border-rose-500 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-bounce">
                  <Bell className="w-4 h-4 text-rose-300" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-rose-400 tracking-wider">TRIGGER THRESHOLD</span>
                  <h4 className="text-sm font-bold text-white font-mono">HIGH-FREQUENCY ALERT</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Loud Audio Synth Tone + Haptic Vibe</p>
                </div>
              </div>
            </div>

            {/* Bottom Status bar inside graphic */}
            <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">TELEMETRY PRESETS</span>
              <span className="text-cyan-400 font-bold">100m – 5.0km</span>
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
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            ACTIVE JOURNEY TELEMETRY
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
      <section className="space-y-4">
        <TimeAlarmList />
      </section>

      {/* ================= SAVED PLACES & QUICK ACCESS ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-mono font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            <span>SAVED DESTINATIONS</span>
          </h2>
          <button
            onClick={() => setActivePage('saved')}
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {savedPlaces.length === 0 ? (
          <div className="hud-card p-6 rounded-2xl text-center space-y-3">
            <p className="text-xs font-mono text-slate-400">No saved places found.</p>
            <button
              onClick={() => setActivePage('create')}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all cursor-pointer"
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
                className="hud-card p-5 rounded-2xl space-y-3 hover:border-cyan-400 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Radius: {place.defaultRadius}m
                  </span>
                </div>
                <div>
                  <h4 className="font-mono font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {place.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{place.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= HOW IT WORKS STEPPER ================= */}
      <section className="hud-card rounded-3xl p-6 sm:p-10 space-y-6">
        <h2 className="text-xl font-mono font-bold text-white text-center">
          HOW ARRIVE ALARM WORKS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-black text-cyan-400">STEP 01</span>
            <h3 className="font-mono font-bold text-base text-white">Select Destination</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Search any location or tap on the map to pin your target station or arrival point.
            </p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-black text-cyan-400">STEP 02</span>
            <h3 className="font-mono font-bold text-base text-white">Set Geofence Radius</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define your preferred wake-up boundary (from 100m up to 5.0 km) before arriving.
            </p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-black text-cyan-400">STEP 03</span>
            <h3 className="font-mono font-bold text-base text-white">Arrive Fully Alerted</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Loud Web Audio tones, browser notifications, and vibration fire the moment you enter the radius.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

