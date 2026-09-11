import React, { useState } from 'react';
import { AlarmClock, Clock, Trash2, Edit2, Plus, Repeat } from 'lucide-react';
import type { AlarmSoundType, RepeatOption, TimeAlarm } from '../../types';
import { useAlarm } from '../../context/AlarmContext';
import { formatTime, getCountdownText, getRepeatLabel } from '../../utils/timeAlarm';
import { SoundSelector } from './SoundSelector';

export const TimeAlarmList: React.FC = () => {
  const {
    timeAlarms,
    toggleTimeAlarm,
    deleteTimeAlarm,
    userSettings,
    setActivePage,
    nowMs,
  } = useAlarm();

  const [editingAlarm, setEditingAlarm] = useState<TimeAlarm | null>(null);

  const is12H = userSettings.timeFormat === '12h';

  if (timeAlarms.length === 0) {
    return (
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto border border-[#222222]">
          <AlarmClock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">No Alarms Set</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            You don't have any active time alarms. Click below to schedule your first alarm.
          </p>
        </div>
        <button
          onClick={() => setActivePage('create')}
          className="py-2.5 px-5 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Alarm</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <AlarmClock className="w-5 h-5 text-white" />
          <span>Your Alarms ({timeAlarms.length})</span>
        </h2>
        <button
          onClick={() => setActivePage('create')}
          className="py-1.5 px-3 bg-[#111111] border border-[#222222] text-white hover:border-neutral-600 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Alarm</span>
        </button>
      </div>

      <div className="space-y-3">
        {timeAlarms.map((alarm) => {
          const { timeStr, period } = formatTime(alarm.hour, alarm.minute, is12H);
          const targetTimestamp =
            alarm.status === 'snoozed' && alarm.snoozedUntil
              ? alarm.snoozedUntil
              : alarm.nextRingTimestamp;
          const countdown = alarm.enabled ? getCountdownText(targetTimestamp, nowMs) : 'Disabled';
          const repeatLabel = getRepeatLabel(alarm.repeat, alarm.customDays);

          return (
            <div
              key={alarm.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                alarm.enabled
                  ? 'bg-[#0a0a0a] border-[#222222]'
                  : 'bg-[#0a0a0a]/50 border-[#1a1a1a] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left Time & Details */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white">
                      {timeStr}
                    </span>
                    {period && (
                      <span className="text-sm font-bold text-neutral-400">
                        {period}
                      </span>
                    )}

                    {alarm.status === 'snoozed' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#111111] text-white border border-[#333333]">
                        Snoozed
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                    <span className="font-semibold text-white">
                      {alarm.label || 'Alarm'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Repeat className="w-3 h-3 text-neutral-500" />
                      <span>{repeatLabel}</span>
                    </span>
                    <span>•</span>
                    <span className="capitalize">{alarm.sound.replace('_', ' ')}</span>
                  </div>

                  {/* Countdown display */}
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5 pt-0.5">
                    <Clock className="w-3.5 h-3.5 text-white" />
                    <span>{countdown}</span>
                  </div>
                </div>

                {/* Right Controls & Toggle Switch */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* ON/OFF Switch */}
                  <button
                    onClick={() => toggleTimeAlarm(alarm.id)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                      alarm.enabled ? 'bg-white' : 'bg-[#222222]'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full transition-transform ${
                        alarm.enabled ? 'translate-x-6 bg-black' : 'translate-x-1 bg-neutral-400'
                      }`}
                    />
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => setEditingAlarm(alarm)}
                    className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-[#111111] transition-colors cursor-pointer"
                    title="Edit alarm"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteTimeAlarm(alarm.id)}
                    className="p-2 text-neutral-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete alarm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Alarm Modal */}
      {editingAlarm && (
        <EditAlarmModal alarm={editingAlarm} onClose={() => setEditingAlarm(null)} />
      )}
    </div>
  );
};

interface EditAlarmModalProps {
  alarm: TimeAlarm;
  onClose: () => void;
}

const EditAlarmModal: React.FC<EditAlarmModalProps> = ({ alarm, onClose }) => {
  const { updateTimeAlarm } = useAlarm();

  const [label, setLabel] = useState(alarm.label);
  const [hour, setHour] = useState(alarm.hour);
  const [minute, setMinute] = useState(alarm.minute);
  const [repeat, setRepeat] = useState<RepeatOption>(alarm.repeat);
  const [sound, setSound] = useState<AlarmSoundType>(alarm.sound);
  const [volume, setVolume] = useState(alarm.volume);
  const [snoozeDuration, setSnoozeDuration] = useState(alarm.snoozeDuration || 5);
  const [customDays, setCustomDays] = useState<number[]>(alarm.customDays || []);

  const handleSave = () => {
    updateTimeAlarm(alarm.id, {
      label,
      hour,
      minute,
      repeat,
      sound,
      volume,
      snoozeDuration,
      customDays,
      enabled: true,
    });
    onClose();
  };

  const toggleDay = (dayIndex: number) => {
    if (customDays.includes(dayIndex)) {
      setCustomDays(customDays.filter((d) => d !== dayIndex));
    } else {
      setCustomDays([...customDays, dayIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fadeIn">
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-white" />
            <span>Edit Alarm</span>
          </h3>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Cancel
          </button>
        </div>

        {/* Time Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Time (24-Hour Format)
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[11px] text-slate-400 font-medium">Hour (0-23)</label>
              <input
                type="number"
                min={0}
                max={23}
                value={hour}
                onChange={(e) => setHour(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-xl font-bold font-mono text-center text-lg"
              />
            </div>
            <span className="text-2xl font-bold pt-4">:</span>
            <div className="flex-1">
              <label className="text-[11px] text-slate-400 font-medium">Minute (0-59)</label>
              <input
                type="number"
                min={0}
                max={59}
                value={minute}
                onChange={(e) => setMinute(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-xl font-bold font-mono text-center text-lg"
              />
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Alarm name (e.g. Work, Gym)"
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#333333] rounded-xl text-xs sm:text-sm font-medium"
          />
        </div>

        {/* Repeat Option */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Repeat</label>
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value as RepeatOption)}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#333333] rounded-xl text-xs sm:text-sm font-medium"
          >
            <option value="once">Once</option>
            <option value="daily">Every day</option>
            <option value="weekdays">Weekdays (Mon-Fri)</option>
            <option value="weekends">Weekends (Sat-Sun)</option>
            <option value="custom">Custom Days</option>
          </select>

          {repeat === 'custom' && (
            <div className="grid grid-cols-7 gap-1 pt-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayChar, idx) => {
                const isSelected = customDays.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      isSelected
                        ? 'bg-white text-black'
                        : 'bg-[#111111] text-[#A3A3A3]'
                    }`}
                  >
                    {dayChar}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Snooze Duration */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Snooze Duration</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 5, 10, 15].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setSnoozeDuration(mins)}
                className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  snoozeDuration === mins
                    ? 'bg-white text-black border-white'
                    : 'bg-[#111111] border-[#333333] text-[#A3A3A3]'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Sound Selector */}
        <SoundSelector
          sound={sound}
          volume={volume}
          onChangeSound={setSound}
          onChangeVolume={setVolume}
        />

        {/* Save Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-[#111111] hover:bg-[#222222] rounded-xl text-xs font-bold text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2.5 px-5 bg-white hover:bg-[#E5E5E5] text-black rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

