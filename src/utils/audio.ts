import type { AlarmSoundType } from '../types';

let audioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let activeGainNodes: GainNode[] = [];
let soundLoopInterval: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAlarmSound() {
  if (soundLoopInterval !== null) {
    clearInterval(soundLoopInterval);
    soundLoopInterval = null;
  }
  
  activeOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // ignore if already stopped
    }
  });
  activeOscillators = [];

  activeGainNodes.forEach((gain) => {
    try {
      gain.disconnect();
    } catch {
      // ignore
    }
  });
  activeGainNodes = [];
}

export function playAlarmSound(
  soundType: AlarmSoundType = 'default',
  volumePercent: number = 80,
  durationSeconds: number = 0 // 0 means loop until stopped
) {
  stopAlarmSound();

  const ctx = getAudioContext();
  const baseVol = Math.max(0, Math.min(1, volumePercent / 100));

  const triggerBeepPulse = () => {
    const now = ctx.currentTime;

    if (soundType === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      gain.gain.setValueAtTime(baseVol * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
      activeOscillators.push(osc);
      activeGainNodes.push(gain);
    } else if (soundType === 'digital') {
      [600, 900, 1200].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(baseVol * 0.3, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.07);
        activeOscillators.push(osc);
        activeGainNodes.push(gain);
      });
    } else if (soundType === 'bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      gain.gain.setValueAtTime(baseVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
      activeOscillators.push(osc);
      activeGainNodes.push(gain);
    } else if (soundType === 'siren') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.3);
      osc.frequency.linearRampToValueAtTime(440, now + 0.6);
      gain.gain.setValueAtTime(baseVol * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
      activeOscillators.push(osc);
      activeGainNodes.push(gain);
    } else {
      // Default standard alarm (dual pulse)
      [750, 950].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(baseVol * 0.6, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.12);
        activeOscillators.push(osc);
        activeGainNodes.push(gain);
      });
    }
  };

  // Immediate start
  triggerBeepPulse();

  // Loop sound every 800ms
  soundLoopInterval = window.setInterval(triggerBeepPulse, 800);

  // Auto stop timer if duration specified
  if (durationSeconds > 0) {
    setTimeout(() => {
      stopAlarmSound();
    }, durationSeconds * 1000);
  }
}

export function testSound(soundType: AlarmSoundType, volumePercent: number = 80) {
  playAlarmSound(soundType, volumePercent, 3); // Test plays for 3 seconds
}

export function triggerVibration() {
  if ('vibrate' in navigator) {
    try {
      // Pattern: vibrate 500ms, pause 250ms, vibrate 500ms, pause 250ms, vibrate 800ms
      navigator.vibrate([500, 250, 500, 250, 800]);
    } catch {
      // ignore if blocked by browser
    }
  }
}
