const fs = require('fs');

let expCode = fs.readFileSync('src/hooks/useExploration.ts', 'utf8');
expCode = expCode.replace(/setLogicalCombatState\(null\);/g, 'setCombatState(null);');
expCode = expCode.replace(/setVisualCombatState\(null\);/g, '');
expCode = expCode.replace(/logicalCombatState,/g, 'combatState,');
expCode = expCode.replace(/visualCombatState,/g, '');
expCode = expCode.replace(/setLogicalCombatState,/g, 'setCombatState,');
expCode = expCode.replace(/setVisualCombatState/g, '');
expCode = expCode.replace(/visualCombatState/g, 'combatState');
fs.writeFileSync('src/hooks/useExploration.ts', expCode);

let effCode = fs.readFileSync('src/hooks/useGameEffects.ts', 'utf8');
effCode = effCode.replace(/logicalCombatState/g, 'combatState');
fs.writeFileSync('src/hooks/useGameEffects.ts', effCode);
