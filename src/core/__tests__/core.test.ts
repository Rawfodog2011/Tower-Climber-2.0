import { describe, it, expect } from 'vitest';
import { getXpRequiredForNextLevel } from '../math/progression';
import { getMonsterScalingForFloor, getRarityProbabilitiesForFloor, getDropChanceForFloor, getExpectedPlayerStats } from '../math/worldScaling';
import { processTurn, CombatState } from '../engine/combat';
import { generateMonsterForFloor } from '../entities/monsters';
import { calculatePlayerStats } from '../entities/player';
import { Player } from '../../types';
import { SKILLS_DATABASE, canClassUseSkill } from '../entities/skills';
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
        monsterStagger: monster.stats.hp * 0.35,
        monsterMaxStagger: monster.stats.hp * 0.35,
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
    console.log(`Level 25 Combat Win Rate: ${(winRate * 100).toFixed(1)}% (${wins}/${iters})`);
    // Win rate acima de 85% indica que o jogador está overpowered em relação ao andar equivalente, contrariando a curva de dificuldade "50/50" da Seção 14 do GDD.md.
    expect(winRate).toBeGreaterThan(0.3);
    expect(winRate).toBeLessThan(0.85);
  });

  it('verifica combate balanceado no nível 70 (andar 70)', () => {
    const floor = 70;
    const playerLevel = 70;
    const iters = 20;
    let wins = 0;

    for (let i = 0; i < iters; i++) {
      const p = createMockPlayer(playerLevel, floor);
      const finalPStats = calculatePlayerStats(p);
      const monster = generateMonsterForFloor(floor);

      const availableSkills = Object.values(SKILLS_DATABASE).filter(s => canClassUseSkill(p.currentClassId, s));
      const healSkill = availableSkills.find(s => s.type === 'heal') || SKILLS_DATABASE['reparo_emergencia'];
      const damageSkill = [...availableSkills].reverse().find(s => s.type === 'damage') || SKILLS_DATABASE['mira_laser_calibrada'];

      let combatState: CombatState = {
        isActive: true,
        monster,
        monsterHp: monster.stats.hp,
        monsterStagger: monster.stats.hp * 0.35,
        monsterMaxStagger: monster.stats.hp * 0.35,
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
        
        const available = p.learnedSkills
          .map(id => SKILLS_DATABASE[id])
          .filter(s => s && (combatState.cooldowns[s.id] || 0) <= 0 && combatState.playerMp >= s.mpCost);

        if (available.length > 0) {
          const heal = available.find(s => s.type === 'heal');
          if (combatState.playerHp < (finalPStats.hp * 0.35) && heal) {
            action = { type: 'skill', skillId: heal.id };
          } else {
            const dmg = available
              .filter(s => s.type === 'damage')
              .sort((a, b) => b.multiplier - a.multiplier)[0];
            if (dmg) action = { type: 'skill', skillId: dmg.id };
          }
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
    console.log(`Level 70 Combat Win Rate: ${(winRate * 100).toFixed(1)}% (${wins}/${iters})`);
    // Win rate acima de 85% indica que o jogador está overpowered em relação ao andar equivalente, contrariando a curva de dificuldade "50/50" da Seção 14 do GDD.md.
    expect(winRate).toBeGreaterThanOrEqual(0.3);
    expect(winRate).toBeLessThan(0.85);
  });

  it('verifica combate balanceado no nível 100 (andar 100 com monstro comum do andar 99)', () => {
    const floor = 100;
    const playerLevel = 100;
    const iters = 20;
    let wins = 0;

    for (let i = 0; i < iters; i++) {
      const p = createMockPlayer(playerLevel, floor);
      const finalPStats = calculatePlayerStats(p);
      // Andar 100 é mainframe_prime (boss fixo); usando monstro comum do andar 99 para curva de combate comum
      const monster = generateMonsterForFloor(99);

      let combatState: CombatState = {
        isActive: true,
        monster,
        monsterHp: monster.stats.hp,
        monsterStagger: monster.stats.hp * 0.35,
        monsterMaxStagger: monster.stats.hp * 0.35,
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
        
        const available = p.learnedSkills
          .map(id => SKILLS_DATABASE[id])
          .filter(s => s && (combatState.cooldowns[s.id] || 0) <= 0 && combatState.playerMp >= s.mpCost);

        if (available.length > 0) {
          const heal = available.find(s => s.type === 'heal');
          if (combatState.playerHp < (finalPStats.hp * 0.35) && heal) {
            action = { type: 'skill', skillId: heal.id };
          } else {
            const dmg = available
              .filter(s => s.type === 'damage')
              .sort((a, b) => b.multiplier - a.multiplier)[0];
            if (dmg) action = { type: 'skill', skillId: dmg.id };
          }
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
    console.log(`Level 100 Combat Win Rate: ${(winRate * 100).toFixed(1)}% (${wins}/${iters})`);
    // Win rate acima de 85% indica que o jogador está overpowered em relação ao andar equivalente, contrariando a curva de dificuldade "50/50" da Seção 14 do GDD.md.
    expect(winRate).toBeGreaterThanOrEqual(0.3);
    expect(winRate).toBeLessThan(0.85);
  });

  it('verifica evoluções de nível 70 e 100, narrativas e fragmentos de memória', async () => {
    const { CLASSES, getAvailableEvolutions, getClassEvolutionNarrative } = await import('../entities/classes');
    const { getMemoryFragment } = await import('../entities/memories');

    const level40Ids = [
      'juggernaut_industrial', 'ciborgue_combate', 'arquiteto_sistemas', 'tecnomante',
      'atirador_optico', 'fantasma_silicio', 'cirurgiao_mecanico', 'simbionte_sintetico'
    ];

    level40Ids.forEach(id40 => {
      // Level 70 evolutions (Alfa and Beta)
      const evols70 = getAvailableEvolutions(id40, 70);
      expect(evols70.length).toBe(2);

      evols70.forEach(cls70 => {
        expect(cls70.requiredLevel).toBe(70);
        expect(cls70.name).toBeTruthy();
        expect(typeof cls70.name).toBe('string');
        expect(cls70.name).not.toContain('undefined');
        expect(cls70.name).not.toContain('[object Object]');

        expect(cls70.description).toBeTruthy();
        expect(typeof cls70.description).toBe('string');
        expect(cls70.description).not.toContain('undefined');

        // Check narrative
        const narrative70 = getClassEvolutionNarrative(cls70.id, 'ciborgue_foragido');
        expect(narrative70).toBeTruthy();
        expect(narrative70).not.toContain('PROTOCOL ATIVADO');

        // Check memory fragment
        const mem70 = getMemoryFragment('ciborgue_foragido', cls70.id);
        expect(mem70.key).toBe(`ciborgue_foragido:${cls70.id}`);
        expect(mem70.coreEventText).toBeTruthy();
        expect(mem70.coreEventText).not.toContain('TODO');

        // Level 100 Ascension
        const evols100 = getAvailableEvolutions(cls70.id, 100);
        expect(evols100.length).toBe(1);

        const cls100 = evols100[0];
        expect(cls100.requiredLevel).toBe(100);
        expect(cls100.name).toBeTruthy();
        expect(typeof cls100.name).toBe('string');
        expect(cls100.name).not.toContain('undefined');

        expect(cls100.description).toBeTruthy();
        expect(typeof cls100.description).toBe('string');

        // Check narrative 100
        const narrative100 = getClassEvolutionNarrative(cls100.id, 'ciborgue_foragido');
        expect(narrative100).toBeTruthy();
        expect(narrative100).not.toContain('PROTOCOL ATIVADO');

        // Check memory fragment 100
        const mem100 = getMemoryFragment('ciborgue_foragido', cls100.id);
        expect(mem100.key).toBe(`ciborgue_foragido:${cls100.id}`);
        expect(mem100.coreEventText).toBeTruthy();
        expect(mem100.coreEventText).not.toContain('TODO');
      });
    });
  });
});
