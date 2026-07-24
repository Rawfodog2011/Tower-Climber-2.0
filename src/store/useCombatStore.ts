import { create } from 'zustand';
import { CombatState } from '../core/engine/combat';
import { CombatEvent } from '../core/engine/combatEvents';

interface CombatStore {
  actionQueue: CombatEvent[];
  setActionQueue: (queue: CombatEvent[] | ((prev: CombatEvent[]) => CombatEvent[])) => void;
  
  isProcessingQueue: boolean;
  setIsProcessingQueue: (processing: boolean) => void;
  
  logicalCombatState: CombatState | null;
  setLogicalCombatState: (state: CombatState | null) => void;

  visualCombatState: CombatState | null;
  setVisualCombatState: (state: CombatState | ((prev: CombatState | null) => CombatState | null)) => void;

  combatLogFilter: 'all' | 'important';
  setCombatLogFilter: (filter: 'all' | 'important') => void;
  
  combatEndMessage: { title: string, subtitle: string, isVictory: boolean } | null;
  setCombatEndMessage: (msg: { title: string, subtitle: string, isVictory: boolean } | null) => void;
  
  combatSpeed: 'normal' | 'fast';
  setCombatSpeed: (speed: 'normal' | 'fast') => void;
  
  dmgPopups: { target: 'player' | 'monster', amount: number | string, id: number, type: 'damage' | 'heal' | 'crit' | 'miss' | 'block' | 'dodge' }[];
  setDmgPopups: (popups: any) => void;
  
  enrageFlash: boolean;
  setEnrageFlash: (flash: boolean) => void;
  
  attackerAnimating: { player: boolean, monster: boolean };
  setAttackerAnimating: (animating: { player: boolean, monster: boolean }) => void;
  
  cameraShake: 'light' | 'medium' | 'heavy' | null;
  setCameraShake: (shake: 'light' | 'medium' | 'heavy' | null) => void;
}

export const useCombatStore = create<CombatStore>((set) => ({
  actionQueue: [],
  setActionQueue: (queue) => set((state) => ({ actionQueue: typeof queue === 'function' ? queue(state.actionQueue) : queue })),
  
  isProcessingQueue: false,
  setIsProcessingQueue: (isProcessingQueue) => set({ isProcessingQueue }),
  
  logicalCombatState: null,
  setLogicalCombatState: (logicalCombatState) => set({ logicalCombatState }),

  visualCombatState: null,
  setVisualCombatState: (stateUpdate) => set((state) => ({
    visualCombatState: typeof stateUpdate === 'function' ? stateUpdate(state.visualCombatState) : stateUpdate
  })),

  combatLogFilter: 'all',
  setCombatLogFilter: (combatLogFilter) => set({ combatLogFilter }),
  
  combatEndMessage: null,
  setCombatEndMessage: (combatEndMessage) => set({ combatEndMessage }),
  
  combatSpeed: 'normal',
  setCombatSpeed: (combatSpeed) => set({ combatSpeed }),
  
  dmgPopups: [],
  setDmgPopups: (popupsOrUpdater) => set((state) => ({
    dmgPopups: typeof popupsOrUpdater === 'function' ? popupsOrUpdater(state.dmgPopups) : popupsOrUpdater
  })),
  
  enrageFlash: false,
  setEnrageFlash: (enrageFlash) => set({ enrageFlash }),
  
  attackerAnimating: { player: false, monster: false },
  setAttackerAnimating: (attackerAnimating) => set({ attackerAnimating }),
  
  cameraShake: null,
  setCameraShake: (cameraShake) => set({ cameraShake }),
}));
