const fs = require('fs');
let code = fs.readFileSync('generate_combat.cjs', 'utf-8');

code = code.replace(/pStats\.level/g, 'player.level');
code = code.replace(/mStats\.level/g, 'state.monster.level');

code = code.replace(/skill\.effects\.damagePercent/g, "skill.type === 'damage'");
code = code.replace(/skill\.effects\.staggerDamage/g, "0"); // No stagger damage built into Skill interface directly?
code = code.replace(/skill\.effects\.healPercent/g, "skill.type === 'heal'");
code = code.replace(/skill\.effects\.applyStatus/g, "skill.applyStatus");
code = code.replace(/Math\.floor\(pStats\.atk \* skill\.effects\.damagePercent\)/g, "Math.floor(pStats.atk * skill.multiplier)");
code = code.replace(/Math\.floor\(pStats\.hp \* skill\.effects\.healPercent\)/g, "Math.floor(pStats.hp * skill.multiplier)");

code = code.replace(/winner: 'flee'/g, "winner: 'flee' as 'flee'");
code = code.replace(/winner: 'exhausted'/g, "winner: 'exhausted' as 'exhausted'");
code = code.replace(/winner: 'monster'/g, "winner: 'monster' as 'monster'");
code = code.replace(/winner: 'player'/g, "winner: 'player' as 'player'");

fs.writeFileSync('generate_combat.cjs', code);
