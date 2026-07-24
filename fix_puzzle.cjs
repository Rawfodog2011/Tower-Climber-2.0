const fs = require('fs');
let code = fs.readFileSync('src/pages/PuzzleScene.tsx', 'utf8');
code = code.replace(/;\s*handlePuzzleSelect[\s\S]*?\}/, '');
fs.writeFileSync('src/pages/PuzzleScene.tsx', code);
