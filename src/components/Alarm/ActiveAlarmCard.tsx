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
      : 0;

  const etaMins = currentDistance !== null ? estimateEtaMinutes(currentDistance) : null;

  return (
    <div className="bg-[#0a0a0a] rounded-md p-5 border border-[#1a1a1a]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-[#111111] text-white border border-[#333333]">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>TRACKING</span>
        </div>
        <span className="text-[11px] text-[#555555]">
          Radius: <span className="text-white">{alarm.radius}m</span>
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row md:items-center gap-5 mb-4">
        {/* Info */}
        <div className="flex-1 space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-white">
            {alarm.destinationName}
          </h3>
          <p className="text-xs text-[#555555] truncate flex items-center gap-1.5">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{alarm.address || 'Target Location'}</span>
          </p>
        </div>

        {/* Distance + ETA */}
        <div className="flex gap-3">
          <div className="bg-black p-3 rounded-md border border-[#1a1a1a] min-w-[100px] text-center">
            <span className="text-[10px] text-[#555555] uppercase">Distance</span>
            <p className="text-lg font-bold font-mono text-white mt-0.5">{formattedDist}</p>
          </div>
          <div className="bg-black p-3 rounded-md border border-[#1a1a1a] min-w-[80px] text-center">
            <span className="text-[10px] text-[#555555] uppercase">ETA</span>
            <p className="text-lg font-bold font-mono text-white mt-0.5">
              {etaMins !== null ? `${etaMins}m` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] text-[#555555] mb-1">
          <span>Progress</span>
          <span className="text-white">{progressPct}%</span>
        </div>
        <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${Math.max(2, progressPct)}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#1a1a1a]">
        <button
          onClick={onViewAlarm}
          className="flex-1 py-2.5 px-4 bg-white hover:bg-neutral-200 text-black font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View Tracker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {onStopAlarm && (
          <button
            onClick={onStopAlarm}
            className="py-2.5 px-4 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 font-medium text-xs rounded-md transition-colors cursor-pointer"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};
