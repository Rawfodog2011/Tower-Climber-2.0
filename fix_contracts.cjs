const fs = require('fs');
let code = fs.readFileSync('src/core/engine/contracts.ts', 'utf8');

code = code.replace(/sectorId: \(template as any\)\.sectorId,/g, "sectorId: 'sectorId' in template ? template.sectorId : undefined,");

fs.writeFileSync('src/core/engine/contracts.ts', code);
