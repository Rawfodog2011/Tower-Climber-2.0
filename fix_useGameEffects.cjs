const fs = require('fs');
let code = fs.readFileSync('src/hooks/useGameEffects.ts', 'utf8');

const regex = /if \(player\.currentClassId !== newClass\.id\) \{[\s\S]*?setActiveEvolutionNarrative\(\{ classId: newClass\.id, text \}\);\n\s*return nextPlayer;\n\s*\}\);\n\s*\}/g;

const match = regex.exec(code);
if (match) {
  code = code.replace(regex, `if (player.currentClassId !== newClass.id) {
          autoEvolveClass(newClass.id);
        }`);
  fs.writeFileSync('src/hooks/useGameEffects.ts', code);
  console.log('Fixed');
} else {
  console.log('Not matched');
}
