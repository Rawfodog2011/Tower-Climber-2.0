const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  // Remove everything between "import { saveGame }" and "import { usePlayerStore"
  // Wait, the generic way is to remove stray interface props lines. 
  // Let's remove from " | null;" up to "}" before "import {"
  code = code.replace(/ \| null;[\s\S]*?\n\}[\s\S]*?(?=import \{)/, '');
  fs.writeFileSync(file, code);
}
fixFile('src/pages/EnvIntroScene.tsx');
