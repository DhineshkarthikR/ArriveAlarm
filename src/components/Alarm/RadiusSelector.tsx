import React, { useState } from 'react';
import { Radio } from 'lucide-react';
import { clsx } from 'clsx';

interface RadiusSelectorProps {
  radius: number; // in meters
  onChange: (meters: number) => void;
}

const PRESETS = [
  { label: '50 m', value: 50 },
  { label: '100 m', value: 100 },
  { label: '200 m', value: 200 },
  { label: '500 m', value: 500 },
  { label: '1 km', value: 1000 },
];

export const RadiusSelector: React.FC<RadiusSelectorProps> = ({ radius, onChange }) => {
  const [isCustom, setIsCustom] = useState(() => !PRESETS.some((p) => p.value === radius));
  const [customValue, setCustomValue] = useState(radius.toString());

  const handleSelectPreset = (val: number) => {
    setIsCustom(false);
    onChange(val);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setCustomValue(valStr);
    const num = parseInt(valStr, 10);
    if (!isNaN(num) && num > 0) {
      onChange(num);
    }
  };

  const formatText = (m: number) => {
    if (m >= 1000) return `${(m / 1000).toFixed(m % 1000 === 0 ? 0 : 1)} kilometers`;
    return `${m} meters`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
          <Radio className="w-4 h-4 text-white" />
          <span>Alert Radius</span>
        </label>
        <span className="text-xs font-semibold text-[#A3A3A3] bg-[#111111] border border-[#333333] px-2.5 py-0.5 rounded-full">
          {formatText(radius)}
        </span>
      </div>

      {/* Preset Chips */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {PRESETS.map((preset) => {
          const isSelected = !isCustom && radius === preset.value;
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => handleSelectPreset(preset.value)}
              className={clsx(
                'py-2 px-3 rounded-xl text-xs font-semibold border transition-all duration-150',
                isSelected
                  ? 'bg-white border-white text-black shadow-md'
                  : 'bg-[#080808] border-[#333333] text-[#A3A3A3] hover:text-white hover:bg-[#111111]'
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Custom Radius input */}
      <div className="pt-1 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setIsCustom(true);
            const num = parseInt(customValue, 10);
            if (!isNaN(num) && num > 0) onChange(num);
          }}
          className={clsx(
            'px-3 py-2 rounded-xl text-xs font-semibold border shrink-0 transition-colors',
            isCustom
              ? 'bg-white border-white text-black shadow-sm'
              : 'bg-[#080808] border-[#333333] text-[#A3A3A3] hover:text-white'
          )}
        >
          Custom
        </button>
        {isCustom && (
          <div className="relative flex-1 flex items-center">
            <input
              type="number"
              min="10"
              max="50000"
              value={customValue}
              onChange={handleCustomChange}
              placeholder="e.g. 250"
              className="w-full px-3 py-2 bg-[#080808] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            />
            <span className="absolute right-3 text-xs text-slate-400 font-medium">meters</span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        Alert triggers when you arrive within <span className="font-semibold text-white">{formatText(radius)}</span> of your destination.
      </p>
    </div>
  );
};
