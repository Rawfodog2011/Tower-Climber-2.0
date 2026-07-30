const fs = require('fs');
let code = fs.readFileSync('src/components/IntroSequence.tsx', 'utf8');
code = code.replace(
  "        const duration = isContinue ? 4000 : 7600;\n        const timer = setTimeout(() => {\n          handleComplete();\n        }, duration); // slightly after zoom hits scale 32 and fades to black",
  "        const timer = setTimeout(() => {\n          handleComplete();\n        }, 7600); // slightly after zoom hits scale 32 and fades to black"
);
fs.writeFileSync('src/components/IntroSequence.tsx', code);
