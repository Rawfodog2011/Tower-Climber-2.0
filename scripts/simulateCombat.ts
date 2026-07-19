import { processTurn } from '../src/core/engine/combat';
import { generateMonsterForFloor } from '../src/core/entities/monsters';
import { ITEMS_DATABASE } from '../src/core/entities/items';
import { SKILLS_DATABASE } from '../src/core/entities/skills';
import { CLASSES } from '../src/core/entities/classes';
import { calculatePlayerStats } from '../src/core/entities/player';
import { getExpectedPlayerStats } from '../src/core/math/worldScaling';
import { Player, CombatState } from '../src/types';
import { createMockPlayer } from '../src/core/__tests__/testUtils';

function simulateCombat(playerLevel: number, floor: number, debug: boolean = false): boolean {
  let player = createMockPlayer(playerLevel, floor);
  const finalPStats = calculatePlayerStats(player);
  let monster = generateMonsterForFloor(floor);

  while (monster.isBoss) {
      break; 
  }

  let combatState: CombatState = {
    isActive: true,
    monster,
    monsterHp: monster.stats.hp,
    playerHp: finalPStats.hp,
    playerMp: finalPStats.mp,
    round: 1,
    logs: [],
    playerStatuses: [],
    monsterStatuses: [],
    cooldowns: {},
    adaptationTrackers: {}
  };

  if (debug) {
    console.log(`\n=== F${floor} BATTLE START ===`);
    console.log(`PStats: HP ${finalPStats.hp} ATK ${finalPStats.atk} DEF ${finalPStats.def} SPD ${finalPStats.spd}`);
    console.log(`MStats: HP ${monster.stats.hp} ATK ${monster.stats.atk} DEF ${monster.stats.def} SPD ${monster.stats.spd} (BOSS: ${monster.isBoss})`);
  }

  while (combatState.isActive) {
    let action: any = { type: 'attack' };
    
    if (combatState.playerHp < (finalPStats.hp * 0.3) && !combatState.cooldowns['reparo_emergencia'] && combatState.playerMp >= SKILLS_DATABASE['reparo_emergencia'].mpCost) {
       action = { type: 'skill', skillId: 'reparo_emergencia' };
    } else if (!combatState.cooldowns['mira_laser_calibrada'] && combatState.playerMp >= SKILLS_DATABASE['mira_laser_calibrada'].mpCost) {
       action = { type: 'skill', skillId: 'mira_laser_calibrada' };
    }
    
    if (debug) {
        console.log(`Round ${combatState.round} - Action: ${action.type === 'skill' ? action.skillId : 'attack'}`);
        console.log(`State Before Turn -> Player: [HP ${combatState.playerHp}, MP ${combatState.playerMp}] | Monster: [HP ${combatState.monsterHp}]`);
    }
    
    const { nextState, combatResult } = processTurn(player, combatState, action, floor);
    
    if (debug) {
       for (const l of nextState.logs.slice(combatState.logs.length)) {
           console.log("  LOG:", l);
       }
    }

    if (!nextState.isActive) {
       if (debug) console.log(`Result: ${combatResult?.winner === 'player' ? 'PLAYER WINS' : 'MONSTER WINS'}\n`);
       return combatResult?.winner === 'player';
    }
    combatState = nextState;
    if (combatState.round > 50) return false;
  }
  return false;
}

const floorsToTest = [25];
const iters = 100;

console.log(`--- SIMULATION: Under-leveled (Level 20 at Floor 25) ---`);
for (const floor of floorsToTest) {
  let wins = 0;
  console.log(`Running 1 debug battle:`);
  simulateCombat(20, floor, true);
  
  for (let i = 0; i < iters; i++) {
    if (simulateCombat(20, floor, false)) wins++;
  }
  console.log(`Floor ${floor} (Level 20): ${((wins/iters)*100).toFixed(1)}% win rate over ${iters} runs\n`);
}

console.log(`--- SIMULATION: Normal Progression (Level 25 at Floor 25) ---`);
for (const floor of floorsToTest) {
  let wins = 0;
  console.log(`Running 1 debug battle:`);
  simulateCombat(25, floor, true);
  
  for (let i = 0; i < iters; i++) {
    if (simulateCombat(25, floor, false)) wins++;
  }
  console.log(`Floor ${floor} (Level 25): ${((wins/iters)*100).toFixed(1)}% win rate over ${iters} runs\n`);
}
