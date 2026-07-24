import { random } from './rng';
import { Player, Monster, Item, Skill } from '../../types';
import { calculatePlayerStats, applyDeathPenalty, addXpAndLevelUp } from '../entities/player';
import { getDropChanceForFloor, rollLootRarity, getSectorForFloor } from '../math/worldScaling';
import { getRandomItemForFloor, getRandomCircuitModule } from '../entities/items';
import { updateHuntContracts, updateCatalogContracts } from './contracts';
import { NEURAL_MATRIX_DATABASE } from '../entities/neuralMatrix';
import { canClassUseSkill } from '../entities/skills';
import { SKILLS_DATABASE } from '../entities/skills';
import { calculateDamage } from '../math/damagePipeline';
import { getRandomAnomaly } from '../entities/anomalies';
import { CombatQueueAction } from './combatQueue';
import { getTimelineMetaBonus } from './timelineCodex';

export interface CombatResult {
  winner: 'player' | 'monster' | 'exhausted' | 'flee';
  updatedPlayer: Player;
  logs: string[];
  loot?: {
    gold: number;
    xp: number;
    items: Item[];
  };
  trackers?: {
    damageTaken: number;
    basicAttacks: number;
    epSpent: number;
    turnsPassed: number;
    skillsUsed: number;
  };
}

export interface MonsterIntent {
  type: 'attack' | 'skill' | 'buff' | 'debuff' | 'ultimate';
  skillName?: string;
  value?: number;
}

export interface CombatState {
  isActive: boolean;
  round: number;
  playerHp: number;
  playerMp: number;
  monsterHp: number;
  monsterStagger: number;
  monsterMaxStagger: number;
  isMonsterStaggered?: boolean;
  isPlayerGuarding?: boolean;
  monster: Monster;
  monsterNextIntent?: MonsterIntent;
  logs: string[];
  cooldowns: Record<string, number>;
  isBossEnraged?: boolean;
  adaptationTrackers: {
    damageTaken: number;
    basicAttacks: number;
    epSpent: number;
    turnsPassed: number;
    skillsUsed: number;
  };
  playerStatuses: import('../../types').StatusEffect[];
  monsterStatuses: import('../../types').StatusEffect[];
  currentSector?: import('../../types').SectorDefinition;
  bossPuzzle?: { vibrationHz: number, temperatureC: number, correctPort: number, active: boolean };
  anomaly?: import('../../types').CombatAnomaly;
}

export type CombatAction = { type: 'attack' } | { type: 'skill', skillId: string } | { type: 'boss_puzzle', port: number } | { type: 'flee' } | { type: 'guard' };

function generateMonsterIntent(monster: Monster, round: number, isEnraged?: boolean): MonsterIntent {
  // Bosses have specific patterns
  if (monster.isBoss) {
    if (monster.id === 'mainframe_prime' && round % 5 === 0) {
      return { type: 'ultimate', skillName: 'Protocolo de Extermínio' };
    }
    if (isEnraged) {
      if (random() < 0.4) return { type: 'attack', value: Math.floor(monster.stats.atk * 1.5) };
      return { type: 'skill', skillName: 'Golpe Esmagador', value: Math.floor(monster.stats.atk * 2.0) };
    }
    // Normal Boss
    const roll = random();
    if (roll < 0.2) return { type: 'debuff', skillName: 'Anomalia Radiotiva' };
    if (roll < 0.5) return { type: 'skill', skillName: 'Golpe Pesado', value: Math.floor(monster.stats.atk * 1.3) };
    return { type: 'attack', value: monster.stats.atk };
  }

  // Normal monsters
  const roll = random();
  // Elites have a higher chance to use skills
  const skillChance = 0.15;
  
  if (roll < skillChance) {
    if (random() > 0.5) {
       return { type: 'buff', skillName: 'Carregar Energia' };
    } else {
       return { type: 'skill', skillName: 'Ataque Selvagem', value: Math.floor(monster.stats.atk * 1.5) };
    }
  }
  
  return { type: 'attack', value: monster.stats.atk };
}

/**
 * Mitigação de Dano:
 * Fórmula: Dano = (ATK * ATK) / (ATK + DEF)
 * 
 * Por que esta fórmula?
 * 1. Sem Valores Negativos: O dano nunca é 0 ou menor (salvo se ATK for 0).
 * 2. Retornos Decrescentes: Cada ponto de DEF mitiga um pouco menos que o anterior.
 * 3. Escalonamento Estável: Se ATK = DEF, o dano é reduzido pela metade.
 */
// calculateDamage movido para damagePipeline.ts

export function startCombat(player: Player, monster: Monster, currentFloor: number = 1): CombatState {
  const pStats = calculatePlayerStats(player);
  
  // Obtém as informações do Setor unificado e canônico para o andar atual
  const currentSector: import('../../types').SectorDefinition = getSectorForFloor(currentFloor);

  let anomaly: import('../../types').CombatAnomaly | undefined = undefined;
  const logs = [
      monster.isBoss ? `⚠️ ALERTA DE CHEFE: ${monster.name} emergiu das sombras! ⚠️` : `Um ${monster.name} selvagem apareceu!`,
      `📍 Você está em: ${currentSector.name}`
  ];
  let mHp = monster.stats.hp;
  const rolledAnomaly = getRandomAnomaly();
  if (rolledAnomaly) {
    anomaly = rolledAnomaly;
    logs.push(`✨ [ANOMALIA DETECTADA]: ${anomaly.name} - ${anomaly.description}`);
    if (anomaly.id === 'magnetic_storm') {
      mHp = Math.floor(mHp * 1.3);
    }
  }

  const mMaxStagger = monster.isBoss ? 250 : Math.max(50, Math.floor(mHp * 0.35));

  return {
    isActive: true,
    round: 1,
    playerHp: pStats.hp,
    playerMp: pStats.mp,
    monsterHp: mHp,
    monsterStagger: mMaxStagger,
    monsterMaxStagger: mMaxStagger,
    isMonsterStaggered: false,
    isPlayerGuarding: false,
    monster,
    monsterNextIntent: generateMonsterIntent(monster, 1, false),
    logs,
    cooldowns: {},
    isBossEnraged: false,
    adaptationTrackers: { damageTaken: 0, basicAttacks: 0, epSpent: 0, turnsPassed: 0, skillsUsed: 0 },
    playerStatuses: [],
    monsterStatuses: [],
    currentSector,
    anomaly
  };
}


function getPlayerPassives(player: import('../../types').Player) {
  let lifesteal = 0;
  let statusResistance = 0;
  
  const equipSlots = ['weapon', 'armor', 'helmet', 'pants', 'boots', 'bracers', 'accessory1', 'accessory2', 'accessory3'] as const;
  equipSlots.forEach(slot => {
    const item = player.equipment[slot];
    if (item && item.hardwareSlots) {
      item.hardwareSlots.forEach(mod => {
        if (mod && mod.passiveEffects) {
          lifesteal += mod.passiveEffects.lifesteal || 0;
          statusResistance += mod.passiveEffects.statusResistance || 0;
        }
      });
    }
  });
  
  return { lifesteal, statusResistance };
}

export function processTurn(
  player: Player,
  state: CombatState,
  action: CombatAction,
  currentFloor: number
): { nextState: CombatState; queue: CombatQueueAction[]; combatResult?: CombatResult } {
  const queue: CombatQueueAction[] = [];
  const logAndQueue = (text: string) => {
    nextState.logs.push(text);
    queue.push({ type: 'TEXT_LOG', text });
  };

  const pStats = calculatePlayerStats(player);
  const pPassives = getPlayerPassives(player);
  const mStats = state.monster.stats;

  const nextState: CombatState = {
    ...state,
    logs: [...state.logs],
    cooldowns: { ...state.cooldowns },
    adaptationTrackers: { ...state.adaptationTrackers },
    playerStatuses: state.playerStatuses.map(s => ({ ...s })),
    monsterStatuses: state.monsterStatuses.map(s => ({ ...s }))
  };
  if (state.bossPuzzle) {
    nextState.bossPuzzle = { ...state.bossPuzzle };
  }
  if (action.type === 'flee') {
    nextState.logs.push(`🏃 Retirada Tática... Você abandonou o combate!`);
    nextState.isActive = false;
    let updatedPlayer = { ...player };
    const xpPenalty = Math.floor(updatedPlayer.currentXp * 0.1);
    const goldPenalty = Math.floor(updatedPlayer.gold * 0.1);
    updatedPlayer.currentXp = Math.max(0, updatedPlayer.currentXp - xpPenalty);
    updatedPlayer.gold = Math.max(0, updatedPlayer.gold - goldPenalty);
    return { nextState, combatResult: { winner: 'flee', updatedPlayer, logs: nextState.logs } };
  }

  const logs = nextState.logs;

  logs.push(`--- Turno ${nextState.round} ---`);

  // Aplica DoT (Corrosão) e Efeitos de Setor de Fim/Início de Turno
  const applyStartOfTurnEffects = (targetName: string, statuses: import('../../types').StatusEffect[], hp: number, maxHp: number, isPlayer: boolean = false) => {
    let currentHp = hp;
    
    // Radiation Leak Hazard
    if (state.anomaly && state.anomaly.id === 'radiation_leak') {
       const radDmg = Math.max(1, Math.floor(maxHp * 0.03));
       currentHp -= radDmg;
       logs.push(`☢️ [Vazamento de Radiação] ${targetName} sofre ${radDmg} de dano radiativo!`);
    }

    if (state.anomaly && state.anomaly.id === 'overdrive' && isPlayer) {
       const overDmg = Math.max(1, Math.floor(maxHp * 0.05));
       currentHp -= overDmg;
       logs.push(`⚡ [Protocolo Overdrive] ${targetName} consome ${overDmg} HP para manter os sistemas no limite!`);
    }

    statuses.forEach(s => {
      if (s.type === 'corrosion') {
        let dmg = s.value || Math.floor(maxHp * 0.05) || 1;
        if (state.currentSector?.hazard === 'toxic_refinery') {
          dmg = Math.floor(dmg * 2);
        }
        currentHp -= dmg;
        logs.push(`🟢 [Corrosão] ${targetName} sofre ${dmg} de dano ácido!`);
      }
    });
    return Math.max(0, currentHp);
  };

  nextState.playerHp = applyStartOfTurnEffects('Jogador', nextState.playerStatuses, nextState.playerHp, pStats.hp, true);
  nextState.monsterHp = applyStartOfTurnEffects(nextState.monster.name, nextState.monsterStatuses, nextState.monsterHp, mStats.hp, false);

  // Mecânica de Fúria (Enrage) do Chefe
  if (nextState.monster.isBoss && !nextState.isBossEnraged) {
    const hpPercent = nextState.monsterHp / nextState.monster.stats.hp;
    if (hpPercent < 0.35 || nextState.round > 8) {
      nextState.isBossEnraged = true;
      logs.push(`⚠️ ATENÇÃO: ${nextState.monster.name} entrou em estado de FÚRIA! (+50% ATK) ⚠️`);
    }
  }

  const currentMonsterAtk = nextState.isBossEnraged ? Math.floor(mStats.atk * 1.5) : mStats.atk;
  const playerStarts = pStats.spd >= mStats.spd;

    const executePlayerAction = () => {
    let damageDealt = 0;
    const prevMonsterHp = nextState.monsterHp;
    
    if (action.type === 'guard') {
      nextState.isPlayerGuarding = true;
      const epRegen = Math.max(10, Math.floor(pStats.mp * 0.15));
      nextState.playerMp = Math.min(pStats.mp, nextState.playerMp + epRegen);
      logs.push(`🛡️ [Guarda Ativa] Você adotou uma postura defensiva (+${epRegen} EP)! Dano sofrido reduzido em 50% neste turno.`);
      return;
    }

    if (action.type === 'boss_puzzle') {
      if (nextState.bossPuzzle && nextState.bossPuzzle.active) {
        if (action.port === nextState.bossPuzzle.correctPort) {
          logs.push(`🔌 [SOBRESCRITA BEM-SUCEDIDA] Você redirecionou a energia do Protocolo de Extermínio!`);
          logs.push(`💥 O Núcleo Matriz sofreu um curto-circuito massivo e foi atordoado!`);
          const dmg = Math.floor(mStats.hp * 0.15); // 15% Max HP damage
          nextState.monsterHp -= dmg;
          nextState.monsterStatuses.push({ type: 'stun', duration: 2, value: 0 }); // Fake stun status or just let's add a skip turn flag
          nextState.bossPuzzle.active = false;
        } else {
          logs.push(`❌ [ERRO DE SOBRESCRITA] Porta Incorreta! O Protocolo de Extermínio foi acionado!`);
          const dmg = Math.floor(pStats.hp * 0.8); // 80% Max HP damage
          nextState.playerHp -= dmg;
          logs.push(`🔥 O Núcleo Matriz incinera o jogador causando ${dmg} de dano letal!`);
          nextState.bossPuzzle.active = false;
        }
      }
      return;
    }
    
    let staggerDmg = 0;
    
    if (action.type === 'attack') {
      nextState.monsterHp = executeAttack('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered);
      nextState.adaptationTrackers.basicAttacks += 1;
      staggerDmg = 25;
    } else if (action.type === 'skill') {
      const skill = SKILLS_DATABASE[action.skillId];
      let epCost = skill.mpCost;
      if (player.originId === 'nomade_silicio' && epCost > 0) {
        epCost = Math.max(1, Math.floor(epCost * 0.75));
      }
      if (state.currentSector?.hazard === 'frozen_datacore') {
        epCost = Math.floor(epCost * 1.2);
      }
      if (state.anomaly && state.anomaly.id === 'emp_field') {
        epCost = 0;
      }
      if (nextState.playerMp < epCost) {
        logs.push(`Energia Insuficiente para usar ${skill.name}! Atacando normalmente.`);
        nextState.monsterHp = executeAttack('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered);
        staggerDmg = 25;
      } else if (nextState.cooldowns[skill.id] > 0) {
        logs.push(`${skill.name} está em recarga (${nextState.cooldowns[skill.id]} turnos)! Atacando normalmente.`);
        nextState.monsterHp = executeAttack('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered);
        staggerDmg = 25;
      } else {
        nextState.playerMp -= epCost;
        nextState.adaptationTrackers.epSpent += epCost;
        nextState.adaptationTrackers.skillsUsed += 1;
        const isClassSkill = canClassUseSkill(player.currentClassId, skill);
        const fromNeural = player.unlockedNodes?.some(nodeId => NEURAL_MATRIX_DATABASE[nodeId]?.skillId === skill.id);
        const isUpgraded = isClassSkill && fromNeural;
        
        const finalMultiplier = isUpgraded ? skill.multiplier * 1.5 : skill.multiplier;
        const finalCooldown = isUpgraded ? Math.max(1, skill.cooldown - 1) : skill.cooldown;
        
        nextState.cooldowns[skill.id] = finalCooldown;
        const upgradeTag = isUpgraded ? ' [PROTOCOLO EVOLUÍDO]' : '';

        if (skill.type === 'damage') {
          const skillAtk = Math.floor(pStats.atk * finalMultiplier);
          logs.push(`Jogador usou ${skill.name}${upgradeTag}! (-${epCost} EP)`);
          nextState.monsterHp = executeAttack('Jogador (Skill)', skillAtk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered);
          staggerDmg = Math.floor(35 * finalMultiplier);
          
          if (skill.applyStatus && random() <= skill.applyStatus.chance) {
            let duration = skill.applyStatus.duration;
            if (skill.applyStatus.type === 'overheat' && state.anomaly?.id === 'hyper_cooling' ) {
              // Hyper Cooling check
            }
            if (skill.applyStatus.type === 'overheat' && state.currentSector?.hazard === 'plasma_furnace') {
              duration += 2;
              logs.push(`🔥 [Setor: Fornalha] Sobreaquecimento estendido para ${duration} turnos!`);
            }
            nextState.monsterStatuses.push({ ...skill.applyStatus, duration });
            logs.push(`[SISTEMA] Jogador aplicou ${skill.applyStatus.type.toUpperCase()} no alvo por ${duration} turnos!`);
          }
        } else if (skill.type === 'heal') {
          const healAmount = Math.floor(pStats.hp * finalMultiplier);
          nextState.playerHp = Math.min(pStats.hp, nextState.playerHp + healAmount);
          logs.push(`Jogador usou ${skill.name}${upgradeTag}! Curou ${healAmount} HP. (-${epCost} EP)`);
          
          if (skill.id === 'soro_regenerador') {
            const initialCount = nextState.playerStatuses.length;
            nextState.playerStatuses = nextState.playerStatuses.filter(s => s.type !== 'overheat' && s.type !== 'corrosion');
            const removedCount = initialCount - nextState.playerStatuses.length;
            if (removedCount > 0) {
              logs.push(`🧪 [Soro] Nanites purgaram efeitos negativos de Superaquecimento e Corrosão!`);
            }
            const mpRegen = Math.floor(pStats.mp * 0.10);
            nextState.playerMp = Math.min(pStats.mp, nextState.playerMp + mpRegen);
            logs.push(`🧪 [Soro] Sistemas energéticos carregados em +${mpRegen} EP (10% de carga residual).`);
          }
        }
      }
    }
    
    if (staggerDmg > 0 && !nextState.isMonsterStaggered && nextState.monsterHp > 0) {
      nextState.monsterStagger = Math.max(0, nextState.monsterStagger - staggerDmg);
      if (nextState.monsterStagger <= 0) {
        nextState.isMonsterStaggered = true;
        logs.push(`💥 [QUEBRA DE POSTURA] A guarda de ${nextState.monster.name} foi QUEBRADA! O inimigo está ATORDOADO e vulnerável (+50% Dano)!`);
        nextState.monsterStatuses.push({ type: 'stun', duration: 1, value: 0 });
      }
    }
    
    damageDealt = prevMonsterHp - nextState.monsterHp;
    if (damageDealt > 0 && pPassives.lifesteal > 0) {
      const heal = Math.floor(damageDealt * pPassives.lifesteal);
      if (heal > 0) {
        nextState.playerHp = Math.min(pStats.hp, nextState.playerHp + heal);
        logs.push(`🩸 [Sanguessuga] Jogador absorveu ${heal} HP!`);
      }
    }
  };

    const executeMonsterAction = () => {
      // Hyper Cool check for monster applying overheat to player
      // We don't have monster skills applying overheat yet but just in case we can filter playerStatuses at the end of turn or inside executeMonsterAction.
    if (nextState.monsterStatuses.some(s => s.type === 'stun')) {
      logs.push(`[SISTEMA] ${nextState.monster.name} está ATORDOADO e não pode atacar!`);
      return;
    }
    
    if (nextState.bossPuzzle && nextState.bossPuzzle.active && nextState.monster.id === 'mainframe_prime') {
      // If active, it skips attacking and charges? Or wait, if player didn't answer, does it fire?
      // In processTurn, player acts first if faster. If player acts, they resolve the puzzle.
      // If puzzle is still active when monster acts, it means player didn't use the puzzle action or was slower.
      // But boss puzzle is a player choice, so it's a reaction.
      // Actually, if it's active and player didn't use it, boss fires.
      if (action.type !== 'boss_puzzle') {
        logs.push(`⏳ [FALHA NO TEMPO] O Protocolo de Extermínio foi executado!`);
        const dmg = Math.floor(pStats.hp * 0.8);
        nextState.playerHp -= dmg;
        logs.push(`🔥 O Núcleo Matriz incinera o jogador causando ${dmg} de dano letal!`);
        nextState.bossPuzzle.active = false;
        return;
      }
    }
    
    const intent = nextState.monsterNextIntent || { type: 'attack', value: currentMonsterAtk };
    
    if (intent.type === 'ultimate') {
      logs.push(`⏳ O Protocolo de Extermínio foi acionado pelo inimigo!`);
      const dmg = Math.floor(pStats.hp * 0.8);
      nextState.playerHp = Math.max(0, nextState.playerHp - dmg);
      logs.push(`🔥 O inimigo dispara uma rajada massiva causando ${dmg} de dano letal!`);
      return;
    }

    if (intent.type === 'buff') {
      logs.push(`O inimigo canaliza energia usando ${intent.skillName}! (+ATK Temporário)`);
      return;
    }
    
    if (intent.type === 'debuff') {
      logs.push(`O inimigo espalha esporos usando ${intent.skillName}!`);
      if (random() >= pPassives.statusResistance) {
         const type = random() > 0.5 ? 'corrosion' : 'overheat';
         nextState.playerStatuses.push({ type, duration: 3, value: Math.floor(mStats.atk * 0.15) });
         logs.push(`[ANOMALIA] Inimigo aplicou ${type.toUpperCase()}!`);
      } else {
         logs.push(`🛡️ [Filtro] Jogador resistiu ao efeito negativo!`);
      }
      return;
    }

    const prevHp = nextState.playerHp;
    const atkToUse = intent.value || currentMonsterAtk;
    
    if (intent.type === 'skill') {
      logs.push(`O inimigo usa ${intent.skillName}!`);
    }

    nextState.playerHp = executeAttack(nextState.monster.name, atkToUse, pStats.def, nextState.playerHp, logs, nextState.monsterStatuses, nextState.playerStatuses, currentFloor, player.level, state.anomaly, false);
    let damageTaken = prevHp - nextState.playerHp;
    if (player.originId === 'ciborgue_foragido' && damageTaken > 0) {
      const reduction = Math.floor(damageTaken * 0.05);
      if (reduction > 0) {
        damageTaken -= reduction;
        nextState.playerHp = prevHp - damageTaken;
        logs.push(`🛡️ [Ciborgue] Blindagem Subdérmica reduziu o dano sofrido em ${reduction} (5% mitigação).`);
      }
    }
    if (damageTaken > 0) {
      nextState.adaptationTrackers.damageTaken += damageTaken;
    }
  };

  // Resolução da Ordem (Iniciativa)
  if (playerStarts) {
    if (nextState.playerHp > 0) executePlayerAction();
    if (nextState.monsterHp > 0) executeMonsterAction();
  } else {
    if (nextState.monsterHp > 0) executeMonsterAction();
    if (nextState.playerHp > 0) executePlayerAction();
  }


  // Mega-Boss Final Mechanic Trigger
  if (nextState.monster.id === 'mainframe_prime' && nextState.monsterHp > 0) {
    if (nextState.round % 5 === 0 && (!nextState.bossPuzzle || !nextState.bossPuzzle.active)) {
      logs.push(`⚠️ ATENÇÃO: O NÚCLEO MATRIZ INICIOU O PROTOCOLO DE EXTERMÍNIO! ⚠️`);
      const vib = Math.floor(random() * 50) + 50; // 50 to 100
      const temp = Math.floor(random() * 50) + 50; // 50 to 100
      const port = (vib * 2) + temp;
      nextState.bossPuzzle = {
        active: true,
        vibrationHz: vib,
        temperatureC: temp,
        correctPort: port
      };
      logs.push(`📊 SENSORES: Vibração [${vib} Hz] | Temperatura [${temp} °C]`);
      logs.push(`💡 DICA: Use a Sobrescrita Plug & Play na porta correta (2x Hz + Temp)!`);
    }
  }

  // Plasma Furnace end of turn hazard
  if (state.currentSector?.hazard === 'plasma_furnace') {
    if (nextState.playerHp > 0) {
      const heatDmg = Math.max(1, Math.floor(pStats.hp * 0.02));
      nextState.playerHp -= heatDmg;
      logs.push(`🔥 [Onda de Calor] Jogador sofre ${heatDmg} de dano ambiental!`);
    }
    if (nextState.monsterHp > 0) {
      const heatDmg = Math.max(1, Math.floor(mStats.hp * 0.02));
      nextState.monsterHp -= heatDmg;
      logs.push(`🔥 [Onda de Calor] ${nextState.monster.name} sofre ${heatDmg} de dano ambiental!`);
    }
  }

  // Decrementa Statuses
  nextState.playerStatuses.forEach(s => s.duration--);
  nextState.monsterStatuses.forEach(s => s.duration--);
  nextState.playerStatuses = nextState.playerStatuses.filter(s => s.duration > 0);
  nextState.monsterStatuses = nextState.monsterStatuses.filter(s => s.duration > 0);

  // Origens: Efeitos de Fim de Turno
  if (player.originId === 'ciborgue_foragido') {
    const regen = Math.max(1, Math.floor(pStats.hp * 0.03));
    if (nextState.playerHp > 0 && nextState.playerHp < pStats.hp) {
      nextState.playerHp = Math.min(pStats.hp, nextState.playerHp + regen);
      logs.push(`🛡️ [Origem: Ciborgue] Regenerou ${regen} HP (Blindagem Subdérmica).`);
    }
  }
  if (player.originId === 'nomade_silicio') {
    if (nextState.playerHp > 0 && nextState.playerMp < pStats.mp) {
      nextState.playerMp = Math.min(pStats.mp, nextState.playerMp + 2);
      logs.push(`⚡ [Origem: Nômade] Sincronia de Rede restaurou +2 EP.`);
    }
  }

  // Reduz Cooldowns ao final do turno
  for (const key in nextState.cooldowns) {
    if (nextState.cooldowns[key] > 0) {
      nextState.cooldowns[key]--;
    }
  }

  if (nextState.isMonsterStaggered && !nextState.monsterStatuses.some(s => s.type === 'stun')) {
    nextState.isMonsterStaggered = false;
    nextState.monsterStagger = nextState.monsterMaxStagger;
    logs.push(`🛡️ ${nextState.monster.name} reergueu sua guarda e se recuperou da Quebra de Postura!`);
  }

  if (state.anomaly?.id === 'hyper_cooling') {
    nextState.playerStatuses = nextState.playerStatuses.filter(s => s.type !== 'overheat');
  }
  nextState.round++;
  nextState.adaptationTrackers.turnsPassed += 1;

  // Trava de segurança
  if (nextState.round > 100) {
     logs.push(`O combate se arrastou por tempo demais e os combatentes fugiram exaustos.`);
     nextState.isActive = false;
     return { nextState, combatResult: { winner: 'exhausted', updatedPlayer: player, logs } };
  }

  // Verificação de Condições de Fim de Combate
  if (nextState.playerHp <= 0) {
    nextState.isActive = false;
    logs.push(`O jogador sucumbiu aos ferimentos...`);
    const penalizedPlayer = applyDeathPenalty(player);
    logs.push(`Penalidade de Morte aplicada: Você perdeu 20% do seu Ouro e XP atual.`);
    return {
      nextState,
      combatResult: { winner: 'monster', updatedPlayer: penalizedPlayer, logs, trackers: nextState.adaptationTrackers }
    };
  }

  if (nextState.monsterHp <= 0) {
    nextState.isActive = false;
    logs.push(`Vitória! ${nextState.monster.name} foi derrotado.`);
    
    const timelineBonus = getTimelineMetaBonus();
    const xpReward = nextState.monster.xpReward;
    const goldReward = Math.floor(nextState.monster.goldReward * timelineBonus.goldMultiplier);
    const itemsDropped: Item[] = [];

    if (random() <= getDropChanceForFloor(currentFloor, nextState.monster.isBoss)) {
      const rarity = rollLootRarity(currentFloor, nextState.monster.isBoss);
      const item = getRandomItemForFloor(rarity, currentFloor);
      if (item) itemsDropped.push(item);
    }
    
    // Drop Dinâmico de Módulos de Circuito
    if (random() <= 0.15 || nextState.monster.isBoss) {
      const mod = getRandomCircuitModule(currentFloor);
      if (mod) itemsDropped.push(mod);
    }

    let shardsDropped = 0;
    if (nextState.monster.isBoss) {
      shardsDropped = Math.max(1, Math.floor(currentFloor / 10));
    }
    if (currentFloor > 100) {
      shardsDropped += Math.max(1, Math.floor((currentFloor - 100) / 5) + (nextState.monster.isBoss ? 5 : 1));
    }

    logs.push(`Você recebeu ${xpReward} XP e ${goldReward} Ouro.`);
    if (itemsDropped.length > 0) {
      logs.push(`Loot: ${itemsDropped.map(i => i.name).join(', ')} (${itemsDropped.map(i => i.rarity.toUpperCase()).join(', ')})`);
    }
    if (shardsDropped > 0) {
      logs.push(`Loot Especial: +${shardsDropped} Estilhaços de Alma!`);
    }

    let updatedPlayer = addXpAndLevelUp(player, xpReward);
    updatedPlayer.gold += goldReward;
    updatedPlayer.soulShards += shardsDropped;
    updatedPlayer.materials = { ...(updatedPlayer.materials || { common: 0, rare: 0, epic: 0 }) };
    
    let autoDismantledCount = 0;
    const finalItems: Item[] = [];
    const autoDismantleSettings = player.settings?.autoDismantleRarities || [];

    for (const item of itemsDropped) {
       if (autoDismantleSettings.includes(item.rarity)) {
           const matKey = (item.rarity === 'legendary' || item.rarity === 'mythic') ? 'epic' : item.rarity;
           if (updatedPlayer.materials[matKey] >= 300) {
               // Capacity full, auto-sell
               updatedPlayer.gold += (item.value || 5);
           } else {
               updatedPlayer.materials[matKey] += 1;
           }
           autoDismantledCount++;
       } else {
           finalItems.push(item);
       }
    }

    if (autoDismantledCount > 0) {
        logs.push(`🔧 Auto-Dismantle: ${autoDismantledCount} item(s) convertido(s) em materiais/ouro.`);
    }

    updatedPlayer.inventory = [...updatedPlayer.inventory, ...finalItems];
    updatedPlayer.gameStats = { ...updatedPlayer.gameStats };
    updatedPlayer.gameStats.monstersKilled += 1;
    if (nextState.monster.isBoss) {
      updatedPlayer.gameStats.bossesDefeated += 1;
    }

    if (currentFloor > 100) {
      const abyssalDepth = currentFloor - 100;
      if (abyssalDepth > (updatedPlayer.highestAbyssalDepth || 0)) {
        updatedPlayer.highestAbyssalDepth = abyssalDepth;
      }
    }

    // Bestiary Update
    updatedPlayer.bestiary = { ...updatedPlayer.bestiary };
    const bestiaryId = nextState.monster.name;
    const isNewBestiaryEntry = !updatedPlayer.bestiary[bestiaryId];
    if (isNewBestiaryEntry) {
      updatedPlayer.bestiary[bestiaryId] = {
        name: nextState.monster.name,
        kills: 1,
        firstFloor: currentFloor,
        lastFloor: currentFloor
      };
      // Only increment catalog if it's a new unique monster
      if (nextState.currentSector?.hazard) {
        updatedPlayer = updateCatalogContracts(updatedPlayer, nextState.currentSector.hazard);
      }
    } else {
      updatedPlayer.bestiary[bestiaryId] = {
        ...updatedPlayer.bestiary[bestiaryId],
        kills: updatedPlayer.bestiary[bestiaryId].kills + 1,
        lastFloor: currentFloor
      };
    }

    // Hunt Contracts
    // Notice monsterId isn't perfectly mapped in monster, but nextState.monster.name is a string. 
    // updateHuntContracts checks if targetId is included in monsterId.
    const monsterIdForHunt = nextState.monster.name.toLowerCase().replace(/ /g, '_');
    updatedPlayer = updateHuntContracts(updatedPlayer, monsterIdForHunt);


    if (updatedPlayer.level > player.level) {
      logs.push(`🎉 LEVEL UP! O jogador atingiu o Nível ${updatedPlayer.level}! 🎉`);
    }

    return {
      nextState,
      combatResult: { winner: 'player', updatedPlayer, logs, loot: { xp: xpReward, gold: goldReward, items: itemsDropped }, trackers: nextState.adaptationTrackers }
    };
  }

  nextState.monsterNextIntent = generateMonsterIntent(nextState.monster, nextState.round, nextState.isBossEnraged);

  return { nextState };
}

function executeAttack(attackerName: string, atk: number, def: number, targetHp: number, logs: string[], attackerStatuses: import('../../types').StatusEffect[] = [], targetStatuses: import('../../types').StatusEffect[] = [], attackerLvl: number = 1, defenderLvl: number = 1, anomaly?: import('../../types').CombatAnomaly, isPlayerAttacking: boolean = false, isTargetStaggered: boolean = false, queue?: CombatQueueAction[]): number {
  if (attackerStatuses.some(s => s.type === 'shock')) {
    if (random() < 0.3) {
      logs.push(`⚠️ [Curto-Circuito] ${attackerName} sofreu uma falha no sistema e errou o ataque!`);
      if (queue) queue.push({ type: 'TEXT_LOG', text: `⚠️ [Curto-Circuito] ${attackerName} sofreu uma falha no sistema e errou o ataque!` });
      if (queue) queue.push({ type: 'HP_CHANGE', target: isPlayerAttacking ? 'monster' : 'player', amount: 0, isCrit: false, isHeal: false, isMiss: true, newHp: targetHp });
      return targetHp;
    }
  }

  let finalDef = def;
  if (targetStatuses.some(s => s.type === 'corrosion')) {
    finalDef = Math.floor(def * 0.75);
  }
  
  let additivePercent = [];
  let independentMultipliers = [];

  if (isTargetStaggered) {
    independentMultipliers.push(1.5);
  }

  // Anomaly effects on damage
  if (anomaly) {
    if (anomaly.id === 'overdrive' && isPlayerAttacking) additivePercent.push(0.20);
    if (anomaly.id === 'emp_field' && !attackerName.includes('Skill')) independentMultipliers.push(0.5); // Ataques básicos -50%
  }

  if (targetStatuses.some(s => s.type === 'overheat')) {
    additivePercent.push(0.30);
  }

  if (targetStatuses.some(s => s.type === 'shock')) {
     logs.push(`⚡ Sinergia: Choque ampliou o impacto de ${attackerName}!`);
     if (queue) queue.push({ type: 'TEXT_LOG', text: `⚡ Sinergia: Choque ampliou o impacto de ${attackerName}!` });
     independentMultipliers.push(1.5);
  }
  
  // Level difference scaling (re-implementing what we removed from calculateDamage but using the pipeline correctly if we want, or just add it as a multiplier)
  // Let's use the independent multiplier for level variance so it behaves the same
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

  const newHp = Math.max(0, targetHp - dmg);
  logs.push(`${attackerName} ataca e causa ${dmg} de dano! (HP alvo restante: ${newHp})`);
  if (queue) queue.push({ type: 'TEXT_LOG', text: `${attackerName} ataca e causa ${dmg} de dano! (HP alvo restante: ${newHp})` });
  if (queue) queue.push({ type: 'HP_CHANGE', target: isPlayerAttacking ? 'monster' : 'player', amount: dmg, isCrit: false, isHeal: false, isMiss: false, newHp });
  return newHp;
}
