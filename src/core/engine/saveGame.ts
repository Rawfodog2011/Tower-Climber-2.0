import { Player } from '../../types';
import { migrateSave, CURRENT_SAVE_VERSION } from './migrations';

const SAVE_KEY = 'tower_rpg_save';

export function saveGame(player: Player): void {
  try {
    player.saveVersion = CURRENT_SAVE_VERSION;
    const serializedState = JSON.stringify(player);
    localStorage.setItem(SAVE_KEY, serializedState);
  } catch (error) {
    console.error('Erro ao salvar o jogo:', error);
  }
}

export function loadGame(): Player | null {
  try {
    const serializedState = localStorage.getItem(SAVE_KEY);
    if (serializedState === null) {
      return null;
    }
    return migrateSave(JSON.parse(serializedState));
  } catch (error) {
    console.error('Erro ao carregar o jogo:', error);
    return null;
  }
}
