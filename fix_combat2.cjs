const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');
code = code.replace(/ \| null;[\s\S]*?\}import/, 'import');
// Let's do it right
code = code.replace(/ \| null;[\s\S]*?\}[\s\S]*?import/, 'import');
fs.writeFileSync('src/pages/CombatScene.tsx', code);
