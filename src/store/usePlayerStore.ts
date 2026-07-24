import { create } from 'zustand';
import { Player } from '../types';
import { loadGame } from '../core/engine/saveGame';

// Temporarily import ITEMS_DATABASE for fallback if no save
import { ITEMS_DATABASE } from '../core/entities/items';

const createDefaultPlayer = (): Player => ({
  level: 1,
  currentXp: 0,
  currentClassId: 'tecno_aprendiz',
  gold: 0,
  inventory: [
    ITEMS_DATABASE['weapon_common_classless_1'], 
    ITEMS_DATABASE['weapon_common_classless_2'],    
    ITEMS_DATABASE['accessory_common_classless_1'],
    ITEMS_DATABASE['accessory_common_classless_2'] 
  ].filter(Boolean),
  learnedSkills: [],
  equipment: {
    weapon: ITEMS_DATABASE['weapon_common_classless_3'],
    armor: ITEMS_DATABASE['armor_common_classless_1']
  },
  highestFloorUnlocked: 1,
  matrixPoints: 0,
  unlockedNodes: ['core_start'],
  materials: { common: 0, rare: 0, epic: 0 },
  soulShards: 0,
  relics: {},
  achievements: [],
  name: 'Operador',
  avatar: '🤖',
  originId: 'ciborgue_foragido',
  isAutoBattleActive: false,
  isFarmActive: false,
  contracts: [],
  bestiary: {},
  gameStats: { monstersKilled: 0, puzzlesSolved: 0, bossesDefeated: 0 },
  autoBattleRules: [],
  adaptations: {},
  totalPlaytimeSeconds: 0,
  runStats: { goldSpent: 0, totalTurns: 0 }
});

interface PlayerStore {
  player: Player;
  setPlayer: (playerOrUpdater: Player | ((prev: Player) => Player)) => void;
  loadPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  player: createDefaultPlayer(),
  setPlayer: (playerOrUpdater) => set((state) => {
    const nextPlayer = typeof playerOrUpdater === 'function' ? playerOrUpdater(state.player) : playerOrUpdater;
    return { player: nextPlayer };
  }),
  loadPlayer: () => {
    const saved = loadGame();
    if (saved) {
      if (!saved.visitedSectors) {
        saved.visitedSectors = [];
      }
      set({ player: saved });
    }
  }
}));
