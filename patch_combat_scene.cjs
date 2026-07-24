const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

if (!code.includes('useCombatQueueRunner')) {
  code = code.replace(/import \{ useCombatLogic \} from '\.\.\/hooks\/useCombatLogic';/,
    `import { useCombatLogic } from '../hooks/useCombatLogic';\nimport { useCombatQueueRunner } from '../hooks/useCombatQueueRunner';`);
  
  code = code.replace(/const \{ handleCombatAction \} = useCombatLogic\(\);/,
    `const { handleCombatAction } = useCombatLogic();\n  useCombatQueueRunner();`);
  
  fs.writeFileSync('src/pages/CombatScene.tsx', code);
}
