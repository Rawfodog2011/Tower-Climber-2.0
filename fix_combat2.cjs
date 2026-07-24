const fs = require('fs');
let file = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

file = file.replace(
  /{ winner: 'flee'/g,
  '{ winner: "flee" as const'
);
file = file.replace(
  /{ winner: 'exhausted'/g,
  '{ winner: "exhausted" as const'
);
file = file.replace(
  /{ winner: 'monster'/g,
  '{ winner: "monster" as const'
);
file = file.replace(
  /{ winner: 'player'/g,
  '{ winner: "player" as const'
);

file = file.replace(
  /class EndRoundState implements FsmState \{\n  update\(context: CombatFsmContext\) \{\n    const \{ builder \} = context;/,
  'class EndRoundState implements FsmState {\n  update(context: CombatFsmContext) {\n    const { builder, player } = context;'
);

fs.writeFileSync('src/core/engine/combat.ts', file);
