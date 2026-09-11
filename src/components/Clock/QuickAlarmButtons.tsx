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
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
        <Zap className="w-3.5 h-3.5 text-blue-400" />
        <span>QUICK ALARM PRESETS</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <button
          onClick={() => quickAddAlarm(5, 'Timer +5m')}
          className="py-3 px-3 bg-[#0a0a0a] border border-[#222222] hover:border-neutral-600 rounded-xl text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>+5 MIN</span>
        </button>

        <button
          onClick={() => quickAddAlarm(10, 'Timer +10m')}
          className="py-3 px-3 bg-[#0a0a0a] border border-[#222222] hover:border-neutral-600 rounded-xl text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>+10 MIN</span>
        </button>

        <button
          onClick={() => quickAddAlarm(30, 'Timer +30m')}
          className="py-3 px-3 bg-[#0a0a0a] border border-[#222222] hover:border-neutral-600 rounded-xl text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>+30 MIN</span>
        </button>

        <button
          onClick={() => quickAddAlarm(60, 'Timer +1 Hour')}
          className="py-3 px-3 bg-[#0a0a0a] border border-[#222222] hover:border-neutral-600 rounded-xl text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>+1 HOUR</span>
        </button>

        <button
          onClick={handleTomorrowMorning}
          className="col-span-2 sm:col-span-1 py-3 px-3 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-xl text-xs font-mono font-bold text-amber-300 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>7 AM</span>
        </button>
      </div>
    </div>
  );
};

