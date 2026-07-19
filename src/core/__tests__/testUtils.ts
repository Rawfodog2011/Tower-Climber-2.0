import { Player, Item } from '../../types';
import { calculatePlayerStats } from '../entities/player';
import { getExpectedPlayerStats } from '../math/worldScaling';

export function createMockPlayer(level: number, floor: number): Player {
  const weaponItem: Item = {
    id: 'mock_w',
    name: 'Mock Weapon',
    type: 'weapon',
    rarity: 'epic',
    statModifiers: { atk: 100 },
    description: 'Mock',
    value: 0
  };

  const armorItem: Item = {
    id: 'mock_a',
    name: 'Mock Armor',
    type: 'armor',
    rarity: 'epic',
    statModifiers: { def: 100, hp: 250 },
    description: 'Mock',
    value: 0
  };

  const accessoryItem: Item = {
    id: 'mock_ac',
    name: 'Mock Accessory',
    type: 'accessory',
    rarity: 'epic',
    statModifiers: { spd: 50, mp: 50 },
    description: 'Mock',
    value: 0
  };

  const p: Player = {
    level,
    currentXp: 0,
    currentClassId: 'tecno_aprendiz',
    gold: 0,
    inventory: [],
    equipment: {
      weapon: weaponItem,
      armor: armorItem,
      accessory1: accessoryItem
    },
    highestFloorUnlocked: floor,
    unlockedNodes: [],
    learnedSkills: ['mira_laser_calibrada', 'reparo_emergencia'],
    materials: { common: 0, rare: 0, epic: 0 },
    adaptations: {},
    bestiary: {},
    contracts: [],
    gameStats: { monstersKilled: 0, puzzlesSolved: 0, bossesDefeated: 0 },
    soulShards: 0,
    runStats: { goldSpent: 0, totalTurns: 0 },
    matrixPoints: 0,
    relics: {},
    achievements: [],
    autoBattleRules: []
  };

  const basePStats = calculatePlayerStats({ ...p, equipment: {} });
  const expected = getExpectedPlayerStats(level);

  p.equipment.weapon!.statModifiers = { atk: expected.atk - basePStats.atk };
  p.equipment.armor!.statModifiers = { hp: expected.hp - basePStats.hp, def: expected.def - basePStats.def };
  p.equipment.accessory1!.statModifiers = { spd: expected.spd - basePStats.spd, mp: 100 };

  return p;
}
