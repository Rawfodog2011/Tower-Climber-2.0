import { Player, AutoBattleCondition, AutoBattleRule, AutoBattleAction } from '../../types';
import { CombatState, CombatAction } from './combat';
import { calculatePlayerStats } from '../entities/player';
import { SKILLS_DATABASE, canClassUseSkill } from '../entities/skills';
import { NEURAL_MATRIX_DATABASE } from '../entities/neuralMatrix';

export function evaluateCondition(condition: AutoBattleCondition, player: Player, combatState: CombatState): boolean {
  const pStats = calculatePlayerStats(player);
  const pMaxHp = pStats.hp;
  const pMaxMp = pStats.mp;
  
  const mMaxHp = combatState.monster.stats.hp;

  const pHpPct = (combatState.playerHp / pMaxHp) * 100;
  const pMpPct = (combatState.playerMp / pMaxMp) * 100;
  const mHpPct = (combatState.monsterHp / mMaxHp) * 100;

  switch (condition) {
    case 'always': return true;
    case 'hp_lt_25': return pHpPct < 25;
    case 'hp_lt_50': return pHpPct < 50;
    case 'hp_lt_75': return pHpPct < 75;
    case 'mp_lt_50': return pMpPct < 50;
    case 'enemy_hp_lt_50': return mHpPct < 50;
    default: return false;
  }
}

export function getAutoBattleAction(player: Player, combatState: CombatState): CombatAction {
  if (!player.autoBattleRules) return { type: 'attack' };

  for (const rule of player.autoBattleRules) {
    if (evaluateCondition(rule.condition, player, combatState)) {
      if (rule.action === 'attack') {
        return { type: 'attack' };
      } else {
        const skill = SKILLS_DATABASE[rule.action];
        if (skill) {
                    const isNeuralUnlocked = player.unlockedNodes?.some(nodeId => {
            return NEURAL_MATRIX_DATABASE[nodeId]?.skillId === skill.id;
          });
          const canUseClass = canClassUseSkill(player.currentClassId, skill) || isNeuralUnlocked || player.learnedSkills?.includes(skill.id);
          const cd = combatState.cooldowns[skill.id] || 0;
          const noMp = combatState.playerMp < skill.mpCost;
          
          if (canUseClass && cd === 0 && !noMp) {
            return { type: 'skill', skillId: skill.id };
          }
        }
      }
    }
  }

  return { type: 'attack' };
}
