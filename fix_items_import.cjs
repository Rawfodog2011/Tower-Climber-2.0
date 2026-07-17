const fs = require('fs');
let content = fs.readFileSync('src/core/entities/items.ts', 'utf-8');

// I will remove the first 15 lines that have applyManufacturer and imports, 
// then I will just inject it properly.
const lines = content.split('\n');
let applyManLogic = [];
let i = 0;
while (i < lines.length && !lines[i].includes('import { Item')) {
  applyManLogic.push(lines[i]);
  i++;
}

// now applyManLogic contains the misplaced logic
// we remove it from the top
lines.splice(0, i);
content = lines.join('\n');

// the imports should be there
// append the applyManLogic after imports
const importIdx = content.indexOf("import { CLASSES }");
let newContent = content.slice(0, importIdx) + applyManLogic.join('\n') + '\n' + content.slice(importIdx);

fs.writeFileSync('src/core/entities/items.ts', newContent);
