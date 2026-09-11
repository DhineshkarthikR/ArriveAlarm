import React from 'react';
import { Zap, Sun, Clock } from 'lucide-react';
import { useAlarm } from '../../context/AlarmContext';

export const QuickAlarmButtons: React.FC = () => {
  const { quickAddAlarm, addTimeAlarm, userSettings } = useAlarm();

  const handleTomorrowMorning = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(7, 0, 0, 0);

    addTimeAlarm({
      type: 'time',
      label: 'Tomorrow Morning',
      hour: 7,
      minute: 0,
      enabled: true,
      sound: userSettings.defaultSound || 'morning',
      volume: userSettings.defaultVolume || 80,
      snoozeDuration: userSettings.defaultSnoozeDuration || 5,
      repeat: 'once',
      customDays: [],
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <Zap className="w-3.5 h-3.5 text-amber-500" />
        <span>Quick Set Alarms</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <button
          onClick={() => quickAddAlarm(5, 'Timer +5m')}
          className="py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>+5 Min</span>
        </button>

        <button
          onClick={() => quickAddAlarm(10, 'Timer +10m')}
          className="py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>+10 Min</span>
        </button>

        <button
          onClick={() => quickAddAlarm(30, 'Timer +30m')}
          className="py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>+30 Min</span>
        </button>

        <button
          onClick={() => quickAddAlarm(60, 'Timer +1 Hour')}
          className="py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>+1 Hour</span>
        </button>

        <button
          onClick={handleTomorrowMorning}
          className="col-span-2 sm:col-span-1 py-2.5 px-3 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-700/50 hover:bg-amber-500/20 rounded-2xl text-xs font-semibold text-amber-800 dark:text-amber-200 shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Tomorrow 7 AM</span>
        </button>
      </div>
    </div>
  );
};
