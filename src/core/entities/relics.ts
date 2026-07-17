import { Player, Stats } from '../../types';

export interface Relic {
  id: string;
  name: string;
  description: string;
  baseEffectText: string;
  maxLevel: number;
  upgradeCost: {
    goldBase: number;
    goldMultiplier: number;
    shardsBase: number;
    shardsMultiplier: number;
  };
}

export const RELICS_DATABASE: Record<string, Relic> = {
  bateria_sanguinea: {
    id: 'bateria_sanguinea',
    name: 'Bateria Biomecânica Autossuficiente',
    description: 'Um módulo experimental que converte fluidos vitais em carga para os exoesqueletos, estendendo a integridade estrutural (HP Máximo).',
    baseEffectText: '+2% HP Máximo por nível.',
    maxLevel: 25,
    upgradeCost: { goldBase: 500, goldMultiplier: 1.5, shardsBase: 1, shardsMultiplier: 1.2 },
  },
  chip_aprendizado: {
    id: 'chip_aprendizado',
    name: 'Coprocessador Heurístico',
    description: 'Um chip de silício negro focado em redes neurais. Aumenta a velocidade de extração de dados e a experiência adquirida em combate.',
    baseEffectText: '+3% XP Obtido por nível.',
    maxLevel: 10,
    upgradeCost: { goldBase: 1000, goldMultiplier: 2.0, shardsBase: 2, shardsMultiplier: 1.5 },
  },
  lamina_plasma_fibrilada: {
    id: 'lamina_plasma_fibrilada',
    name: 'Condensador de Plasma Instável',
    description: 'Um núcleo de energia superaquecido capaz de sobrecarregar as armas do usuário para infligir danos maiores.',
    baseEffectText: '+2% T-ATK por nível.',
    maxLevel: 20,
    upgradeCost: { goldBase: 750, goldMultiplier: 1.6, shardsBase: 1, shardsMultiplier: 1.3 },
  },
  campo_forca_fractal: {
    id: 'campo_forca_fractal',
    name: 'Gerador de Escudo Fractal',
    description: 'Uma tecnologia quase esquecida que cria micro-barreiras ao redor da blindagem para absorver impactos extremos.',
    baseEffectText: '+2% DEF por nível.',
    maxLevel: 20,
    upgradeCost: { goldBase: 750, goldMultiplier: 1.6, shardsBase: 1, shardsMultiplier: 1.3 },
  },
  acelerador_particulas: {
    id: 'acelerador_particulas',
    name: 'Acelerador de Partículas Tático',
    description: 'Aprimora as juntas do traje com propulsão microscópica. Aumenta os reflexos e a velocidade (SPD).',
    baseEffectText: '+2% SPD por nível.',
    maxLevel: 20,
    upgradeCost: { goldBase: 750, goldMultiplier: 1.6, shardsBase: 1, shardsMultiplier: 1.3 },
  },
  processador_quantico: {
    id: 'processador_quantico',
    name: 'Processador Quântico OMNI',
    description: 'O ápice da computação. Otimiza de maneira abrangente todas as funções do sistema.',
    baseEffectText: '+1% em todos os Atributos (HP, MP, ATK, DEF, SPD) por nível.',
    maxLevel: 15,
    upgradeCost: { goldBase: 2000, goldMultiplier: 1.8, shardsBase: 3, shardsMultiplier: 1.4 },
  },
  extrator_creditos: {
    id: 'extrator_creditos',
    name: 'Criptominerador Embutido',
    description: 'Enquanto você luta, este módulo descriptografa carteiras digitais dos inimigos.',
    baseEffectText: '+5% Créditos Obtidos por nível.',
    maxLevel: 10,
    upgradeCost: { goldBase: 500, goldMultiplier: 2.2, shardsBase: 1, shardsMultiplier: 1.6 },
  },
  conversor_materia: {
    id: 'conversor_materia',
    name: 'Otimizador de Loot (Droptable.dll)',
    description: 'Recalcula as probabilidades quânticas, aumentando a chance de encontrar equipamentos raros nos destroços inimigos.',
    baseEffectText: '+2% Chance de Drop de Qualidade por nível.',
    maxLevel: 10,
    upgradeCost: { goldBase: 1500, goldMultiplier: 2.0, shardsBase: 2, shardsMultiplier: 1.5 },
  },
  bateria_auxiliar: {
    id: 'bateria_auxiliar',
    name: 'Célula de Energia de Alta Densidade',
    description: 'Uma fonte adicional de energia que amplia a capacidade de Mana/Energia (EP).',
    baseEffectText: '+3% EP Máximo por nível.',
    maxLevel: 20,
    upgradeCost: { goldBase: 600, goldMultiplier: 1.5, shardsBase: 1, shardsMultiplier: 1.2 },
  },
  modulo_arrefecimento: {
    id: 'modulo_arrefecimento',
    name: 'Sistema de Arrefecimento de Nitrogênio',
    description: 'Impede o superaquecimento. Permite ativar módulos de auto-restauração por mais tempo ou mais rápido.',
    baseEffectText: '+1 Regeneração de EP/Turno por nível.',
    maxLevel: 10,
    upgradeCost: { goldBase: 1200, goldMultiplier: 1.7, shardsBase: 2, shardsMultiplier: 1.4 },
  }
};

export function getRelicUpgradeCost(relicId: string, currentLevel: number): { gold: number; shards: number } {
  const relic = RELICS_DATABASE[relicId];
  if (!relic) return { gold: 0, shards: 0 };

  const gold = Math.floor(relic.upgradeCost.goldBase * Math.pow(relic.upgradeCost.goldMultiplier, currentLevel));
  const shards = Math.floor(relic.upgradeCost.shardsBase * Math.pow(relic.upgradeCost.shardsMultiplier, currentLevel));
  
  return { gold, shards };
}

export function upgradeRelic(player: Player, relicId: string): { success: boolean, message: string, updatedPlayer: Player } {
  const relic = RELICS_DATABASE[relicId];
  const currentLevel = player.relics[relicId] || 0;

  if (!relic) {
    return { success: false, message: 'Relíquia desconhecida.', updatedPlayer: player };
  }
  
  if (currentLevel >= relic.maxLevel) {
    return { success: false, message: 'Relíquia no nível máximo.', updatedPlayer: player };
  }

  const cost = getRelicUpgradeCost(relicId, currentLevel);
  
  if (player.gold < cost.gold || player.soulShards < cost.shards) {
    return { success: false, message: 'Recursos insuficientes para aprimoramento.', updatedPlayer: player };
  }

  const updatedPlayer = {
    ...player,
    gold: player.gold - cost.gold,
    soulShards: player.soulShards - cost.shards,
    relics: {
      ...player.relics,
      [relicId]: currentLevel + 1
    }
  };

  return { success: true, message: `${relic.name} aprimorada para o nível ${currentLevel + 1}!`, updatedPlayer };
}
