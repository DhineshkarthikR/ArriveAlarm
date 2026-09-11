import React, { useState } from 'react';
import { Volume2, Play, Square, BellRing, Clock } from 'lucide-react';
import type { AlarmSoundType } from '../../types';
import { testSound, stopAlarmSound } from '../../utils/audio';

interface SoundSelectorProps {
  sound: AlarmSoundType;
  volume: number;
  durationSeconds?: number;
  onChangeSound: (sound: AlarmSoundType) => void;
  onChangeVolume: (volume: number) => void;
  onChangeDuration?: (durationSeconds: number) => void;
}

const SOUND_OPTIONS: { id: AlarmSoundType; label: string; desc: string }[] = [
  { id: 'classic', label: 'Classic Alarm', desc: 'Dual pitch chime pulse' },
  { id: 'loud_beep', label: 'Loud Beep', desc: 'High gain 1200Hz tone' },
  { id: 'digital', label: 'Digital Alarm', desc: 'Ascending 3-step wave' },
  { id: 'high_pitch', label: 'High Pitch', desc: 'Sharp 2400Hz sine tone' },
  { id: 'rapid_beep', label: 'Rapid Beep', desc: 'Fast 4x staccato pulse' },
  { id: 'emergency', label: 'Emergency Style', desc: 'Urgent siren sweep' },
  { id: 'bell', label: 'Gentle Bell', desc: 'Resonant bell chime' },
  { id: 'electronic', label: 'Electronic', desc: '8-bit retro arpeggio' },
  { id: 'morning', label: 'Morning Alarm', desc: 'Soft C5-G5 harmonic' },
  { id: 'double_beep', label: 'Double Beep', desc: 'Classic double pulse' },
];

const DURATION_OPTIONS = [
  { label: '10 sec', value: 10 },
  { label: '30 sec', value: 30 },
  { label: '1 min', value: 60 },
  { label: 'Until dismissed', value: 0 },
];

export const SoundSelector: React.FC<SoundSelectorProps> = ({
  sound,
  volume,
  durationSeconds,
  onChangeSound,
  onChangeVolume,
  onChangeDuration,
}) => {
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const handleTest = () => {
    if (isPlayingTest) {
      stopAlarmSound();
      setIsPlayingTest(false);
    } else {
      setIsPlayingTest(true);
      testSound(sound, volume);
      setTimeout(() => {
        setIsPlayingTest(false);
      }, 3000);
    }
  };

  const selectedSoundObj = SOUND_OPTIONS.find((s) => s.id === sound) || SOUND_OPTIONS[0];

  return (
    <div className="space-y-4">
      {/* Sound Type Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
            <BellRing className="w-4 h-4 text-white" />
            <span>Alarm Tone ({selectedSoundObj.label})</span>
          </label>

          <button
            type="button"
            onClick={handleTest}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
              isPlayingTest
                ? 'bg-white text-black border-white animate-pulse'
                : 'bg-[#111111] border-[#333333] text-white hover:bg-[#1A1A1A]'
            }`}
          >
            {isPlayingTest ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                <span>Playing...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Test Sound</span>
              </>
            )}
          </button>
        </div>

        <select
          value={sound}
          onChange={(e) => onChangeSound(e.target.value as AlarmSoundType)}
          className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#333333] rounded-xl text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
        >
          {SOUND_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label} — {opt.desc}
            </option>
          ))}
        </select>
      </div>

      {/* Volume Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
          <span className="flex items-center gap-1.5 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-[#A3A3A3]" />
            <span>Volume</span>
          </span>
          <span className="font-semibold text-white">{volume}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={volume}
          onChange={(e) => onChangeVolume(parseInt(e.target.value, 10))}
          className="w-full accent-white h-1.5 bg-[#333333] rounded-lg cursor-pointer"
        />
      </div>

      {/* Alarm Duration (Optional for Location Alarms) */}
      {durationSeconds !== undefined && onChangeDuration && (
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#A3A3A3]">
            <Clock className="w-3.5 h-3.5 text-[#A3A3A3]" />
            <span>Alarm Duration</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = durationSeconds === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeDuration(opt.value)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-xs'
                      : 'bg-[#080808] border-[#333333] text-[#A3A3A3] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
