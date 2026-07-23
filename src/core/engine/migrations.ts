import { Player } from '../../types';
import { CLASSES } from '../entities/classes';
import { ADAPTATIONS_DATABASE } from '../entities/adaptations';

export const CURRENT_SAVE_VERSION = 2;

export function migrateSave(data: any): Player | null {
  if (!data) return null;

  let player = { ...data };

  // Sanitize equipment to avoid any invalid/legacy/null items
  if (player.equipment) {
    const slots = ['weapon', 'armor', 'helmet', 'pants', 'boots', 'bracers', 'accessory1', 'accessory2', 'accessory3'] as const;
    slots.forEach(slot => {
      const item = player.equipment[slot];
      if (item && (!item.id || !item.rarity || !item.type)) {
        delete player.equipment[slot];
      }
    });
  } else {
    player.equipment = {};
  }

  // Sanitize inventory to filter out any null/undefined or corrupted legacy items
  if (player.inventory) {
    player.inventory = player.inventory.filter((item: any) => item && item.id && item.rarity && item.type);
  } else {
    player.inventory = [];
  }

  // Base missing fields (v0 / legacy)
  if (!player.materials) player.materials = { common: 0, rare: 0, epic: 0 };
  if (typeof player.soulShards !== 'number') player.soulShards = 0;
  if (!player.relics) player.relics = {};
  if (!player.achievements) player.achievements = [];
  if (!player.gameStats) player.gameStats = { monstersKilled: 0, puzzlesSolved: 0, bossesDefeated: 0, deaths: 0 };
  if (!player.runStats) player.runStats = { goldSpent: 0, totalTurns: 0 };
  if (typeof player.matrixPoints !== 'number') player.matrixPoints = Math.max(0, player.level - 1);
  if (!player.unlockedNodes) player.unlockedNodes = ['core_start'];
  if (!player.learnedSkills) player.learnedSkills = [];
  if (!player.autoBattleRules) player.autoBattleRules = [];
  if (player.isAutoBattleActive === undefined) player.isAutoBattleActive = false;
  if (typeof player.totalPlaytimeSeconds !== 'number') player.totalPlaytimeSeconds = 0;
  if (typeof player.quantumLevel !== 'number') player.quantumLevel = 0;
  if (!player.quantumUpgrades) player.quantumUpgrades = {};
  if (typeof player.highestAbyssalDepth !== 'number') player.highestAbyssalDepth = 0;
  if (!player.adaptations) {
    player.adaptations = {
      'blindagem_reativa': { level: 0, exp: 0 },
      'overclock_combate': { level: 0, exp: 0 },
      'dissipacao_calor': { level: 0, exp: 0 }
    };
  }

  // Version 0 -> 1: Class migration and skill cleanup
  if (!player.saveVersion || player.saveVersion < 1) {
    const classMap: Record<string, string> = {
      novato: 'tecno_aprendiz',
      guerreiro: 'mecatronico',
      mago: 'eletromante',
      arqueiro: 'operador_drones',
      paladino: 'juggernaut_industrial',
      berserker: 'ciborgue_combate',
      arquimago: 'arquiteto_sistemas',
      necromante: 'tecnomante',
      atirador_elite: 'atirador_optico'
    };
    
    if (classMap[player.currentClassId]) {
      player.currentClassId = classMap[player.currentClassId];
    } else if (!CLASSES[player.currentClassId]) {
      player.currentClassId = 'tecno_aprendiz';
    }

    // Migration: Limpar learnedSkills que não vieram de fusions
    player.learnedSkills = player.learnedSkills.filter((skillId: string) => {
      return Object.values(ADAPTATIONS_DATABASE).some(def => def.isFusion && def.grantedSkillId === skillId && player.adaptations?.[def.id]?.level >= 1);
    });

    player.saveVersion = 1;
  }

  // Version 1 -> 2: Bestiary and Contracts
  if (player.saveVersion < 2) {
    if (!player.contracts) player.contracts = [];
    if (!player.bestiary) player.bestiary = {};
    player.saveVersion = 2;
  }

  // Set to latest
  player.saveVersion = CURRENT_SAVE_VERSION;

  return player as Player;
}
