import React from 'react';
import { Calendar, Bell, ShieldCheck } from 'lucide-react';
import { useAlarm } from '../../context/AlarmContext';

export const LiveClock: React.FC = () => {
  const { nowMs, userSettings, setTimeFormat, notificationPermission, requestNotificationPermission } =
    useAlarm();

  const currentDate = new Date(nowMs);
  const is12H = userSettings.timeFormat === '12h';

  // Format time components
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';

  if (is12H) {
    hours = hours % 12;
    if (hours === 0) hours = 12;
  }

  const hoursStr = hours.toString().padStart(2, '0');

  // Format date & day
  const dayName = currentDate.toLocaleDateString([], { weekday: 'long' });
  const dateStr = currentDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
      {/* Dynamic ambient background blur circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Date and Live Clock Display */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-indigo-300 font-semibold tracking-wide uppercase">
            <span className="flex items-center gap-1.5 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/50">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {dayName}, {dateStr}
              </span>
            </span>
          </div>

          <div className="flex items-baseline gap-2 font-black tracking-tight font-mono text-4xl sm:text-6xl md:text-7xl text-slate-50 drop-shadow-md">
            <span>{hoursStr}</span>
            <span className="animate-pulse text-indigo-400">:</span>
            <span>{minutes}</span>
            <span className="animate-pulse text-indigo-400">:</span>
            <span className="text-3xl sm:text-4xl text-slate-400 font-normal">{seconds}</span>

            {is12H && (
              <span className="text-xl sm:text-2xl font-sans font-bold text-indigo-400 ml-2">
                {period}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls & Format Toggle */}
        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
          {/* 12H / 24H Toggle */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-2xl border border-slate-700/80 shadow-inner">
            <button
              onClick={() => setTimeFormat('12h')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                is12H
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              12H
            </button>
            <button
              onClick={() => setTimeFormat('24h')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                !is12H
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24H
            </button>
          </div>

          {/* Notification Permission Request */}
          {notificationPermission !== 'granted' ? (
            <button
              onClick={() => requestNotificationPermission()}
              className="px-3.5 py-2 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-2xl flex items-center gap-2 transition-all active:scale-95"
              title="Click to enable desktop browser notifications for alarms"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Enable Notifications</span>
            </button>
          ) : (
            <div className="px-3.5 py-1.5 text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notifications Enabled</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
