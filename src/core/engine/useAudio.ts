import { useState, useEffect } from 'react';
import { AudioManager } from './audio';

export function useAudio() {
  // Sincronizar o estado local com o estado do singleton AudioManager
  const [audioState, setAudioState] = useState(() => AudioManager.getState());

  useEffect(() => {
    const unsubscribe = AudioManager.subscribe((newState) => {
      setAudioState(newState);
    });
    return unsubscribe;
  }, []);

  return {
    sfxVolume: audioState.sfxVolume,
    musicVolume: audioState.musicVolume,
    muted: audioState.muted,
    initialized: audioState.initialized,

    init: () => AudioManager.init(),
    playSfx: (id: string, options?: { volume?: number; pitch?: number; damageMultiplier?: number; rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' }) => AudioManager.playSfx(id, options),
    playMusic: (trackId: string, options?: { fadeInSeconds?: number }) => AudioManager.playMusic(trackId, options),
    stopMusic: (fadeOutSeconds?: number) => AudioManager.stopMusic(fadeOutSeconds),
    setSfxVolume: (value: number) => AudioManager.setSfxVolume(value),
    setMusicVolume: (value: number) => AudioManager.setMusicVolume(value),
    setMuted: (muted: boolean) => AudioManager.setMuted(muted),
    
    manager: AudioManager,
  };
}
