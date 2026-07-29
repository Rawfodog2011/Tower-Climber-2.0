const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCombatLogic.ts', 'utf8');
code = code.replace(
  "      if (combatResult.winner === 'player') {",
  "      if (combatResult.winner === 'player') {\n        if (selectedFloor === updatedPlayer.highestFloorUnlocked) {\n          updatedPlayer.highestFloorUnlocked += 1;\n        }"
);
fs.writeFileSync('src/hooks/useCombatLogic.ts', code);
