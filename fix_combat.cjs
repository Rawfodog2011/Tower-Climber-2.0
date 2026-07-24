const fs = require('fs');
let file = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

file = file.replace(
  'changeState(newState: CombatFsmStateId): void;\n}',
  'changeState(newState: CombatFsmStateId): void;\n  combatResult?: CombatResult;\n}'
);

file = file.replace(
  'const { builder } = context;\n    const state = builder.getState();',
  'const { builder, player } = context;\n    const state = builder.getState();'
);

fs.writeFileSync('src/core/engine/combat.ts', file);
