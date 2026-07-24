const fs = require('fs');
let code = fs.readFileSync('src/components/EndingScreen.tsx', 'utf8');

code = code.replace(/export function EndingScreen\(\{ onContinue \}: \{ onContinue: \(\) => void \}\) \{/, 'export function EndingScreen() {');
code = code.replace(/onClick=\{onContinue\}/, "onClick={() => setScene('timeline_closure')}");

fs.writeFileSync('src/components/EndingScreen.tsx', code);
