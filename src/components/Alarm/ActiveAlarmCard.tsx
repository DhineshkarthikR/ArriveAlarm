import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
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
      : 72; // Default preview percentage if calculating

  const etaMins = currentDistance !== null ? estimateEtaMinutes(currentDistance) : 4;

  // SVG Circular progress math
  const strokeWidth = 8;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <div className="hud-card-active rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden group border border-cyan-500/40 shadow-[0_0_35px_rgba(0,242,255,0.2)]">
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Status Row */}
      <div className="flex items-center justify-between gap-2 mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,242,255,0.3)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>ALARM ACTIVE • TELEMETRY LOCK</span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Geofence Boundary: <strong className="text-cyan-400">{alarm.radius}m</strong>
        </span>
      </div>

      {/* Main Proximity & Circular Progress Ring Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6 relative z-10">
        {/* Circular Progress Visualizer */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-cyan-500/20">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-900 stroke-current"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-cyan-400 stroke-current transition-all duration-1000 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black font-mono text-cyan-400 text-cyan-glow">
                {progressPct}%
              </span>
              <span className="text-[10px] font-mono uppercase text-slate-400">ARRIVED</span>
            </div>
          </div>
        </div>

        {/* Proximity Readout Details */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mb-1">
              {alarm.destinationName}
            </h3>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 font-sans">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{alarm.address || 'Target Location Coordinates'}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">PROXIMITY</span>
              <p className="text-xl font-black font-mono text-cyan-400 mt-0.5">{formattedDist}</p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">ESTIMATED ETA</span>
              <p className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                ~{etaMins !== null ? etaMins : 4} MIN
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 relative z-10 pt-2 border-t border-slate-800/80">
        <button
          onClick={onViewAlarm}
          className="flex-1 py-3.5 px-5 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-slate-950 font-mono font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>VIEW LIVE TRACKER</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>

        {onStopAlarm && (
          <button
            onClick={onStopAlarm}
            className="py-3.5 px-5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-mono font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
          >
            DISARM
          </button>
        )}
      </div>
    </div>
  );
};

