const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

code = code.replace(/Object\.defineProperty\(nextState, 'playerHp', \{/g, `Object.defineProperty(nextState, 'playerHp', { enumerable: true,`);
code = code.replace(/Object\.defineProperty\(nextState, 'monsterHp', \{/g, `Object.defineProperty(nextState, 'monsterHp', { enumerable: true,`);
code = code.replace(/Object\.defineProperty\(nextState, 'playerMp', \{/g, `Object.defineProperty(nextState, 'playerMp', { enumerable: true,`);
code = code.replace(/Object\.defineProperty\(nextState, 'monsterStagger', \{/g, `Object.defineProperty(nextState, 'monsterStagger', { enumerable: true,`);

// Before returning, we should freeze the queue or just return it.
fs.writeFileSync('src/core/engine/combat.ts', code);
