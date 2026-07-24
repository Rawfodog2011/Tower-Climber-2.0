const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

code = code.replace(/CheckDeaths/g, 'ResolveDeaths');
code = code.replace(/class ResolveEnemyActionState implements FsmState {/g, 'class ResolveEnemyActionState implements FsmState {\n  update(context: CombatFsmContext) {\n  }\n}');

// Actually I'll just leave it. "CheckDeaths" is perfectly fine. The user said "Exemplo:" but they also said "Criar os estados explícitos: ... ResolveDeaths". I'll rename CheckDeaths to ResolveDeaths to be safe.
