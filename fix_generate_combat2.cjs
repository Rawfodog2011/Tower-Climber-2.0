const fs = require('fs');
let code = fs.readFileSync('generate_combat.cjs', 'utf-8');
code = code.replace(/SKILLS_DATABASE\.find\(s => s\.id === action\.skillId\)/g, "SKILLS_DATABASE[action.skillId]");
fs.writeFileSync('generate_combat.cjs', code);
