export const STORAGE_KEYS = {
  SAVE: 'tower_rpg_save',
  MEMORY_ARCHIVE: 'towerclimber_memory_archive',
  TIMELINE_CODEX: 'towerclimber_timeline_codex',
  COMBAT_SPEED: 'combat_speed',
  INTRO_SEEN_COUNT: 'intro_seen_count',
  LANGUAGE: 'tower_climber_lang',
  SFX_VOLUME: 'tower_audio_sfx_volume',
  MUSIC_VOLUME: 'tower_audio_music_volume',
  AUDIO_MUTED: 'tower_audio_muted',
} as const;

/**
 * Lê um valor do localStorage e o analisa como JSON.
 */
export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Erro ao ler JSON do localStorage[${key}]:`, error);
    return fallback;
  }
}

/**
 * Grava um valor serializado em JSON no localStorage.
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao gravar JSON no localStorage[${key}]:`, error);
  }
}

/**
 * Lê uma string pura do localStorage (sem análise de JSON).
 */
export function getStorageString(key: string, fallback: string): string {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw;
  } catch (error) {
    console.error(`Erro ao ler string do localStorage[${key}]:`, error);
    return fallback;
  }
}

/**
 * Grava uma string pura no localStorage (sem serialização de JSON).
 */
export function setStorageString(key: string, value: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Erro ao gravar string no localStorage[${key}]:`, error);
  }
}

/**
 * Remove um item do localStorage.
 */
function removeStorageItem(key: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Erro ao remover do localStorage[${key}]:`, error);
  }
}
