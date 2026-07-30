const fs = require('fs');
let code = fs.readFileSync('src/components/AutoBattlePanel.tsx', 'utf8');

code = code.replace(/const newRule = \{ id: random\(\)\.toString\(36\)\.substr\(2, 9\), condition: 'always', action: 'attack' \};/g, "const newRule: import('../types').AutoBattleRule = { id: random().toString(36).substr(2, 9), condition: 'always', action: 'attack' };");

fs.writeFileSync('src/components/AutoBattlePanel.tsx', code);
