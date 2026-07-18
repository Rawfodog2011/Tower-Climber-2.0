const fs = require('fs');
let content = fs.readFileSync('src/core/math/progression.ts', 'utf-8');

const oldBase = `  const baseXP = 50;
  const exponent = 1.8;`;

const newBase = `  const baseXP = 40; // Reduzido para suavizar a curva inicial
  const exponent = 1.8;`;

if (content.includes(oldBase)) {
  content = content.replace(oldBase, newBase);
  fs.writeFileSync('src/core/math/progression.ts', content);
  console.log('Replaced progression baseXP');
} else {
  console.log('Could not find progression baseXP');
}
