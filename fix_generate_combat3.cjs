const fs = require('fs');
let code = fs.readFileSync('generate_combat.cjs', 'utf-8');

// The replacement code has a bug
code = code.replace(/Math\.floor\(pStats\.atk \* skill\.type === 'damage'\)/g, "Math.floor(pStats.atk * skill.multiplier)");
code = code.replace(/Math\.floor\(pStats\.hp \* skill\.type === 'heal'\)/g, "Math.floor(pStats.hp * skill.multiplier)");
code = code.replace(/if \(0\) \{/g, "if (false) {");
fs.writeFileSync('generate_combat.cjs', code);
