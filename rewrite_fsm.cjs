const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

const newProcessTurn = `
export type CombatFsmStateId = 
  | 'Idle' 
  | 'PlayerTurn'
  | 'ResolvePlayerAction'
  | 'EnemyTurn'
  | 'ResolveEffects'
  | 'CheckDeaths'
  | 'ResolveVictory'
  | 'ResolveDefeat'
  | 'EndRound'
  | 'BattleFinished';

export interface CombatFsmContext {
  builder: CombatTurnBuilder;
  player: Player;
  currentFloor: number;
  action?: CombatAction;
  pStats: any;
  pPassives: any;
  changeState(newState: CombatFsmStateId): void;
}

export interface FsmState {
  enter?(context: CombatFsmContext): void;
  update(context: CombatFsmContext): void;
  exit?(context: CombatFsmContext): void;
}

class ResolvePlayerActionState implements FsmState {
  update(context: CombatFsmContext) {
    const { builder, player, action, pStats, pPassives } = context;
    if (!action) {
       context.changeState('PlayerTurn');
       return;
    }
    
    const state = builder.getState();
    const mStats = state.monster.stats;
    
    builder.setPlayerGuarding(false);
    if (action.type === 'guard') {
      builder.startAction('player', 'Guarda', false);
      builder.setPlayerGuarding(true);
    } 
    else if (action.type === 'flee') {
      builder.startAction('player', 'Fugir', false);
      const fleeChance = state.monster.isBoss ? 0 : 0.5;
      if (random() < fleeChance) {
        builder.endCombat('flee', null);
        context.changeState('BattleFinished');
        return;
      } else {
        builder.fleeAttempt(false);
      }
    } 
    else if (action.type === 'boss_puzzle') {
      builder.startAction('player', 'Interagir com Terminal', false);
      if (state.bossPuzzle?.active) {
        if (action.port === state.bossPuzzle.correctPort) {
           builder.bossPuzzleResult(true);
           builder.deactivateBossPuzzle();
        } else {
           builder.bossPuzzleResult(false);
           builder.applyDamage("player", Math.floor(pStats.hp * 0.1), false, "Sistema de Segurança");
        }
      }
    } 
    else if (action.type === 'skill') {
      const skill = SKILLS_DATABASE[action.skillId];
      if (skill) {
        builder.startAction('player', skill.name, true);
        builder.consumeMp(skill.mpCost);
        builder.trackSkillUse(skill.id, skill.cooldown, skill.mpCost);
        builder.playSound('skill_cast');
        if (skill.type === 'damage') {
           executeAttack(builder, 'player', skill.name, Math.floor(pStats.atk * skill.multiplier), mStats.def, pPassives, player.level, state.monster.level, true);
        }
        if (skill.type === 'heal') {
           builder.applyHeal('player', Math.floor(pStats.hp * skill.multiplier), skill.name, pStats.hp);
        }
        if (skill.applyStatus) {
           if (random() < skill.applyStatus.chance + pPassives.statusResistance) {
              builder.addStatus("monster", { type: skill.applyStatus.type, duration: skill.applyStatus.duration });
           }
        }
      }
    } 
    else if (action.type === 'attack') {
      builder.startAction('player', 'Ataque Básico', false);
      builder.trackBasicAttack();
      builder.playSound('sword_slash');
      
      const dodgeChance = state.anomaly?.id === 'glitch_field' ? 0.3 : 0.05;
      if (random() < dodgeChance) {
        builder.triggerDodge('monster', 'Jogador');
      } else {
        executeAttack(builder, 'player', 'Jogador', pStats.atk, mStats.def, pPassives, player.level, state.monster.level, false);
      }
      
      if (pPassives.lifesteal > 0 && builder.getState().monsterHp < state.monsterHp) {
         const dmgDealt = state.monsterHp - builder.getState().monsterHp;
         const healAmt = Math.floor(dmgDealt * pPassives.lifesteal);
         if (healAmt > 0) builder.applyHeal('player', healAmt, 'Roubo de Vida', pStats.hp);
      }
    }

    if (builder.getState().monsterStagger <= 0 && !builder.getState().isMonsterStaggered) {
       builder.playSound('guard_break');
    }
    
    builder.addDelay(500);
    context.changeState('CheckDeaths');
    (context as any).nextStateAfterDeaths = 'EnemyTurn';
  }
}

class EnemyTurnState implements FsmState {
  update(context: CombatFsmContext) {
    const { builder, player, pStats, pPassives } = context;
    const state = builder.getState();
    const mStats = state.monster.stats;
    const intent = state.monsterNextIntent;
    
    if (intent && !state.monsterStatuses.some(s => s.type === 'stun')) {
      builder.startAction('monster', intent.skillName || 'Ataque', intent.type !== 'attack');
      
      if (state.isMonsterStaggered && random() < 0.3) {
         builder.staggerFail(state.monster.name);
      } else {
        if (intent.type === 'attack' || intent.type === 'skill' || intent.type === 'ultimate') {
           builder.playSound('monster_attack');
           const dodgeChance = 0.05 + pPassives.statusResistance * 0.1;
           if (random() < dodgeChance) {
             builder.triggerDodge('player', state.monster.name);
           } else {
             executeAttack(builder, 'monster', state.monster.name, intent.value || mStats.atk, state.isPlayerGuarding ? pStats.def * 2 : pStats.def, pPassives, state.monster.level, player.level, intent.type !== 'attack');
           }
        } else if (intent.type === 'buff') {
           builder.addStatus("monster", { type: 'overheat', duration: 3 });
        } else if (intent.type === 'debuff') {
           if (random() > pPassives.statusResistance) {
              builder.addStatus("player", { type: 'corrosion', duration: 3 });
           } else {
              builder.debuffResisted("player");
           }
        }
      }
    } else if (state.monsterStatuses.some(s => s.type === 'stun')) {
      builder.monsterStunnedSkip(state.monster.name);
    }
    
    builder.addDelay(500);
    context.changeState('CheckDeaths');
    (context as any).nextStateAfterDeaths = 'ResolveEffects';
  }
}

class CheckDeathsState implements FsmState {
  update(context: CombatFsmContext) {
    const { builder } = context;
    const state = builder.getState();
    
    if (state.playerHp <= 0) {
       context.changeState('ResolveDefeat');
       return;
    }
    if (state.monsterHp <= 0) {
       context.changeState('ResolveVictory');
       return;
    }
    
    const next = (context as any).nextStateAfterDeaths || 'PlayerTurn';
    context.changeState(next);
  }
}

class ResolveEffectsState implements FsmState {
  update(context: CombatFsmContext) {
    const { builder, pStats } = context;
    const state = builder.getState();
    const mStats = state.monster.stats;
    
    const pStatuses = state.playerStatuses;
    if (pStatuses.some(s => s.type === 'corrosion')) {
      builder.applyDamage('player', Math.floor(pStats.hp * 0.05), false, "Corrosão");
    }
    const mStatuses = state.monsterStatuses;
    if (mStatuses.some(s => s.type === 'corrosion')) {
      builder.applyDamage('monster', Math.floor(mStats.hp * 0.05), false, "Corrosão");
    }
    
    context.changeState('CheckDeaths');
    (context as any).nextStateAfterDeaths = 'EndRound';
  }
}

class EndRoundState implements FsmState {
  update(context: CombatFsmContext) {
    const { builder } = context;
    const state = builder.getState();
    
    builder.tickStatuses();
    builder.tickCooldowns();
    
    if (state.isMonsterStaggered && !state.monsterStatuses.some(s => s.type === 'stun')) {
      builder.recoverStagger(state.monsterMaxStagger);
    }
    
    builder.incrementRound();
    builder.setMonsterNextIntent(generateMonsterIntent(state.monster, builder.getState().round, state.isBossEnraged));
    
    if (builder.getState().round > 100) {
      builder.endCombat('exhausted', null);
      context.changeState('BattleFinished');
    } else {
      context.changeState('PlayerTurn');
    }
  }
}

class ResolveDefeatState implements FsmState {
  update(context: CombatFsmContext) {
    const { builder, player } = context;
    builder.endCombat('monster', null);
    
    const penalizedPlayer = applyDeathPenalty(player);
    (context as any).combatResult = { winner: 'monster', updatedPlayer: penalizedPlayer, logs: [], trackers: builder.getState().adaptationTrackers };
    
    context.changeState('BattleFinished');
  }
}

class ResolveVictoryState implements FsmState {
  update(context: CombatFsmContext) {
    const { builder, player, currentFloor } = context;
    const state = builder.getState();
    
    const xpReward = state.monster.xpReward;
    const timelineBonus = getTimelineMetaBonus();
    const goldReward = Math.floor(state.monster.goldReward * timelineBonus.goldMultiplier);
    const itemsDropped = [];
    
    if (random() <= getDropChanceForFloor(currentFloor, state.monster.isBoss)) {
      const rarity = rollLootRarity(currentFloor, state.monster.isBoss);
      const item = getRandomItemForFloor(rarity, currentFloor);
      if (item) itemsDropped.push(item);
    }
    if (random() <= 0.15 || state.monster.isBoss) {
      const mod = getRandomCircuitModule(currentFloor);
      if (mod) itemsDropped.push(mod);
    }
    
    let shardsDropped = 0;
    if (state.monster.isBoss) {
      shardsDropped = Math.max(1, Math.floor(currentFloor / 10));
    }
    
    let updatedPlayer = addXpAndLevelUp(player, xpReward);
    if (updatedPlayer.level > player.level) {
      builder.triggerLevelUp(updatedPlayer.level);
    }
    
    updatedPlayer.gold += goldReward;
    updatedPlayer.soulShards += shardsDropped;
    updatedPlayer.materials = { ...(updatedPlayer.materials || { common: 0, rare: 0, epic: 0 }) };
    
    const autoDismantleSettings = player.settings?.autoDismantleRarities || [];
    for (const item of itemsDropped) {
       if (autoDismantleSettings.includes(item.rarity)) {
           const matKey = (item.rarity === 'legendary' || item.rarity === 'mythic') ? 'epic' : item.rarity;
           if (updatedPlayer.materials[matKey] >= 300) {
               updatedPlayer.gold += (item.value || 5);
           } else {
               updatedPlayer.materials[matKey] += 1;
           }
       } else {
           updatedPlayer.inventory.push(item);
       }
    }
    
    updatedPlayer.gameStats = { ...updatedPlayer.gameStats };
    updatedPlayer.gameStats.monstersKilled += 1;
    if (state.monster.isBoss) {
      updatedPlayer.gameStats.bossesDefeated += 1;
    }
    
    updatedPlayer.bestiary = { ...updatedPlayer.bestiary };
    const bestiaryId = state.monster.name;
    if (!updatedPlayer.bestiary[bestiaryId]) {
      updatedPlayer.bestiary[bestiaryId] = { name: state.monster.name, kills: 1, firstFloor: currentFloor, lastFloor: currentFloor };
      if (state.currentSector?.hazard) {
        updatedPlayer = updateCatalogContracts(updatedPlayer, state.currentSector.hazard);
      }
    } else {
      updatedPlayer.bestiary[bestiaryId].kills += 1;
      updatedPlayer.bestiary[bestiaryId].lastFloor = currentFloor;
    }
    
    const monsterIdForHunt = state.monster.name.toLowerCase().replace(/ /g, '_');
    updatedPlayer = updateHuntContracts(updatedPlayer, monsterIdForHunt);
    
    const loot = { xp: xpReward, gold: goldReward, items: itemsDropped };
    builder.endCombat('player', loot);
    
    (context as any).combatResult = { winner: 'player', updatedPlayer, logs: [], loot, trackers: state.adaptationTrackers };
    
    context.changeState('BattleFinished');
  }
}

class CombatStateMachine {
  private currentStateId: CombatFsmStateId = 'ResolvePlayerAction';
  private states: Record<string, FsmState>;
  public context: CombatFsmContext;

  constructor(builder: CombatTurnBuilder, player: Player, currentFloor: number, action?: CombatAction) {
    this.context = {
      builder,
      player,
      currentFloor,
      action,
      pStats: calculatePlayerStats(player),
      pPassives: getPlayerPassives(player),
      changeState: (newState: CombatFsmStateId) => {
        const prevState = this.states[this.currentStateId];
        if (prevState && prevState.exit) prevState.exit(this.context);
        this.currentStateId = newState;
        const nextState = this.states[this.currentStateId];
        if (nextState && nextState.enter) nextState.enter(this.context);
      }
    };
    
    this.states = {
      'ResolvePlayerAction': new ResolvePlayerActionState(),
      'EnemyTurn': new EnemyTurnState(),
      'CheckDeaths': new CheckDeathsState(),
      'ResolveEffects': new ResolveEffectsState(),
      'EndRound': new EndRoundState(),
      'ResolveDefeat': new ResolveDefeatState(),
      'ResolveVictory': new ResolveVictoryState(),
      'Idle': { update: () => {} },
      'PlayerTurn': { update: () => {} },
      'BattleFinished': { update: () => {} }
    };
    
    const initialState = builder.getState().fsmState as CombatFsmStateId || 'ResolvePlayerAction';
    this.currentStateId = initialState === 'PlayerTurn' ? 'ResolvePlayerAction' : initialState;
  }

  public run(): { nextState: CombatState; events: CombatEvent[]; combatResult?: CombatResult } {
    let loops = 0;
    while (this.currentStateId !== 'Idle' && this.currentStateId !== 'PlayerTurn' && this.currentStateId !== 'BattleFinished' && loops < 100) {
      const state = this.states[this.currentStateId];
      if (state) {
         state.update(this.context);
      } else {
         this.currentStateId = 'PlayerTurn';
      }
      loops++;
    }
    
    const nextState = this.context.builder.getState();
    nextState.fsmState = this.currentStateId;
    
    return {
      nextState,
      events: this.context.builder.getEvents(),
      combatResult: (this.context as any).combatResult || this.context.builder.getResult() || undefined
    };
  }
}

export function processTurn(
  player: Player,
  state: CombatState,
  action: CombatAction,
  currentFloor: number
): { nextState: CombatState; events: CombatEvent[]; combatResult?: CombatResult } {
  const builder = new CombatTurnBuilder(state);
  const fsm = new CombatStateMachine(builder, player, currentFloor, action);
  return fsm.run();
}
`;

const oldProcessTurnStart = code.indexOf('export function processTurn(');
const executeAttackStart = code.indexOf('function executeAttack(');

if (oldProcessTurnStart > -1 && executeAttackStart > -1) {
  code = code.substring(0, oldProcessTurnStart) + newProcessTurn + '\n' + code.substring(executeAttackStart);
} else {
  console.log("Could not find start and end points.", { oldProcessTurnStart, executeAttackStart });
}

fs.writeFileSync('src/core/engine/combat.ts', code);
