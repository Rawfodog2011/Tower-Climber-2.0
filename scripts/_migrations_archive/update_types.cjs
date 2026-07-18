const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

const newTypes = `export type AutoBattleCondition = 'always' | 'hp_lt_25' | 'hp_lt_50' | 'hp_lt_75' | 'mp_lt_50' | 'enemy_hp_lt_50';
export type AutoBattleAction = 'attack' | string;

export interface AutoBattleRule {
  id: string;
  condition: AutoBattleCondition;
  action: AutoBattleAction;
}

export interface Player {`;

content = content.replace("export interface Player {", newTypes);

const newPlayerFields = `  autoBattleRules: AutoBattleRule[];
  isAutoBattleActive?: boolean;
}`;

content = content.replace(/  gameStats: {[\s\S]*?};\n}/, (match) => {
  return match.slice(0, -1) + `  autoBattleRules: AutoBattleRule[];\n  isAutoBattleActive?: boolean;\n}`;
});

fs.writeFileSync('src/types.ts', content);
