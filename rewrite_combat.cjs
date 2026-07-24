const fs = require('fs');
let code = fs.readFileSync('combat.ts.bak', 'utf8');

// We will inject the new queue type and modify the processTurn signature.
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

// For any return { nextState... } we need to inject queue
code = code.replace(/return \{ nextState, combatResult/g, 'return { nextState, queue, combatResult');
code = code.replace(/return \{\n\s*nextState,\n\s*combatResult/g, 'return {\n      nextState,\n      queue,\n      combatResult');
code = code.replace(/return \{ nextState \};/g, 'return { nextState, queue };');

// Now, we inject the queue into executeAttack
code = code.replace(/function executeAttack\([\s\S]*?isTargetStaggered: boolean = false\): number \{/, 
`function executeAttack(attackerName: string, atk: number, def: number, targetHp: number, logs: string[], attackerStatuses: import('../../types').StatusEffect[] = [], targetStatuses: import('../../types').StatusEffect[] = [], attackerLvl: number = 1, defenderLvl: number = 1, anomaly?: import('../../types').CombatAnomaly, isPlayerAttacking: boolean = false, isTargetStaggered: boolean = false, queue?: CombatQueueAction[]): number {`);

// Hook logs.push in processTurn to also output TEXT_LOG to queue
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

// Now we need to pass queue to executeAttack
code = code.replace(/executeAttack\(nextState\.monster\.name, atkToUse, pStats\.def, nextState\.playerHp, logs, nextState\.monsterStatuses, nextState\.playerStatuses, currentFloor, player\.level, state\.anomaly, false\)/g,
`executeAttack(nextState.monster.name, atkToUse, pStats.def, nextState.playerHp, logs, nextState.monsterStatuses, nextState.playerStatuses, currentFloor, player.level, state.anomaly, false, nextState.isPlayerGuarding, queue)`);

code = code.replace(/executeAttack\('Jogador', pStats\.atk, mDef, nextState\.monsterHp, logs, nextState\.playerStatuses, nextState\.monsterStatuses, player\.level, currentFloor, state\.anomaly, true, nextState\.isMonsterStaggered\)/g,
`executeAttack('Jogador', pStats.atk, mDef, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered, queue)`);

// Wait, the arguments to executeAttack are: 
// attackerName, atk, def, targetHp, logs, attackerStatuses, targetStatuses, attackerLvl, defenderLvl, anomaly, isPlayerAttacking, isTargetStaggered.
// My replace string added `nextState.isPlayerGuarding` into `isTargetStaggered` position!
// Let's refine this replace:
