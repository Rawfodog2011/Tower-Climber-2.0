const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

if (!code.includes('fsmState?:')) {
  code = code.replace(/export interface CombatState \{/g, "export interface CombatState {\n  fsmState?: string;");
  fs.writeFileSync('src/core/engine/combat.ts', code);
}
