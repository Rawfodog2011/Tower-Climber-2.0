const fs = require('fs');
let code = fs.readFileSync('combat.ts.full', 'utf-8');

// We will do a full rewrite of processTurn and executeAttack.
// The easiest way is to cut the file at processTurn, and append our own.

const cutIndex = code.indexOf('export function processTurn');
let header = code.substring(0, cutIndex);

// Add the new imports for CombatTurnBuilder and CombatEvent
header = header.replace(
  "import { CombatQueueAction } from './combatQueue';",
  "import { CombatQueueAction } from './combatQueue';\nimport { CombatEvent } from './combatEvents';\nimport { CombatTurnBuilder } from './combatBuilder';"
);

// We should remove 'logs' from CombatResult just to be clean, or keep it optional.
// I'll leave it as is to not break types unnecessarily.

const newFunctions = `
export function processTurn(
  player: Player,
  state: CombatState,
  action: CombatAction,
  currentFloor: number
): { nextState: CombatState; events: CombatEvent[]; combatResult?: CombatResult } {
  const builder = new CombatTurnBuilder(state);
  const pStats = calculatePlayerStats(player);
  const pPassives = getPlayerPassives(player);
  const mStats = state.monster.stats;

  builder.turnStart(state.round);

  if (state.anomaly?.id === 'magnetic_storm') {
     // Apply some effect or just note it
  }

  // --- PLAYER PHASE ---
  builder.mutateState(s => s.isPlayerGuarding = false);

  if (action.type === 'guard') {
    builder.actionStart('player', 'Guarda', false);
    builder.mutateState(s => s.isPlayerGuarding = true);
    // Maybe an event for guarding
  } 
  else if (action.type === 'flee') {
    builder.actionStart('player', 'Fugir', false);
    const fleeChance = state.monster.isBoss ? 0 : 0.5;
    if (random() < fleeChance) {
      builder.endCombat('flee', null);
      return { nextState: builder.getState(), events: builder.getEvents(), combatResult: { winner: 'flee' as 'flee', updatedPlayer: player, logs: [] } };
    } else {
      builder.message("Você tentou fugir, mas falhou!");
    }
  } 
  else if (action.type === 'boss_puzzle') {
    builder.actionStart('player', 'Interagir com Terminal', false);
    if (state.bossPuzzle?.active) {
      if (action.port === state.bossPuzzle.correctPort) {
         builder.message("Porta correta! O escudo do chefe caiu!");
         builder.mutateState(s => { if(s.bossPuzzle) s.bossPuzzle.active = false; });
      } else {
         builder.message("Porta incorreta! Dano refletido!");
         builder.damage('player', Math.floor(pStats.hp * 0.1), 'Sistema de Segurança');
      }
    }
  } 
  else if (action.type === 'skill') {
    const skill = SKILLS_DATABASE[action.skillId];
    if (skill) {
      builder.actionStart('player', skill.name, true);
      builder.consumeMp('player', skill.mpCost);
      builder.mutateState(s => {
         s.cooldowns[skill.id] = skill.cooldown;
         s.adaptationTrackers.skillsUsed += 1;
         s.adaptationTrackers.epSpent += skill.mpCost;
      });
      builder.playSound('skill_cast');

      if (skill.type === 'damage') {
         executeAttack(builder, 'player', skill.name, Math.floor(pStats.atk * skill.multiplier), mStats.def, pPassives, player.level, state.monster.level);
         if (false) {
            builder.staggerChange('monster', Math.max(0, builder.getState().monsterStagger - 0));
         }
      }
      if (skill.type === 'heal') {
         builder.heal('player', Math.floor(pStats.hp * skill.multiplier), skill.name, pStats.hp);
      }
      if (skill.applyStatus) {
         if (random() < skill.applyStatus.chance + pPassives.statusResistance) {
            builder.applyStatus('monster', { type: skill.applyStatus.type, duration: skill.applyStatus.duration, potency: 1.0 });
         }
      }
    }
  } 
  else if (action.type === 'attack') {
    builder.actionStart('player', 'Ataque Básico', false);
    builder.mutateState(s => s.adaptationTrackers.basicAttacks += 1);
    builder.playSound('sword_slash');
    
    // Check hit chance
    const dodgeChance = state.anomaly?.id === 'glitch_field' ? 0.3 : 0.05;
    if (random() < dodgeChance) {
      builder.dodge('monster', 'Jogador');
    } else {
      executeAttack(builder, 'player', 'Jogador', pStats.atk, mStats.def, pPassives, player.level, state.monster.level);
    }
    
    if (pPassives.lifesteal > 0 && builder.getState().monsterHp < state.monsterHp) {
       const dmgDealt = state.monsterHp - builder.getState().monsterHp;
       const healAmt = Math.floor(dmgDealt * pPassives.lifesteal);
       if (healAmt > 0) builder.heal('player', healAmt, 'Roubo de Vida', pStats.hp);
    }
  }

  // Check Monster Stagger Break
  if (builder.getState().monsterStagger <= 0 && !builder.getState().isMonsterStaggered) {
     builder.staggerBreak('monster');
     builder.playSound('guard_break');
  }

  builder.wait(500);

  // Check Death early
  if (builder.getState().monsterHp <= 0 || builder.getState().playerHp <= 0) {
    return handleEndOfCombat(builder, player, currentFloor);
  }

  // --- MONSTER PHASE ---
  const intent = builder.getState().monsterNextIntent;
  if (intent && !builder.getState().monsterStatuses.some(s => s.type === 'stun')) {
    builder.actionStart('monster', intent.skillName || 'Ataque', intent.type !== 'attack');
    
    // If monster is staggered, 30% chance to fail action
    if (builder.getState().isMonsterStaggered && random() < 0.3) {
      builder.message(\`\${state.monster.name} tentou atacar, mas falhou devido à quebra de postura!\`);
    } else {
      if (intent.type === 'attack' || intent.type === 'skill' || intent.type === 'ultimate') {
         builder.playSound('monster_attack');
         const dodgeChance = 0.05 + pPassives.statusResistance * 0.1; // simplified dodge
         if (random() < dodgeChance) {
           builder.dodge('player', state.monster.name);
         } else {
           executeAttack(builder, 'monster', state.monster.name, intent.value || mStats.atk, builder.getState().isPlayerGuarding ? pStats.def * 2 : pStats.def, pPassives, state.monster.level, player.level);
         }
      } else if (intent.type === 'buff') {
         builder.applyStatus('monster', { type: 'overheat', duration: 3, potency: 1.0 });
      } else if (intent.type === 'debuff') {
         if (random() > pPassives.statusResistance) {
            builder.applyStatus('player', { type: 'corrosion', duration: 3, potency: 1.0 });
         } else {
            builder.message(\`O jogador resistiu à anomalia!\`);
         }
      }
    }
  } else if (builder.getState().monsterStatuses.some(s => s.type === 'stun')) {
    builder.message(\`\${state.monster.name} está atordoado e perdeu o turno!\`);
  }

  builder.wait(500);

  // --- END OF ROUND EFFECTS ---
  // Process Statuses
  processStatuses(builder, 'player', pStats.hp);
  processStatuses(builder, 'monster', mStats.hp);

  builder.mutateState(s => {
    s.playerStatuses = s.playerStatuses.map(st => ({...st, duration: st.duration - 1})).filter(st => {
      if(st.duration <= 0) { builder.removeStatus('player', st.type); return false; } return true;
    });
    s.monsterStatuses = s.monsterStatuses.map(st => ({...st, duration: st.duration - 1})).filter(st => {
      if(st.duration <= 0) { builder.removeStatus('monster', st.type); return false; } return true;
    });

    for (const key in s.cooldowns) {
      if (s.cooldowns[key] > 0) s.cooldowns[key]--;
    }
  });

  if (builder.getState().isMonsterStaggered && !builder.getState().monsterStatuses.some(s => s.type === 'stun')) {
    builder.staggerRecover('monster', builder.getState().monsterMaxStagger);
  }

  builder.mutateState(s => {
    s.round++;
    s.adaptationTrackers.turnsPassed += 1;
    s.monsterNextIntent = generateMonsterIntent(s.monster, s.round, s.isBossEnraged);
  });

  if (builder.getState().round > 100) {
    builder.endCombat('exhausted', null);
    return { nextState: builder.getState(), events: builder.getEvents(), combatResult: { winner: 'exhausted' as 'exhausted', updatedPlayer: player, logs: [] } };
  }

  if (builder.getState().monsterHp <= 0 || builder.getState().playerHp <= 0) {
    return handleEndOfCombat(builder, player, currentFloor);
  }

  return { nextState: builder.getState(), events: builder.getEvents() };
}

function processStatuses(builder: CombatTurnBuilder, target: 'player'|'monster', maxHp: number) {
   const statuses = target === 'player' ? builder.getState().playerStatuses : builder.getState().monsterStatuses;
   if (statuses.some(s => s.type === 'corrosion')) {
      builder.damage(target, Math.floor(maxHp * 0.05), 'Corrosão');
   }
}

function handleEndOfCombat(builder: CombatTurnBuilder, player: Player, currentFloor: number) {
  const state = builder.getState();
  if (state.playerHp <= 0) {
    builder.endCombat('monster', null);
    const penalizedPlayer = applyDeathPenalty(player);
    return { nextState: state, events: builder.getEvents(), combatResult: { winner: 'monster' as 'monster', updatedPlayer: penalizedPlayer, logs: [], trackers: state.adaptationTrackers } };
  } 
  
  if (state.monsterHp <= 0) {
    // Generate Loot
    const xpReward = state.monster.xpReward;
    const timelineBonus = getTimelineMetaBonus();
    const goldReward = Math.floor(state.monster.goldReward * timelineBonus.goldMultiplier);
    const itemsDropped: Item[] = [];
    
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
      builder.levelUp(updatedPlayer.level);
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
    
    // Bestiary
    updatedPlayer.bestiary = { ...updatedPlayer.bestiary };
    const bestiaryId = state.monster.name;
    if (!updatedPlayer.bestiary[bestiaryId]) {
      updatedPlayer.bestiary[bestiaryId] = {
        name: state.monster.name,
        kills: 1,
        firstFloor: currentFloor,
        lastFloor: currentFloor
      };
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
    return { nextState: builder.getState(), events: builder.getEvents(), combatResult: { winner: 'player' as 'player', updatedPlayer, logs: [], loot, trackers: state.adaptationTrackers } };
  }

  return { nextState: state, events: builder.getEvents() };
}

function executeAttack(
  builder: CombatTurnBuilder,
  attackerTarget: 'player'|'monster',
  attackerName: string, 
  atk: number, 
  def: number, 
  pPassives: any,
  attackerLvl: number = 1, 
  defenderLvl: number = 1
) {
  const state = builder.getState();
  const attackerStatuses = attackerTarget === 'player' ? state.playerStatuses : state.monsterStatuses;
  const targetStatuses = attackerTarget === 'player' ? state.monsterStatuses : state.playerStatuses;
  const target = attackerTarget === 'player' ? 'monster' : 'player';

  if (attackerStatuses.some(s => s.type === 'shock')) {
    if (random() < 0.3) {
      builder.miss(target, attackerName);
      return;
    }
  }

  let finalDef = def;
  if (targetStatuses.some(s => s.type === 'corrosion')) {
    finalDef = Math.floor(def * 0.75);
  }
  
  let additivePercent = [];
  let independentMultipliers = [];

  if (attackerTarget === 'player' && state.isMonsterStaggered) {
    independentMultipliers.push(1.5);
  }
  
  const anomaly = state.anomaly;
  if (anomaly) {
    if (anomaly.id === 'overdrive' && attackerTarget === 'player') additivePercent.push(0.20);
    if (anomaly.id === 'emp_field' && !attackerName.includes('Skill')) independentMultipliers.push(0.5); 
  }

  if (targetStatuses.some(s => s.type === 'overheat')) {
    additivePercent.push(0.30);
  }
  if (targetStatuses.some(s => s.type === 'shock')) {
     independentMultipliers.push(1.5);
  }
  
  const lvlDiff = attackerLvl - defenderLvl;
  let levelMultiplier = 1 + (lvlDiff * 0.15);
  levelMultiplier = Math.max(0.1, Math.min(levelMultiplier, 4.0));
  const variance = 0.85 + random() * 0.30;
  independentMultipliers.push(levelMultiplier * variance);

  const dmg = calculateDamage({
     baseAtk: atk,
     baseDef: finalDef,
     additivePercentModifiers: additivePercent,
     multiplicativeIndependentModifiers: independentMultipliers
  });

  const isCrit = random() < 0.1; // generic crit for now
  const finalDmg = isCrit ? Math.floor(dmg * 1.5) : dmg;
  
  if (attackerTarget === 'monster' && state.isPlayerGuarding) {
     builder.block('player', attackerName);
  }

  builder.damage(target, finalDmg, attackerName, isCrit);
}
`;

fs.writeFileSync('src/core/engine/combat.ts', header + newFunctions);
console.log('Combat.ts replaced.');
