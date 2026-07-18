import { describe, it, expect } from 'vitest';
import { getXpRequiredForNextLevel } from '../math/progression';
import { getMonsterScalingForFloor, getRarityProbabilitiesForFloor, getDropChanceForFloor, getExpectedPlayerStats } from '../math/worldScaling';
import { processTurn } from '../engine/combat';
import { generateMonsterForFloor } from '../entities/monsters';
import { calculatePlayerStats } from '../entities/player';
import { Player, CombatState } from '../../types';
import { SKILLS_DATABASE } from '../entities/skills';

describe('Tower Climber Core Math', () => {
  it('calculates XP required per level correctly', () => {
    const xp1 = getXpRequiredForNextLevel(1);
    const xp10 = getXpRequiredForNextLevel(10);
    const xp50 = getXpRequiredForNextLevel(50);
    
    expect(xp1).toBe(40);
    expect(xp10).toBeGreaterThan(xp1);
    expect(xp50).toBeGreaterThan(xp10);
  });

  it('scales monster attributes properly per floor', () => {
    const f1 = getMonsterScalingForFloor(1);
    const f10 = getMonsterScalingForFloor(10);
    const f50 = getMonsterScalingForFloor(50);
    
    expect(f1.hp).toBeLessThan(f10.hp);
    expect(f10.hp).toBeLessThan(f50.hp);
    expect(f50.atk).toBeGreaterThan(f10.atk);
  });

  it('calculates dynamic drop rates properly', () => {
    const dr1 = getDropChanceForFloor(1, false);
    const dr10 = getDropChanceForFloor(10, false);
    
    expect(dr1).toBeCloseTo(0.205, 3); // 0.20 + 1*0.005
    expect(dr10).toBe(0.25); // 0.20 + 10*0.005
    
    const probs1 = getRarityProbabilitiesForFloor(1);
    const probs50 = getRarityProbabilitiesForFloor(50);
    
    // Epic should have higher relative weight at floor 50 vs floor 1
    expect(probs50.epic).toBeGreaterThan(probs1.epic);
  });

  it('verifies players can win combat at their level', () => {
    const floor = 25;
    const playerLevel = 25;
    const iters = 20;
    let wins = 0;

    for (let i = 0; i < iters; i++) {
      const p: Player = {
        level: playerLevel,
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
      const expected = getExpectedPlayerStats(playerLevel);
      p.equipment.weapon!.statModifiers = { atk: expected.atk - basePStats.atk };
      p.equipment.armor!.statModifiers = { hp: expected.hp - basePStats.hp, def: expected.def - basePStats.def };
      p.equipment.accessory1!.statModifiers = { spd: expected.spd - basePStats.spd, mp: 100 };

      const finalPStats = calculatePlayerStats(p);
      const monster = generateMonsterForFloor(floor);

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

      while (combatState.isActive && combatState.round <= 50) {
        let action: any = { type: 'attack' };
        
        if (combatState.playerHp < (finalPStats.hp * 0.3) && !combatState.cooldowns['reparo_emergencia'] && combatState.playerMp >= SKILLS_DATABASE['reparo_emergencia'].mpCost) {
          action = { type: 'skill', skillId: 'reparo_emergencia' };
        } else if (!combatState.cooldowns['mira_laser_calibrada'] && combatState.playerMp >= SKILLS_DATABASE['mira_laser_calibrada'].mpCost) {
          action = { type: 'skill', skillId: 'mira_laser_calibrada' };
        }
        
        const { nextState, combatResult } = processTurn(p, combatState, action, floor);
        if (!nextState.isActive) {
          if (combatResult?.winner === 'player') wins++;
          break;
        }
        combatState = nextState;
      }
    }

    const winRate = wins / iters;
    expect(winRate).toBeGreaterThan(0.3);
  });
});
