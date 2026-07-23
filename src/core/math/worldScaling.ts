import { random } from '../engine/rng';
import { translate } from '../engine/translation';
/**
 * math/worldScaling.ts
 * Contém a matemática de escalonamento do mundo (monstros, ouro, xp, loot) baseada no andar da torre.
 */
import { Rarity } from '../../types';

/**
 * Calcula as estatísticas e recompensas base de um monstro para um determinado andar.
 * 
 * Matemática:
 * - HP Base: Crescimento exponencial leve (1.2) para acompanhar o dano do jogador que cresce
 *   através de status base, equipamentos e habilidades.
 * - Dano Base (ATK): Crescimento exponencial (1.1) para garantir que os monstros
 *   continuem sendo uma ameaça constante.
 * - XP Reward: Exponente 1.5. Como a curva de XP do jogador requer expoente 1.8,
 *   a quantidade de monstros necessários por nível aumenta gradativamente 
 *   (aprox. 10 no nv 1, 20 no nv 10, 30 no nv 40), criando a sensação de progressão e esforço.
 * - Ouro Reward: Exponente 1.4. Acompanha a necessidade de comprar itens mais caros.
 */
import { CLASSES } from '../entities/classes';

/**
 * Retorna as estatísticas médias de um jogador no nível especificado,
 * baseado na classe Tecno-Aprendiz e suas evoluções padrão.
 */
export function getExpectedPlayerStats(level: number) {
  let hp = 100 + 10 * (level - 1);
  let mp = 20 + 2 * (level - 1);
  let atk = 10 + 2 * (level - 1);
  let def = 10 + 2 * (level - 1);
  let spd = 10 + 2 * (level - 1);

  if (level >= 10 && level < 40) {
    // Media aproximada das evoluções do nivel 10
    hp = 180 + 15 * (level - 10);
    atk = 25 + 4 * (level - 10);
    def = 20 + 3 * (level - 10);
    spd = 20 + 4 * (level - 10);
  } else if (level >= 40 && level < 70) {
    // Media aproximada das evoluções do nivel 40
    hp = 800 + 25 * (level - 40);
    atk = 250 + 12 * (level - 40);
    def = 150 + 7 * (level - 40);
    spd = 150 + 8 * (level - 40);
  } else if (level >= 70 && level < 100) {
    hp = 2500 + 75 * (level - 70);
    atk = 600 + 20 * (level - 70);
    def = 500 + 15 * (level - 70);
    spd = 350 + 8 * (level - 70);
  } else if (level >= 100) {
    hp = 5000 + 100 * (level - 100);
    atk = 1300 + 30 * (level - 100);
    def = 1000 + 25 * (level - 100);
    spd = 600 + 10 * (level - 100);
  }

  // Bonus aproximado de itens por tier
  if (level >= 100) {
    hp += level * 100;
    atk += level * 20;
    def += level * 30;
    spd += level * 5;
  } else if (level >= 70) {
    hp += level * 70;
    atk += level * 12;
    def += level * 20;
    spd += level * 4;
  } else {
    hp += level * 10;
    atk += level * 3;
    def += level * 3;
    spd += level * 2;
  }

  return { hp, atk, def, spd };
}

export function getMonsterScalingForFloor(floor: number) {
  const baseXP = 15;
  const baseGold = 5;
  const xpReward = Math.floor(baseXP * Math.pow(floor, 1.5));
  const goldReward = Math.floor(baseGold * Math.pow(floor, 1.4));
  
  const pStats = getExpectedPlayerStats(floor);

  if (floor >= 70) {
    const fDiff = floor - 70;
    const isTier100 = floor >= 90;

    let hp: number;
    let def: number;
    let atk: number;
    let spd: number;

    if (!isTier100) {
      // Andares 70-89 (Tier 70)
      hp = 7000 + fDiff * 150;
      def = 600 + fDiff * 10;
      atk = 3150 + fDiff * 30;
      spd = 550 + fDiff * 6;
    } else {
      // Andares 90-99 (Tier 100)
      hp = 18000 + (floor - 90) * 3200;
      def = 1500 + (floor - 90) * 180;
      atk = 5600 + (floor - 90) * 260;
      spd = 900 + (floor - 90) * 15;
    }

    return {
      hp: Math.max(100, hp),
      atk: Math.max(10, atk),
      def: Math.max(1, def),
      spd: Math.max(5, spd),
      xpReward,
      goldReward,
    };
  }

  return {
    // Monstro com HP e estatísticas para resistir a habilidades de burst e oferecer curva 50/50
    hp: Math.max(30, Math.floor(pStats.hp * 1.25 + floor * 15)),
    // Dano do inimigo para pressionar o jogador
    atk: Math.floor(pStats.def * 1.15 + 10 + floor * 2.8),
    // Defesa proporcional
    def: Math.max(1, Math.floor(pStats.def * 0.35 + floor * 0.8)),
    // Velocidade
    spd: Math.max(5, Math.floor(pStats.spd * 0.90)),
    xpReward,
    goldReward,
  };
}

/**
 * Calcula a probabilidade de um monstro dropar um item ao morrer.
 * Começa em 20% no andar 1 e aumenta gradativamente até o cap de 50%.
 */
export function getDropChanceForFloor(floor: number, isBoss: boolean = false): number {
  if (isBoss) return 1.0; // Chefes têm 100% de chance de drop
  const baseChance = 0.20;
  const increasePerFloor = 0.005;
  const maxChance = 0.50;
  
  return Math.min(baseChance + (floor * increasePerFloor), maxChance);
}

/**
 * Retorna as probabilidades (em porcentagem) de cada raridade para um dado andar.
 * Utiliza um sistema de pesos (weights) que favorece itens mais raros em andares altos.
 */
export function getRarityProbabilitiesForFloor(floor: number): Record<Rarity, number> {
  // Peso base que define a chance relativa
  const commonWeight = 100; // Constante
  const rareWeight = 10 + (floor * 1.5); // Cresce moderadamente
  const epicWeight = 1 + (floor * 0.3); // Cresce lentamente
  const legendaryWeight = floor > 15 ? Math.max(0, (floor - 15) * 0.1) : 0;
  const mythicWeight = floor > 30 ? Math.max(0, (floor - 30) * 0.05) : 0;

  const totalWeight = commonWeight + rareWeight + epicWeight + legendaryWeight + mythicWeight;

  return {
    common: (commonWeight / totalWeight) * 100,
    rare: (rareWeight / totalWeight) * 100,
    epic: (epicWeight / totalWeight) * 100,
    legendary: (legendaryWeight / totalWeight) * 100,
    mythic: (mythicWeight / totalWeight) * 100,
  };
}

/**
 * Função utilitária para rolar um dado e determinar a raridade do loot baseado no andar.
 */
export function rollLootRarity(floor: number, isBoss: boolean = false): Rarity {
  if (isBoss) {
    if (floor > 30) {
      const roll = random();
      if (roll < 0.10) return 'mythic';
      if (roll < 0.35) return 'legendary';
      if (roll < 0.75) return 'epic';
      return 'rare';
    } else if (floor > 15) {
      const roll = random();
      if (roll < 0.15) return 'legendary';
      if (roll < 0.60) return 'epic';
      return 'rare';
    }
    // Chefes só dropam Rare ou Epic em andares iniciais
    return random() < 0.3 ? 'epic' : 'rare';
  }

  const probs = getRarityProbabilitiesForFloor(floor);
  const roll = random() * 100; // 0 a 100
  
  if (roll <= probs.mythic) return 'mythic';
  if (roll <= probs.mythic + probs.legendary) return 'legendary';
  if (roll <= probs.mythic + probs.legendary + probs.epic) return 'epic';
  if (roll <= probs.mythic + probs.legendary + probs.epic + probs.rare) return 'rare';
  return 'common';
}

/**
 * Retorna as informações completas do setor para um determinado andar.
 */
export function getSectorForFloor(floor: number) {
  const idx = Math.floor((floor - 1) / 10) % 3;
  const cycle = Math.floor((floor - 1) / 30) + 1;
  const numerals = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const suffix = cycle > 1 ? ` ${numerals[cycle] || cycle}` : '';
  
  const scale = (val: number) => Math.min(255, Math.floor(val + (cycle - 1) * 15));
  
  if (idx === 0) {
    return {
      id: 'sector_1',
      name: `${translate("Refinaria Tóxica")}${suffix}`,
      hazard: 'toxic_refinery' as const,
      description: translate('Corrosão é duas vezes mais eficiente e dá dano por turno.'),
      colorTheme: 'green',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      rgb: `${scale(34)}, ${scale(197)}, ${scale(94)}`,
      flavorText: translate('Antigo setor de processamento pesado da Kinetix, onde carcaças de metal e implantes rejeitados são dissolvidos em reagentes básicos. Os gases corrosivos ativam os sensores de dor fantasma do Ciborgue, sussurrando sobre a obsolescência de sua derme.')
    };
  }
  if (idx === 1) {
    return {
      id: 'sector_2',
      name: `${translate("Data-Core Congelado")}${suffix}`,
      hazard: 'frozen_datacore' as const,
      description: translate('Habilidades custam 20% mais EP devido ao frio glacial.'),
      colorTheme: 'blue',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      rgb: `${scale(59)}, ${scale(130)}, ${scale(246)}`,
      flavorText: translate('A zona de resfriamento criogênico que abriga os servidores massivos do Pináculo. Por entre as frestas congeladas e a névoa fria, fluxos de dados brutos que o Nômade costumava interceptar correm como correntes elétricas selvagens, ecoando o silêncio de mentes esquecidas.')
    };
  }
  return {
    id: 'sector_3',
    name: `${translate("Fornalha de Plasma")}${suffix}`,
    hazard: 'plasma_furnace' as const,
    description: translate('Ondas de calor causam Dano no fim de cada turno e Sobreaquecimento dura mais.'),
    colorTheme: 'orange',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    rgb: `${scale(249)}, ${scale(115)}, ${scale(22)}`,
    flavorText: translate('O imenso reator de fusão operado pela OmniCorp para sintetizar energia e matéria condensada. O calor infernal acelera a degradação de nanites e reativos biológicos, as mesmas patentes secretas que o Químico sintetizou antes de se tornar parte deste imenso tubo de ensaio.')
  };
}
