const fs = require('fs');

let typesContent = fs.readFileSync('src/types.ts', 'utf-8');

typesContent = typesContent.replace(
    "export interface AdaptationState {\n  level: number;\n  exp: number;\n}",
    "export interface AdaptationState {\n  level: number;\n  exp: number;\n}\n\nexport interface AdaptationDef {\n  id: string;\n  name: string;\n  description: string;\n  maxLevel: number;\n  expFormula: (level: number) => number;\n  bonusPerLevel: Partial<Stats>;\n  requirements?: string[];\n  grantedSkillId?: string;\n  isFusion?: boolean;\n}"
);

fs.writeFileSync('src/types.ts', typesContent);
console.log("Updated types.ts");
