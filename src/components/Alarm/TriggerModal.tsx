import React from 'react';
import { Bell, CheckCircle2, Square, Clock, Radio, MapPin } from 'lucide-react';
import type { Alarm } from '../../types';

interface TriggerModalProps {
  isOpen: boolean;
  alarm: Alarm | null;
  onStop: () => void;
  onSnooze: () => void;
  onKeepTracking: () => void;
}

export const TriggerModal: React.FC<TriggerModalProps> = ({
  isOpen,
  alarm,
  onStop,
  onSnooze,
  onKeepTracking,
}) => {
  if (!isOpen || !alarm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/80 backdrop-blur-md animate-alarm-flash">
      <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden text-white animate-pulse-glow">
        {/* Pulsing radar backdrop */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-rose-500/30 rounded-full blur-3xl animate-ping" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-5">
          {/* Pulsing Bell Icon */}
          <div className="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/40 animate-bounce">
            <Bell className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
              Arrival Alarm
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
              YOU'VE ARRIVED!
            </h1>
          </div>

          {/* Destination Details Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
              <h2 className="text-xl font-bold text-white truncate">
                {alarm.destinationName}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>You are within <strong className="text-emerald-400">{alarm.radius} meters</strong> of your destination.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={onStop}
              className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-base rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>STOP ALARM</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onSnooze}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>Snooze 1 min</span>
              </button>

              <button
                onClick={onKeepTracking}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Keep Tracking</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
