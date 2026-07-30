const fs = require('fs');
let code = fs.readFileSync('src/core/engine/migrations.ts', 'utf8');

const currentTotalPointsBlock = `if (typeof player.matrixPoints !== 'number') player.matrixPoints = 0;
  
  // Auto-heal matrix points if they save-edited their level
  const expectedTotalPoints = Math.max(0, player.level - 1);
  const spentPoints = Math.max(0, player.unlockedNodes.length - 1);
  const currentTotalPoints = player.matrixPoints + spentPoints;
  
  if (currentTotalPoints < expectedTotalPoints) {
    player.matrixPoints += (expectedTotalPoints - currentTotalPoints);
  }`;

const fallbackBlock = `if (!player.unlockedNodes || player.unlockedNodes.length === 0) player.unlockedNodes = ['core_start'];`;

if (code.includes(currentTotalPointsBlock) && code.includes(fallbackBlock)) {
  code = code.replace(currentTotalPointsBlock, ''); // remove from current pos
  code = code.replace(fallbackBlock, fallbackBlock + '\n\n  ' + currentTotalPointsBlock); // put after fallback
  fs.writeFileSync('src/core/engine/migrations.ts', code);
  console.log('Fixed execution order in migrations.ts');
} else {
  console.log('Could not find blocks to reorder');
}
