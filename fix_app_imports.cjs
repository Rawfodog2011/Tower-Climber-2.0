const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ useTranslation \} from '\.\/core\/engine\/translation';\n/, '');
code = code.replace(/import \{ useToast \} from '\.\/hooks\/useToast';\n/, '');
code = code.replace(/import \{ useCombatStore \} from '\.\/store\/useCombatStore';\n/, '');
code = code.replace(/import \{ Player \} from '\.\/types';\n/, '');
code = code.replace(/  const \{ language, setLanguage \} = useTranslation\(\);\n/, '');
code = code.replace(/  const \{ player, setPlayer, loadPlayer \} = usePlayerStore\(\);/, '  const { player, loadPlayer } = usePlayerStore();');
code = code.replace(/  const \{ triggerToast \} = useToast\(\);\n/, '');
code = code.replace(/    savedPlayerPreview, setIsContinueRun, isContinueRun\n  \} = useGameUIStore\(\);/, '  } = useGameUIStore();');

fs.writeFileSync('src/App.tsx', code);
