import React from 'react';
import {
  PlusCircle,
  MapPin,
  Bell,
  Star,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Compass,
  Radio,
} from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { LiveClock } from '../components/Clock/LiveClock';
import { QuickAlarmButtons } from '../components/Clock/QuickAlarmButtons';
import { TimeAlarmList } from '../components/Alarm/TimeAlarmList';
import { ActiveAlarmCard } from '../components/Alarm/ActiveAlarmCard';
import { Card } from '../components/Common/Card';
import { BannerLimitation } from '../components/Common/BannerLimitation';

export const Home: React.FC = () => {
  const {
    setActivePage,
    isTracking,
    activeAlarm,
    currentDistance,
    initialDistance,
    history,
    savedPlaces,
    stopAlarm,
  } = useAlarm();

  // Determine greeting based on local browser time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning 👋' : hour < 18 ? 'Good afternoon 👋' : 'Good evening 👋';

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      <BannerLimitation />

      {/* Hero Welcome & Journey Visual Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
        {/* Subtle dynamic background ambient glows */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Messaging */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-indigo-200">
                {greeting}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-300 border border-indigo-400/30">
                <Navigation className="w-3 h-3 text-indigo-400" />
                <span>Smart Alarm Engine</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Arrive. Relax. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-200 to-indigo-400">
                Never Miss Your Stop.
              </span>
            </h1>

            <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed max-w-xl">
              Set location arrival geofences or precise time alarms. Arrive Alarm triggers loud audio tones, vibration, and browser alerts the exact moment you reach your destination.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActivePage('create')}
                className="py-3.5 px-6 bg-white text-indigo-950 hover:bg-slate-100 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2 transform active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4.5 h-4.5 text-indigo-600" />
                <span>+ Create New Alarm</span>
              </button>

              <button
                onClick={() => setActivePage('saved')}
                className="py-3.5 px-5 bg-indigo-900/60 hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm rounded-2xl border border-indigo-400/30 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Star className="w-4 h-4 text-amber-300" />
                <span>Saved Places ({savedPlaces.length})</span>
              </button>
            </div>
          </div>

          {/* Right Visual Representation: Location -> Journey -> Destination -> Alert */}
          <div className="lg:col-span-5 bg-slate-950/60 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-indigo-900/50 pb-3">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Visual Journey Flow</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE PIPELINE
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center relative">
              {/* Journey Step 1 */}
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-indigo-900/80 border border-indigo-700 text-indigo-300 flex items-center justify-center shadow-md">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[11px] font-bold text-slate-200">Location</span>
                <span className="text-[9px] text-slate-400">GPS Pin</span>
              </div>

              {/* Journey Step 2 */}
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-blue-900/80 border border-blue-700 text-blue-300 flex items-center justify-center shadow-md">
                  <Navigation className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-[11px] font-bold text-slate-200">Journey</span>
                <span className="text-[9px] text-slate-400">Tracking</span>
              </div>

              {/* Journey Step 3 */}
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-amber-900/80 border border-amber-700 text-amber-300 flex items-center justify-center shadow-md">
                  <Radio className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[11px] font-bold text-slate-200">Geofence</span>
                <span className="text-[9px] text-slate-400">Radius</span>
              </div>

              {/* Journey Step 4 */}
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-rose-900/80 border border-rose-700 text-rose-300 flex items-center justify-center shadow-md animate-bounce">
                  <Bell className="w-5 h-5 text-rose-400" />
                </div>
                <span className="text-[11px] font-bold text-slate-200">Alert!</span>
                <span className="text-[9px] text-slate-400">Loud Tone</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Digital Clock Section */}
      <section className="space-y-3">
        <LiveClock />
      </section>

      {/* Quick Alarm Presets */}
      <section className="space-y-3">
        <QuickAlarmButtons />
      </section>

      {/* Saved Time Alarms List */}
      <section className="space-y-3">
        <TimeAlarmList />
      </section>

      {/* Active Location Alarm Tracking Status */}
      {isTracking && activeAlarm && (
        <section className="space-y-3 pt-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            Active Location Tracking Status
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

      {/* Quick Metrics & System Status Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Arrival History</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {history.length} <span className="text-xs font-normal text-slate-400">arrivals</span>
            </p>
          </div>
        </Card>

        <Card
          onClick={() => setActivePage('saved')}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Saved Places</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {savedPlaces.length} <span className="text-xs font-normal text-slate-400">saved</span>
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Engine Status</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Alarm Ticker Active</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Arrival History Activity */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Recent Arrival History
          </h2>
          <button
            onClick={() => setActivePage('history')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No recent arrival history logs.</p>
        ) : (
          <div className="space-y-2.5">
            {history.slice(0, 3).map((item) => (
              <Card key={item.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {item.destinationName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Arrived within {item.radius} m • Duration: {item.durationMinutes} min
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {new Date(item.arrivedAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
