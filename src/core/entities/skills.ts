/**
 * entities/skills.ts
 * Definições e validações do sistema de habilidades (Skills).
 */
import { Skill, ClassDefinition } from '../../types';
import { CLASSES } from './classes';

export const SKILLS_DATABASE: Record<string, Skill> = {
  fortaleza_biomecanica: {
    id: 'fortaleza_biomecanica',
    name: 'Fortaleza Biomecânica',
    description: 'Protocolo de Colosso ativado. Cura 30% do HP Máximo e mitiga dano passivamente.',
    mpCost: 40,
    cooldown: 4,
    multiplier: 0.3,
    type: 'heal',
    allowedClassId: 'todas' // Pode ser usado por qualquer classe que desbloquear a adaptação
  },
  golpe_fantasma: {
    id: 'golpe_fantasma',
    name: 'Golpe Fantasma',
    description: 'Assassino do Fio da Navalha. Um ataque letal indetectável que causa 350% de dano.',
    mpCost: 25,
    cooldown: 3,
    multiplier: 3.5,
    type: 'damage',
    allowedClassId: 'todas'
  },
  exaustao_termica: {
    id: 'exaustao_termica',
    name: 'Exaustão Térmica',
    description: 'Purga o calor acumulado num raio destruidor, causando 450% de dano. Aplica Superaquecimento.',
    mpCost: 80,
    cooldown: 5,
    multiplier: 4.5,
    type: 'damage',
    allowedClassId: 'todas',
    applyStatus: { type: 'overheat', duration: 3, chance: 1.0 }
  },
  sobrecarga_hardware: {
    id: 'sobrecarga_hardware',
    name: 'Sobrecarga de Hardware',
    description: 'Um ataque bruto que causa 150% do dano base. Requer 3 turnos de recarga.',
    mpCost: 15,
    cooldown: 3,
    multiplier: 1.5,
    type: 'damage',
    allowedClassId: 'mecatronico',
    applyStatus: { type: 'overheat', duration: 3, chance: 1.0 }
  },
  pulso_eletromagnetico: {
    id: 'pulso_eletromagnetico',
    name: 'Pulso Eletromagnético (EMP)',
    description: 'Ataque de energia que causa 250% de dano. Requer 2 turnos de recarga.',
    mpCost: 30,
    cooldown: 2,
    multiplier: 2.5,
    type: 'damage',
    allowedClassId: 'eletromante',
    applyStatus: { type: 'shock', duration: 2, chance: 1.0 }
  },
  mira_laser_calibrada: {
    id: 'mira_laser_calibrada',
    name: 'Mira Laser Calibrada',
    description: 'Ataque focado que causa 200% do dano base.',
    mpCost: 20,
    cooldown: 2,
    multiplier: 2.0,
    type: 'damage',
    allowedClassId: 'operador_drones'
  },
  reparo_emergencia: {
    id: 'reparo_emergencia',
    name: 'Reparo de Emergência',
    description: 'Restaura HP equivalente a 25% da sua Vida Máxima.',
    mpCost: 20,
    cooldown: 3,
    multiplier: 0.25,
    type: 'heal',
    allowedClassId: 'tecno_aprendiz' // Tecno-Aprendiz e consequentemente todos podem usar.
  },
  protocolo_juggernaut: {
    id: 'protocolo_juggernaut',
    name: 'Protocolo Juggernaut',
    description: 'Um golpe cinético avassalador. Causa 300% de dano.',
    mpCost: 60,
    cooldown: 4,
    multiplier: 3.0,
    type: 'damage',
    allowedClassId: 'juggernaut_industrial'
  },
  overclock_letal: {
    id: 'overclock_letal',
    name: 'Overclock Letal',
    description: 'Ataque suicida do Ciborgue. Causa 400% de dano.',
    mpCost: 40,
    cooldown: 3,
    multiplier: 4.0,
    type: 'damage',
    allowedClassId: 'ciborgue_combate'
  },
  ataque_orbital: {
    id: 'ataque_orbital',
    name: 'Ataque Orbital',
    description: 'Evoca uma calamidade do Arquiteto de Sistemas. Causa 500% de dano.',
    mpCost: 150,
    cooldown: 5,
    multiplier: 5.0,
    type: 'damage',
    allowedClassId: 'arquiteto_sistemas'
  },
  drenagem_nucleo: {
    id: 'drenagem_nucleo',
    name: 'Drenagem de Núcleo',
    description: 'Drena a bateria inimiga causando 350% de dano e cura 50%.',
    mpCost: 100,
    cooldown: 4,
    multiplier: 3.5,
    type: 'damage',
    allowedClassId: 'tecnomante',
    applyStatus: { type: 'corrosion', duration: 3, chance: 1.0, value: 10 }
  },
  disparo_antimateria: {
    id: 'disparo_antimateria',
    name: 'Disparo de Antimatéria',
    description: 'Tiro de elite que causa 400% de dano de longe.',
    mpCost: 80,
    cooldown: 4,
    multiplier: 4.0,
    type: 'damage',
    allowedClassId: 'atirador_optico',
    applyStatus: { type: 'corrosion', duration: 3, chance: 0.5, value: 15 }
  },
  sintese_organica: {
    id: 'sintese_organica',
    name: 'Síntese Orgânica',
    description: 'Recombina matéria viva. Causa 150% de dano e cura 15% do HP Máximo.',
    mpCost: 35,
    cooldown: 3,
    multiplier: 1.5,
    type: 'damage',
    allowedClassId: 'biotecnologo'
  },
  drenagem_cirurgica: {
    id: 'drenagem_cirurgica',
    name: 'Drenagem Cirúrgica',
    description: 'Disseca o alvo em tempo real. Causa 300% de dano e aplica corrosão profunda.',
    mpCost: 55,
    cooldown: 4,
    multiplier: 3.0,
    type: 'damage',
    allowedClassId: 'cirurgiao_mecanico',
    applyStatus: { type: 'corrosion', duration: 3, chance: 1.0, value: 25 }
  },
  mutacao_desenfreada: {
    id: 'mutacao_desenfreada',
    name: 'Mutação Desenfreada',
    description: 'Rompe os limites físicos. Causa 350% de dano esmagador.',
    mpCost: 65,
    cooldown: 4,
    multiplier: 3.5,
    type: 'damage',
    allowedClassId: 'simbionte_sintetico'
  },
  assassinato_fantasma: {
    id: 'assassinato_fantasma',
    name: 'Assassinato Fantasma',
    description: 'Ataque termóptico veloz que causa 450% de dano.',
    mpCost: 90,
    cooldown: 4,
    multiplier: 4.5,
    type: 'damage',
    allowedClassId: 'fantasma_silicio'
  },
  soro_regenerador: {
    id: 'soro_regenerador',
    name: 'Soro Regenerador',
    description: 'Consome nanites para curar 15% do HP Máximo, limpa Superaquecimento e Corrosão, e recupera 10% do MP Máximo.',
    mpCost: 6,
    cooldown: 4,
    multiplier: 0.15,
    type: 'heal',
    allowedClassId: 'todas'
  },
  tiro_de_precisao: {
    id: 'tiro_de_precisao',
    name: 'Tiro de Precisão',
    description: 'Um tiro focado de alta energia que causa 180% de dano mecânico com 30% de chance de aplicar ATORDOAMENTO por 1 turno.',
    mpCost: 10,
    cooldown: 3,
    multiplier: 1.8,
    type: 'damage',
    allowedClassId: 'todas',
    applyStatus: { type: 'stun', duration: 1, chance: 0.3 }
  },

  // Habilidades de Nível 70 (Alfa e Beta)
  impacto_gravitacional_tita: {
    id: 'impacto_gravitacional_tita',
    name: 'Impacto Gravitacional Titã',
    description: 'Adensa a carcaça de titânio e canaliza um colapso cinético que causa 550% de dano esmagador. Aplica Atordoamento.',
    mpCost: 90,
    cooldown: 4,
    multiplier: 7.0,
    type: 'damage',
    allowedClassId: 'juggernaut_industrial_70a',
    applyStatus: { type: 'stun', duration: 1, chance: 0.6 }
  },
  baluarte_polimerico: {
    id: 'baluarte_polimerico',
    name: 'Baluarte Polimérico',
    description: 'Sela as juntas em polímeros bio-regenerativos. Restaura 40% do HP Máximo e fortalece a blindagem.',
    mpCost: 85,
    cooldown: 4,
    multiplier: 0.40,
    type: 'heal',
    allowedClassId: 'juggernaut_industrial_70b'
  },
  furia_termica_aegis: {
    id: 'furia_termica_aegis',
    name: 'Fúria Térmica Aegis',
    description: 'Força o núcleo de fusão ao ponto de fusão, desferindo uma rajada escaldante que causa 620% de dano. Aplica Superaquecimento.',
    mpCost: 110,
    cooldown: 4,
    multiplier: 6.2,
    type: 'damage',
    allowedClassId: 'ciborgue_combate_70a',
    applyStatus: { type: 'overheat', duration: 3, chance: 0.8 }
  },
  purga_tatica_kinetix: {
    id: 'purga_tatica_kinetix',
    name: 'Purga Tática Kinetix',
    description: 'Executa um protocolo militar encriptado em hipervelocidade, fatiando o alvo com 580% de dano físico.',
    mpCost: 95,
    cooldown: 3,
    multiplier: 5.8,
    type: 'damage',
    allowedClassId: 'ciborgue_combate_70b',
    applyStatus: { type: 'stun', duration: 1, chance: 0.4 }
  },
  tempestade_algoritmica: {
    id: 'tempestade_algoritmica',
    name: 'Tempestade Algorítmica',
    description: 'Canaliza a estática da Torre em um raio de dados devastador, causando 650% de dano eletromagnético. Aplica Choque.',
    mpCost: 120,
    cooldown: 5,
    multiplier: 6.5,
    type: 'damage',
    allowedClassId: 'arquiteto_sistemas_70a',
    applyStatus: { type: 'shock', duration: 3, chance: 0.9 }
  },
  reescrita_matriz: {
    id: 'reescrita_matriz',
    name: 'Reescrita da Matriz',
    description: 'Infiltra o código do Núcleo Matriz no tecido local, purgando anomalias e restaurando 42% do HP Máximo.',
    mpCost: 100,
    cooldown: 4,
    multiplier: 0.42,
    type: 'heal',
    allowedClassId: 'arquiteto_sistemas_70b'
  },
  enxame_fantasma_aerodynamics: {
    id: 'enxame_fantasma_aerodynamics',
    name: 'Enxame Fantasma AeroDynamics',
    description: 'Ergue uma horda de destroços robóticos para desfechar uma descarga concentrada de 540% de dano. Aplica Choque.',
    mpCost: 105,
    cooldown: 4,
    multiplier: 5.4,
    type: 'damage',
    allowedClassId: 'tecnomante_70a',
    applyStatus: { type: 'shock', duration: 2, chance: 0.7 }
  },
  canibalismo_sintetico: {
    id: 'canibalismo_sintetico',
    name: 'Canibalismo Sintético',
    description: 'Drena a fiação e o núcleo vital do oponente, causando 500% de dano e corroendo o chassi inimigo.',
    mpCost: 90,
    cooldown: 4,
    multiplier: 5.0,
    type: 'damage',
    allowedClassId: 'tecnomante_70b',
    applyStatus: { type: 'corrosion', duration: 3, chance: 0.8, value: 20 }
  },
  canhao_sentinela_aerodynamics: {
    id: 'canhao_sentinela_aerodynamics',
    name: 'Canhão Sentinela AeroDynamics',
    description: 'Sincroniza as lentes sentinelas de precisão para disparar um feixe de alto calibre que causa 600% de dano. Aplica Corrosão.',
    mpCost: 100,
    cooldown: 4,
    multiplier: 6.0,
    type: 'damage',
    allowedClassId: 'atirador_optico_70a',
    applyStatus: { type: 'corrosion', duration: 3, chance: 0.7, value: 25 }
  },
  perfuracao_espectrometrica: {
    id: 'perfuracao_espectrometrica',
    name: 'Perfuração Espectrométrica',
    description: 'Identifica falhas moleculares na blindagem inimiga e dispara com precisão atômica, causando 630% de dano perfurante.',
    mpCost: 110,
    cooldown: 4,
    multiplier: 6.3,
    type: 'damage',
    allowedClassId: 'atirador_optico_70b',
    applyStatus: { type: 'corrosion', duration: 3, chance: 0.9, value: 30 }
  },
  execucao_termoptica_absoluta: {
    id: 'execucao_termoptica_absoluta',
    name: 'Execução Termóptica Absoluta',
    description: 'Emerge do rasgo negro da camuflagem para infligir um golpe crítico letal de 640% de dano.',
    mpCost: 115,
    cooldown: 4,
    multiplier: 6.4,
    type: 'damage',
    allowedClassId: 'fantasma_silicio_70a'
  },
  golpe_de_nano_estatica: {
    id: 'golpe_de_nano_estatica',
    name: 'Golpe de Nano-Estática',
    description: 'Projeta clones holográficos de estática e ataca pelas costas, causando 560% de dano e atordoando o alvo.',
    mpCost: 95,
    cooldown: 3,
    multiplier: 5.6,
    type: 'damage',
    allowedClassId: 'fantasma_silicio_70b',
    applyStatus: { type: 'stun', duration: 1, chance: 0.5 }
  },
  dissecacao_molecular_termoeletrica: {
    id: 'dissecacao_molecular_termoeletrica',
    name: 'Dissecação Molecular Térmica',
    description: 'Superaquece os bisturis de fusão, cortando o alvo com 520% de dano e drenando fluidos para corroer a armadura.',
    mpCost: 90,
    cooldown: 4,
    multiplier: 5.2,
    type: 'damage',
    allowedClassId: 'cirurgiao_mecanico_70a',
    applyStatus: { type: 'corrosion', duration: 3, chance: 1.0, value: 30 }
  },
  reparo_clinico_reverso: {
    id: 'reparo_clinico_reverso',
    name: 'Reparo Clínico Reverso',
    description: 'Extrai reagentes de restauração das juntas anatômicas do alvo. Restaura 38% do HP Máximo enquanto reajusta o chassi.',
    mpCost: 75,
    cooldown: 4,
    multiplier: 0.38,
    type: 'heal',
    allowedClassId: 'cirurgiao_mecanico_70b'
  },
  biomassa_hipertrofica: {
    id: 'biomassa_hipertrofica',
    name: 'Biomassa Hipertrófica',
    description: 'Expande a massa viva de polímero mutante para regenerar 45% do HP Máximo instantaneamente.',
    mpCost: 80,
    cooldown: 5,
    multiplier: 0.45,
    type: 'heal',
    allowedClassId: 'simbionte_sintetico_70a'
  },
  laceracao_biomecanica: {
    id: 'laceracao_biomecanica',
    name: 'Laceração Biomecânica',
    description: 'Ataca violentamente com garras de quitina e metal superaquecido, causando 590% de dano e derretendo a carcaça inimiga.',
    mpCost: 100,
    cooldown: 4,
    multiplier: 5.9,
    type: 'damage',
    allowedClassId: 'simbionte_sintetico_70b',
    applyStatus: { type: 'overheat', duration: 3, chance: 0.7 }
  }
};

/**
 * Verifica recursivamente se a classe fornecida (ou seus ancestrais)
 * corresponde à classe requerida pela habilidade.
 */
export function canClassUseSkill(playerClassId: string, skill: Skill): boolean {
  if (skill.allowedClassId === 'todas') return true;
  let currentClass: ClassDefinition | undefined = CLASSES[playerClassId];

  while (currentClass) {
    if (currentClass.id === skill.allowedClassId) {
      return true;
    }
    if (currentClass.parentClassId) {
      currentClass = CLASSES[currentClass.parentClassId];
    } else {
      break;
    }
  }

  return false;
}
