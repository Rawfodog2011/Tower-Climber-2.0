const fs = require('fs');
let code = fs.readFileSync('src/core/entities/player.ts', 'utf8');

const importAdd = `import { getTimelineMetaBonus } from '../engine/timelineCodex';`;
const newImportAdd = `import { getTimelineMetaBonus } from '../engine/timelineCodex';
import { calculateMatrixPower } from './neuralMatrix';`;

if (!code.includes('calculateMatrixPower')) {
    code = code.replace(importAdd, newImportAdd);
}

const matrixStart = `  // Soma modificadores da Matriz Neural
  if (player.unlockedNodes) {
    player.unlockedNodes.forEach(nodeId => {
      const node = NEURAL_MATRIX_DATABASE[nodeId];
      if (node && node.statBonus) {
        Object.entries(node.statBonus).forEach(([key, val]) => {
          stats[key as keyof Stats] += val || 0;
        });
      }
    });
  }`;

const matrixNew = `  // Soma modificadores da Matriz Neural
  if (player.unlockedNodes) {
    const matrixPower = calculateMatrixPower(player.unlockedNodes, NEURAL_MATRIX_DATABASE);
    Object.entries(matrixPower.bonusStats).forEach(([key, val]) => {
      stats[key as keyof Stats] += val || 0;
    });
  }`;

code = code.replace(matrixStart, matrixNew);

fs.writeFileSync('src/core/entities/player.ts', code);
