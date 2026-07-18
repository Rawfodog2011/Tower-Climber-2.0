const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const startTarget = "if (!saved.materials) saved.materials = { common: 0, rare: 0, epic: 0 };";
const endTarget = "return saved;";

const startIndex = code.indexOf(startTarget);
const endIndex = code.indexOf(endTarget);

if (startIndex !== -1 && endIndex !== -1) {
   const before = code.substring(0, startIndex);
   const after = code.substring(endIndex);
   code = before + after;
   fs.writeFileSync('src/App.tsx', code);
   console.log('App.tsx migration logic removed.');
} else {
   console.log('Could not find boundaries.');
}
