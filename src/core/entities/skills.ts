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
  }
};

/**
 * Verifica recursivamente se a classe fornecida (ou seus ancestrais)
 * corresponde à classe requerida pela habilidade.
 */
export function canClassUseSkill(playerClassId: string, skill: Skill): boolean {
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
