const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace("Você perdeu ${hpDamage} de HP", "O traje absorveu ${hpDamage} de dano no HP");

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed text');
