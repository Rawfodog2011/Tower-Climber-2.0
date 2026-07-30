const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importStr = "import { ToastContainer } from './components/ToastContainer';";
code = code.replace("import { TutorialManager } from './components/TutorialManager';", "import { TutorialManager } from './components/TutorialManager';\n" + importStr);

const containerStr = "      {['hub', 'env_intro', 'combat', 'event', 'puzzle'].includes(scene) && (\n        <TutorialManager />\n      )}\n      <ToastContainer />";
code = code.replace("      {['hub', 'env_intro', 'combat', 'event', 'puzzle'].includes(scene) && (\n        <TutorialManager />\n      )}", containerStr);

fs.writeFileSync('src/App.tsx', code);
