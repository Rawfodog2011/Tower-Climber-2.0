const fs = require('fs');
let code = fs.readFileSync('src/store/useCombatStore.ts', 'utf8');
code = code.replace(/logicalCombatState: CombatState \| null;\n  setLogicalCombatState: \(state: CombatState \| null\) => void;\n  visualCombatState: CombatState \| null;\n  setVisualCombatState: \(state: CombatState \| \(\(prev: CombatState \| null\) => CombatState \| null\)\) => void;/, "combatState: CombatState | null;\n  setCombatState: (state: CombatState | null) => void;");
code = code.replace(/logicalCombatState: null,\n  setLogicalCombatState: \(logicalCombatState\) => set\(\{ logicalCombatState \}\),\n  visualCombatState: null,\n  setVisualCombatState: \(stateUpdate\) => set\(\(state\) => \(\{\n    visualCombatState: typeof stateUpdate === 'function' \? stateUpdate\(state.visualCombatState\) : stateUpdate\n  \}\)\),/, "combatState: null,\n  setCombatState: (combatState) => set({ combatState }),");
fs.writeFileSync('src/store/useCombatStore.ts', code);
