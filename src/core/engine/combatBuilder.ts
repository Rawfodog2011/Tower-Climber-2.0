import { Player, Monster } from '../../types';
import { CombatState, CombatResult } from './combat';
import { CombatEvent } from './combatEvents';

export class CombatTurnBuilder {
  private state: CombatState;
  private events: CombatEvent[] = [];
  private result: CombatResult | null = null;

  constructor(initialState: CombatState) {
    // Deep clone to ensure immutability of the incoming state
    this.state = JSON.parse(JSON.stringify(initialState));
    this.events = [];
  }

  public getState(): CombatState {
    return this.state;
  }

  public getEvents(): CombatEvent[] {
    return this.events;
  }

  public getResult(): CombatResult | null {
    return this.result;
  }

  // --- Core State Updates ---
  
  public setPlayerGuarding(isGuarding: boolean) {
    this.state.isPlayerGuarding = isGuarding;
  }
  
  public deactivateBossPuzzle() {
    if (this.state.bossPuzzle) {
      this.state.bossPuzzle.active = false;
    }
  }

  public trackSkillUse(skillId: string, cooldown: number, mpCost: number) {
    this.state.cooldowns[skillId] = cooldown;
    this.state.adaptationTrackers.skillsUsed += 1;
    this.state.adaptationTrackers.epSpent += mpCost;
  }
  
  public trackBasicAttack() {
    this.state.adaptationTrackers.basicAttacks += 1;
  }
  
  public tickCooldowns() {
    for (const key in this.state.cooldowns) {
      if (this.state.cooldowns[key] > 0) {
        this.state.cooldowns[key]--;
      }
    }
  }
  
  public tickStatuses() {
    this.state.playerStatuses = this.state.playerStatuses.map(st => ({...st, duration: st.duration - 1})).filter(st => {
      if(st.duration <= 0) {
        this.events.push({ type: 'STATUS_REMOVED', target: 'player', statusType: st.type });
        return false;
      }
      return true;
    });
    
    this.state.monsterStatuses = this.state.monsterStatuses.map(st => ({...st, duration: st.duration - 1})).filter(st => {
      if(st.duration <= 0) {
        this.events.push({ type: 'STATUS_REMOVED', target: 'monster', statusType: st.type });
        return false;
      }
      return true;
    });
  }
  
  public incrementRound() {
    this.state.round++;
    this.state.adaptationTrackers.turnsPassed += 1;
    this.events.push({ type: 'TURN_STARTED', round: this.state.round });
  }

  public setMonsterNextIntent(intent: any) {
    this.state.monsterNextIntent = intent;
  }

  // --- Visual & Mechanical Event Triggers ---

  public startAction(actor: 'player' | 'monster', actionName: string, isSkill: boolean = false) {
    this.events.push({ type: 'ACTION_STARTED', actor, actionName, isSkill });
  }

  public applyDamage(target: 'player' | 'monster', amount: number, isCrit: boolean, source: string) {
    let newHp = 0;
    if (target === 'player') {
      this.state.playerHp = Math.max(0, this.state.playerHp - amount);
      newHp = this.state.playerHp;
    } else {
      this.state.monsterHp = Math.max(0, this.state.monsterHp - amount);
      newHp = this.state.monsterHp;
    }
    
    this.events.push({ type: 'DAMAGE_APPLIED', target, amount, isCrit, source, newHp });
    this.events.push({ type: 'CAMERA_SHAKE', intensity: isCrit ? 'heavy' : 'light' });
  }

  public applyHeal(target: 'player' | 'monster', amount: number, source: string, maxHp: number) {
    let newHp = 0;
    if (target === 'player') {
      this.state.playerHp = Math.min(maxHp, this.state.playerHp + amount);
      newHp = this.state.playerHp;
    } else {
      this.state.monsterHp = Math.min(maxHp, this.state.monsterHp + amount);
      newHp = this.state.monsterHp;
    }
    this.events.push({ type: 'HEAL_APPLIED', target, amount, source, newHp });
  }

  public consumeMp(amount: number) {
    this.state.playerMp = Math.max(0, this.state.playerMp - amount);
    this.events.push({ type: 'MP_CONSUMED', target: 'player', amount, newMp: this.state.playerMp });
  }

  public triggerMiss(target: 'player' | 'monster', attacker: string) {
    this.events.push({ type: 'MISS', target, attacker });
  }

  public triggerDodge(target: 'player' | 'monster', attacker: string) {
    this.events.push({ type: 'DODGE', target, attacker });
  }

  public triggerBlock(target: 'player' | 'monster', attacker: string) {
    this.events.push({ type: 'BLOCK', target, attacker });
  }

  public addStatus(target: 'player' | 'monster', status: any) {
    if (target === 'player') {
      this.state.playerStatuses.push(status);
    } else {
      this.state.monsterStatuses.push(status);
    }
    this.events.push({ type: 'STATUS_APPLIED', target, status });
  }

  public setStagger(newValue: number, maxStagger: number) {
    this.state.monsterStagger = Math.max(0, newValue);
    this.events.push({ type: 'STAGGER_CHANGED', target: 'monster', newValue: this.state.monsterStagger });
    
    if (this.state.monsterStagger === 0 && !this.state.isMonsterStaggered) {
      this.state.isMonsterStaggered = true;
      this.events.push({ type: 'STAGGER_BROKEN', target: 'monster' });
    }
  }

  public recoverStagger(maxStagger: number) {
    this.state.isMonsterStaggered = false;
    this.state.monsterStagger = maxStagger;
    this.events.push({ type: 'STAGGER_RECOVERED', target: 'monster', maxStagger });
  }

  public triggerEnrage() {
    this.state.isBossEnraged = true;
    this.events.push({ type: 'BOSS_ENRAGE_TRIGGERED' });
  }

  public addDelay(ms: number) {
    this.events.push({ type: 'WAIT', ms });
  }

  public playSound(sfxId: string) {
    this.events.push({ type: 'PLAY_SOUND', sfxId });
  }

  // --- Specific Semantic Events ---

  public fleeAttempt(success: boolean) {
    this.events.push({ type: 'FLEE_ATTEMPT', success });
  }

  public bossPuzzleResult(success: boolean) {
    this.events.push({ type: 'BOSS_PUZZLE_RESULT', success });
  }

  public monsterStunnedSkip(monsterName: string) {
    this.events.push({ type: 'MONSTER_STUNNED_SKIP', monsterName });
  }

  public staggerFail(monsterName: string) {
    this.events.push({ type: 'STAGGER_FAIL', monsterName });
  }

  public debuffResisted(target: 'player' | 'monster') {
    this.events.push({ type: 'DEBUFF_RESISTED', target });
  }

  // --- Finalization ---

  public triggerLevelUp(newLevel: number) {
    this.events.push({ type: 'LEVEL_UP', newLevel });
  }

  public endCombat(winner: 'player' | 'flee' | 'exhausted' | 'monster', result: any) {
    this.state.isActive = false;
    this.result = result;
    this.events.push({ type: 'COMBAT_END', winner, result });
  }
}
