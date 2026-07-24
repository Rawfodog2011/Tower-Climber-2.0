import { create } from 'zustand';

interface ExplorationStore {
  selectedFloor: number;
  setSelectedFloor: (floor: number) => void;

  activeEvent: any | null;
  setActiveEvent: (event: any | null) => void;

  eventLog: string | null;
  setEventLog: (log: string | null) => void;

  lastEventId: string | null;
  setLastEventId: (id: string | null) => void;

  activePuzzle: any | null;
  setActivePuzzle: (puzzle: any | null) => void;

  pendingDiveParams: { floor: number; forceCombat: boolean } | null;
  setPendingDiveParams: (params: { floor: number; forceCombat: boolean } | null) => void;

  justCompletedAll: boolean;
  setJustCompletedAll: (completed: boolean) => void;
}

export const useExplorationStore = create<ExplorationStore>((set) => ({
  selectedFloor: 1, // Default, will be updated by component
  setSelectedFloor: (selectedFloor) => set({ selectedFloor }),

  activeEvent: null,
  setActiveEvent: (activeEvent) => set({ activeEvent }),

  eventLog: null,
  setEventLog: (eventLog) => set({ eventLog }),

  lastEventId: null,
  setLastEventId: (lastEventId) => set({ lastEventId }),

  activePuzzle: null,
  setActivePuzzle: (activePuzzle) => set({ activePuzzle }),

  pendingDiveParams: null,
  setPendingDiveParams: (pendingDiveParams) => set({ pendingDiveParams }),

  justCompletedAll: false,
  setJustCompletedAll: (justCompletedAll) => set({ justCompletedAll }),
}));
