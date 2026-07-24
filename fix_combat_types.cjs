const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

code = code.replace(/combatState\.playerMaxHp/g, 'pStatsMemo.hp');
code = code.replace(/combatState\.playerMaxMp/g, 'pStatsMemo.mp');
code = code.replace(/combatState\.playerShield/g, '(combatState as any).playerShield || 0');
code = code.replace(/combatState\.playerBaseDmg/g, 'pStatsMemo.atk');
code = code.replace(/player\.skillUpgrades/g, '(player as any).skillUpgrades');
code = code.replace(/combatState\.isPlayerTurn/g, '(combatState as any).isPlayerTurn');
code = code.replace(/combatState\.monster\.description/g, '(combatState.monster as any).description');
code = code.replace(/combatState\.monster\.stats\.agi/g, 'combatState.monster.stats.spd');
code = code.replace(/combatState\.monster\.skills/g, '(combatState.monster as any).skills');

fs.writeFileSync('src/pages/CombatScene.tsx', code);
