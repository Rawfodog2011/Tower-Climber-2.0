const fs = require('fs');
let code = fs.readFileSync('src/components/AutoBattlePanel.tsx', 'utf8');

code = code.replace(/!\(SKILLS_DATABASE\[id\] as any\)\?\.isPassive/g, "!(SKILLS_DATABASE[id] as { isPassive?: boolean })?.isPassive");
code = code.replace(/condition: 'always' as any/g, "condition: 'always'");
code = code.replace(/rules\[idx\]\.condition = e\.target\.value as any;/g, "rules[idx].condition = e.target.value as import('../types').AutoBattleCondition;");

fs.writeFileSync('src/components/AutoBattlePanel.tsx', code);
