const fs = require('fs');
let code = fs.readFileSync('combat.ts.bak', 'utf8');

// Imports
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
  const pStats = calculatePlayerStats(player);
  const pPassives = getPlayerPassives(player);
  const mStats = state.monster.stats;

  let _playerHp = state.playerHp;
  let _monsterHp = state.monsterHp;
  let _monsterStagger = state.monsterStagger;
  let _playerMp = state.playerMp;

  const nextState: CombatState = {
    ...state,
    logs: [...state.logs],
    cooldowns: { ...state.cooldowns },
    adaptationTrackers: { ...state.adaptationTrackers },
    playerStatuses: state.playerStatuses.map(s => ({ ...s })),
    monsterStatuses: state.monsterStatuses.map(s => ({ ...s }))
  };

  Object.defineProperty(nextState, 'playerHp', {
    get() { return _playerHp; },
    set(v) { 
      const amount = Math.round(Math.abs(v - _playerHp));
      const isHeal = v > _playerHp;
      if (amount > 0) {
        queue.push({ type: 'HP_CHANGE', target: 'player', amount, isCrit: false, isHeal, isMiss: false, newHp: v });
      }
      _playerHp = v;
    }
  });

  Object.defineProperty(nextState, 'monsterHp', {
    get() { return _monsterHp; },
    set(v) {
      const amount = Math.round(Math.abs(v - _monsterHp));
      const isHeal = v > _monsterHp;
      if (amount > 0) {
        queue.push({ type: 'HP_CHANGE', target: 'monster', amount, isCrit: false, isHeal, isMiss: false, newHp: v });
      }
      _monsterHp = v;
    }
  });

  Object.defineProperty(nextState, 'playerMp', {
    get() { return _playerMp; },
    set(v) {
      const amount = Math.round(Math.abs(v - _playerMp));
      if (amount > 0) {
        queue.push({ type: 'MP_CHANGE', target: 'player', amount, newMp: v });
      }
      _playerMp = v;
    }
  });

  Object.defineProperty(nextState, 'monsterStagger', {
    get() { return _monsterStagger; },
    set(v) {
      const amount = Math.round(Math.abs(v - _monsterStagger));
      if (amount > 0) {
        queue.push({ type: 'STAGGER_CHANGE', amount, newStagger: v });
      }
      _monsterStagger = v;
    }
  });

  const logs = nextState.logs;
  const originalPush = logs.push.bind(logs);
  logs.push = (...items) => {
    items.forEach(text => {
      queue.push({ type: 'TEXT_LOG', text });
    });
    return originalPush(...items);
  };
  
  queue.push({ type: 'ROUND_START', round: nextState.round });

`);

// Also need to remove the variable initializations that we just duplicated
code = code.replace(/  const pStats = calculatePlayerStats\(player\);\n  const pPassives = getPlayerPassives\(player\);\n  const mStats = state\.monster\.stats;\n\n  const nextState: CombatState = \{[\s\S]*?\n  \};\n/m, '');

code = code.replace(/return \{ nextState, combatResult/g, 'return { nextState, queue, combatResult');
code = code.replace(/return \{\n\s*nextState,\n\s*combatResult/g, 'return {\n      nextState,\n      queue,\n      combatResult');
code = code.replace(/return \{ nextState \};/g, 'return { nextState, queue };');

fs.writeFileSync('src/core/engine/combat.ts', code);
