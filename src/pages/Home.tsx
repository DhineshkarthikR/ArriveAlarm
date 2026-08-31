import React from 'react';
import { PlusCircle, History as HistoryIcon, MapPin, Bell, Star, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { ActiveAlarmCard } from '../components/Alarm/ActiveAlarmCard';
import { Card } from '../components/Common/Card';
import { BannerLimitation } from '../components/Common/BannerLimitation';

export const Home: React.FC = () => {
  const { setActivePage, isTracking, activeAlarm, currentDistance, initialDistance, history, savedPlaces, stopAlarm } = useAlarm();

  // Determine greeting based on current time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning 👋' : hour < 18 ? 'Good afternoon 👋' : 'Good evening 👋';

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <BannerLimitation />

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-brand-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-100">
            {greeting}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Never miss your destination.
          </h1>
          <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
            Set a location alarm and receive loud audio, vibration, and browser alerts the exact moment you arrive within your chosen geofence.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActivePage('create')}
              className="py-3 px-5 bg-white text-indigo-950 hover:bg-slate-100 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>+ Create Location Alarm</span>
            </button>

            <button
              onClick={() => setActivePage('history')}
              className="py-3 px-5 bg-indigo-800/60 hover:bg-indigo-800 text-white font-semibold text-xs sm:text-sm rounded-2xl border border-indigo-500/40 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <HistoryIcon className="w-4 h-4" />
              <span>View History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Alarm Card (If tracking) */}
      {isTracking && activeAlarm && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            Active Alarm Status
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

      {/* Quick Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Alerts */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed Arrivals</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {history.length} <span className="text-xs font-normal text-slate-400">total</span>
            </p>
          </div>
        </Card>

        {/* Saved Places */}
        <Card
          onClick={() => setActivePage('saved')}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Saved Destinations</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {savedPlaces.length} <span className="text-xs font-normal text-slate-400">places</span>
            </p>
          </div>
        </Card>

        {/* System Status */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">GPS Engine</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready to Track</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Recent Activity
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
          <p className="text-xs text-slate-400 italic">No recent arrival history.</p>
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
                  {new Date(item.arrivedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
