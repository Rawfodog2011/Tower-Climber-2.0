const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCombatLogic.ts', 'utf8');
code = code.replace(/const \{ nextState, combatResult \} = processTurn/, 'const { nextState, queue, combatResult } = processTurn');
fs.writeFileSync('src/hooks/useCombatLogic.ts', code);
