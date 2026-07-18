const fs = require('fs');
let content = fs.readFileSync('src/core/entities/adaptations.ts', 'utf-8');

content = content.replace(/\\\`\\[SISTEMA\\] Adaptação \\\$\\{def\\.name\\} subiu para o Nv\.\\\$\\{state\\.level\\}!\\\`/, "\`[SISTEMA] Adaptação \${def.name} subiu para o Nv.\${state.level}!\`");

fs.writeFileSync('src/core/entities/adaptations.ts', content);
console.log('adaptations fixed');
