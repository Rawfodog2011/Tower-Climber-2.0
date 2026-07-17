import { random } from '../engine/rng';
/**
 * entities/monsters.ts
 * Sistema de templates e geração de monstros.
 */

import { Monster } from '../../types';
import { getMonsterScalingForFloor } from '../math/worldScaling';

/**
 * Templates de monstros base. Os atributos reais serão escalados no momento da geração.
 * 'statMultipliers' permite criar variedades (ex: Goblins são rápidos, Golems têm defesa alta).
 */
export const MONSTER_TEMPLATES = [
  {
    id: 'parasita_acido',
    name: 'Parasita Ácido',
    statMultipliers: { hp: 1.2, mp: 1, atk: 0.8, def: 0.8, spd: 0.5 },
  },
  {
    id: 'drone_defeituoso',
    name: 'Drone Defeituoso',
    statMultipliers: { hp: 0.8, mp: 1, atk: 1.1, def: 0.9, spd: 1.3 },
  },
  {
    id: 'soldado_reptiliano',
    name: 'Soldado Reptiliano',
    statMultipliers: { hp: 0.9, mp: 1, atk: 1.2, def: 0.7, spd: 1.0 },
  },
  {
    id: 'aberracao_genetica',
    name: 'Aberração Genética',
    statMultipliers: { hp: 1.5, mp: 1, atk: 1.5, def: 2.0, spd: 0.2 },
  },
  {
    id: 'mutante_biomecanico',
    name: 'Mutante Biomecânico',
    statMultipliers: { hp: 1.1, mp: 1, atk: 1.3, def: 1.1, spd: 0.8 },
  }
];

export function getMonsterLore(monsterName: string): string {
  const baseName = monsterName.replace(/\s*\(Nv\s+\d+\)/i, '').replace(/\s*\(Andar\s+\d+\)/i, '').trim();
  
  const loreMap: Record<string, string> = {
    // Bosses
    "Soberano da Ninhada": "REGISTRO #019-B: Organismo hipertrofiado com blindagem quitinosa fundida a placas de titânio descartadas pela Kinetix. A criatura coordena o enxame inferior através de uma frequência bioelétrica de baixa latência. Análise de tecido indica que o núcleo nervoso central foi substituído por um roteador militar obsoleto.",
    "Guardião Cibernético": "REGISTRO #042-B: Unidade tática de segurança automatizada classe Sentinela, originalmente programada pela AeroDynamics para purga de invasores. Seus giroscópios estão corrompidos, fazendo-o patrulhar o mesmo terminal em um loop eterno de hostilidade sem lógica. O chassis exibe cicatrizes de solda rústica, sugerindo reparos feitos por mãos párias.",
    "Destruidor de Sistemas": "REGISTRO #073-B: Uma colossal unidade de processamento térmico móvel que sofreu fusão parcial de hardware. Ele consome cabos de alta tensão ativos para alimentar sua bobina de indução exposta. O cheiro de silício queimado e ozônio ao seu redor é forte o suficiente para causar curto-circuito em visores óticos não blindados.",
    "Leviatã Biomecânico": "REGISTRO #105-B: Uma amálgama perturbadora de biomassa de répteis locais e chassis de perfuração pesada da Kinetix. O espécime parece respirar fumaça de óleo sintético inflamável. Cicatrizes profundas sugerem que a máquina de perfuração foi injetada diretamente em sua medula espinhal enquanto o espécime ainda estava em estágio larval.",
    "Mente-Colmeia Alpha": "REGISTRO #144-B: Um supercomputador biológico flutuante que flutua através de campos magnéticos locais. Ele mantém centenas de mini-sondas de dados conectadas à sua massa encefálica exposta por cabos de fibra ótica. Cada pulso elétrico em seu núcleo envia comandos letais para as aberrações menores nos andares adjacentes.",
    "Holograma Corrompido": "REGISTRO #189-B: Uma projeção tridimensional instável do antigo diretor de segurança do Pináculo, agora fundida a um software de simulação militar corrompido. O holograma oscila entre ordens de evacuação datadas de 80 anos atrás e rotinas de combate letais. A luz azulada emitida causa picos de estática nos decodificadores neurais.",
    "O Núcleo Matriz": "REGISTRO #999-M: O mainframe central autoconsciente que controla as comportas de dados do topo do Pináculo. Ele processa milhões de terabytes de telemetria por segundo e enxerga os exploradores humanos como meras linhas de código corrompidas a serem limpas. Suas conexões físicas estendem-se por toda a estrutura da torre, tornando-o praticamente imortal enquanto conectada.",
    "Anomalia Ômega": "REGISTRO #000-X: Um aglomerado instável de sucata cibernética e nanite-plasma que desafia as leis de termodinâmica da torre. O núcleo pulsa em um padrão arrítmico, alternando polaridades magnéticas sem aviso. Provavelmente uma falha crítica de compilação física gerada por um terminal de descarte que entrou em loop infinito.",

    // Monstros Comuns
    "Parasita Ácido": "REGISTRO #004-C: Organismo anelídeo modificado que colonizou os dutos de refrigeração química da refinaria. Ele secreta um composto corrosivo capaz de dissolver ligas de policarbonato militar em segundos. Exploradores relatam que o parasita é atraído pelo calor gerado por baterias de íon-lítio ativa.",
    "Drone Defeituoso": "REGISTRO #012-C: Drone de entrega civil AeroDynamics reconfigurado com comandos de ataque obsoletos. Suas hélices de fibra de carbono estão lascadas e o sensor de proximidade infravermelho foi substituído por uma baioneta improvisada de sucata. Emite um zumbido agudo e irritante antes de avançar contra o alvo.",
    "Soldado Reptiliano": "REGISTRO #028-C: Espécime reptiliano nativo das fendas inferiores, equipado à força com um exoesqueleto hidráulico de combate Kinetix. Seus olhos exibem implantes de rastreamento térmico queimados, forçando-o a atacar puramente por vibração acústica. O rosnado metálico de suas juntas mecânicas indica falta de lubrificação.",
    "Aberração Genética": "REGISTRO #055-C: Um produto grotesco de experimentos de clonagem descartados e vazamento de fluidos mutagênicos nos laboratórios da OmniCorp. Seus tecidos musculares crescem em taxas descontroladas, engolindo os eletrodos de monitoramento originais. Ele não sente dor, atacando até que suas próprias fibras musculares sofram colapso térmico.",
    "Mutante Biomecânico": "REGISTRO #081-C: Um infeliz explorador de eras passadas cujos implantes cibernéticos continuaram operando e se replicando de forma autônoma após a morte cerebral. Armadura fundiu-se irrevogavelmente à carne em decomposição, obedecendo a rotinas básicas de patrulha escritas em firmware corrompido."
  };

  return loreMap[baseName] || "";
}

/**
 * Gera um monstro para o andar atual, aplicando a matemática de escalonamento.
 */
export function generateMonsterForFloor(floor: number): Monster {
  const isBoss = floor % 10 === 0;

  if (floor === 100) {
    const baseScaling = getMonsterScalingForFloor(floor);
    return {
      id: `mainframe_prime`,
      name: `O Núcleo Matriz`,
      level: 100,
      isBoss: true,
      stats: {
        hp: Math.floor(baseScaling.hp * 15), // 15x HP
        mp: Math.floor(1000),
        atk: Math.floor(baseScaling.atk * 2.0),
        def: Math.floor(baseScaling.def * 2.5),
        spd: Math.floor(baseScaling.spd * 1.5),
      },
      xpReward: Math.floor(baseScaling.xpReward * 20),
      goldReward: Math.floor(baseScaling.goldReward * 50),
      loreEntry: getMonsterLore("O Núcleo Matriz"),
    };
  }


  if (isBoss) {
    const scale = Math.pow(floor + 5, 1.1); // Escalonamento base levemente maior para chefes
    const baseScaling = getMonsterScalingForFloor(floor);
    
    const bossNames = [
      "Soberano da Ninhada",
      "Guardião Cibernético",
      "Destruidor de Sistemas",
      "Leviatã Biomecânico",
      "Mente-Colmeia Alpha",
      "Holograma Corrompido"
    ];
    const bossName = bossNames[(floor / 10 - 1) % bossNames.length] || "Anomalia Ômega";
    
    return {
      id: `boss_floor_${floor}`,
      name: `${bossName} (Andar ${floor})`,
      level: floor + 5,
      isBoss: true,
      stats: {
        hp: Math.floor(baseScaling.hp * 3), // 3x HP
        mp: Math.floor(100),
        atk: Math.floor(baseScaling.atk * 1.2), // 20% mais ataque
        def: Math.floor(baseScaling.def * 1.5), // 50% mais defesa
        spd: Math.floor(baseScaling.spd * 1.2), 
      },
      xpReward: Math.floor(baseScaling.xpReward * 3), // 3x XP
      goldReward: Math.floor(baseScaling.goldReward * 5), // 5x Ouro
      loreEntry: getMonsterLore(bossName),
    };
  }

  const templateIndex = Math.floor(random() * MONSTER_TEMPLATES.length);
  const template = MONSTER_TEMPLATES[templateIndex];
  
  // 1. Pega os status base matemáticos projetados para este andar
  const baseScaling = getMonsterScalingForFloor(floor);

  // 2. Aplica os multiplicadores do template para dar identidade ao monstro
  // (um Golem no andar 10 é muito mais forte e resistente que um Slime no andar 10)
  const finalStats = {
    hp: Math.floor(baseScaling.hp * template.statMultipliers.hp),
    mp: Math.floor(10 * template.statMultipliers.mp), // MP base 10 pra monstros simplificado
    atk: Math.floor(baseScaling.atk * template.statMultipliers.atk),
    def: Math.floor(baseScaling.def * template.statMultipliers.def),
    spd: Math.floor(baseScaling.spd * template.statMultipliers.spd),
  };

  return {
    id: `${template.id}_f${floor}`,
    name: `${template.name} (Nv ${floor})`,
    level: floor,
    stats: finalStats,
    xpReward: baseScaling.xpReward,
    goldReward: baseScaling.goldReward,
    isBoss: false,
    loreEntry: getMonsterLore(template.name),
  };
}
