import { CombatState } from './combat';
import { CombatEvent, CombatTarget } from './combatEvents';
import { StatusEffect } from '../../types';

export class CombatTurnBuilder {
  private state: CombatState;
  private events: CombatEvent[] = [];

  constructor(initialState: CombatState) {
    // Deep copy enough to not mutate the original state directly
    this.state = {
      ...initialState,
      playerStatuses: initialState.playerStatuses.map(s => ({ ...s })),
      monsterStatuses: initialState.monsterStatuses.map(s => ({ ...s })),
      cooldowns: { ...initialState.cooldowns },
      adaptationTrackers: { ...initialState.adaptationTrackers },
    };
    if (initialState.bossPuzzle) {
      this.state.bossPuzzle = { ...initialState.bossPuzzle };
    }
  }

  public damage(target: CombatTarget, amount: number, source: string, isCrit = false) {
    if (target === 'player') {
      this.state.playerHp = Math.max(0, this.state.playerHp - amount);
      this.events.push({ type: 'DAMAGE_APPLIED', target, amount, isCrit, source, newHp: this.state.playerHp });
    } else {
      this.state.monsterHp = Math.max(0, this.state.monsterHp - amount);
      this.events.push({ type: 'DAMAGE_APPLIED', target, amount, isCrit, source, newHp: this.state.monsterHp });
    }
  }

  public heal(target: CombatTarget, amount: number, source: string, maxHp: number) {
    if (target === 'player') {
      this.state.playerHp = Math.min(maxHp, this.state.playerHp + amount);
      this.events.push({ type: 'HEAL_APPLIED', target, amount, source, newHp: this.state.playerHp });
    } else {
      this.state.monsterHp = Math.min(maxHp, this.state.monsterHp + amount);
      this.events.push({ type: 'HEAL_APPLIED', target, amount, source, newHp: this.state.monsterHp });
    }
  }

  public miss(target: CombatTarget, attacker: string) {
    this.events.push({ type: 'MISS', target, attacker });
  }

  public block(target: CombatTarget, attacker: string) {
    this.events.push({ type: 'BLOCK', target, attacker });
  }

  public dodge(target: CombatTarget, attacker: string) {
    this.events.push({ type: 'DODGE', target, attacker });
  }

  public applyStatus(target: CombatTarget, status: StatusEffect) {
    if (target === 'player') {
      this.state.playerStatuses.push(status);
    } else {
      this.state.monsterStatuses.push(status);
    }
    this.events.push({ type: 'STATUS_APPLIED', target, status });
  }

  public removeStatus(target: CombatTarget, statusType: string) {
    if (target === 'player') {
      this.state.playerStatuses = this.state.playerStatuses.filter(s => s.type !== statusType);
    } else {
      this.state.monsterStatuses = this.state.monsterStatuses.filter(s => s.type !== statusType);
    }
    this.events.push({ type: 'STATUS_REMOVED', target, statusType });
  }

  public consumeMp(target: CombatTarget, amount: number) {
    if (target === 'player') {
      this.state.playerMp = Math.max(0, this.state.playerMp - amount);
      this.events.push({ type: 'MP_CONSUMED', target, amount, newMp: this.state.playerMp });
    }
  }

  public staggerChange(target: CombatTarget, newStagger: number) {
    if (target === 'monster') {
      this.state.monsterStagger = newStagger;
      this.events.push({ type: 'STAGGER_CHANGED', target, newValue: newStagger });
    }
  }

  public staggerBreak(target: CombatTarget) {
    if (target === 'monster') {
      this.state.isMonsterStaggered = true;
      this.events.push({ type: 'STAGGER_BROKEN', target });
    }
  }

  public staggerRecover(target: CombatTarget, maxStagger: number) {
    if (target === 'monster') {
      this.state.isMonsterStaggered = false;
      this.state.monsterStagger = maxStagger;
      this.events.push({ type: 'STAGGER_RECOVERED', target, maxStagger });
    }
  }

  public actionStart(actor: CombatTarget, actionName: string, isSkill = false) {
    this.events.push({ type: 'ACTION_STARTED', actor, actionName, isSkill });
  }

  public turnStart(round: number) {
    this.state.round = round;
    this.events.push({ type: 'TURN_STARTED', round });
  }

  public endCombat(winner: CombatTarget | 'exhausted' | 'flee', result: any) {
    this.state.isActive = false;
    this.events.push({ type: 'COMBAT_END', winner, result });
  }

  public bossEnrage() {
    this.state.isBossEnraged = true;
    this.events.push({ type: 'BOSS_ENRAGE_TRIGGERED' });
  }

  public playSound(sfxId: string) {
    this.events.push({ type: 'PLAY_SOUND', sfxId });
  }

  public wait(ms: number) {
    this.events.push({ type: 'WAIT', ms });
  }

  public message(text: string) {
    this.events.push({ type: 'TEXT_MESSAGE', text });
  }

  public levelUp(newLevel: number) {
    this.events.push({ type: 'LEVEL_UP', newLevel });
  }

  public getState() {
    return this.state;
  }

  public getEvents() {
    return this.events;
  }

  public mutateState(fn: (state: CombatState) => void) {
    fn(this.state);
  }
}
