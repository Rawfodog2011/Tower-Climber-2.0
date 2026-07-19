import { describe, it, expect } from 'vitest';
import { getXpRequiredForNextLevel } from '../math/progression';
import { getMonsterScalingForFloor, getRarityProbabilitiesForFloor, getDropChanceForFloor, getExpectedPlayerStats } from '../math/worldScaling';
import { processTurn, CombatState } from '../engine/combat';
import { generateMonsterForFloor } from '../entities/monsters';
import { calculatePlayerStats } from '../entities/player';
import { Player } from '../../types';
import { SKILLS_DATABASE } from '../entities/skills';
import { createMockPlayer } from './testUtils';

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
      const p = createMockPlayer(playerLevel, floor);

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
        adaptationTrackers: {
          damageTaken: 0,
          basicAttacks: 0,
          epSpent: 0,
          turnsPassed: 0,
          skillsUsed: 0
        }
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
