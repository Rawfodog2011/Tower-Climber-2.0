import { Player, Stats, Manufacturer } from '../../types';
import { CLASSES } from './classes';
import { getAdaptationBonuses } from './adaptations';
import { getXpRequiredForNextLevel } from '../math/progression';
import { NEURAL_MATRIX_DATABASE } from './neuralMatrix';
import { ORIGINS } from './origins';
import { getTimelineMetaBonus } from '../engine/timelineCodex';

/**
 * Calcula os status totais do jogador somando os atributos da Classe base (e seu crescimento por nível)
 * com os modificadores dos equipamentos e multiplicadores passivos das Relíquias.
 */
export function calculatePlayerStats(player: Player): Stats {
  const baseClass = CLASSES[player.currentClassId];
  
  // Status = Status Base + ((Nível - 1) * Crescimento por Nível)
  const stats: Stats = {
    hp: baseClass.baseStats.hp + (player.level - 1) * baseClass.statGrowthPerLevel.hp,
    mp: baseClass.baseStats.mp + (player.level - 1) * baseClass.statGrowthPerLevel.mp,
    atk: baseClass.baseStats.atk + (player.level - 1) * baseClass.statGrowthPerLevel.atk,
    def: baseClass.baseStats.def + (player.level - 1) * baseClass.statGrowthPerLevel.def,
    spd: baseClass.baseStats.spd + (player.level - 1) * baseClass.statGrowthPerLevel.spd,
  };

  // Aplica bônus de Origem/Raça se houver
  if (player.originId && ORIGINS[player.originId]) {
    const origin = ORIGINS[player.originId];
    Object.entries(origin.statModifiers).forEach(([key, val]) => {
      stats[key as keyof Stats] += val || 0;
    });
  }

  // Soma modificadores da Matriz Neural
  if (player.unlockedNodes) {
    player.unlockedNodes.forEach(nodeId => {
      const node = NEURAL_MATRIX_DATABASE[nodeId];
      if (node && node.statBonus) {
        Object.entries(node.statBonus).forEach(([key, val]) => {
          stats[key as keyof Stats] += val || 0;
        });
      }
    });
  }

  // Soma modificadores de equipamentos, se existirem
  const equipSlots = ['weapon', 'armor', 'helmet', 'pants', 'boots', 'bracers', 'accessory1', 'accessory2', 'accessory3'] as const;
  equipSlots.forEach(slot => {
    const item = player.equipment[slot];
    if (item) {
      if (item.statModifiers) {
        Object.entries(item.statModifiers).forEach(([key, val]) => {
          stats[key as keyof Stats] += val || 0;
        });
      }
      if (item.hardwareSlots) {
        item.hardwareSlots.forEach(mod => {
          if (mod?.statModifiers) {
            Object.entries(mod.statModifiers).forEach(([key, val]) => {
              stats[key as keyof Stats] += val || 0;
            });
          }
        });
      }
    }
  });

  // Aplica multiplicadores passivos das Relíquias
  const quantico = (player.relics?.processador_quantico || 0) * 0.01;
  const hpMultiplier = 1 + ((player.relics?.bateria_sanguinea || 0) * 0.02) + quantico;
  const atkMultiplier = 1 + ((player.relics?.lamina_plasma_fibrilada || 0) * 0.02) + quantico;
  const defMultiplier = 1 + ((player.relics?.campo_forca_fractal || 0) * 0.02) + quantico;
  const spdMultiplier = 1 + ((player.relics?.acelerador_particulas || 0) * 0.02) + quantico;
  const mpMultiplier = 1 + ((player.relics?.bateria_auxiliar || 0) * 0.03) + quantico;
  
  // Modulo de Arrefecimento gives MP Regen (handled in combat)

  // Bônus de Corporação/Fabricante (Set Bonus)
  const manufacturerCounts: Record<Manufacturer, number> = {
    Kinetix: 0,
    AeroDynamics: 0,
    OmniCorp: 0
  };

  equipSlots.forEach(slot => {
    const item = player.equipment[slot];
    if (item?.manufacturer) {
      manufacturerCounts[item.manufacturer]++;
    }
  });

  // Aplica Bônus de Adaptações
  const adaptations = getAdaptationBonuses(player);

  let finalHp = Math.floor(stats.hp * hpMultiplier) + adaptations.hp;
  let finalMp = Math.floor(stats.mp * mpMultiplier) + adaptations.mp;
  let finalAtk = Math.floor(stats.atk * atkMultiplier) + adaptations.atk;
  let finalDef = Math.floor(stats.def * defMultiplier) + adaptations.def;
  let finalSpd = Math.floor(stats.spd * spdMultiplier) + adaptations.spd;

  // Aplica Bônus de Set por Fabricante
  // Kinetix: Foco em HP/DEF
  if (manufacturerCounts['Kinetix'] >= 3) {
    finalHp = Math.floor(finalHp * 1.10);
    finalDef = Math.floor(finalDef * 1.10);
  }
  // AeroDynamics: Foco em SPD/Evasão (Evasão ainda não tem status, focamos em SPD)
  if (manufacturerCounts['AeroDynamics'] >= 3) {
    finalSpd = Math.floor(finalSpd * 1.15);
  }
  // OmniCorp: Foco em MP(EP)/T-ATK
  if (manufacturerCounts['OmniCorp'] >= 3) {
    finalMp = Math.floor(finalMp * 1.10);
    finalAtk = Math.floor(finalAtk * 1.10);
  }

  // Bônus maiores para 5 peças ou 7 peças seriam lidos na UI e aplicados no combate 
  // (Imunidade a corrosão no combate, etc). Aqui apenas mudamos status estáticos, 
  // mas vamos salvar os counts se possível? O CombatState pode calcular a imunidade lendo o player.

  // Bônus Meta-Permanentes de Ressonância Quântica (Prestígio)
  if (player.quantumUpgrades) {
    const qBio = (player.quantumUpgrades['quantum_bio'] || 0) * 0.05;
    const qAtk = (player.quantumUpgrades['quantum_atk'] || 0) * 0.05;
    const qDef = (player.quantumUpgrades['quantum_def'] || 0) * 0.05;
    const qMp  = (player.quantumUpgrades['quantum_mp'] || 0) * 0.05;
    const qSpd = (player.quantumUpgrades['quantum_spd'] || 0) * 0.03;

    finalHp = Math.floor(finalHp * (1 + qBio));
    finalAtk = Math.floor(finalAtk * (1 + qAtk));
    finalDef = Math.floor(finalDef * (1 + qDef));
    finalMp = Math.floor(finalMp * (1 + qMp));
    finalSpd = Math.floor(finalSpd * (1 + qSpd));
  }

  return {
    hp: finalHp,
    mp: finalMp,
    atk: finalAtk,
    def: finalDef,
    spd: finalSpd
  };

}

/**
 * Regra do GDD: Penalidade de Morte.
 * O jogador perde 20% do XP atual (não perde nível) e 20% do Ouro atual.
 */
export function applyDeathPenalty(player: Player): Player {
  const newXp = Math.floor(player.currentXp * 0.8);
  const newGold = Math.floor(player.gold * 0.8);

  return {
    ...player,
    currentXp: newXp,
    gold: newGold
  };
}

/**
 * Adiciona XP ao jogador e verifica se ele subiu de nível.
 * Caso ganhe muito XP, lida com múltiplos level ups.
 * Aplica bônus de relíquias.
 */
export function addXpAndLevelUp(player: Player, xpAmount: number): Player {
  let { currentXp, level, matrixPoints = 0 } = player;
  
  // Bônus do Medalhão do Caçador e Códice Temporal
  const timelineBonus = getTimelineMetaBonus();
  const xpMultiplier = (1 + ((player.relics?.chip_aprendizado || 0) * 0.03)) * timelineBonus.xpMultiplier;
  const finalXp = Math.floor(xpAmount * xpMultiplier);
  
  // Se já estiver no cap (nível 100), não ganha mais XP
  if (level >= 100) {
    return {
      ...player,
      level: 100,
      currentXp: 0
    };
  }

  currentXp += finalXp;
  
  let required = getXpRequiredForNextLevel(level);
  while (currentXp >= required && level < 100) {
    currentXp -= required; // Consome o XP necessário para o nível
    level++;
    matrixPoints++;
    if (level >= 100) {
      currentXp = 0;
      break;
    }
    required = getXpRequiredForNextLevel(level);
  }
  
  return {
    ...player,
    currentXp,
    level,
    matrixPoints
  };
}
