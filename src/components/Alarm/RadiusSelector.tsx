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
        <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
          <Radio className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Alert Radius</span>
        </label>
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 px-2.5 py-0.5 rounded-full">
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
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
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
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
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
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <span className="absolute right-3 text-xs text-slate-400 font-medium">meters</span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        Alert triggers when you arrive within <span className="font-semibold text-slate-800 dark:text-slate-200">{formatText(radius)}</span> of your destination.
      </p>
    </div>
  );
};
