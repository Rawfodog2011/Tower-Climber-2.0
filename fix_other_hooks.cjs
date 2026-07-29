const fs = require('fs');

let expCode = fs.readFileSync('src/hooks/useExploration.ts', 'utf8');
expCode = expCode.replace(/logicalCombatState, visualCombatState, setLogicalCombatState, setVisualCombatState/, 'combatState, setCombatState');
expCode = expCode.replace(/setLogicalCombatState\(null\);\n\s*setVisualCombatState\(null\);/g, 'setCombatState(null);');
expCode = expCode.replace(/if \(\(logicalCombatState && logicalCombatState\.isActive\) \|\| \(visualCombatState && visualCombatState\.isActive\)\)/, 'if (combatState && combatState.isActive)');
fs.writeFileSync('src/hooks/useExploration.ts', expCode);

let effCode = fs.readFileSync('src/hooks/useGameEffects.ts', 'utf8');
effCode = effCode.replace(/logicalCombatState,/g, 'combatState,');
effCode = effCode.replace(/if \(logicalCombatState\?.isActive\)/, 'if (combatState?.isActive)');
fs.writeFileSync('src/hooks/useGameEffects.ts', effCode);

let storeCode = fs.readFileSync('src/store/useCombatStore.ts', 'utf8');
storeCode = storeCode.replace(/logicalCombatState: null,\n\s*setLogicalCombatState: \(logicalCombatState\) => set\(\{ logicalCombatState \}\),\n\s*visualCombatState: null,\n\s*setVisualCombatState: \(stateUpdate\) => set\(\(state\) => \(\{\n\s*visualCombatState: typeof stateUpdate === 'function' \? stateUpdate\(state.visualCombatState\) : stateUpdate\n\s*\}\)\),/, 'combatState: null,\n  setCombatState: (combatState) => set({ combatState }),');
fs.writeFileSync('src/store/useCombatStore.ts', storeCode);
