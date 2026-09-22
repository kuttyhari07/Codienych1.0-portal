// Web Audio API Synthesizer for high-tech sci-fi UI sound effects (Zero external files)
let audioCtx = null;
let soundEnabled = true;

const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  return soundEnabled;
};

export const isSoundEnabled = () => soundEnabled;

// Subtle Sci-Fi Laser Blip on hover
export const playLaserBlip = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
};

// Sci-Fi Decrypt Chirp
export const playChirp = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.03);
    osc.frequency.setValueAtTime(2000, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore
  }
};

// Grand Victory Chime on Vault Unlock & Game Win
export const playVictoryFanfare = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
    });
  } catch (e) {
    // Ignore
  }
};

// AI Cyber Voice Speech Synthesis for Intel Audio Stream
export const stopIntelSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
};

export const speakIntelTransmission = (text, onStart, onEnd) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();

    // Clean up text and add subtle natural pauses for crystal clear pronunciation
    const cleanText = text
      .replace(/₹/g, 'Rupees ')
      .replace(/@CUB/gi, ' at C U B')
      .replace(/UG/g, 'Undergraduate')
      .replace(/ESEC/g, 'E S E C')
      .replace(/24-HR/gi, '24 hour')
      .replace(/\(/g, ', ')
      .replace(/\)/g, ', ')
      .replace(/\//g, ' and ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    // Relaxed, clear and steady speaking speed (0.85 for clear human pace)
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prefer high quality calm natural English voices (Google, Natural, Samantha, Microsoft)
    const naturalVoice = voices.find(
      (v) =>
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Zira')) &&
        v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('[Speech Synthesis Warning]', e);
    if (onEnd) onEnd();
  }
};

// --- PIRATE DJ WEB AUDIO SYNTHESIZERS ---

// Deep 808 Sub-Bass Drop
export const playBassDrop = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Pitch drop from 180Hz down to 35Hz
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.85);

    // Punchy attack and sub sustain
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.9);
  } catch (e) {
    // Ignore audio errors
  }
};

// Iconic Club / Festival DJ Reggae Airhorn (3 quick stabs + 1 trail)
export const playAirhorn = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const baseFreqs = [466.16, 587.33]; // Bb4 and D5 for rich brass tone
    const stabs = [
      { start: 0.0, dur: 0.1 },
      { start: 0.14, dur: 0.1 },
      { start: 0.28, dur: 0.1 },
      { start: 0.42, dur: 0.35 }
    ];

    const now = ctx.currentTime;

    stabs.forEach((stab) => {
      baseFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + stab.start);
        osc.frequency.linearRampToValueAtTime(freq * 1.02, now + stab.start + stab.dur);

        gain.gain.setValueAtTime(0.08, now + stab.start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + stab.start + stab.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + stab.start);
        osc.stop(now + stab.start + stab.dur);
      });
    });
  } catch (e) {
    // Ignore audio errors
  }
};

// Electro Laser Sweep Zap
export const playLaserSweep = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(3200, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.28);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  } catch (e) {
    // Ignore audio errors
  }
};

