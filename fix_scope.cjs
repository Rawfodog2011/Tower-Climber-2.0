const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

const targetStr = 'const isMatrixFullyUnlocked = Object.values(pentagonGroups).length === 6 && Object.values(pentagonGroups).every(g => g.isComplete);';
code = code.replace(targetStr, ''); // remove it from there

const afterGroupsStr = '}, [unlockedNodes]);';
const afterGroupsIdx = code.indexOf(afterGroupsStr);
if (afterGroupsIdx !== -1) {
  const insertPos = afterGroupsIdx + afterGroupsStr.length;
  code = code.slice(0, insertPos) + '\n  ' + targetStr + '\n' + code.slice(insertPos);
}

fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
