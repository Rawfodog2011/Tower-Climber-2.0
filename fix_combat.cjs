const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

code = code.replace(/builder\.staggerChange\('monster', Math\.max\(0, builder\.getState\(\)\.monsterStagger - 0\)\);/g, 'builder.setStagger(Math.max(0, builder.getState().monsterStagger - 0), builder.getState().monsterMaxStagger);');
code = code.replace(/builder\.applyDamage\(target, finalDmg, attackerName, isCrit\);/g, 'builder.applyDamage(target, finalDmg, isCrit, attackerName);');

fs.writeFileSync('src/core/engine/combat.ts', code);
