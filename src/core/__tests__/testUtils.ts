import { Player, Item } from '../../types';
import { calculatePlayerStats } from '../entities/player';
import { getExpectedPlayerStats } from '../math/worldScaling';
import { SKILLS_DATABASE, canClassUseSkill } from '../entities/skills';
import { ITEMS_DATABASE, canClassEquipItem, getRandomItemForFloor } from '../entities/items';

export function createMockPlayer(level: number, floor: number, customClassId?: string): Player {
  const chosenClassId = customClassId || (
    level >= 100 ? 'juggernaut_industrial_70a_ascension' :
    level >= 70 ? 'juggernaut_industrial_70a' :
    level >= 40 ? 'juggernaut_industrial' :
    level >= 10 ? 'mecatronico' :
    'tecno_aprendiz'
  );

  const learnedSkills = Object.values(SKILLS_DATABASE)
    .filter(s => canClassUseSkill(chosenClassId, s))
    .map(s => s.id);

  if (level >= 70) {
    const equipSlots = ['weapon', 'armor', 'helmet', 'pants', 'boots', 'bracers', 'accessory1', 'accessory2', 'accessory3'] as const;
    const equipment: Player['equipment'] = {};

    for (const slot of equipSlots) {
      const slotType = slot.startsWith('accessory') ? 'accessory' : slot;
      const itemsForSlot = Object.values(ITEMS_DATABASE).filter(item => 
        item.type === slotType &&
        canClassEquipItem(chosenClassId, item) &&
        (item.rarity === 'epic' || item.rarity === 'rare' || item.rarity === 'legendary')
      );

      if (itemsForSlot.length > 0) {
        const suitable = itemsForSlot.filter(i => (i.requiredLevel || 1) <= level);
        const chosenPool = suitable.length > 0 ? suitable : itemsForSlot;
        const chosen = chosenPool[Math.floor(Math.random() * chosenPool.length)];
        equipment[slot] = { ...chosen };
      } else {
        const fallback = getRandomItemForFloor('epic', floor);
        if (fallback) equipment[slot] = fallback;
      }
    }

    return {
      level,
      currentXp: 0,
      currentClassId: chosenClassId,
      gold: 10000,
      inventory: [],
      equipment,
      highestFloorUnlocked: floor,
      unlockedNodes: [],
      learnedSkills,
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
  }

  // Comportamento original para níveis baixos (<70)
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
    currentClassId: chosenClassId,
    gold: 0,
    inventory: [],
    equipment: {
      weapon: weaponItem,
      armor: armorItem,
      accessory1: accessoryItem
    },
    highestFloorUnlocked: floor,
    unlockedNodes: [],
    learnedSkills,
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

  p.equipment.weapon!.statModifiers = { atk: Math.max(10, expected.atk - basePStats.atk) };
  p.equipment.armor!.statModifiers = { hp: Math.max(50, expected.hp - basePStats.hp), def: Math.max(10, expected.def - basePStats.def) };
  p.equipment.accessory1!.statModifiers = { spd: Math.max(10, expected.spd - basePStats.spd), mp: 200 };

  return p;
}
