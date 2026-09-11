import type { AlarmSoundType } from '../types';

let audioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let activeGainNodes: GainNode[] = [];
let soundLoopInterval: number | null = null;
let unlockListenerAdded = false;

/**
 * Initializes and unlocks AudioContext upon user interaction to prevent browser autoplay blocks.
 */
export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  return audioCtx;
}

// Auto-unlock AudioContext on first click/touch/keydown
if (typeof window !== 'undefined' && !unlockListenerAdded) {
  unlockListenerAdded = true;
  const unlockAudio = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    } else if (!audioCtx) {
      getAudioContext();
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };

  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
}

/**
 * Stops all actively playing Web Audio oscillators and loop intervals.
 */
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
      // Ignore if already stopped
    }
  });
  activeOscillators = [];

  activeGainNodes.forEach((gain) => {
    try {
      gain.disconnect();
    } catch {
      // Ignore
    }
  });
  activeGainNodes = [];
}

/**
 * Sound definitions for all 10 distinct alarm sounds using Web Audio API synthesis.
 */
export function playAlarmSound(
  soundType: AlarmSoundType = 'classic',
  volumePercent: number = 80,
  durationSeconds: number = 0 // 0 means loop continuously until stopped
) {
  stopAlarmSound();

  const ctx = getAudioContext();
  const baseVol = Math.max(0.01, Math.min(1.0, volumePercent / 100));

  const triggerSoundPattern = () => {
    const now = ctx.currentTime;

    switch (soundType) {
      case 'classic':
      case 'default':
        // Classic dual-tone alternating chime (750Hz & 950Hz)
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
        break;

      case 'loud_beep':
        // High gain piercing 1200Hz pulse
        {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1200, now);
          gain.gain.setValueAtTime(baseVol * 0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
          activeOscillators.push(osc);
          activeGainNodes.push(gain);
        }
        break;

      case 'digital':
        // Ascending 3-step digital beep (600Hz -> 900Hz -> 1200Hz)
        [600, 900, 1200].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(baseVol * 0.4, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.07);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.07);
          activeOscillators.push(osc);
          activeGainNodes.push(gain);
        });
        break;

      case 'high_pitch':
        // High pitch 2400Hz sharp sine tone
        {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2400, now);
          gain.gain.setValueAtTime(baseVol * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          activeOscillators.push(osc);
          activeGainNodes.push(gain);
        }
        break;

      case 'rapid_beep':
        // Fast 4x 1500Hz staccato pulse
        [0, 0.08, 0.16, 0.24].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1500, now + delay);
          gain.gain.setValueAtTime(baseVol * 0.6, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.05);
          activeOscillators.push(osc);
          activeGainNodes.push(gain);
        });
        break;

      case 'emergency':
      case 'siren':
        // Sweeping warble 500Hz -> 1800Hz sawtooth siren
        {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(500, now);
          osc.frequency.linearRampToValueAtTime(1800, now + 0.25);
          osc.frequency.linearRampToValueAtTime(500, now + 0.5);
          gain.gain.setValueAtTime(baseVol * 0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.5);
          activeOscillators.push(osc);
          activeGainNodes.push(gain);
        }
        break;

      case 'bell':
        // Gentle bell chime (C5 523.25Hz triangle wave with long decay)
        {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now);
          gain.gain.setValueAtTime(baseVol * 0.9, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.2);
          activeOscillators.push(osc);
          activeGainNodes.push(gain);
        }
        break;

      case 'electronic':
        // 8-bit retro arpeggio (E5 659Hz, G#5 830Hz, B5 987Hz)
        [659.25, 830.61, 987.77, 1318.51].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(baseVol * 0.35, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.06);
          activeOscillators.push(osc);
          activeGainNodes.push(gain);
        });
        break;

      case 'morning':
        // Soothing 2-step harmonic chime (C5 523Hz -> G5 784Hz soft sine)
        [523.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.25);
          gain.gain.setValueAtTime(baseVol * 0.5, now + idx * 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.25 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.25);
          osc.stop(now + idx * 0.25 + 0.6);
          activeOscillators.push(osc);
          activeGainNodes.push(gain);
        });
        break;

      case 'double_beep':
        // Classic double beep pulse (1000Hz)
        [0, 0.12].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1000, now + delay);
          gain.gain.setValueAtTime(baseVol * 0.65, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.08);
          activeOscillators.push(osc);
          activeGainNodes.push(gain);
        });
        break;
    }
  };

  // Trigger immediate pattern
  triggerSoundPattern();

  // Determine loop interval based on sound type
  const intervalMs = soundType === 'bell' || soundType === 'morning' ? 1400 : 750;
  soundLoopInterval = window.setInterval(triggerSoundPattern, intervalMs);

  // Auto stop after duration if specified
  if (durationSeconds > 0) {
    setTimeout(() => {
      stopAlarmSound();
    }, durationSeconds * 1000);
  }
}

/**
 * Preview sound for 3 seconds.
 */
export function testSound(soundType: AlarmSoundType, volumePercent: number = 80) {
  playAlarmSound(soundType, volumePercent, 3);
}

/**
 * Triggers device vibration pattern if supported.
 */
export function triggerVibration() {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([500, 250, 500, 250, 800]);
    } catch {
      // Ignore if blocked by browser
    }
  }
}
