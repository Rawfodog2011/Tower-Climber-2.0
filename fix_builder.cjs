const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combatBuilder.ts', 'utf8');

code = code.replace(/public endCombat\(winner: 'player' \| 'flee' \| 'exhausted' \| 'monster', result: CombatResult\)/g, "public endCombat(winner: 'player' | 'flee' | 'exhausted' | 'monster', result: any)");
code = code.replace(/public endCombat\(winner: 'player' \| 'flee' \| 'exhausted' \| 'monster', result: any\)/g, "public endCombat(winner: 'player' | 'flee' | 'exhausted' | 'monster', result: any)");

fs.writeFileSync('src/core/engine/combatBuilder.ts', code);
