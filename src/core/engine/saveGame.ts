import { Player } from '../../types';
import { migrateSave, CURRENT_SAVE_VERSION } from './migrations';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from './storage';

export function saveGame(player: Player): void {
  try {
    player.saveVersion = CURRENT_SAVE_VERSION;
    setStorageItem(STORAGE_KEYS.SAVE, player);
  } catch (error) {
    console.error('Erro ao salvar o jogo:', error);
  }
}

export function loadGame(): Player | null {
  try {
    const state = getStorageItem<any | null>(STORAGE_KEYS.SAVE, null);
    if (state === null) {
      return null;
    }
    return migrateSave(state);
  } catch (error) {
    console.error('Erro ao carregar o jogo:', error);
    return null;
  }
}
