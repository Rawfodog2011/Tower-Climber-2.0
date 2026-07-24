const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

code = code.replace(/const \{[\s\n]*combatState, combatEndMessage, combatSpeed, setCombatSpeed,[\s\n]*combatLogFilter, setCombatLogFilter, dmgPopups, attackerAnimating[\s\n]*\} = useCombatStore\(\);/,
`const {
    combatState, combatEndMessage, combatSpeed, setCombatSpeed,
    combatLogFilter, setCombatLogFilter, dmgPopups, attackerAnimating, isAnimating
  } = useCombatStore();`);

code = code.replace(/disabled=\{player\.isAutoBattleActive \|\| !!combatState\.playerStatuses\?\.some\(s => s\.type === 'stun'\)\}/g,
`disabled={player.isAutoBattleActive || !!combatState.playerStatuses?.some(s => s.type === 'stun') || isAnimating}`);

fs.writeFileSync('src/pages/CombatScene.tsx', code);
