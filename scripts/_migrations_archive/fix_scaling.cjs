const fs = require('fs');
let content = fs.readFileSync('src/core/math/worldScaling.ts', 'utf-8');

const oldBase = `  const baseHP = 50;
  const baseATK = 5;
  const baseDEF = 5;
  const baseSPD = 5;
  const baseXP = 5;
  const baseGold = 3;`;

const newBase = `  const baseHP = 35; // HP reduzido para facilitar o início
  const baseATK = 4; // Menos dano base
  const baseDEF = 2; // Defesa significativamente menor para ataques básicos darem dano
  const baseSPD = 3;
  const baseXP = 15; // Ganho de XP aumentado no início
  const baseGold = 5; // Mais ouro inicial para ajudar na economia`;

if (content.includes(oldBase)) {
  content = content.replace(oldBase, newBase);
  fs.writeFileSync('src/core/math/worldScaling.ts', content);
  console.log('Replaced base stats');
} else {
  console.log('Could not find oldBase string');
}
