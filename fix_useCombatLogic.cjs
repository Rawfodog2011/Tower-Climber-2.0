const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCombatLogic.ts', 'utf8');

code = code.replace(/AudioManager\.playSfx\(lootId as any\);/g, "AudioManager.playSfx(lootId);");

fs.writeFileSync('src/hooks/useCombatLogic.ts', code);
