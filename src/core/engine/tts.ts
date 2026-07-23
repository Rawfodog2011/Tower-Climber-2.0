import { getLanguage, Language } from './translation';
import { AudioManager } from './audio';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from './storage';

export interface TTSState {
  speaking: boolean;
  currentText: string | null;
  speakingId: string | null;
  gender: 'male' | 'female';
  selectedVoiceURI: string | null;
  activeVoiceName: string | null;
}

type TTSListener = (state: TTSState) => void;

const TTS_VOICE_STORAGE_KEY = 'cyberpunk_tts_voice_uri';

class TTSEngine {
  private listeners: Set<TTSListener> = new Set();
  private genderPreference: 'male' | 'female' = 'male';
  private selectedVoiceURI: string | null = null;
  private currentState: TTSState = {
    speaking: false,
    currentText: null,
    speakingId: null,
    gender: 'male',
    selectedVoiceURI: null,
    activeVoiceName: null
  };
  private voicesCache: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.selectedVoiceURI = getStorageItem<string | null>(TTS_VOICE_STORAGE_KEY, null);
    this.currentState.selectedVoiceURI = this.selectedVoiceURI;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voicesCache = window.speechSynthesis.getVoices();
        this.updateActiveVoiceName();
        this.notify();
      };
      // Initial fetch
      this.voicesCache = window.speechSynthesis.getVoices();
      
      window.addEventListener('languagechange', () => {
        if (this.currentState.speaking) {
          this.stop();
        }
      });
    }
  }

  public subscribe(listener: TTSListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.currentState });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    // Clone the state object so that React hooks detect the change
    const stateSnapshot = { ...this.currentState };
    this.listeners.forEach((listener) => listener(stateSnapshot));
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getState(): TTSState {
    return { ...this.currentState };
  }

  public setGenderPreference(gender: 'male' | 'female') {
    this.genderPreference = gender;
    this.currentState.gender = gender;
    // Clear manual voice override if toggling gender auto mode
    this.selectedVoiceURI = null;
    this.currentState.selectedVoiceURI = null;
    setStorageItem(TTS_VOICE_STORAGE_KEY, null);
    this.updateActiveVoiceName();
    this.notify();
  }

  public getGenderPreference(): 'male' | 'female' {
    return this.genderPreference;
  }

  public setSelectedVoiceURI(uri: string | null) {
    this.selectedVoiceURI = uri;
    this.currentState.selectedVoiceURI = uri;
    setStorageItem(TTS_VOICE_STORAGE_KEY, uri);
    this.updateActiveVoiceName();
    this.notify();
  }

  public getSelectedVoiceURI(): string | null {
    return this.selectedVoiceURI;
  }

  public getAllVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported()) return [];
    if (this.voicesCache.length === 0) {
      this.voicesCache = window.speechSynthesis.getVoices();
    }
    return this.voicesCache;
  }

  private updateActiveVoiceName() {
    const voice = this.getBestVoice(getLanguage(), this.genderPreference);
    this.currentState.activeVoiceName = voice ? voice.name : null;
  }

  /**
   * Clean text for natural speech reading
   */
  private cleanText(rawText: string): string {
    return rawText
      .replace(/<[^>]*>/g, '') // strip HTML tags
      .replace(/\[[^\]]*\]/g, '') // strip bracketed tags like [REVERSO]
      .replace(/SYS\.EXE\s*\/\/\s*EXEC/gi, '') // strip system prompt noise
      .replace(/\\n/g, '. ')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Helper to identify if a voice is male
   */
  public isVoiceMale(voice: SpeechSynthesisVoice): boolean {
    const name = voice.name.toLowerCase();
    const maleKeywords = [
      'male', 'masculin', 'homem', 'guy', 'man', 'daniel', 'felipe', 'luciano', 'helio',
      'ricardo', 'antonio', 'david', 'mark', 'george', 'alex', 'james', 'stefan', 'paul',
      'diego', 'sergio', 'jorge', 'gustavo', 'rodrigo', 'pedro', 'tiago', 'carlos', 'henrique',
      'marcelo', 'bruno', 'fabio', 'gabriel', 'alessandro', 'lucas', 'gould', 'fred'
    ];
    const femaleKeywords = [
      'female', 'feminin', 'mulher', 'zira', 'hazel', 'susan', 'victoria', 'luciana', 'fiona',
      'helena', 'maria', 'francisca', 'yuki', 'woman', 'girl', 'leticia', 'ana', 'julia',
      'fernanda', 'camila', 'raquel', 'soraia', 'samanta', 'joana', 'catia', 'inês', 'clara'
    ];
    if (maleKeywords.some((kw) => name.includes(kw))) return true;
    if (femaleKeywords.some((kw) => name.includes(kw))) return false;
    // Default heuristics
    return false;
  }

  /**
   * Get the best voice matching language, selected voice URI or male/female preference
   */
  public getBestVoice(lang: Language, gender: 'male' | 'female' = 'male'): SpeechSynthesisVoice | null {
    if (!this.isSupported()) return null;
    const voices = this.getAllVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Explicit voice URI set by user
    if (this.selectedVoiceURI) {
      const custom = voices.find((v) => v.voiceURI === this.selectedVoiceURI || v.name === this.selectedVoiceURI);
      if (custom) return custom;
    }

    const targetLang = lang === 'pt' ? 'pt' : 'en';
    const preferredLocales = lang === 'pt' ? ['pt-br', 'pt-pt', 'pt'] : ['en-us', 'en-gb', 'en'];

    // Filter by matching language locale
    const langVoices = voices.filter((v) =>
      preferredLocales.some((loc) => v.lang.toLowerCase().replace('_', '-') === loc) ||
      v.lang.toLowerCase().startsWith(targetLang)
    );

    const candidates = langVoices.length > 0 ? langVoices : voices;

    if (gender === 'male') {
      // 1. Explicit male voice in requested language
      const maleLangVoice = candidates.find((v) => this.isVoiceMale(v));
      if (maleLangVoice) return maleLangVoice;

      // 2. Search male voice across ALL installed voices (e.g., if OS has English male voice)
      const globalMaleVoice = voices.find((v) => this.isVoiceMale(v));
      if (globalMaleVoice) return globalMaleVoice;

      // 3. Any voice that does not explicitly match female keywords
      const nonFemaleVoice = candidates.find((v) => {
        const nameLower = v.name.toLowerCase();
        return !['female', 'feminin', 'mulher', 'zira', 'hazel', 'luciana', 'victoria', 'maria', 'francisca', 'ana', 'julia', 'camila'].some((kw) => nameLower.includes(kw));
      });
      if (nonFemaleVoice) return nonFemaleVoice;
    } else {
      // Female preference
      const femaleVoice = candidates.find((v) => {
        const nameLower = v.name.toLowerCase();
        return ['female', 'feminin', 'mulher', 'zira', 'hazel', 'susan', 'victoria', 'luciana', 'fiona', 'helena', 'maria', 'francisca', 'ana', 'julia', 'camila'].some((kw) => nameLower.includes(kw));
      });
      if (femaleVoice) return femaleVoice;
    }

    return candidates[0] || voices[0] || null;
  }

  /**
   * Speak a given text string out loud using the selected language voice
   */
  public speak(text: string, id: string = 'default', langOverride?: Language): boolean {
    if (!this.isSupported()) return false;

    // If currently speaking this exact ID, toggle off (stop)
    if (this.currentState.speaking && this.currentState.speakingId === id) {
      this.stop();
      return false;
    }

    // Stop any ongoing speech
    this.stop();

    const textToSpeak = this.cleanText(text);
    if (!textToSpeak) return false;

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const appLang = langOverride || getLanguage();
      const voice = this.getBestVoice(appLang, this.genderPreference);

      utterance.lang = appLang === 'pt' ? 'pt-BR' : 'en-US';
      if (voice) {
        utterance.voice = voice;
        // If voice has a language set, align utterance language
        if (voice.lang) utterance.lang = voice.lang;
      }

      const isVoiceMale = voice ? this.isVoiceMale(voice) : false;

      if (this.genderPreference === 'male') {
        if (isVoiceMale) {
          // Genuine male voice pitch and rate
          utterance.pitch = 0.92;
          utterance.rate = 0.94;
        } else {
          // Fallback if system only has a female voice
          utterance.pitch = 0.75;
          utterance.rate = 0.92;
        }
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 0.98;
      }

      utterance.onstart = () => {
        this.currentState = {
          speaking: true,
          currentText: textToSpeak,
          speakingId: id,
          gender: this.genderPreference,
          selectedVoiceURI: this.selectedVoiceURI,
          activeVoiceName: voice ? voice.name : null
        };
        this.notify();

        // Start dark somber narrative background music at loud audible volume
        try {
          AudioManager.init().then(() => {
            AudioManager.playMusic('music.dark_narrative', { fadeInSeconds: 0.6 });
          });
        } catch (e) {
          console.warn('[TTS] Failed to play dark narrative background music:', e);
        }
      };

      utterance.onend = () => {
        this.currentState = {
          speaking: false,
          currentText: null,
          speakingId: null,
          gender: this.genderPreference,
          selectedVoiceURI: this.selectedVoiceURI,
          activeVoiceName: voice ? voice.name : null
        };
        this.currentUtterance = null;
        this.notify();

        // Smoothly fade out dark narrative background music
        try {
          AudioManager.stopMusic(1.5);
        } catch (e) {}
      };

      utterance.onerror = (e) => {
        console.warn('[TTS] Speech error:', e);
        this.currentState = {
          speaking: false,
          currentText: null,
          speakingId: null,
          gender: this.genderPreference,
          selectedVoiceURI: this.selectedVoiceURI,
          activeVoiceName: voice ? voice.name : null
        };
        this.currentUtterance = null;
        this.notify();

        try {
          AudioManager.stopMusic(1.0);
        } catch (err) {}
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('[TTS] Failed to trigger speech:', err);
      return false;
    }
  }

  /**
   * Stop current speech
   */
  public stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.currentState = {
      ...this.currentState,
      speaking: false,
      currentText: null,
      speakingId: null
    };
    this.notify();

    try {
      AudioManager.stopMusic(1.0);
    } catch (e) {}
  }
}

export const tts = new TTSEngine();
