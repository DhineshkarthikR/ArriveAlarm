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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn">
      {/* Fullscreen pulsing background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-ping" />
        <div className="w-[300px] h-[300px] bg-rose-500/30 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-6 sm:p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden text-white space-y-6 z-10 animate-bounce-slow">
        {/* Ringing Bell Icon Header */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-rose-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/40 animate-bounce">
          <Bell className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        {/* Live Large Time Display */}
        <div className="space-y-1">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            {isTimeAlarm ? '⏰ TIME ALARM' : '📍 LOCATION ALARM'}
          </span>

          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white pt-2">
            {formattedNow.timeStr}
            {formattedNow.period && (
              <span className="text-2xl font-sans text-indigo-400 font-bold ml-2">
                {formattedNow.period}
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-200 mt-1 flex items-center justify-center gap-2">
            {isTimeAlarm ? (
              <AlarmClock className="w-5 h-5 text-indigo-400" />
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
            className="w-full py-4 sm:py-5 px-6 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:from-rose-700 active:to-rose-800 text-white font-black text-lg rounded-2xl shadow-xl shadow-rose-600/40 transition-all flex items-center justify-center gap-3 transform active:scale-95 cursor-pointer"
          >
            <Square className="w-6 h-6 fill-current" />
            <span>STOP ALARM</span>
          </button>

          {/* Snooze Options Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
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
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 active:scale-95 ${
                    selectedSnoozeMins === mins
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
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
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
            >
              Keep Location Tracking Active
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
