import type { RepeatOption } from '../types';

/**
 * Calculates the exact next millisecond timestamp for an alarm based on time and repeat rules.
 */
export function calculateNextRingTimestamp(
  hour: number,
  minute: number,
  repeat: RepeatOption = 'once',
  customDays: number[] = [],
  fromDate: Date = new Date()
): number {
  const target = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate(),
    hour,
    minute,
    0,
    0
  );

  const nowMs = fromDate.getTime();

  if (repeat === 'once' || repeat === 'daily') {
    if (target.getTime() <= nowMs) {
      target.setDate(target.getDate() + 1);
    }
    return target.getTime();
  }

  if (repeat === 'weekdays') {
    // Weekdays = Mon (1), Tue (2), Wed (3), Thu (4), Fri (5)
    while (target.getTime() <= nowMs || target.getDay() === 0 || target.getDay() === 6) {
      target.setDate(target.getDate() + 1);
    }
    return target.getTime();
  }

  if (repeat === 'weekends') {
    // Weekends = Sun (0), Sat (6)
    while (target.getTime() <= nowMs || (target.getDay() !== 0 && target.getDay() !== 6)) {
      target.setDate(target.getDate() + 1);
    }
    return target.getTime();
  }

  if (repeat === 'custom') {
    if (!customDays || customDays.length === 0) {
      if (target.getTime() <= nowMs) {
        target.setDate(target.getDate() + 1);
      }
      return target.getTime();
    }

    while (target.getTime() <= nowMs || !customDays.includes(target.getDay())) {
      target.setDate(target.getDate() + 1);
    }
    return target.getTime();
  }

  return target.getTime();
}

/**
 * Returns a human-friendly live countdown string such as "Alarm in 2 hours 15 minutes".
 */
export function getCountdownText(nextRingTimestamp: number, currentMs: number = Date.now()): string {
  const diffMs = nextRingTimestamp - currentMs;
  if (diffMs <= 0) {
    return 'Ringing now...';
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  if (totalMinutes < 1) {
    return 'Alarm in less than a minute';
  }

  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);

  return `Alarm in ${parts.join(' ')}`;
}

/**
 * Formats 24h hour & minute to 12-hour or 24-hour string representation.
 */
export function formatTime(hour: number, minute: number, is12H: boolean = true): { timeStr: string; period?: string } {
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (!is12H) {
    return { timeStr: `${pad(hour)}:${pad(minute)}` };
  }

  const period = hour >= 12 ? 'PM' : 'AM';
  let h12 = hour % 12;
  if (h12 === 0) h12 = 12;

  return {
    timeStr: `${pad(h12)}:${pad(minute)}`,
    period,
  };
}

/**
 * Returns human-readable label for repeat options.
 */
export function getRepeatLabel(repeat: RepeatOption, customDays: number[] = []): string {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  switch (repeat) {
    case 'once':
      return 'Once';
    case 'daily':
      return 'Every day';
    case 'weekdays':
      return 'Weekdays (Mon-Fri)';
    case 'weekends':
      return 'Weekends (Sat-Sun)';
    case 'custom':
      if (!customDays || customDays.length === 0) return 'Custom';
      if (customDays.length === 7) return 'Every day';
      const sorted = [...customDays].sort((a, b) => a - b);
      return sorted.map((d) => dayNames[d]).join(', ');
    default:
      return 'Once';
  }
}
