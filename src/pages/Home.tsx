import React from 'react';
import { MapPin, Bell, Star, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAlarm } from '../context/AlarmContext';
import { LiveClock } from '../components/Clock/LiveClock';
import { QuickAlarmButtons } from '../components/Clock/QuickAlarmButtons';
import { TimeAlarmList } from '../components/Alarm/TimeAlarmList';
import { ActiveAlarmCard } from '../components/Alarm/ActiveAlarmCard';
import { Card } from '../components/Common/Card';
import { BannerLimitation } from '../components/Common/BannerLimitation';

export const Home: React.FC = () => {
  const { setActivePage, isTracking, activeAlarm, currentDistance, initialDistance, history, savedPlaces, stopAlarm } = useAlarm();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <BannerLimitation />

      {/* Live Digital Clock Header */}
      <LiveClock />

      {/* Quick Alarm Presets */}
      <QuickAlarmButtons />

      {/* Saved Time Alarms List */}
      <TimeAlarmList />

      {/* Active Location Alarm Card (If tracking) */}
      {isTracking && activeAlarm && (
        <section className="space-y-3 pt-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            Active Location Alarm Tracking
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

      {/* Quick Dashboard Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Arrival History</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {history.length} <span className="text-xs font-normal text-slate-400 font-sans">total</span>
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
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Saved Destinations</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {savedPlaces.length} <span className="text-xs font-normal text-slate-400 font-sans">places</span>
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

      {/* Recent History Activity Section */}
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
