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
  } else if (level >= 40) {
    // Media aproximada das evoluções do nivel 40
    hp = 800 + 25 * (level - 40);
    atk = 250 + 12 * (level - 40);
    def = 150 + 7 * (level - 40);
    spd = 150 + 8 * (level - 40);
  }

  // Bonus aproximado de itens
  hp += level * 10;
  atk += level * 3;
  def += level * 3;
  spd += level * 2;

  return { hp, atk, def, spd };
}

export function getMonsterScalingForFloor(floor: number) {
  const baseXP = 15;
  const baseGold = 5;
  const xpReward = Math.floor(baseXP * Math.pow(floor, 1.5));
  const goldReward = Math.floor(baseGold * Math.pow(floor, 1.4));
  
  const pStats = getExpectedPlayerStats(floor);
  return {
    // Reduz HP do monstro para cerca de 22% do HP do jogador para combates ágeis e divertidos
    hp: Math.max(20, Math.floor(pStats.hp * 0.22)),
    // Garante que o ataque do inimigo cause dano real superando a defesa esperada do jogador
    atk: Math.floor(pStats.def + 3 + floor * 1.2),
    // Reduz defesa para evitar o efeito 'esponja de balas' onde o jogador causa 1 de dano
    def: Math.max(1, Math.floor(pStats.def * 0.15)),
    // Velocidade ligeiramente inferior para dar iniciativa estratégica ao jogador
    spd: Math.max(5, Math.floor(pStats.spd * 0.85)),
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
      rgb: `${scale(34)}, ${scale(197)}, ${scale(94)}`
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
      rgb: `${scale(59)}, ${scale(130)}, ${scale(246)}`
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
    rgb: `${scale(249)}, ${scale(115)}, ${scale(22)}`
  };
}
