import * as Tone from 'tone';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from './storage';

class AudioManagerClass {
  private initialized = false;
  private sfxVolume = 0.5;
  private musicVolume = 0.5;
  private muted = false;

  private sfxGain: any = null; // Tone.Gain
  private musicGain: any = null; // Tone.Gain

  private activeTrack: { id: string; gainNode: any; dispose: () => void; isMainframePrime?: boolean } | null = null;
  private transitionTrack: { id: string; gainNode: any; dispose: () => void } | null = null;
  private pendingTrack: { trackId: string; options?: any } | null = null;

  private listeners = new Set<(state: { sfxVolume: number; musicVolume: number; muted: boolean; initialized: boolean }) => void>();

  constructor() {
    // Carregar configurações salvas no localStorage
    this.sfxVolume = getStorageItem<number>(STORAGE_KEYS.SFX_VOLUME, 0.5);
    this.musicVolume = getStorageItem<number>(STORAGE_KEYS.MUSIC_VOLUME, 0.5);
    this.muted = getStorageItem<boolean>(STORAGE_KEYS.AUDIO_MUTED, false);
  }

  subscribe(listener: (state: { sfxVolume: number; musicVolume: number; muted: boolean; initialized: boolean }) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('[audio] Erro ao disparar listener de áudio:', err);
      }
    });
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      await Tone.start();
      
      // Inicializar nós do Tone.js e conectá-los ao Destination principal
      this.sfxGain = new Tone.Gain(this.sfxVolume).toDestination();
      this.musicGain = new Tone.Gain(Tone.dbToGain(-15) * this.musicVolume).toDestination();

      // Definir estado de mute global do Tone
      Tone.getDestination().mute = this.muted;

      this.initialized = true;
      console.log('[audio] AudioManager inicializado com sucesso.');
      this.notify();

      if (this.pendingTrack) {
        this.playMusic(this.pendingTrack.trackId, this.pendingTrack.options);
        this.pendingTrack = null;
      }
    } catch (error) {
      console.error('[audio] Falha ao inicializar AudioManager:', error);
    }
  }

  playSfx(id: string, options?: { volume?: number; pitch?: number; damageMultiplier?: number }): void {
    if (!this.initialized || this.muted) {
      return;
    }

    try {
      const now = Tone.now();
      // Converter volume linear (0 a 1) para ganho dB relativo se especificado
      const customVol = options?.volume !== undefined ? Tone.gainToDb(options.volume) : 0;

      if (id === 'ui.click') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.05 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol, now);
        synth.triggerAttackRelease(880, 0.04, now);
        synth.frequency.setValueAtTime(880, now);
        synth.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
        setTimeout(() => synth.dispose(), 300);
      } else if (id === 'ui.hover') {
        const synth = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.002, decay: 0.015, sustain: 0, release: 0.01 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol - 12, now);
        synth.triggerAttackRelease(600, 0.015, now);
        setTimeout(() => synth.dispose(), 300);
      } else if (id === 'ui.panel_open') {
        const filter = new Tone.Filter({ type: 'lowpass', frequency: 150 }).connect(this.sfxGain);
        const noise = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.05, decay: 0.15, sustain: 0, release: 0.1 }
        }).connect(filter);
        noise.volume.setValueAtTime(customVol, now);
        noise.triggerAttackRelease(0.15, now);
        setTimeout(() => {
          noise.dispose();
          filter.dispose();
        }, 500);
      } else if (id === 'ui.panel_close') {
        const filter = new Tone.Filter({ type: 'lowpass', frequency: 150 }).connect(this.sfxGain);
        const noise = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.01, decay: 0.12, sustain: 0, release: 0.05 }
        }).connect(filter);
        noise.volume.setValueAtTime(customVol - 3, now);
        noise.triggerAttackRelease(0.12, now);
        setTimeout(() => {
          noise.dispose();
          filter.dispose();
        }, 500);
      } else if (id === 'ui.tab_switch') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.002, decay: 0.05, sustain: 0, release: 0.05 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol, now);
        synth.triggerAttackRelease(500, 0.03, now);
        synth.triggerAttackRelease(750, 0.03, now + 0.05);
        setTimeout(() => synth.dispose(), 400);
      } else if (id === 'ui.error') {
        const osc1 = new Tone.Oscillator(120, 'triangle').connect(this.sfxGain);
        const osc2 = new Tone.Oscillator(127, 'triangle').connect(this.sfxGain);
        osc1.volume.setValueAtTime(customVol - 6, now);
        osc2.volume.setValueAtTime(customVol - 6, now);
        osc1.start(now).stop(now + 0.12);
        osc2.start(now).stop(now + 0.12);
        setTimeout(() => {
          osc1.dispose();
          osc2.dispose();
        }, 500);
      } else if (id === 'ui.notification') {
        const synth = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.002, decay: 0.06, sustain: 0, release: 0.05 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol - 3, now);
        synth.triggerAttackRelease(523.25, 0.05, now);
        synth.triggerAttackRelease(659.25, 0.08, now + 0.06);
        setTimeout(() => synth.dispose(), 500);
      } else if (id === 'ui.boot_beep') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol - 6, now);
        const pitch = options?.pitch || 1000;
        synth.triggerAttackRelease(pitch, 0.05, now);
        setTimeout(() => synth.dispose(), 300);
      } else if (id === 'combat.attack_basic') {
        const synth = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.002, decay: 0.15, sustain: 0, release: 0.1 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol, now);
        synth.triggerAttackRelease(250, 0.15, now);
        synth.frequency.exponentialRampToValueAtTime(60, now + 0.12);
        setTimeout(() => synth.dispose(), 400);
      } else if (id === 'combat.skill_damage') {
        const mult = options?.damageMultiplier || 1.0;
        const baseFreq = mult > 1.5 ? 120 : 250;
        const decayTime = mult > 1.5 ? 0.35 : 0.2;
        
        const dist = new Tone.Distortion(0.4).connect(this.sfxGain);
        const synth = new Tone.Synth({
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.005, decay: decayTime, sustain: 0, release: 0.05 }
        }).connect(dist);

        synth.volume.setValueAtTime(customVol, now);
        synth.triggerAttackRelease(baseFreq * 2, decayTime, now);
        synth.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + decayTime);
        
        setTimeout(() => {
          synth.dispose();
          dist.dispose();
        }, (decayTime + 0.2) * 1000);
      } else if (id === 'combat.skill_heal') {
        const delay = new Tone.FeedbackDelay(0.15, 0.3).connect(this.sfxGain);
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.05, decay: 0.2, sustain: 0.1, release: 0.2 }
        }).connect(delay);
        
        synth.volume.setValueAtTime(customVol - 4, now);
        synth.triggerAttackRelease(330, 0.3, now);
        synth.frequency.setValueAtTime(330, now);
        synth.frequency.exponentialRampToValueAtTime(880, now + 0.25);
        
        setTimeout(() => {
          synth.dispose();
          delay.dispose();
        }, 800);
      } else if (id === 'combat.crit_or_bonus') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol + 2, now);
        synth.triggerAttackRelease(1200, 0.06, now);
        synth.triggerAttackRelease(1800, 0.1, now + 0.05);
        setTimeout(() => synth.dispose(), 400);
      } else if (id === 'combat.status_overheat') {
        const filter = new Tone.Filter({ type: 'lowpass', frequency: 300 }).connect(this.sfxGain);
        const synth = new Tone.Synth({
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.05, decay: 0.4, sustain: 0.1, release: 0.1 }
        }).connect(filter);
        
        synth.volume.setValueAtTime(customVol, now);
        synth.triggerAttack(100, now);
        
        for (let i = 0; i < 8; i++) {
          const t = now + i * 0.05;
          filter.frequency.setValueAtTime(200 + (i % 2 === 0 ? 300 : 0), t);
        }
        
        synth.triggerRelease(now + 0.4);
        setTimeout(() => {
          synth.dispose();
          filter.dispose();
        }, 700);
      } else if (id === 'combat.status_corrosion') {
        const filter = new Tone.Filter({ type: 'bandpass', frequency: 1500, Q: 8 }).connect(this.sfxGain);
        const noise = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.02, sustain: 0, release: 0.01 }
        }).connect(filter);
        
        noise.volume.setValueAtTime(customVol - 2, now);
        noise.triggerAttackRelease(0.02, now);
        noise.triggerAttackRelease(0.02, now + 0.08);
        noise.triggerAttackRelease(0.02, now + 0.15);
        noise.triggerAttackRelease(0.02, now + 0.22);
        
        setTimeout(() => {
          noise.dispose();
          filter.dispose();
        }, 500);
      } else if (id === 'combat.status_shock') {
        const gain = new Tone.Gain(0.15).connect(this.sfxGain);
        gain.gain.setValueAtTime(Tone.dbToGain(customVol), now);
        
        const osc1 = new Tone.Oscillator(3200, 'square').connect(gain);
        const osc2 = new Tone.Oscillator(3250, 'square').connect(gain);
        
        osc1.start(now).stop(now + 0.03);
        osc2.start(now).stop(now + 0.03);
        
        osc1.start(now + 0.06).stop(now + 0.09);
        osc2.start(now + 0.06).stop(now + 0.09);
        
        osc1.start(now + 0.12).stop(now + 0.15);
        osc2.start(now + 0.12).stop(now + 0.15);
        
        setTimeout(() => {
          osc1.dispose();
          osc2.dispose();
          gain.dispose();
        }, 500);
      } else if (id === 'combat.status_stun') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.01 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol - 4, now);
        
        for (let i = 0; i < 6; i++) {
          synth.triggerAttackRelease(800 - i * 50, 0.02, now + i * 0.04);
        }
        
        setTimeout(() => synth.dispose(), 600);
      } else if (id === 'combat.damage_taken_player') {
        const filter = new Tone.Filter({ type: 'lowpass', frequency: 200 }).connect(this.sfxGain);
        const synth = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.002, decay: 0.18, sustain: 0, release: 0.05 }
        }).connect(filter);
        synth.volume.setValueAtTime(customVol, now);
        synth.triggerAttackRelease(120, 0.18, now);
        synth.frequency.setValueAtTime(120, now);
        synth.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        
        setTimeout(() => {
          synth.dispose();
          filter.dispose();
        }, 400);
      } else if (id === 'combat.damage_taken_monster') {
        const filter = new Tone.Filter({ type: 'lowpass', frequency: 450 }).connect(this.sfxGain);
        const synth = new Tone.Synth({
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.002, decay: 0.12, sustain: 0, release: 0.05 }
        }).connect(filter);
        synth.volume.setValueAtTime(customVol - 3, now);
        synth.triggerAttackRelease(200, 0.12, now);
        synth.frequency.setValueAtTime(200, now);
        synth.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        
        setTimeout(() => {
          synth.dispose();
          filter.dispose();
        }, 300);
      } else if (id === 'combat.level_up') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.02, decay: 0.2, sustain: 0.3, release: 0.5 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol, now);
        
        const base = 261.63; // C4
        synth.triggerAttackRelease(base, 0.1, now);
        synth.triggerAttackRelease(base * 1.5, 0.1, now + 0.12);
        synth.triggerAttackRelease(base * 2.0, 0.1, now + 0.24);
        synth.triggerAttackRelease(base * 2.5, 0.4, now + 0.36);
        
        setTimeout(() => synth.dispose(), 1500);
      } else if (id === 'combat.victory') {
        const poly = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.05, decay: 0.3, sustain: 0.5, release: 1.0 }
        }).connect(this.sfxGain);
        poly.volume.setValueAtTime(customVol - 2, now);
        
        const notes = [261.63, 329.63, 392.00, 493.88, 739.99];
        notes.forEach((freq, idx) => {
          poly.triggerAttack(freq, now + idx * 0.1);
        });
        poly.triggerRelease(notes, now + 1.2);
        
        setTimeout(() => poly.dispose(), 3000);
      } else if (id === 'combat.defeat') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.1, decay: 1.5, sustain: 0, release: 0.5 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol, now);
        synth.triggerAttack(300, now);
        synth.frequency.setValueAtTime(300, now);
        synth.frequency.exponentialRampToValueAtTime(40, now + 1.4);
        
        const filter = new Tone.Filter({ type: 'lowpass', frequency: 100 }).connect(this.sfxGain);
        const noise = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.5, decay: 1.0, sustain: 0, release: 0.5 }
        }).connect(filter);
        noise.volume.setValueAtTime(customVol - 6, now + 0.4);
        noise.triggerAttackRelease(1.0, now + 0.4);
        
        setTimeout(() => {
          synth.dispose();
          noise.dispose();
          filter.dispose();
        }, 2500);
      } else if (id === 'combat.boss_enrage') {
        const filter = new Tone.Filter({ type: 'lowpass', frequency: 400 }).connect(this.sfxGain);
        const dist = new Tone.Distortion(0.8).connect(filter);
        
        const synth = new Tone.Synth({
          oscillator: { type: 'square' },
          envelope: { attack: 0.1, decay: 0.8, sustain: 0.2, release: 0.4 }
        }).connect(dist);
        synth.volume.setValueAtTime(customVol, now);
        
        const noise = new Tone.NoiseSynth({
          noise: { type: 'pink' },
          envelope: { attack: 0.2, decay: 0.6, sustain: 0.1, release: 0.3 }
        }).connect(dist);
        noise.volume.setValueAtTime(customVol - 6, now);
        
        synth.triggerAttack(80, now);
        synth.frequency.linearRampToValueAtTime(160, now + 0.2);
        synth.frequency.exponentialRampToValueAtTime(50, now + 0.8);
        
        noise.triggerAttack(now);
        
        synth.triggerRelease(now + 1.0);
        noise.triggerRelease(now + 1.0);
        
        setTimeout(() => {
          synth.dispose();
          noise.dispose();
          dist.dispose();
          filter.dispose();
        }, 2000);
      } else if (id === 'combat.loot_common') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol, now);
        synth.triggerAttackRelease(440, 0.15, now);
        setTimeout(() => synth.dispose(), 300);
      } else if (id === 'combat.loot_rare') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol - 2, now);
        synth.triggerAttackRelease(440, 0.12, now);
        synth.triggerAttackRelease(587.33, 0.15, now + 0.1);
        setTimeout(() => synth.dispose(), 400);
      } else if (id === 'combat.loot_epic') {
        const delay = new Tone.FeedbackDelay(0.1, 0.2).connect(this.sfxGain);
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.002, decay: 0.15, sustain: 0, release: 0.05 }
        }).connect(delay);
        synth.volume.setValueAtTime(customVol - 3, now);
        
        synth.triggerAttackRelease(523.25, 0.1, now);
        synth.triggerAttackRelease(659.25, 0.1, now + 0.08);
        synth.triggerAttackRelease(783.99, 0.15, now + 0.16);
        
        setTimeout(() => {
          synth.dispose();
          delay.dispose();
        }, 800);
      } else if (id === 'combat.loot_legendary') {
        const delay = new Tone.FeedbackDelay(0.12, 0.25).connect(this.sfxGain);
        const poly = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.01, decay: 0.25, sustain: 0.3, release: 0.3 }
        }).connect(delay);
        poly.volume.setValueAtTime(customVol - 2, now);
        
        const notes = [523.25, 659.25, 783.99, 1046.50];
        poly.triggerAttack(notes, now);
        poly.triggerRelease(notes, now + 0.4);
        
        setTimeout(() => {
          poly.dispose();
          delay.dispose();
        }, 1200);
      } else if (id === 'combat.loot_mythic') {
        const delay = new Tone.FeedbackDelay(0.15, 0.45).connect(this.sfxGain);
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.3, sustain: 0.2, release: 0.5 }
        }).connect(delay);
        synth.volume.setValueAtTime(customVol + 1, now);
        
        synth.triggerAttack(523.25, now);
        synth.frequency.setValueAtTime(523.25, now);
        synth.frequency.exponentialRampToValueAtTime(2093.00, now + 0.25);
        synth.triggerRelease(now + 0.3);
        
        setTimeout(() => {
          synth.dispose();
          delay.dispose();
        }, 1500);
      } else if (id === 'event.puzzle_correct') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.005, decay: 0.15, sustain: 0.2, release: 0.3 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol + 2, now);
        synth.triggerAttack(520, now);
        synth.frequency.setValueAtTime(520, now);
        synth.frequency.exponentialRampToValueAtTime(1040, now + 0.1);
        synth.triggerRelease(now + 0.15);
        setTimeout(() => synth.dispose(), 500);
      } else if (id === 'event.puzzle_incorrect') {
        const filter = new Tone.Filter({ type: 'lowpass', frequency: 150 }).connect(this.sfxGain);
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.05 }
        }).connect(filter);
        synth.volume.setValueAtTime(customVol + 2, now);
        
        synth.triggerAttackRelease(90, 0.12, now);
        synth.triggerAttackRelease(80, 0.12, now + 0.15);
        
        const gain = new Tone.Gain(0.25).connect(this.sfxGain);
        gain.gain.setValueAtTime(Tone.dbToGain(customVol + 4), now + 0.28);
        
        const osc1 = new Tone.Oscillator(2800, 'square').connect(gain);
        const osc2 = new Tone.Oscillator(2850, 'square').connect(gain);
        
        osc1.start(now + 0.28).stop(now + 0.36);
        osc2.start(now + 0.28).stop(now + 0.36);
        
        osc1.start(now + 0.38).stop(now + 0.44);
        osc2.start(now + 0.38).stop(now + 0.44);
        
        setTimeout(() => {
          synth.dispose();
          filter.dispose();
          osc1.dispose();
          osc2.dispose();
          gain.dispose();
        }, 700);
      } else if (id === 'event.puzzle_skip') {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.05 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol - 4, now);
        synth.triggerAttackRelease(330, 0.05, now);
        synth.triggerAttackRelease(220, 0.08, now + 0.08);
        setTimeout(() => synth.dispose(), 300);
      } else if (id === 'event.exploration_choice') {
        const synth = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.002, decay: 0.08, sustain: 0, release: 0.02 }
        }).connect(this.sfxGain);
        synth.volume.setValueAtTime(customVol - 6, now);
        synth.triggerAttackRelease(600, 0.06, now);
        setTimeout(() => synth.dispose(), 200);
      } else if (id === 'event.achievement_unlock') {
        const delay = new Tone.FeedbackDelay(0.12, 0.3).connect(this.sfxGain);
        const poly = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.02, decay: 0.3, sustain: 0.5, release: 0.8 }
        }).connect(delay);
        poly.volume.setValueAtTime(customVol - 2, now);
        
        const base = 261.63; // C4
        const notes = [base, base * 1.25, base * 1.5, base * 1.875, base * 2.0]; // Cmaj7 arpeggio
        notes.forEach((freq, idx) => {
          poly.triggerAttack(freq, now + idx * 0.08);
        });
        poly.triggerRelease(notes, now + 1.0);
        
        setTimeout(() => {
          poly.dispose();
          delay.dispose();
        }, 2500);
      } else if (id === 'event.contract_complete') {
        const delay = new Tone.FeedbackDelay(0.08, 0.2).connect(this.sfxGain);
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.005, decay: 0.15, sustain: 0.1, release: 0.2 }
        }).connect(delay);
        synth.volume.setValueAtTime(customVol - 2, now);
        
        synth.triggerAttackRelease(523.25, 0.1, now);
        synth.triggerAttackRelease(783.99, 0.15, now + 0.08);
        synth.triggerAttackRelease(1046.50, 0.2, now + 0.16);
        
        setTimeout(() => {
          synth.dispose();
          delay.dispose();
        }, 1000);
      } else if (id === 'event.relic_upgrade') {
        const filter = new Tone.Filter({ type: 'bandpass', frequency: 1000, Q: 3 }).connect(this.sfxGain);
        const synth = new Tone.Synth({
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.1, decay: 0.4, sustain: 0.2, release: 0.4 }
        }).connect(filter);
        synth.volume.setValueAtTime(customVol - 4, now);
        
        synth.triggerAttack(220, now);
        synth.frequency.setValueAtTime(220, now);
        synth.frequency.exponentialRampToValueAtTime(880, now + 0.4);
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(3000, now + 0.4);
        
        synth.triggerRelease(now + 0.4);
        
        setTimeout(() => {
          synth.dispose();
          filter.dispose();
        }, 1000);
      } else if (id === 'event.craft_success') {
        const filter = new Tone.Filter({ type: 'highpass', frequency: 1200 }).connect(this.sfxGain);
        const metalSynth = new Tone.Synth({
          oscillator: { type: 'square' },
          envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 }
        }).connect(filter);
        metalSynth.volume.setValueAtTime(customVol + 2, now);
        metalSynth.triggerAttackRelease(2500, 0.05, now);
        
        const boom = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.002, decay: 0.3, sustain: 0, release: 0.1 }
        }).connect(this.sfxGain);
        boom.volume.setValueAtTime(customVol - 2, now);
        boom.triggerAttackRelease(120, 0.3, now);
        boom.frequency.exponentialRampToValueAtTime(40, now + 0.25);

        const rarity = options?.rarity || 'common';
        if (rarity === 'common') {
          const chime = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 }
          }).connect(this.sfxGain);
          chime.volume.setValueAtTime(customVol - 4, now + 0.05);
          chime.triggerAttackRelease(440, 0.2, now + 0.05);
          setTimeout(() => chime.dispose(), 500);
        } else if (rarity === 'rare') {
          const chime = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 }
          }).connect(this.sfxGain);
          chime.volume.setValueAtTime(customVol - 6, now + 0.05);
          chime.triggerAttackRelease(440, 0.15, now + 0.05);
          chime.triggerAttackRelease(587.33, 0.2, now + 0.15);
          setTimeout(() => chime.dispose(), 600);
        } else if (rarity === 'epic') {
          const delay = new Tone.FeedbackDelay(0.1, 0.2).connect(this.sfxGain);
          const chime = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 }
          }).connect(delay);
          chime.volume.setValueAtTime(customVol - 6, now + 0.05);
          chime.triggerAttackRelease(523.25, 0.12, now + 0.05);
          chime.triggerAttackRelease(659.25, 0.12, now + 0.13);
          chime.triggerAttackRelease(783.99, 0.2, now + 0.21);
          setTimeout(() => {
            chime.dispose();
            delay.dispose();
          }, 1000);
        } else if (rarity === 'legendary') {
          const delay = new Tone.FeedbackDelay(0.12, 0.25).connect(this.sfxGain);
          const poly = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.3 }
          }).connect(delay);
          poly.volume.setValueAtTime(customVol - 4, now + 0.05);
          const notes = [523.25, 659.25, 783.99, 1046.50];
          poly.triggerAttack(notes, now + 0.05);
          poly.triggerRelease(notes, now + 0.4);
          setTimeout(() => {
            poly.dispose();
            delay.dispose();
          }, 1200);
        } else {
          const delay = new Tone.FeedbackDelay(0.15, 0.4).connect(this.sfxGain);
          const chime = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.4, sustain: 0.2, release: 0.5 }
          }).connect(delay);
          chime.volume.setValueAtTime(customVol - 2, now + 0.05);
          chime.triggerAttack(523.25, now + 0.05);
          chime.frequency.setValueAtTime(523.25, now + 0.05);
          chime.frequency.exponentialRampToValueAtTime(2093.00, now + 0.3);
          chime.triggerRelease(now + 0.35);
          setTimeout(() => {
            chime.dispose();
            delay.dispose();
          }, 1500);
        }
        
        setTimeout(() => {
          metalSynth.dispose();
          filter.dispose();
          boom.dispose();
        }, 600);
      } else {
        console.log(`[audio] playSfx: ${id} (not yet implemented)`, options);
      }
    } catch (err) {
      console.warn(`[audio] Erro ao reproduzir sfx "${id}":`, err);
    }
  }

  private buildAmbientTrack(trackId: string, options?: { isMainframePrime?: boolean }): { id: string; gainNode: any; dispose: () => void } {
    const now = Tone.now();
    const gainNode = new Tone.Gain(0).connect(this.musicGain);
    const disposables: any[] = [];

    let bpm = 90;

    if (trackId === 'music.hub') {
      bpm = 85;
      const padFilter = new Tone.Filter({ type: 'lowpass', frequency: 600 }).connect(gainNode);
      const padSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 2.0, decay: 2.0, sustain: 0.8, release: 2.5 }
      }).connect(padFilter);
      padSynth.volume.setValueAtTime(-12, now);

      const delay = new Tone.FeedbackDelay(0.3, 0.4).connect(gainNode);
      const bellSynth = new Tone.MonoSynth({
        oscillator: { type: 'sine' },
        filter: { Q: 1, type: 'lowpass', frequency: 1200 },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.3 },
        filterEnvelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1, baseFrequency: 1000, octaves: 2 }
      }).connect(delay);
      bellSynth.volume.setValueAtTime(-14, now);

      const chords = [
        [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
        [146.83, 185.00, 220.00, 261.63], // D7 (D3, F#3, A3, C4)
        [164.81, 196.00, 246.94, 293.66], // Em7 (E3, G3, B3, D4)
        [146.83, 185.00, 220.00, 293.66], // Dsus (D3, F#3, A3, D4)
      ];
      let chordIdx = 0;
      const padLoop = new Tone.Loop((time) => {
        const currentChord = chords[chordIdx % chords.length];
        padSynth.triggerAttackRelease(currentChord, 6, time);
        chordIdx++;
      }, '8m');

      const bellNotes = [523.25, 587.33, 659.25, 739.99, 783.99, 880.00, 987.77, 1046.50];
      const bellLoop = new Tone.Loop((time) => {
        if (Math.random() < 0.6) {
          const note = bellNotes[Math.floor(Math.random() * bellNotes.length)];
          bellSynth.triggerAttackRelease(note, 0.4, time);
        }
      }, '2n');

      padLoop.start(now);
      bellLoop.start(now);

      disposables.push(padFilter, padSynth, delay, bellSynth, padLoop, bellLoop);

    } else if (trackId === 'music.sector_toxic_refinery') {
      bpm = 110;
      const droneFilter = new Tone.Filter({ type: 'lowpass', frequency: 120 }).connect(gainNode);
      const droneLFO = new Tone.LFO(0.2, 60, 150).connect(droneFilter.frequency);
      const droneSynth = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 2.0, decay: 1.0, sustain: 1.0, release: 2.0 }
      }).connect(droneFilter);
      droneSynth.volume.setValueAtTime(-14, now);
      droneLFO.start(now);
      droneSynth.triggerAttack(82.41, now);

      const acidFilter = new Tone.Filter({ type: 'lowpass', frequency: 300, Q: 8 }).connect(gainNode);
      const acidSynth = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.002, decay: 0.1, sustain: 0, release: 0.05 }
      }).connect(acidFilter);
      acidSynth.volume.setValueAtTime(-20, now);

      const acidPattern = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0];
      let acidIdx = 0;
      const acidNotes = [82.41, 87.31, 98.00, 110.00];
      const acidLoop = new Tone.Loop((time) => {
        if (acidPattern[acidIdx % acidPattern.length] === 1 && Math.random() < 0.8) {
          const note = acidNotes[Math.floor(Math.random() * acidNotes.length)];
          acidFilter.frequency.setValueAtTime(200 + Math.random() * 600, time);
          acidSynth.triggerAttackRelease(note, 0.08, time);
        }
        acidIdx++;
      }, '16n');

      const dripDelay = new Tone.FeedbackDelay(0.2, 0.3).connect(gainNode);
      const dripSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
      }).connect(dripDelay);
      dripSynth.volume.setValueAtTime(-16, now);
      const dripLoop = new Tone.Loop((time) => {
        if (Math.random() < 0.4) {
          const freq = 2000 + Math.random() * 3000;
          dripSynth.triggerAttackRelease(freq, 0.02, time);
        }
      }, '4n');

      acidLoop.start(now);
      dripLoop.start(now);

      disposables.push(droneFilter, droneLFO, droneSynth, acidFilter, acidSynth, acidLoop, dripDelay, dripSynth, dripLoop);

    } else if (trackId === 'music.sector_frozen_datacore') {
      bpm = 95;
      const delay = new Tone.PingPongDelay(0.4, 0.5).connect(gainNode);
      const padSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 3.0, decay: 2.0, sustain: 0.8, release: 3.0 }
      }).connect(delay);
      padSynth.volume.setValueAtTime(-15, now);
      padSynth.set({ detune: 15 });

      const frozenChords = [
        [146.83, 174.61, 220.00, 261.63], // Dm7 (D3, F3, A3, C4)
        [164.81, 196.00, 246.94, 293.66], // Em7 (E3, G3, B3, D4)
        [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
        [196.00, 246.94, 293.66, 349.23], // G7 (G3, B3, D4, F4)
      ];
      let frozenChordIdx = 0;
      const frozenPadLoop = new Tone.Loop((time) => {
        const chord = frozenChords[frozenChordIdx % frozenChords.length];
        padSynth.triggerAttackRelease(chord, 6, time);
        frozenChordIdx++;
      }, '8m');

      const panner = new Tone.Panner().connect(gainNode);
      const coldSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
      }).connect(panner);
      coldSynth.volume.setValueAtTime(-18, now);

      const coldNotes = [587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
      const coldLoop = new Tone.Loop((time) => {
        if (Math.random() < 0.5) {
          const note = coldNotes[Math.floor(Math.random() * coldNotes.length)];
          panner.pan.setValueAtTime(Math.random() * 2 - 1, time);
          coldSynth.triggerAttackRelease(note, 0.05, time);
        }
      }, '4n');

      frozenPadLoop.start(now);
      coldLoop.start(now);

      disposables.push(delay, padSynth, frozenPadLoop, panner, coldSynth, coldLoop);

    } else if (trackId === 'music.sector_plasma_furnace') {
      bpm = 130;
      const bassDist = new Tone.Distortion(0.3).connect(gainNode);
      const bassFilter = new Tone.Filter({ type: 'lowpass', frequency: 250 }).connect(bassDist);
      const bassSynth = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.15, sustain: 0.4, release: 0.1 }
      }).connect(bassFilter);
      bassSynth.volume.setValueAtTime(-14, now);

      const locrianNotes = [123.47, 130.81, 146.83, 164.81, 174.61, 196.00, 220.00];
      let arpeggioIdx = 0;
      const bassLoop = new Tone.Loop((time) => {
        const note = locrianNotes[arpeggioIdx % locrianNotes.length];
        bassSynth.triggerAttackRelease(note, 0.12, time);
        arpeggioIdx++;
      }, '8n');

      const pulseFilter = new Tone.Filter({ type: 'lowpass', frequency: 150 }).connect(gainNode);
      const pulseNoise = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 0.05, decay: 0.4, sustain: 0, release: 0.2 }
      }).connect(pulseFilter);
      pulseNoise.volume.setValueAtTime(-18, now);
      const pulseLoop = new Tone.Loop((time) => {
        pulseNoise.triggerAttackRelease(0.4, time);
      }, '1m');

      const leadFilter = new Tone.Filter({ type: 'bandpass', frequency: 1200, Q: 3 }).connect(gainNode);
      const leadSynth = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.6, release: 0.4 }
      }).connect(leadFilter);
      leadSynth.volume.setValueAtTime(-20, now);
      const leadNotes = [246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
      const leadLoop = new Tone.Loop((time) => {
        if (Math.random() < 0.4) {
          const note = leadNotes[Math.floor(Math.random() * leadNotes.length)];
          leadSynth.triggerAttackRelease(note, 0.5, time);
        }
      }, '2n');

      bassLoop.start(now);
      pulseLoop.start(now);
      leadLoop.start(now);

      disposables.push(bassDist, bassFilter, bassSynth, bassLoop, pulseFilter, pulseNoise, pulseLoop, leadFilter, leadSynth, leadLoop);

    } else if (trackId === 'music.boss_theme') {
      bpm = 140;
      const formantFilter = new Tone.Filter({ type: 'bandpass', frequency: 600, Q: 4 }).connect(gainNode);
      const choirSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'square' },
        envelope: { attack: 1.0, decay: 1.0, sustain: 0.8, release: 1.5 }
      }).connect(formantFilter);
      
      choirSynth.volume.setValueAtTime(options?.isMainframePrime ? -13 : -16, now);

      const bossChords = [
        [130.81, 164.81, 207.65, 261.63], // Whole tone chord (C3, E3, G#3, C4)
        [146.83, 185.00, 233.08, 293.66], // D, F#, A#, D
        [164.81, 207.65, 261.63, 329.63], // E, G#, C, E
      ];
      let bossChordIdx = 0;
      const choirLoop = new Tone.Loop((time) => {
        const chord = bossChords[bossChordIdx % bossChords.length];
        choirSynth.triggerAttackRelease(chord, 3.5, time);
        formantFilter.frequency.setValueAtTime(500 + Math.sin(time) * 200, time);
        bossChordIdx++;
      }, '4m');

      const bassDist = new Tone.Distortion(0.6).connect(gainNode);
      const bassFilter = new Tone.Filter({ type: 'lowpass', frequency: 180 }).connect(bassDist);
      const bass1 = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.05, decay: 0.4, sustain: 0.8, release: 0.4 }
      }).connect(bassFilter);
      const bass2 = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.05, decay: 0.4, sustain: 0.8, release: 0.4 }
      }).connect(bassFilter);
      bass1.volume.setValueAtTime(-14, now);
      bass2.volume.setValueAtTime(-10, now);

      const bassNotes = [65.41, 73.42, 82.41, 92.50, 103.83, 116.54];
      let bassIdx = 0;
      const bassLoop = new Tone.Loop((time) => {
        const note = bassNotes[bassIdx % bassNotes.length];
        bass1.triggerAttackRelease(note, 0.25, time);
        bass2.triggerAttackRelease(note * 0.5, 0.25, time);
        bassIdx++;
      }, '4n');

      const leadDist = new Tone.Distortion(0.4).connect(gainNode);
      const leadSynth = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.1 }
      }).connect(leadDist);
      leadSynth.volume.setValueAtTime(-20, now);

      const leadNotes = [261.63, 293.66, 329.63, 369.99, 415.30, 466.16];
      const leadLoop = new Tone.Loop((time) => {
        if (Math.random() < 0.6) {
          const note = leadNotes[Math.floor(Math.random() * leadNotes.length)];
          leadSynth.triggerAttackRelease(note, 0.1, time);
        }
      }, '8n');

      choirLoop.start(now);
      bassLoop.start(now);
      leadLoop.start(now);

      disposables.push(formantFilter, choirSynth, choirLoop, bassDist, bassFilter, bass1, bass2, bassLoop, leadDist, leadSynth, leadLoop);

      if (options?.isMainframePrime) {
        const fastSynth = new Tone.Synth({
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
        }).connect(gainNode);
        fastSynth.volume.setValueAtTime(-22, now);
        let fastIdx = 0;
        const arpeggioLoop = new Tone.Loop((time) => {
          const note = leadNotes[fastIdx % leadNotes.length];
          fastSynth.triggerAttackRelease(note * 2, 0.04, time);
          fastIdx++;
        }, '16n');
        arpeggioLoop.start(now);
        disposables.push(fastSynth, arpeggioLoop);
      }
    }

    Tone.Transport.bpm.value = bpm;

    const dispose = () => {
      disposables.forEach(item => {
        try {
          if (item.stop) item.stop();
        } catch (e) {}
        try {
          item.dispose();
        } catch (e) {}
      });
      try {
        gainNode.disconnect();
        gainNode.dispose();
      } catch (e) {}
    };

    return { id: trackId, gainNode, dispose };
  }

  playMusic(trackId: string, options?: { fadeInSeconds?: number; isMainframePrime?: boolean }): void {
    if (!this.initialized) {
      this.pendingTrack = { trackId, options };
      return;
    }

    if (this.activeTrack && this.activeTrack.id === trackId) {
      if (trackId === 'music.boss_theme' && options?.isMainframePrime && !this.activeTrack.isMainframePrime) {
        // Upgrade theme
      } else {
        return;
      }
    }

    try {
      if (Tone.Transport.state !== 'started') {
        Tone.Transport.start();
      }

      const now = Tone.now();
      const fadeTime = options?.fadeInSeconds !== undefined ? options.fadeInSeconds : 1.5;

      if (this.activeTrack) {
        if (this.transitionTrack) {
          try {
            this.transitionTrack.dispose();
          } catch (e) {}
        }
        this.transitionTrack = this.activeTrack;
        const t = this.transitionTrack;
        try {
          t.gainNode.gain.setValueAtTime(t.gainNode.gain.value, now);
          t.gainNode.gain.linearRampToValueAtTime(0, now + fadeTime);
        } catch (e) {}
        
        setTimeout(() => {
          try {
            t.dispose();
            if (this.transitionTrack === t) {
              this.transitionTrack = null;
            }
          } catch (e) {}
        }, fadeTime * 1000 + 100);
      }

      const newTrackObj = this.buildAmbientTrack(trackId, options);
      this.activeTrack = {
        id: trackId,
        gainNode: newTrackObj.gainNode,
        dispose: newTrackObj.dispose,
        isMainframePrime: options?.isMainframePrime || false
      };

      const targetDb = (trackId === 'music.boss_theme' && options?.isMainframePrime) ? -17 : -20;
      newTrackObj.gainNode.gain.setValueAtTime(0, now);
      newTrackObj.gainNode.gain.linearRampToValueAtTime(Tone.dbToGain(targetDb), now + fadeTime);

      console.log(`[audio] playMusic started: ${trackId}`, options);
    } catch (err) {
      console.warn('[audio] Error in playMusic:', err);
    }
  }

  stopMusic(fadeOutSeconds?: number): void {
    if (!this.initialized) {
      this.pendingTrack = null;
      return;
    }

    const fadeTime = fadeOutSeconds !== undefined ? fadeOutSeconds : 1.5;
    const now = Tone.now();

    if (this.activeTrack) {
      const t = this.activeTrack;
      try {
        t.gainNode.gain.setValueAtTime(t.gainNode.gain.value, now);
        t.gainNode.gain.linearRampToValueAtTime(0, now + fadeTime);
      } catch (e) {}

      setTimeout(() => {
        try {
          t.dispose();
          if (this.activeTrack === t) {
            this.activeTrack = null;
          }
        } catch (e) {}
      }, fadeTime * 1000 + 100);
    }
  }

  setSfxVolume(value: number): void {
    const vol = Math.max(0, Math.min(1, value));
    this.sfxVolume = vol;
    setStorageItem(STORAGE_KEYS.SFX_VOLUME, vol);

    if (this.initialized && this.sfxGain) {
      try {
        this.sfxGain.gain.setValueAtTime(vol, Tone.now());
      } catch (error) {
        console.warn('[audio] Erro ao setar volume sfx no Tone:', error);
      }
    }
    this.notify();
  }

  setMusicVolume(value: number): void {
    const vol = Math.max(0, Math.min(1, value));
    this.musicVolume = vol;
    setStorageItem(STORAGE_KEYS.MUSIC_VOLUME, vol);

    if (this.initialized && this.musicGain) {
      try {
        this.musicGain.gain.setValueAtTime(Tone.dbToGain(-15) * vol, Tone.now());
      } catch (error) {
        console.warn('[audio] Erro ao setar volume música no Tone:', error);
      }
    }
    this.notify();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    setStorageItem(STORAGE_KEYS.AUDIO_MUTED, muted);

    // Muta no Tone.js Destination globalmente
    try {
      Tone.getDestination().mute = muted;
    } catch (error) {
      console.warn('[audio] Erro ao aplicar mute global:', error);
    }
    this.notify();
  }

  getState() {
    return {
      sfxVolume: this.sfxVolume,
      musicVolume: this.musicVolume,
      muted: this.muted,
      initialized: this.initialized,
    };
  }
}

export const AudioManager = new AudioManagerClass();
