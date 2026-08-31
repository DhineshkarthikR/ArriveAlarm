import React from 'react';
import { MapPin, Radio, ArrowRight, Timer } from 'lucide-react';
import type { Alarm } from '../../types';
import { formatDistance, calculateApproachProgress, estimateEtaMinutes } from '../../utils/distance';

interface ActiveAlarmCardProps {
  alarm: Alarm;
  currentDistance: number | null;
  initialDistance: number | null;
  onViewAlarm: () => void;
  onStopAlarm?: () => void;
}

export const ActiveAlarmCard: React.FC<ActiveAlarmCardProps> = ({
  alarm,
  currentDistance,
  initialDistance,
  onViewAlarm,
  onStopAlarm,
}) => {
  const formattedDist = currentDistance !== null ? formatDistance(currentDistance) : 'Calculating...';
  const progressPct =
    currentDistance !== null && initialDistance !== null
      ? calculateApproachProgress(initialDistance, currentDistance, alarm.radius)
      : 0;

  const etaMins = currentDistance !== null ? estimateEtaMinutes(currentDistance) : null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-700/50 relative overflow-hidden group">
      {/* Background glow circle */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>🟢 Tracking Location</span>
        </div>
        <span className="text-xs text-indigo-200/80 font-medium">
          {alarm.batteryMode === 'normal' ? 'High Accuracy' : 'Balanced Battery'}
        </span>
      </div>

      {/* Destination Name & Radius */}
      <div className="mb-5 relative z-10">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
          {alarm.destinationName}
        </h3>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-indigo-200/80">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate max-w-[200px]">{alarm.address || 'Selected Destination'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
            <span>{alarm.radius} m radius</span>
          </span>
        </div>
      </div>

      {/* Dynamic Proximity Counter & Progress */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-5 border border-white/10 relative z-10 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-200/70">
              Proximity
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-0.5">
              {formattedDist} <span className="text-sm font-normal text-indigo-200">away</span>
            </div>
          </div>
          {etaMins !== null && (
            <div className="text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-200/70">
                Est. Travel
              </span>
              <div className="text-base font-bold text-emerald-400 mt-0.5 flex items-center gap-1 justify-end">
                <Timer className="w-4 h-4" />
                <span>~{etaMins} mins</span>
              </div>
            </div>
          )}
        </div>

        {/* Approach Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-indigo-200/80 mb-1">
            <span>Approach Progress</span>
            <span className="font-bold text-white">{progressPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950/40 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.max(5, progressPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 relative z-10">
        <button
          onClick={onViewAlarm}
          className="flex-1 py-3 px-4 bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group/btn"
        >
          <span>View Live Tracker</span>
          <ArrowRight className="w-4 h-4 text-indigo-600 group-hover/btn:translate-x-1 transition-transform" />
        </button>

        {onStopAlarm && (
          <button
            onClick={onStopAlarm}
            className="py-3 px-4 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 font-semibold text-xs sm:text-sm rounded-xl transition-all"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};
