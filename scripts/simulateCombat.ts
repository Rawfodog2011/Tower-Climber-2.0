import { processTurn } from '../src/core/engine/combat';
import { generateMonsterForFloor } from '../src/core/entities/monsters';
import { ITEMS_DATABASE } from '../src/core/entities/items';
import { SKILLS_DATABASE } from '../src/core/entities/skills';
import { CLASSES } from '../src/core/entities/classes';
import { calculatePlayerStats } from '../src/core/entities/player';
import { getExpectedPlayerStats } from '../src/core/math/worldScaling';
import { Player, CombatState } from '../src/types';

function createMockPlayer(level: number, floor: number): Player {
  const p: Player = {
    level, // keep actual level so it scales
    currentXp: 0,
    currentClassId: 'tecno_aprendiz',
    gold: 0,
    inventory: [],
    equipment: {
       weapon: { id: 'mock_w', name: 'Mock', type: 'weapon', rarity: 'epic', statModifiers: { atk: 100 } },
       armor: { id: 'mock_a', name: 'Mock', type: 'armor', rarity: 'epic', statModifiers: { def: 100, hp: 250 } },
       accessory1: { id: 'mock_ac', name: 'Mock', type: 'accessory', rarity: 'epic', statModifiers: { spd: 50, mp: 50 } }
    },
    highestFloorUnlocked: floor,
    unlockedNodes: [],
    learnedSkills: ['mira_laser_calibrada', 'reparo_emergencia'],
    materials: { common: 0, rare: 0, epic: 0 },
    adaptationTrackers: {},
    adaptations: {},
    bestiary: {},
    contracts: [],
    gameStats: { monstersKilled: 0, puzzlesSolved: 0, bossesDefeated: 0, deaths: 0 },
    soulShards: 0
  } as any;
  
  const basePStats = calculatePlayerStats({ ...p, equipment: {} } as any);
  const expected = getExpectedPlayerStats(level);
  p.equipment.weapon.statModifiers = { atk: expected.atk - basePStats.atk };
  p.equipment.armor.statModifiers = { hp: expected.hp - basePStats.hp, def: expected.def - basePStats.def };
  p.equipment.accessory1.statModifiers = { spd: expected.spd - basePStats.spd, mp: 100 };
  
  return p;
}

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
const iters = 5;

for (const floor of floorsToTest) {
  let wins = 0;
  for (let i = 0; i < iters; i++) {
    if (simulateCombat(20, floor, true)) wins++;
  }
  console.log(`Floor ${floor}: ${((wins/iters)*100).toFixed(1)}% win rate`);
}
