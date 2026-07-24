import { StatusEffect, Item } from '../../types';
import { CombatResult } from './combat';

export type CombatTarget = 'player' | 'monster';

export type CombatEvent =
  | { type: 'COMBAT_START' }
  | { type: 'TURN_STARTED'; round: number }
  | { type: 'ACTION_STARTED'; actor: CombatTarget; actionName: string; isSkill: boolean }
  | { type: 'DAMAGE_APPLIED'; target: CombatTarget; amount: number; isCrit: boolean; source: string; newHp: number }
  | { type: 'HEAL_APPLIED'; target: CombatTarget; amount: number; source: string; newHp: number }
  | { type: 'MP_CONSUMED'; target: CombatTarget; amount: number; newMp: number }
  | { type: 'MISS'; target: CombatTarget; attacker: string }
  | { type: 'DODGE'; target: CombatTarget; attacker: string }
  | { type: 'BLOCK'; target: CombatTarget; attacker: string }
  | { type: 'STATUS_APPLIED'; target: CombatTarget; status: StatusEffect }
  | { type: 'STATUS_REMOVED'; target: CombatTarget; statusType: string }
  | { type: 'STAGGER_CHANGED'; target: CombatTarget; newValue: number }
  | { type: 'STAGGER_BROKEN'; target: CombatTarget }
  | { type: 'STAGGER_RECOVERED'; target: CombatTarget; maxStagger: number }
  | { type: 'PLAY_SOUND'; sfxId: string }
  | { type: 'CAMERA_SHAKE'; intensity: 'light' | 'medium' | 'heavy' }
  | { type: 'WAIT'; ms: number }
  | { type: 'COMBAT_END'; winner: CombatTarget | 'exhausted' | 'flee'; result: CombatResult }
  | { type: 'BOSS_ENRAGE_TRIGGERED' }
  | { type: 'LEVEL_UP'; newLevel: number }
  | { type: 'TEXT_MESSAGE'; text: string }; // For very specific narrative beats that don't fit semantics
