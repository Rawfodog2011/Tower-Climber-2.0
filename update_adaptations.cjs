const fs = require('fs');

const code = `import { Player, Stats, AdaptationDef } from '../../types';

export const ADAPTATIONS_DATABASE: Record<string, AdaptationDef> = {
  'blindagem_reativa': {
    id: 'blindagem_reativa',
    name: 'Blindagem Reativa',
    description: 'Resistência ao impacto calibra o chassi. Concede +1 DEF por nível.',
    maxLevel: 10,
    expFormula: (level: number) => Math.floor(100 * Math.pow(level + 1, 1.5)),
    bonusPerLevel: { def: 1 }
  },
  'nanocelulas_regenerativas': {
    id: 'nanocelulas_regenerativas',
    name: 'Nanocélulas Regenerativas',
    description: 'Sobrevivência estendida multiplica as nanocélulas. Concede +15 HP por nível.',
    maxLevel: 10,
    expFormula: (level: number) => Math.floor(120 * Math.pow(level + 1, 1.6)),
    bonusPerLevel: { hp: 15 }
  },
  'overclock_combate': {
    id: 'overclock_combate',
    name: 'Overclock de Combate',
    description: 'Repetição de ataques afia os servos do traje. Concede +2 ATK por nível.',
    maxLevel: 10,
    expFormula: (level: number) => Math.floor(150 * Math.pow(level + 1, 1.4)),
    bonusPerLevel: { atk: 2 }
  },
  'sincronia_neural': {
    id: 'sincronia_neural',
    name: 'Sincronia Neural',
    description: 'Reflexos em combate constante aceleram as sinapses. Concede +1 SPD por nível.',
    maxLevel: 10,
    expFormula: (level: number) => Math.floor(180 * Math.pow(level + 1, 1.5)),
    bonusPerLevel: { spd: 1 }
  },
  'dissipacao_calor': {
    id: 'dissipacao_calor',
    name: 'Dissipação de Calor',
    description: 'Uso de habilidades expande as baterias internas. Concede +5 Max EP por nível.',
    maxLevel: 10,
    expFormula: (level: number) => Math.floor(100 * Math.pow(level + 1, 1.45)),
    bonusPerLevel: { mp: 5 }
  },

  // === FUSÕES ===
  'colosso_carbono': {
    id: 'colosso_carbono',
    name: 'Colosso de Carbono',
    description: 'Fusão de Blindagem Reativa e Nanocélulas. O chassi se torna impenetrável. Concede +5 DEF e +50 HP por nível. Desbloqueia "Fortaleza Biomecânica".',
    maxLevel: 10,
    expFormula: (level: number) => Math.floor(500 * Math.pow(level + 1, 1.8)),
    bonusPerLevel: { def: 5, hp: 50 },
    requirements: ['blindagem_reativa', 'nanocelulas_regenerativas'],
    grantedSkillId: 'fortaleza_biomecanica',
    isFusion: true
  },
  'assassino_navalha': {
    id: 'assassino_navalha',
    name: 'Assassino do Fio da Navalha',
    description: 'Fusão de Overclock e Sincronia Neural. Velocidade e letalidade máximas. Concede +5 ATK e +3 SPD por nível. Desbloqueia "Golpe Fantasma".',
    maxLevel: 10,
    expFormula: (level: number) => Math.floor(600 * Math.pow(level + 1, 1.8)),
    bonusPerLevel: { atk: 5, spd: 3 },
    requirements: ['overclock_combate', 'sincronia_neural'],
    grantedSkillId: 'golpe_fantasma',
    isFusion: true
  },
  'nucleo_fissao': {
    id: 'nucleo_fissao',
    name: 'Núcleo de Fissão Controlada',
    description: 'Fusão de Overclock e Dissipação de Calor. Agressividade energética insana. Concede +8 ATK e +20 EP por nível. Desbloqueia "Exaustão Térmica".',
    maxLevel: 10,
    expFormula: (level: number) => Math.floor(550 * Math.pow(level + 1, 1.8)),
    bonusPerLevel: { atk: 8, mp: 20 },
    requirements: ['overclock_combate', 'dissipacao_calor'],
    grantedSkillId: 'exaustao_termica',
    isFusion: true
  }
};

export function getAdaptationBonuses(player: Player): Partial<Stats> {
  const bonuses: Partial<Stats> = { hp: 0, mp: 0, atk: 0, def: 0, spd: 0 };
  
  if (!player.adaptations) return bonuses;

  for (const [id, state] of Object.entries(player.adaptations)) {
    const def = ADAPTATIONS_DATABASE[id];
    if (def && state.level > 0) {
      if (def.bonusPerLevel.hp) bonuses.hp = (bonuses.hp || 0) + def.bonusPerLevel.hp * state.level;
      if (def.bonusPerLevel.mp) bonuses.mp = (bonuses.mp || 0) + def.bonusPerLevel.mp * state.level;
      if (def.bonusPerLevel.atk) bonuses.atk = (bonuses.atk || 0) + def.bonusPerLevel.atk * state.level;
      if (def.bonusPerLevel.def) bonuses.def = (bonuses.def || 0) + def.bonusPerLevel.def * state.level;
      if (def.bonusPerLevel.spd) bonuses.spd = (bonuses.spd || 0) + def.bonusPerLevel.spd * state.level;
    }
  }

  bonuses.hp = Math.floor(bonuses.hp || 0);
  bonuses.mp = Math.floor(bonuses.mp || 0);
  bonuses.atk = Math.floor(bonuses.atk || 0);
  bonuses.def = Math.floor(bonuses.def || 0);
  bonuses.spd = Math.floor(bonuses.spd || 0);

  return bonuses;
}

export interface ProcessedAdaptationsResult {
  updatedPlayer: Player;
  levelUps: string[];
}

export function processAdaptationTrackers(player: Player, trackers: { damageTaken: number, basicAttacks: number, epSpent: number, turnsPassed: number, skillsUsed: number }): ProcessedAdaptationsResult {
  const newPlayer = { ...player };

  if (!newPlayer.adaptations) {
    newPlayer.adaptations = {
      'blindagem_reativa': { level: 0, exp: 0 },
      'nanocelulas_regenerativas': { level: 0, exp: 0 },
      'overclock_combate': { level: 0, exp: 0 },
      'sincronia_neural': { level: 0, exp: 0 },
      'dissipacao_calor': { level: 0, exp: 0 }
    };
  } else {
    newPlayer.adaptations = JSON.parse(JSON.stringify(newPlayer.adaptations));
  }

  // Ensure new keys exist
  const basicKeys = ['blindagem_reativa', 'nanocelulas_regenerativas', 'overclock_combate', 'sincronia_neural', 'dissipacao_calor'];
  for (const k of basicKeys) {
    if (!newPlayer.adaptations[k]) newPlayer.adaptations[k] = { level: 0, exp: 0 };
  }

  const levelUps: string[] = [];

  const checkLevelUp = (id: string, def: AdaptationDef) => {
    const state = newPlayer.adaptations[id];
    let leveledUp = false;

    while (state.level < def.maxLevel) {
      const required = def.expFormula(state.level);
      if (state.exp >= required) {
        state.exp -= required;
        state.level += 1;
        leveledUp = true;
      } else {
        break;
      }
    }

    if (leveledUp) {
      levelUps.push(\`[PROTOCOLO] \${def.name} subiu para o Nv.\${state.level}\${state.level === def.maxLevel ? ' (MÁXIMO)' : ''}!\`);
    }
  };

  // Add exp
  if (trackers.damageTaken > 0) {
    newPlayer.adaptations['blindagem_reativa'].exp += trackers.damageTaken;
  }
  if (trackers.turnsPassed > 0) {
    newPlayer.adaptations['nanocelulas_regenerativas'].exp += trackers.turnsPassed * 25;
    newPlayer.adaptations['sincronia_neural'].exp += trackers.turnsPassed * 15;
  }
  if (trackers.basicAttacks > 0) {
    newPlayer.adaptations['overclock_combate'].exp += trackers.basicAttacks * 20;
    newPlayer.adaptations['sincronia_neural'].exp += trackers.basicAttacks * 10;
  }
  if (trackers.epSpent > 0) {
    newPlayer.adaptations['dissipacao_calor'].exp += trackers.epSpent;
  }
  if (trackers.skillsUsed > 0) {
    newPlayer.adaptations['dissipacao_calor'].exp += trackers.skillsUsed * 10;
  }

  // Check level ups for all owned adaptations
  for (const [id, state] of Object.entries(newPlayer.adaptations)) {
    const def = ADAPTATIONS_DATABASE[id];
    if (def) checkLevelUp(id, def);
  }

  // Check Fusions unlocking
  for (const [id, def] of Object.entries(ADAPTATIONS_DATABASE)) {
    if (def.isFusion && def.requirements && !newPlayer.adaptations[id]) {
      const meetsReqs = def.requirements.every(reqId => {
        const reqState = newPlayer.adaptations[reqId];
        const reqDef = ADAPTATIONS_DATABASE[reqId];
        return reqState && reqDef && reqState.level >= reqDef.maxLevel;
      });

      if (meetsReqs) {
        newPlayer.adaptations[id] = { level: 1, exp: 0 };
        levelUps.push(\`[SINERGIA CRÍTICA] \${def.name} DESBLOQUEADO!\`);
        // We do not add the skill directly to learnedSkills if we can just derive it dynamically, 
        // but learnedSkills array is where skills go. Let's add it to learnedSkills.
        if (def.grantedSkillId && !newPlayer.learnedSkills.includes(def.grantedSkillId)) {
          newPlayer.learnedSkills.push(def.grantedSkillId);
          levelUps.push(\`[HABILIDADE] "\${def.grantedSkillId.replace(/_/g, ' ')}" adquirida!\`);
        }
      }
    }
  }

  // Add exp to fusions?
  // Let's make fusions gain exp from all actions combined or simply a flat rate
  let totalActions = trackers.basicAttacks + trackers.skillsUsed + trackers.turnsPassed;
  for (const [id, def] of Object.entries(ADAPTATIONS_DATABASE)) {
    if (def.isFusion && newPlayer.adaptations[id] && newPlayer.adaptations[id].level < def.maxLevel) {
      newPlayer.adaptations[id].exp += totalActions * 15 + trackers.damageTaken / 5;
      checkLevelUp(id, def);
    }
  }

  return { updatedPlayer: newPlayer, levelUps };
}
export function getUnlockedFusionSkills(player: Player): string[] {
  const skills: string[] = [];
  if (!player.adaptations) return skills;
  for (const [id, state] of Object.entries(player.adaptations)) {
    const def = ADAPTATIONS_DATABASE[id];
    if (def && def.isFusion && state.level >= 1 && def.grantedSkillId) {
      skills.push(def.grantedSkillId);
    }
  }
  return skills;
}
`
fs.writeFileSync('src/core/entities/adaptations.ts', code);
console.log("Updated adaptations.ts");
