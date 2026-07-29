const fs = require('fs');
let code = fs.readFileSync('src/components/AutoBattlePanel.tsx', 'utf8');

// Fix duplicates
code = code.replace(/import \{ SKILLS_DATABASE \} from '..\/core\/entities\/skills';\n/g, '');
code = code.replace(/import \{ SKILLS_DATABASE \} from "..\/core\/entities\/skills";\n/g, '');
code = "import { SKILLS_DATABASE } from '../core/entities/skills';\n" + code;

// Fix condition typing issue (cast as any for now, or to AutoBattleCondition)
code = code.replace(/condition: 'always',/g, "condition: 'always' as any,");
code = code.replace(/condition: 'hp_low',/g, "condition: 'hp_low' as any,");
code = code.replace(/condition: 'mp_high',/g, "condition: 'mp_high' as any,");

// Fix isPassive
code = code.replace(/SKILLS_DATABASE\[id\]\?\.isPassive/g, "(SKILLS_DATABASE[id] as any)?.isPassive");

fs.writeFileSync('src/components/AutoBattlePanel.tsx', code);
