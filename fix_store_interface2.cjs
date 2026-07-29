const fs = require('fs');
let code = fs.readFileSync('src/store/useCombatStore.ts', 'utf8');

code = code.replace("logicalCombatState: CombatState | null;", "combatState: CombatState | null;");
code = code.replace("setLogicalCombatState: (state: CombatState | null) => void;", "setCombatState: (state: CombatState | null) => void;");
code = code.replace("visualCombatState: CombatState | null;", "");
code = code.replace("setVisualCombatState: (state: CombatState | ((prev: CombatState | null) => CombatState | null)) => void;", "");

fs.writeFileSync('src/store/useCombatStore.ts', code);
