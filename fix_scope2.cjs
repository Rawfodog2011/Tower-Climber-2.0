const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

const targetStr = 'const isMatrixFullyUnlocked = Object.values(pentagonGroups).length === 6 && Object.values(pentagonGroups).every(g => g.isComplete);';
code = code.replace(targetStr, ''); // remove it from there

const uiOverlay = '{/* FINAL LORE REVEAL */}';
code = code.replace(uiOverlay, targetStr + '\n      ' + uiOverlay);

fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
