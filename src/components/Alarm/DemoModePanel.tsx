import React from 'react';
import { FlaskConical, X } from 'lucide-react';
import { useAlarm } from '../../context/AlarmContext';
import { formatDistance } from '../../utils/distance';

export const DemoModePanel: React.FC = () => {
  const { demoMode, setDemoMode, demoDistance, setDemoDistance, activeAlarm } = useAlarm();

  if (!demoMode) return null;

  const presets = [2000, 1000, 500, 200, 100, 0];

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-40 bg-amber-950/90 text-amber-100 border border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-fadeIn">
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-500/30">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="font-bold text-xs sm:text-sm text-white tracking-wide">
            🧪 Demo Mode (GPS Simulator)
          </span>
        </div>
        <button
          onClick={() => setDemoMode(false)}
          className="p-1 text-amber-300 hover:text-white rounded-lg transition-colors"
          title="Close Demo Mode"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[11px] text-amber-200/80 mb-3">
        Simulate user approaching destination without moving physically. Drag slider or click preset below:
      </p>

      {/* Slider */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-amber-300">Simulated Distance:</span>
          <span className="text-white font-extrabold px-2 py-0.5 rounded bg-amber-500/30 border border-amber-500/40">
            {formatDistance(demoDistance)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="2000"
          step="25"
          value={demoDistance}
          onChange={(e) => setDemoDistance(parseInt(e.target.value, 10))}
          className="w-full accent-amber-400 h-2 bg-amber-900 rounded-lg cursor-pointer"
        />
      </div>

      {/* Quick Step Buttons */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {presets.map((val) => {
          const isCurrent = demoDistance === val;
          const isInsideRadius = activeAlarm ? val <= activeAlarm.radius : false;
          return (
            <button
              key={val}
              onClick={() => setDemoDistance(val)}
              className={`py-1 px-2 text-[10px] font-bold rounded-lg border transition-all ${
                isCurrent
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                  : isInsideRadius
                  ? 'bg-rose-500/30 text-rose-200 border-rose-500/40 hover:bg-rose-500/40'
                  : 'bg-amber-900/50 text-amber-200 border-amber-700 hover:bg-amber-800'
              }`}
            >
              {val >= 1000 ? `${val / 1000}km` : `${val}m`}
            </button>
          );
        })}
      </div>
    </div>
  );
};
