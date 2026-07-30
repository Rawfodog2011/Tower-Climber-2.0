const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

code = code.replace(/isPlayerGuarding\?: boolean;/g, "isPlayerGuarding?: boolean;\n  playerShield?: number;\n  isPlayerTurn?: boolean;");

fs.writeFileSync('src/core/engine/combat.ts', code);
