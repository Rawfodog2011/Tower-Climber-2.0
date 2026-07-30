const fs = require('fs');
let code = fs.readFileSync('src/components/TimelineClosureScreen.tsx', 'utf8');

code = code.replace(/\{\(rewards as any\)\.epilogueHint/g, "{rewards.epilogueHint");

fs.writeFileSync('src/components/TimelineClosureScreen.tsx', code);
