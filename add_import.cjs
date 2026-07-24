const fs = require('fs');
let code = fs.readFileSync('src/components/MainMenu.tsx', 'utf8');

if (!code.includes('HybridFlag')) {
   code = "import { HybridFlag } from './HybridFlag';\n" + code;
}
fs.writeFileSync('src/components/MainMenu.tsx', code);
