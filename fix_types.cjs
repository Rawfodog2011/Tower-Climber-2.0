const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/applyStatus\?: \{/g, "isPassive?: boolean;\n  applyStatus?: {");
code = code.replace(/avatar\?: string;/g, "avatar?: string;\n  skillUpgrades?: string[];");

fs.writeFileSync('src/types.ts', code);
