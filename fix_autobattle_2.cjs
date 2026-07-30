const fs = require('fs');
let code = fs.readFileSync('src/components/AutoBattlePanel.tsx', 'utf8');

code = code.replace(/!\(SKILLS_DATABASE\[id\] as \{ isPassive\?: boolean \}\)\?\.isPassive/g, "!SKILLS_DATABASE[id]?.isPassive");
fs.writeFileSync('src/components/AutoBattlePanel.tsx', code);
