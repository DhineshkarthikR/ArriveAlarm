import React from 'react';
import { FlaskConical, X } from 'lucide-react';
import { useAlarm } from '../../context/AlarmContext';
import { formatDistance } from '../../utils/distance';

export const DemoModePanel: React.FC = () => {
  const { demoMode, setDemoMode, demoDistance, setDemoDistance, activeAlarm } = useAlarm();

  if (!demoMode) return null;

  const presets = [2000, 1000, 500, 200, 100, 0];

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-40 bg-[#0A0A0A] text-white border border-[#222222] rounded-2xl p-4 shadow-2xl animate-fadeIn">
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#222222]">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-white" />
          <span className="font-bold text-xs sm:text-sm text-white tracking-wide">
            🧪 Demo Mode (GPS Simulator)
          </span>
        </div>
        <button
          onClick={() => setDemoMode(false)}
          className="p-1 text-[#A3A3A3] hover:text-white rounded-lg transition-colors"
          title="Close Demo Mode"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[11px] text-[#737373] mb-3">
        Simulate user approaching destination without moving physically. Drag slider or click preset below:
      </p>

      {/* Slider */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#A3A3A3]">Simulated Distance:</span>
          <span className="text-white font-extrabold px-2 py-0.5 rounded bg-[#111111] border border-[#333333]">
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
          className="w-full accent-white h-2 bg-[#333333] rounded-lg cursor-pointer"
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
                  ? 'bg-white text-black border-white shadow-sm'
                  : isInsideRadius
                  ? 'bg-[#111111] text-white border-[#333333] hover:bg-[#222222]'
                  : 'bg-[#0A0A0A] text-[#A3A3A3] border-[#222222] hover:bg-[#111111]'
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
