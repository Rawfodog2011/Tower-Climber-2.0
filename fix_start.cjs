const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

code = code.replace(/isActive: true,/g, "isActive: true,\n    fsmState: 'PlayerTurn',");
fs.writeFileSync('src/core/engine/combat.ts', code);
