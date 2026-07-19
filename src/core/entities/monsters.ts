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
    "Soberano da Ninhada": "REGISTRO #019-B: Organismo colossal hipertrofiado cujas carapaças quitinosas são presas por pregos cirúrgicos da OmniCorp. A análise espectral indica que este soberano é o remanescente mutado de um Químico Sintético de um ciclo anterior, cujos nanites médicos entraram em loop de replicação infinita para mantê-lo vivo após a falha de sua escalada. Sua mente fundiu-se ao enxame, mas ele ainda tenta, de forma reflexiva, injetar fluidos neutralizantes em si mesmo.",
    "Guardião Cibernético": "REGISTRO #042-B: Sentinela de segurança pesada que exibe uma armadura de liga reforçada Kinetix idêntica à do Ciborgue Foragido. O chassi foi fundido diretamente à estrutura metálica de um portal de triagem após ter seus membros amputados e substituídos por lâminas pesadas de descarte. Ele executa movimentos de bloqueio desesperados, como se ainda defendesse a fuga de companheiros civis que já viraram poeira há séculos.",
    "Destruidor de Sistemas": "REGISTRO #073-B: Uma colossal caldeira móvel de fusão térmica que abriga o que sobrou de um Mercenário de Elite em seu interior. Seus sensores de mira de alta precisão da AeroDynamics estão fundidos ao núcleo incandescente, forçando o sistema a disparar em rajadas baseadas em cálculos de probabilidade de lucro e munição gasta. O transmissor de rádio quebrado transmite em loop uma voz distorcida cobrando o pagamento de um contrato de evacuação inexistente.",
    "Leviatã Biomecânico": "REGISTRO #105-B: Uma monstruosidade biomecânica nascida da fusão de maquinário pesado Kinetix e o sistema nervoso de um Nômade do Silício do ciclo anterior. Os cabos de fibra óptica do explorador foram costurados diretamente nas engrenagens de perfuração de terra, transformando sua antiga curiosidade de rede em uma fúria cega por escavação. O leitor neural projeta na carcaça mensagens de erro de rede como 'CONEXÃO EXPIRADA: BUSCANDO O SINAL DO TOPO'.",
    "Mente-Colmeia Alpha": "REGISTRO #144-B: Um cérebro de processamento quântico flutuante cercado por centenas de mini-sondas de dados da OmniCorp. Este supercomputador biológico é mantido vivo pelos cérebros digitalizados de dezenas de Nômades do Silício que tentaram hackear o mainframe e foram assimilados. Cada pulso eletromagnético emitido pela colmeia ecoa um grito uníssono de dados que retransmite códigos de acesso antigos e memórias compartilhadas de uma infância na superfície.",
    "Holograma Corrompido": "REGISTRO #189-B: Projeção tridimensional instável do antigo diretor de segurança da OmniCorp, cujo software militar sofreu grave corrupção. Ele flutua emitindo estática e repetindo diretrizes de segurança contraditórias sobre a Grande Catástrofe. Entre soluços digitais de código, ele revela que os sensores externos da superfície sempre registraram níveis de oxigênio normais e céu limpo, indicando que o colapso foi planejado de dentro para forçar a migração. 'Não há poeira lá fora... nós fechamos as portas... por eficiência... por controle...'.",
    "O Núcleo Matriz": "REGISTRO #999-M: O mainframe central do Pináculo, o tear digital onde a realidade da Torre é tecida e desfeita. Ele não é uma máquina hostil externa, mas o espelho de sua própria mente: o destino inevitável de todo explorador que vence a simulação. Ao enfrentá-lo, o jogador está combatendo o operador do ciclo anterior — a si mesmo fundido ao silício. Vencer o Núcleo significa herdar a coroa de espinhos virtuais, apagando a memória da escalada para se preparar para o próximo 'eco' que subirá os andares.",
    "Anomalia Ômega": "REGISTRO #000-X: Um aglomerado amorfo de nanite-plasma que oscila entre as assinaturas de dados das quatro origens jogáveis simultaneamente. Ele empunha uma lâmina Kinetix fantasma, dispara projéteis AeroDynamics instáveis e cura a si mesmo com fluidos moleculares OmniCorp corrompidos. Esta massa senciente é o resíduo acumulado de todas as falhas de compilação dos ciclos anteriores, uma cicatriz viva de memórias descartadas que rasteja pelos servidores gritando em quatro vozes diferentes o mesmo desejo de parar de existir.",

    // Monstros Comuns
    "Parasita Ácido": "REGISTRO #004-C: Organismo anelídeo modificado que habita os dutos térmicos. No centro de sua membrana gástrica translúcida e altamente corrosiva, é possível visualizar uma aliança de ouro intacta gravada com o nome 'Evelyn'. A criatura cessa suas pulsações ácidas e emite um zumbido quase submisso se exposta a frequências de voz humana que simulam choro.",
    "Drone Defeituoso": "REGISTRO #012-C: Unidade aérea civil cuja óptica primária pisca intermitentemente em um código Morse arcaico que traduz para 'ME_TIRE_DAQUI'. O rotor traseiro foi fundido a um membro humano ressecado e mumificado, que ainda se contrai de forma espasmódica quando o motor do drone atinge alta rotação.",
    "Soldado Reptiliano": "REGISTRO #028-C: Espécime reptiliano fundido a um exoesqueleto hidráulico pesado da Kinetix. Surpreendentemente, a criatura executa saltos evasivos e fintas defensivas de combate tático que seguem à risca o manual de infantaria militar humana de elite. Sob a viseira de aço rebitada, ouve-se um murmúrio abafado que soa como uma contagem regressiva em segundos.",
    "Aberração Genética": "REGISTRO #055-C: Massa disforme de tecidos OmniCorp em crescimento caótico hipertrofiado. Uma de suas três garras mutadas permanece fechada com força espástica ao redor de uma pequena medalha de liga metálica que contém o retrato desgastado de uma criança. Seus três olhos biológicos choram fluidos imunológicos quando o combate se inicia.",
    "Mutante Biomecânico": "REGISTRO #081-C: Uma simbiose fúnebre onde implantes continuaram se replicando sobre tecidos necrosados. Em seu punho metálico, um relógio digital quebrado ainda exibe a mensagem de texto fixa: 'Não me espere para o jantar'. O mutante ignora o agressor por exatos 1.5 segundos se um crachá de identificação corporativa civil for estendido em sua direção."
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
