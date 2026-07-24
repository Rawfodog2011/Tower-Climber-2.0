const fs = require('fs');
let code = fs.readFileSync('combat.ts.bak', 'utf8');

code = code.replace(/import \{ getRandomAnomaly \} from '\.\.\/entities\/anomalies';/, 
  "import { getRandomAnomaly } from '../entities/anomalies';\nimport { CombatQueueAction } from './combatQueue';");

code = code.replace(/export function processTurn\([\s\S]*?\): \{ nextState: CombatState; combatResult\?: CombatResult \} \{/,
`export function processTurn(
  player: Player,
  state: CombatState,
  action: CombatAction,
  currentFloor: number
): { nextState: CombatState; queue: CombatQueueAction[]; combatResult?: CombatResult } {
  const queue: CombatQueueAction[] = [];
`);

code = code.replace(/return \{ nextState, combatResult/g, 'return { nextState, queue, combatResult');
code = code.replace(/return \{\n\s*nextState,\n\s*combatResult/g, 'return {\n      nextState,\n      queue,\n      combatResult');
code = code.replace(/return \{ nextState \};/g, 'return { nextState, queue };');

code = code.replace(/const logs = nextState\.logs;/,
`const logs = nextState.logs;
  const originalPush = logs.push.bind(logs);
  logs.push = (...items: string[]) => {
    items.forEach(text => {
      queue.push({ type: 'TEXT_LOG', text });
    });
    return originalPush(...items);
  };
  queue.push({ type: 'ROUND_START', round: nextState.round });`);

// Update the function signature
code = code.replace(/function executeAttack\([\s\S]*?isTargetStaggered: boolean = false\): number \{/, 
`function executeAttack(attackerName: string, atk: number, def: number, targetHp: number, logs: string[], attackerStatuses: import('../../types').StatusEffect[] = [], targetStatuses: import('../../types').StatusEffect[] = [], attackerLvl: number = 1, defenderLvl: number = 1, anomaly?: import('../../types').CombatAnomaly, isPlayerAttacking: boolean = false, isTargetStaggered: boolean = false, queue?: CombatQueueAction[]): number {`);

// Update calls to executeAttack
code = code.replace(/nextState\.monsterHp = executeAttack\('Jogador', pStats\.atk, mStats\.def, nextState\.monsterHp, logs, nextState\.playerStatuses, nextState\.monsterStatuses, player\.level, currentFloor, state\.anomaly, true, nextState\.isMonsterStaggered\);/g, 
`nextState.monsterHp = executeAttack('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered, queue);`);

code = code.replace(/nextState\.monsterHp = executeAttack\('Jogador \(Skill\)', skillAtk, mStats\.def, nextState\.monsterHp, logs, nextState\.playerStatuses, nextState\.monsterStatuses, player\.level, currentFloor, state\.anomaly, true, nextState\.isMonsterStaggered\);/g,
`nextState.monsterHp = executeAttack('Jogador (Skill)', skillAtk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered, queue);`);

code = code.replace(/nextState\.playerHp = executeAttack\(nextState\.monster\.name, atkToUse, pStats\.def, nextState\.playerHp, logs, nextState\.monsterStatuses, nextState\.playerStatuses, currentFloor, player\.level, state\.anomaly, false\);/g,
`nextState.playerHp = executeAttack(nextState.monster.name, atkToUse, pStats.def, nextState.playerHp, logs, nextState.monsterStatuses, nextState.playerStatuses, currentFloor, player.level, state.anomaly, false, false, queue);`);

// Now, update inside executeAttack to push HP_CHANGE
code = code.replace(/logs\.push\(`\$\{attackerName\} ataca e causa \$\{dmg\} de dano! \(HP alvo restante: \$\{newHp\}\)`\);\n\s*return newHp;/,
`logs.push(\`\$\{attackerName\} ataca e causa \$\{dmg\} de dano! (HP alvo restante: \$\{newHp\})\`);
  if (queue) queue.push({ type: 'HP_CHANGE', target: isPlayerAttacking ? 'monster' : 'player', amount: dmg, isCrit: false, isHeal: false, isMiss: false, newHp });
  return newHp;`);

fs.writeFileSync('src/core/engine/combat.ts', code);
