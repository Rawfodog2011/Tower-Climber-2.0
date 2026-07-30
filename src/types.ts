export type Manufacturer = 'Kinetix' | 'AeroDynamics' | 'OmniCorp';
export type StatusEffectType = 'overheat' | 'corrosion' | 'shock' | 'stun';

export interface CombatAnomaly {
  id: string;
  name: string;
  description: string;
  type: 'player_buff' | 'monster_buff' | 'hazard';
}

export interface StatusEffect {
  type: StatusEffectType;
  duration: number; // Em turnos
  value?: number; // Valor do dano ou %
}

export type StatType = 'hp' | 'mp' | 'atk' | 'def' | 'spd';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type SkillType = 'damage' | 'heal' | 'buff';

export interface Stats {
  hp: number;
  mp: number;
  atk: number;
  def: number;
  spd: number;
}

export interface ClassDefinition {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  parentClassId: string | null;
  baseStats: Stats;
  statGrowthPerLevel: Stats;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  mpCost: number;
  cooldown: number; // Em turnos
  multiplier: number; // Multiplicador de Dano ou Cura
  type: SkillType;
  allowedClassId: string;
  isPassive?: boolean;
  applyStatus?: {
    type: StatusEffectType;
    duration: number;
    chance: number;
    value?: number;
  };
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'helmet' | 'pants' | 'boots' | 'bracers' | 'accessory' | 'consumable' | 'circuit_module';
  rarity: Rarity;
  description: string;
  allowedClassIds?: string[]; // Se indefinido ou vazio, qualquer classe pode equipar
  requiredLevel?: number; // Nível necessário para equipar
  statModifiers?: Partial<Stats>; // Bônus concedidos pelo item
  value: number; // Valor de venda/compra
  manufacturer?: Manufacturer; // Patrocínio de corporação
  hardwareSlots?: (Item | null)[]; // Slots de circuito impresso
  level?: number; // Nível do item (especialmente módulos)
  passiveEffects?: {
    lifesteal?: number;
    statusResistance?: number;
  };
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  stats: Stats;
  xpReward: number;
  goldReward: number;
  isBoss?: boolean;
  loreEntry?: string;
}

export type AutoBattleCondition = 'always' | 'hp_lt_25' | 'hp_lt_50' | 'hp_lt_75' | 'mp_lt_50' | 'enemy_hp_lt_50';
export type AutoBattleAction = 'attack' | string;

export interface AutoBattleRule {
  id: string;
  condition: AutoBattleCondition;
  action: AutoBattleAction;
}

export interface AdaptationState {
  level: number;
  exp: number;
}

export interface AdaptationDef {
  id: string;
  name: string;
  description: string;
  maxLevel: number;
  expFormula: (level: number) => number;
  bonusPerLevel: Partial<Stats>;
  requirements?: string[];
  grantedSkillId?: string;
  isFusion?: boolean;
}

export interface Player {
  name?: string;
  avatar?: string;
  skillUpgrades?: string[];
  saveVersion?: number;
  campaignBeaten?: boolean;
  runStats: { goldSpent: number, totalTurns: number };
  marketState?: MarketState;
  settings?: {
    autoDismantleRarities: Rarity[];
  };
  level: number;
  currentXp: number;
  currentClassId: string;
  gold: number;
  inventory: Item[];
  learnedSkills: string[];
  equipment: {
    weapon?: Item;
    armor?: Item;
    helmet?: Item;
    pants?: Item;
    boots?: Item;
    bracers?: Item;
    accessory1?: Item;
    accessory2?: Item;
    accessory3?: Item;
  };
  highestFloorUnlocked: number;
  matrixPoints: number;
  unlockedNodes: string[];
  materials: {
    common: number;
    rare: number;
    epic: number;
  };
  soulShards: number;
  relics: Record<string, number>;
  achievements: string[];
  contracts: Contract[];
  bestiary: Record<string, { name: string, kills: number, firstFloor: number, lastFloor: number }>;
  gameStats: {
    monstersKilled: number;
    puzzlesSolved: number;
    bossesDefeated: number;
  };
  autoBattleRules: AutoBattleRule[];
  isAutoBattleActive?: boolean;
  isFarmActive?: boolean;
  adaptations: Record<string, AdaptationState>;
  originId?: string;
  completedTutorials?: string[];
  visitedSectors?: string[];
  playerName?: string;
  totalPlaytimeSeconds?: number;
  lastPlayedAt?: number;
  quantumLevel?: number;
  quantumUpgrades?: Record<string, number>;
  highestAbyssalDepth?: number;
}

export type SectorHazard = 'toxic_refinery' | 'frozen_datacore' | 'plasma_furnace' | 'none';

export interface SectorDefinition {
  id: string;
  name: string;
  hazard: SectorHazard;
  description: string;
  colorTheme: string;
  flavorText: string;
}

export interface MarketItem {
  id: string;
  type: 'equipment' | 'material' | 'relic';
  itemData?: Item;
  relicId?: string;
  materialType?: Rarity;
  price: number;
  purchased: boolean;
  quantity?: number;
}

export interface MarketState {
  items: MarketItem[];
  rerollCost: number;
}

export type ContractType = 'hunt' | 'reach_floor' | 'collect_materials' | 'catalog';

export interface Contract {
  id: string;
  type: ContractType;
  title: string;
  description: string;
  targetId?: string; // ID do monstro
  sectorId?: string; // ID do setor (para contratos de catalogação)
  goal: number;
  progress: number;
  completed: boolean;
  reward: {
    gold?: number;
    materials?: { common?: number; rare?: number; epic?: number };
  };
  issuer: Manufacturer | 'Sistema';
}
