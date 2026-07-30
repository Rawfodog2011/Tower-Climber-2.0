import { create } from 'zustand';

export type Scene = 'main_menu' | 'intro' | 'hub' | 'combat' | 'event' | 'puzzle' | 'ending' | 'character_creation' | 'timeline_closure' | 'env_intro' | 'loading';
export type HubTab = 'expedicao' | 'perfil' | 'geral' | 'habilidades' | 'forja' | 'soldagem' | 'reliquias' | 'adaptacoes' | 'auto' | 'conquistas' | 'mercado' | 'contratos' | 'bestiario' | 'memorias' | 'prestagio';

interface GameUIStore {
  scene: Scene;
  setScene: (scene: Scene) => void;

  hubTab: HubTab;
  setHubTab: (tab: HubTab) => void;

  inventoryMessage: { text: string, type: 'error' | 'success' } | null;
  setInventoryMessage: (msg: { text: string, type: 'error' | 'success' } | null) => void;

  activeEvolutionNarrative: { classId: string; text: string } | null;
  setActiveEvolutionNarrative: (narrative: { classId: string; text: string } | null) => void;

  activeMemoryKey: string | null;
  setActiveMemoryKey: (key: string | null) => void;

  introSector: any | null;
  setIntroSector: (sector: any | null) => void;

  introStep: 'danger' | 'details';
  setIntroStep: (step: 'danger' | 'details') => void;

  showMonsterInfo: boolean;
  setShowMonsterInfo: (show: boolean) => void;
  
  savedPlayerPreview: any | null;
  setSavedPlayerPreview: (preview: any | null) => void;

  isContinueRun: boolean;
  setIsContinueRun: (isContinue: boolean) => void;
}

export const useGameUIStore = create<GameUIStore>((set) => ({
  scene: 'main_menu',
  setScene: (scene) => set({ scene }),

  hubTab: 'expedicao',
  setHubTab: (hubTab) => set({ hubTab }),

  inventoryMessage: null,
  setInventoryMessage: (inventoryMessage) => set({ inventoryMessage }),

  activeEvolutionNarrative: null,
  setActiveEvolutionNarrative: (activeEvolutionNarrative) => set({ activeEvolutionNarrative }),

  activeMemoryKey: null,
  setActiveMemoryKey: (activeMemoryKey) => set({ activeMemoryKey }),

  introSector: null,
  setIntroSector: (introSector) => set({ introSector }),

  introStep: 'danger',
  setIntroStep: (introStep) => set({ introStep }),

  showMonsterInfo: false,
  setShowMonsterInfo: (showMonsterInfo) => set({ showMonsterInfo }),

  savedPlayerPreview: null,
  setSavedPlayerPreview: (savedPlayerPreview) => set({ savedPlayerPreview }),

  isContinueRun: false,
  setIsContinueRun: (isContinueRun) => set({ isContinueRun }),
}));
