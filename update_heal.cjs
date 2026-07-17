const fs = require('fs');

let skills = fs.readFileSync('src/core/entities/skills.ts', 'utf-8');
skills = skills.replace(
  "description: 'Restaura HP equivalente a 150% da sua Tensão (T-ATK).',\n    mpCost: 20,\n    cooldown: 3,\n    multiplier: 1.5,",
  "description: 'Restaura HP equivalente a 25% da sua Vida Máxima.',\n    mpCost: 20,\n    cooldown: 3,\n    multiplier: 0.25,"
);
fs.writeFileSync('src/core/entities/skills.ts', skills);

let combat = fs.readFileSync('src/core/engine/combat.ts', 'utf-8');
combat = combat.replace(
  "        } else if (skill.type === 'heal') {\n          const healAmount = Math.floor(pStats.atk * skill.multiplier);",
  "        } else if (skill.type === 'heal') {\n          const healAmount = Math.floor(pStats.hp * skill.multiplier);"
);
fs.writeFileSync('src/core/engine/combat.ts', combat);

console.log('Update done');
