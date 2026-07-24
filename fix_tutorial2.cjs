const fs = require('fs');
let code = fs.readFileSync('src/components/TutorialOverlay.tsx', 'utf8');

code = code.replace(/interface Props \{\n  tutorialKey: string;\n  onComplete: \(\) => void;\n\}\n\n/, '');

fs.writeFileSync('src/components/TutorialOverlay.tsx', code);
