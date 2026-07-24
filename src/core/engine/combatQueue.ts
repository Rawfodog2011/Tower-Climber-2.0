import { Monster, Player, StatusEffect, CombatAnomaly } from '../../types';
import { CombatState, CombatResult } from './combat';

export type CombatQueueAction =
  | { type: 'ROUND_START'; round: number }
  | { type: 'TEXT_LOG'; text: string }
  | { type: 'HP_CHANGE'; target: 'player' | 'monster'; amount: number; isCrit: boolean; isHeal: boolean; isMiss: boolean; newHp: number }
  | { type: 'MP_CHANGE'; target: 'player' | 'monster'; amount: number; newMp: number }
  | { type: 'STAGGER_CHANGE'; amount: number; newStagger: number }
  | { type: 'STAGGER_BREAK' }
  | { type: 'STAGGER_RECOVER' }
  | { type: 'STATUS_APPLY'; target: 'player' | 'monster'; statusType: string }
  | { type: 'STATUS_REMOVE'; target: 'player' | 'monster'; statusType: string }
  | { type: 'ATTACK_ANIMATION'; target: 'player' | 'monster' }
  | { type: 'SKILL_ANIMATION'; target: 'player' | 'monster'; skillName: string }
  | { type: 'PLAY_SFX'; sfx: string }
  | { type: 'BOSS_ENRAGE' }
  | { type: 'COMBAT_END'; winner: 'player' | 'monster' | 'exhausted' | 'flee'; result?: CombatResult }
  | { type: 'STATE_SYNC'; state: Partial<CombatState> };
