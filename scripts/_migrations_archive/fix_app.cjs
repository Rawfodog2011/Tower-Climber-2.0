const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove the wrongly placed import
content = content.replace("import { EquipmentTerminal } from './components/equipment/EquipmentTerminal';\n", "");

// Find the real last top-level import
const lines = content.split('\n');
let insertIdx = 0;
for(let i=0; i<lines.length; i++) {
  if (lines[i].startsWith('import ')) {
    insertIdx = i;
  }
}
lines.splice(insertIdx + 1, 0, "import { EquipmentTerminal } from './components/equipment/EquipmentTerminal';");

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log("Fixed import.");
