const fs = require('fs');
let code = fs.readFileSync('src/components/IntroSequence.tsx', 'utf8');

code = code.replace(
  "      const interval = setInterval(() => {",
  "      const speed = isContinue ? 100 : 400;\n      const interval = setInterval(() => {"
);
code = code.replace(
  "      }, 400);",
  "      }, speed);"
);
code = code.replace(
  "          setTimeout(() => setPhase(1), 1500);",
  "          setTimeout(() => setPhase(1), isContinue ? 200 : 1500);"
);
code = code.replace(
  "      setTimeout(() => setPhase(2), 5000); // Matrix rain duration",
  "      setTimeout(() => setPhase(2), isContinue ? 1000 : 5000); // Matrix rain duration"
);
code = code.replace(
  "        const timer = setTimeout(() => {",
  "        const duration = isContinue ? 4000 : 7600;\n        const timer = setTimeout(() => {"
);
code = code.replace(
  "        }, 7600); // slightly after zoom hits scale 32 and fades to black",
  "        }, duration); // slightly after zoom hits scale 32 and fades to black"
);

fs.writeFileSync('src/components/IntroSequence.tsx', code);
