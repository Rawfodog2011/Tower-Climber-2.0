const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

code = code.replace(/\(combatState as any\)\.playerShield/g, "(combatState.playerShield)");
code = code.replace(/\(combatState as any\)\.isPlayerTurn/g, "(combatState.isPlayerTurn)");
code = code.replace(/\(player as any\)\.skillUpgrades/g, "(player.skillUpgrades)");
code = code.replace(/\(combatState\.monster as any\)/g, "(combatState.monster)");

fs.writeFileSync('src/pages/CombatScene.tsx', code);
