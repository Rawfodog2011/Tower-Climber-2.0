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
  const pStats = calculatePlayerStats(player);`);

code = code.replace(/const pStats = calculatePlayerStats\(player\);\n/, ''); // remove duplicate

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

// Now replace specific actions with queue pushes
code = code.replace(/nextState\.playerHp -= radDmg;/, `nextState.playerHp -= radDmg; queue.push({ type: 'HP_CHANGE', target: 'player', amount: radDmg, isCrit: false, isHeal: false, isMiss: false, newHp: nextState.playerHp });`);
code = code.replace(/nextState\.monsterHp -= radDmg;/, `nextState.monsterHp -= radDmg; queue.push({ type: 'HP_CHANGE', target: 'monster', amount: radDmg, isCrit: false, isHeal: false, isMiss: false, newHp: nextState.monsterHp });`);

// It's a huge file. Writing a full JS AST transform or careful regexes might take too many steps.
// Maybe I can just rewrite the whole file using a generated script?
