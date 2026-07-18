const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');
const replacement = fs.readFileSync('replace_panel.tsx', 'utf-8');
const lines = content.split('\n');
lines.splice(410, 38, replacement.trim());
fs.writeFileSync('src/App.tsx', lines.join('\n'));
