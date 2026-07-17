const fs = require('fs');
let content = fs.readFileSync('src/core/entities/adaptations.ts', 'utf-8');

content = content.replace("levelUps.push(`[SISTEMA]", "levelUps.push(`[SISTEMA]"); // Test if it's correctly written

const toReplace = 'levelUps.push(\\`[SISTEMA] Adaptação \\${def.name} subiu para o Nv.\\${state.level}!\\`);';
const replacement = 'levelUps.push(`[SISTEMA] Adaptação ${def.name} subiu para o Nv.${state.level}!`);';

content = content.replace(toReplace, replacement);

fs.writeFileSync('src/core/entities/adaptations.ts', content);
console.log('adaptations fixed 2');
