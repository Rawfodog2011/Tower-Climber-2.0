const fs = require('fs');
let code = fs.readFileSync('src/pages/HubScene.tsx', 'utf8');

// Add import
if (!code.includes("import { AchievementsPanel }")) {
  code = code.replace("import { QuantumPrestigePanel } from '../components/QuantumPrestigePanel';", "import { QuantumPrestigePanel } from '../components/QuantumPrestigePanel';\nimport { AchievementsPanel } from '../components/AchievementsPanel';");
}

// Replace case
const oldCase = `{hubTab === 'conquistas' && (
             <QuantumPrestigePanel />
          )}`;
const newCase = `{hubTab === 'conquistas' && (
             <AchievementsPanel />
          )}
          {hubTab === 'prestagio' && (
             <QuantumPrestigePanel />
          )}`;
code = code.replace(oldCase, newCase);

fs.writeFileSync('src/pages/HubScene.tsx', code);
