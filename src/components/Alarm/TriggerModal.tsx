import React, { useState } from 'react';
import { Bell, Square, Clock, MapPin, AlarmClock } from 'lucide-react';
import { useAlarm } from '../../context/AlarmContext';
import { formatTime } from '../../utils/timeAlarm';

interface TriggerModalProps {
  isOpen: boolean;
  alarm?: any;
  onStop?: () => void;
  onSnooze?: () => void;
  onKeepTracking?: () => void;
}

export const TriggerModal: React.FC<TriggerModalProps> = ({ isOpen }) => {
  const {
    ringingTimeAlarm,
    stopRingingTimeAlarm,
    snoozeTimeAlarm,
    activeAlarm,
    stopAlarm,
    snoozeAlarm,
    keepTracking,
    userSettings,
  } = useAlarm();

  const [selectedSnoozeMins, setSelectedSnoozeMins] = useState<number>(5);

  if (!isOpen) return null;

  const isTimeAlarm = !!ringingTimeAlarm;
  const isLocationAlarm = !isTimeAlarm && !!activeAlarm;

  if (!isTimeAlarm && !isLocationAlarm) return null;

  const label = isTimeAlarm
    ? ringingTimeAlarm.label || 'Alarm'
    : activeAlarm?.destinationName || 'Destination';

  const currentTime = new Date();
  const formattedNow = formatTime(
    currentTime.getHours(),
    currentTime.getMinutes(),
    userSettings.timeFormat === '12h'
  );

  const handleStop = () => {
    if (isTimeAlarm) {
      stopRingingTimeAlarm();
    } else {
      stopAlarm();
    }
  };

  const handleSnooze = (minutes?: number) => {
    const mins = minutes || selectedSnoozeMins;
    if (isTimeAlarm) {
      snoozeTimeAlarm(mins);
    } else {
      snoozeAlarm(mins);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 animate-fade-in">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 sm:p-8 max-w-sm w-full text-center space-y-5">
        {/* Bell Icon */}
        <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto">
          <Bell className="w-8 h-8" />
        </div>

        {/* Time & Label */}
        <div className="space-y-1">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-[#111111] text-[#888888] border border-[#1a1a1a]">
            {isTimeAlarm ? 'Time Alarm' : 'Location Alarm'}
          </span>

          <div className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-white pt-2">
            {formattedNow.timeStr}
            {formattedNow.period && (
              <span className="text-xl text-[#555555] ml-1.5">
                {formattedNow.period}
              </span>
            )}
          </div>

          <h2 className="text-base font-medium text-[#888888] mt-1 flex items-center justify-center gap-2">
            {isTimeAlarm ? (
              <AlarmClock className="w-4 h-4" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            <span>{label}</span>
          </h2>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <button
            onClick={handleStop}
            className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-500 text-white font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Square className="w-5 h-5 fill-current" />
            <span>Stop Alarm</span>
          </button>

          {/* Snooze */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#555555]">
              <span>Snooze</span>
              <span className="text-white">{selectedSnoozeMins} min</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[1, 5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setSelectedSnoozeMins(mins);
                    handleSnooze(mins);
                  }}
                  className={`py-1.5 px-2 rounded-md text-xs font-medium border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                    selectedSnoozeMins === mins
                      ? 'bg-white text-black border-white'
                      : 'bg-[#111111] text-[#888888] border-[#1a1a1a] hover:border-[#333333]'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{mins}m</span>
                </button>
              ))}
            </div>
          </div>

          {isLocationAlarm && (
            <button
              onClick={keepTracking}
              className="w-full py-2 px-4 bg-[#111111] hover:bg-[#1a1a1a] text-[#888888] text-xs font-medium rounded-md border border-[#1a1a1a] transition-colors cursor-pointer"
            >
              Keep Tracking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
