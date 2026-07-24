const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// replace getPendingTutorials import
code = code.replace("import { getPendingTutorials } from './core/engine/tutorial';\n", "");

// replace TutorialOverlay import
code = code.replace("import { TutorialOverlay } from './components/TutorialOverlay';", "import { TutorialManager } from './components/TutorialManager';");

// remove pendingTutorials computation
code = code.replace("  const pendingTutorials = getPendingTutorials(player);\n", "");

// replace the rendering logic
const oldRender = `{pendingTutorials.length > 0 && scene !== 'main_menu' && scene !== 'character_creation' && scene !== 'intro' && scene !== 'timeline_closure' && (
        <TutorialOverlay tutorialKey={pendingTutorials[0]} />
      )}`;

const newRender = `{!['main_menu', 'character_creation', 'intro', 'timeline_closure'].includes(scene) && (
        <TutorialManager />
      )}`;

code = code.replace(oldRender, newRender);

fs.writeFileSync('src/App.tsx', code);
