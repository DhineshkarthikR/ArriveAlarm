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
    <div className="bg-[#0a0a0a] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden border border-[#222222]">
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Date and Live Clock Display */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-400 font-mono font-semibold tracking-wide uppercase">
            <span className="flex items-center gap-1.5 bg-[#111111] px-3 py-1 rounded-full border border-[#222222]">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {dayName}, {dateStr}
              </span>
            </span>
          </div>

          <div className="flex items-baseline gap-2 font-black tracking-tight font-mono text-4xl sm:text-6xl md:text-7xl text-white">
            <span>{hoursStr}</span>
            <span className="animate-pulse text-neutral-500">:</span>
            <span>{minutes}</span>
            <span className="animate-pulse text-neutral-500">:</span>
            <span className="text-3xl sm:text-4xl text-neutral-500 font-normal">{seconds}</span>

            {is12H && (
              <span className="text-xl sm:text-2xl font-mono font-bold text-neutral-400 ml-2">
                {period}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls & Format Toggle */}
        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
          {/* 12H / 24H Toggle */}
          <div className="flex items-center bg-[#111111] p-1 rounded-xl border border-[#222222]">
            <button
              onClick={() => setTimeFormat('12h')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                is12H
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              12H
            </button>
            <button
              onClick={() => setTimeFormat('24h')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                !is12H
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              24H
            </button>
          </div>

          {/* Notification Permission Request */}
          {notificationPermission !== 'granted' ? (
            <button
              onClick={() => requestNotificationPermission()}
              className="px-3.5 py-2 text-xs font-mono font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              title="Click to enable desktop browser notifications for alarms"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>ENABLE NOTIFS</span>
            </button>
          ) : (
            <div className="px-3.5 py-1.5 text-[11px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>NOTIFICATIONS ACTIVE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

