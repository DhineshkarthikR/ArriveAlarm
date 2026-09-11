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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-3xl p-6 sm:p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden text-white space-y-6 z-10">
        {/* Ringing Bell Icon Header */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-black flex items-center justify-center mx-auto shadow-xl animate-bounce">
          <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-black" />
        </div>

        {/* Live Large Time Display */}
        <div className="space-y-1">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-[#111111] text-white border border-[#222222]">
            {isTimeAlarm ? '⏰ TIME ALARM' : '📍 LOCATION ALARM'}
          </span>

          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white pt-2">
            {formattedNow.timeStr}
            {formattedNow.period && (
              <span className="text-2xl font-sans text-neutral-400 font-bold ml-2">
                {formattedNow.period}
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-neutral-200 mt-1 flex items-center justify-center gap-2">
            {isTimeAlarm ? (
              <AlarmClock className="w-5 h-5 text-blue-400" />
            ) : (
              <MapPin className="w-5 h-5 text-rose-400" />
            )}
            <span>{label}</span>
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-2">
          {/* Prominent Stop Button */}
          <button
            onClick={handleStop}
            className="w-full py-4 sm:py-5 px-6 bg-rose-600 hover:bg-rose-500 text-white font-black text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 transform active:scale-95 cursor-pointer"
          >
            <Square className="w-6 h-6 fill-current" />
            <span>STOP ALARM</span>
          </button>

          {/* Snooze Options Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-medium px-1">
              <span>Snooze Duration</span>
              <span className="text-amber-400 font-bold">{selectedSnoozeMins} min</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setSelectedSnoozeMins(mins);
                    handleSnooze(mins);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                    selectedSnoozeMins === mins
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                      : 'bg-[#111111] hover:bg-[#1a1a1a] text-amber-300 border-[#222222]'
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
              className="w-full py-2.5 px-4 bg-[#111111] hover:bg-[#1a1a1a] text-neutral-300 text-xs font-semibold rounded-xl border border-[#222222] transition-all cursor-pointer"
            >
              Keep Location Tracking Active
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
