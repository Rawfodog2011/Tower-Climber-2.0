const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');
code = code.replace(/const logs = nextState\.logs;\n\n  logs\.push\(/, 'logs.push(');
fs.writeFileSync('src/core/engine/combat.ts', code);
