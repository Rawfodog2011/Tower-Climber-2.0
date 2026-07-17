import { Stats } from '../../types';

export type MatrixNodeType = 'minor' | 'active_skill' | 'keystone';

export interface MatrixNode {
  id: string;
  type: MatrixNodeType;
  name: string;
  description: string;
  statBonus?: Partial<Stats>;
  skillId?: string;
  connections: string[]; // IDs of connected nodes
  x: number; // visual coordinates
  y: number;
}

export const NEURAL_MATRIX_DATABASE: Record<string, MatrixNode> = {
  'core_start': {
    id: 'core_start',
    type: 'keystone',
    name: 'Core do Tecno-Aprendiz',
    description: 'O início de tudo. Desperta as capacidades latentes do traje.',
    statBonus: { hp: 20, mp: 20, atk: 5, def: 5, spd: 5 },
    connections: ['mec_1', 'ele_1', 'drone_1', 'bio_1'],
    x: 1000,
    y: 1000
  },
  
  // Ramo Mecatrônico (Esquerda / Superior)
  'mec_1': {
    id: 'mec_1',
    type: 'minor',
    name: 'Blindagem Reforçada I',
    description: '+20 Max HP',
    statBonus: { hp: 20 },
    connections: ['core_start', 'mec_2'],
    x: 800,
    y: 800
  },
  'mec_2': {
    id: 'mec_2',
    type: 'minor',
    name: 'Ligas de Titânio',
    description: '+10 DEF',
    statBonus: { def: 10 },
    connections: ['mec_1', 'mec_skill_1'],
    x: 650,
    y: 650
  },
  'mec_skill_1': {
    id: 'mec_skill_1',
    type: 'active_skill',
    name: 'Sobrecarga de Hardware',
    description: 'Protocolo ativo.',
    skillId: 'sobrecarga_hardware',
    connections: ['mec_2', 'mec_3'],
    x: 450,
    y: 500
  },
  'mec_3': {
    id: 'mec_3',
    type: 'minor',
    name: 'Blindagem Reforçada II',
    description: '+50 Max HP',
    statBonus: { hp: 50 },
    connections: ['mec_skill_1', 'mec_keystone'],
    x: 250,
    y: 350
  },
  'mec_keystone': {
    id: 'mec_keystone',
    type: 'keystone',
    name: 'Bastion Absoluto',
    description: 'Dobro de DEF e Max HP massivo, mas velocidade reduzida drasticamente.',
    statBonus: { hp: 500, def: 100, spd: -50 },
    connections: ['mec_3'],
    x: 100,
    y: 150
  },
  
  // Ramo Eletromante (Direita)
  'ele_1': {
    id: 'ele_1',
    type: 'minor',
    name: 'Capacitores Expandidos I',
    description: '+30 EP',
    statBonus: { mp: 30 },
    connections: ['core_start', 'ele_2'],
    x: 1200,
    y: 800
  },
  'ele_2': {
    id: 'ele_2',
    type: 'minor',
    name: 'Frequência Letal',
    description: '+15 T-ATK',
    statBonus: { atk: 15 },
    connections: ['ele_1', 'ele_skill_1'],
    x: 1350,
    y: 700
  },
  'ele_skill_1': {
    id: 'ele_skill_1',
    type: 'active_skill',
    name: 'Pulso Eletromagnético',
    description: 'Protocolo ativo.',
    skillId: 'pulso_eletromagnetico',
    connections: ['ele_2', 'ele_3'],
    x: 1550,
    y: 600
  },
  'ele_3': {
    id: 'ele_3',
    type: 'minor',
    name: 'Capacitores Expandidos II',
    description: '+100 EP',
    statBonus: { mp: 100 },
    connections: ['ele_skill_1', 'ele_keystone'],
    x: 1750,
    y: 450
  },
  'ele_keystone': {
    id: 'ele_keystone',
    type: 'keystone',
    name: 'Overdrive Suicida',
    description: '+300 T-ATK e cura convertida em dano extra, mas perde 100 DEF.',
    statBonus: { atk: 300, def: -100 },
    connections: ['ele_3'],
    x: 1950,
    y: 300
  },
  
  // Ramo Operador de Drones (Abaixo)
  'drone_1': {
    id: 'drone_1',
    type: 'minor',
    name: 'Servo-motores Calibrados I',
    description: '+10 SPD',
    statBonus: { spd: 10 },
    connections: ['core_start', 'drone_2'],
    x: 1000,
    y: 1200
  },
  'drone_2': {
    id: 'drone_2',
    type: 'minor',
    name: 'Atuadores Leves',
    description: '+15 SPD',
    statBonus: { spd: 15 },
    connections: ['drone_1', 'drone_skill_1'],
    x: 1000,
    y: 1400
  },
  'drone_skill_1': {
    id: 'drone_skill_1',
    type: 'active_skill',
    name: 'Mira Laser Calibrada',
    description: 'Protocolo ativo.',
    skillId: 'mira_laser_calibrada',
    connections: ['drone_2', 'drone_3'],
    x: 1000,
    y: 1600
  },
  'drone_3': {
    id: 'drone_3',
    type: 'minor',
    name: 'Servo-motores Calibrados II',
    description: '+30 SPD',
    statBonus: { spd: 30 },
    connections: ['drone_skill_1', 'drone_keystone'],
    x: 1000,
    y: 1800
  },
  'drone_keystone': {
    id: 'drone_keystone',
    type: 'keystone',
    name: 'Fantasma Óptico',
    description: '+150 SPD e aumento maciço em dano baseado na SPD (simulado com ATK extra), perde Max HP.',
    statBonus: { spd: 150, atk: 100, hp: -100 },
    connections: ['drone_3'],
    x: 1000,
    y: 2000
  },

  // Ramo Biotecnólogo (Acima)
  'bio_1': {
    id: 'bio_1',
    type: 'minor',
    name: 'Recombinação Celular I',
    description: '+40 Max HP',
    statBonus: { hp: 40 },
    connections: ['core_start', 'bio_2'],
    x: 1000,
    y: 800
  },
  'bio_2': {
    id: 'bio_2',
    type: 'minor',
    name: 'Síntese de Bateria',
    description: '+50 EP',
    statBonus: { mp: 50 },
    connections: ['bio_1', 'bio_skill_1'],
    x: 1000,
    y: 600
  },
  'bio_skill_1': {
    id: 'bio_skill_1',
    type: 'active_skill',
    name: 'Síntese Orgânica',
    description: 'Protocolo ativo.',
    skillId: 'sintese_organica',
    connections: ['bio_2', 'bio_3'],
    x: 1000,
    y: 400
  },
  'bio_3': {
    id: 'bio_3',
    type: 'minor',
    name: 'Recombinação Celular II',
    description: '+80 Max HP',
    statBonus: { hp: 80 },
    connections: ['bio_skill_1', 'bio_keystone'],
    x: 1000,
    y: 200
  },
  'bio_keystone': {
    id: 'bio_keystone',
    type: 'keystone',
    name: 'Imortalidade Sintética',
    description: 'Aumenta HP e cura passiva enormemente (simulado com DEF alta e Max HP), mas reduz severamente SPD e ATK.',
    statBonus: { hp: 1000, def: 150, spd: -80, atk: -50 },
    connections: ['bio_3'],
    x: 1000,
    y: 0
  }
};
