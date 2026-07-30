const fs = require('fs');
let code = fs.readFileSync('src/core/engine/migrations.ts', 'utf8');

const target = `if (typeof player.matrixPoints !== 'number') player.matrixPoints = Math.max(0, player.level - 1);`;

const replacement = `if (typeof player.matrixPoints !== 'number') player.matrixPoints = 0;
  
  // Auto-heal matrix points if they save-edited their level
  const expectedTotalPoints = Math.max(0, player.level - 1);
  const spentPoints = Math.max(0, player.unlockedNodes.length - 1);
  const currentTotalPoints = player.matrixPoints + spentPoints;
  
  if (currentTotalPoints < expectedTotalPoints) {
    player.matrixPoints += (expectedTotalPoints - currentTotalPoints);
  }`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/core/engine/migrations.ts', code);
  console.log('Fixed migrations.ts for matrix points heal');
} else {
  console.log('Target not found in migrations.ts');
}
