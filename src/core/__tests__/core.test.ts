import { describe, it, expect } from 'vitest';
import { getXpRequiredForNextLevel } from '../math/progression';
import { getMonsterScalingForFloor, getRarityProbabilitiesForFloor, getDropChanceForFloor } from '../math/worldScaling';

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
});
