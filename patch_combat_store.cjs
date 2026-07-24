const fs = require('fs');
let code = fs.readFileSync('src/store/useCombatStore.ts', 'utf8');

code = code.replace(/import \{ CombatState \} from '\.\.\/core\/engine\/combat';/, 
  "import { CombatState } from '../core/engine/combat';\nimport { CombatQueueAction } from '../core/engine/combatQueue';");

code = code.replace(/interface CombatStore \{/, 
`interface CombatStore {
  actionQueue: CombatQueueAction[];
  setActionQueue: (queue: CombatQueueAction[] | ((prev: CombatQueueAction[]) => CombatQueueAction[])) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;`);

code = code.replace(/export const useCombatStore = create<CombatStore>\(\(set\) => \(\{/,
`export const useCombatStore = create<CombatStore>((set) => ({
  actionQueue: [],
  setActionQueue: (queue) => set((state) => ({ actionQueue: typeof queue === 'function' ? queue(state.actionQueue) : queue })),
  isAnimating: false,
  setIsAnimating: (isAnimating) => set({ isAnimating }),`);

fs.writeFileSync('src/store/useCombatStore.ts', code);
