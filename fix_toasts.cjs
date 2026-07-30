const fs = require('fs');

const filesToUpdate = [
  'src/hooks/useCrafting.ts',
  'src/hooks/useClassEvolution.ts',
  'src/hooks/useCombatLogic.ts',
  'src/hooks/useExploration.ts',
  'src/hooks/useGameEffects.ts'
];

filesToUpdate.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace imports
  code = code.replace(/import \{ useToast \} from '..\/hooks\/useToast';/g, "import { useToastStore } from '../store/useToastStore';");
  code = code.replace(/import \{ useToast \} from '\.\/useToast';/g, "import { useToastStore } from '../store/useToastStore';");
  code = code.replace(/import \{ useToast \} from '..\/useToast';/g, "import { useToastStore } from '../store/useToastStore';");
  
  // Replace instantiation
  code = code.replace(/const \{ triggerToast \} = useToast\(\);/g, "const { triggerToast } = useToastStore();");
  
  fs.writeFileSync(file, code);
});
