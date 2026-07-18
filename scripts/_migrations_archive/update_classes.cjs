const fs = require('fs');

const classesContent = `import { ClassDefinition } from '../../types';

export const CLASSES: Record<string, ClassDefinition> = {
  tecno_aprendiz: {
    id: 'tecno_aprendiz',
    name: 'Tecno-Aprendiz',
    description: 'Um engenheiro novato que acaba de entrar no Complexo Industrial.',
    requiredLevel: 1,
    parentClassId: null,
    baseStats: { hp: 100, mp: 20, atk: 10, def: 10, spd: 10 },
    statGrowthPerLevel: { hp: 10, mp: 2, atk: 2, def: 2, spd: 2 },
  },
  
  // Evoluções do Nível 10
  mecatronico: {
    id: 'mecatronico',
    name: 'Mecatrônico',
    description: 'Focado em exoesqueletos pesados. O Mecatrônico sobrevive na linha de frente.',
    requiredLevel: 10,
    parentClassId: 'tecno_aprendiz',
    baseStats: { hp: 250, mp: 30, atk: 35, def: 30, spd: 15 },
    statGrowthPerLevel: { hp: 25, mp: 2, atk: 5, def: 4, spd: 2 },
  },
  eletromante: {
    id: 'eletromante',
    name: 'Eletromante',
    description: 'Mestre da energia. Alta capacidade destrutiva com curtos-circuitos, porém frágil.',
    requiredLevel: 10,
    parentClassId: 'tecno_aprendiz',
    baseStats: { hp: 120, mp: 150, atk: 10, def: 12, spd: 20 },
    statGrowthPerLevel: { hp: 8, mp: 15, atk: 1, def: 1, spd: 3 },
  },
  operador_drones: {
    id: 'operador_drones',
    name: 'Operador de Drones',
    description: 'Ágil e letal com sensores. Depende de velocidade e ataques de longa distância.',
    requiredLevel: 10,
    parentClassId: 'tecno_aprendiz',
    baseStats: { hp: 150, mp: 50, atk: 30, def: 15, spd: 35 },
    statGrowthPerLevel: { hp: 12, mp: 3, atk: 4, def: 2, spd: 6 },
  },
  biotecnologo: {
    id: 'biotecnologo',
    name: 'Biotecnólogo',
    description: 'Especialista em fusão orgânico-sintética. Focado em auto-reparo e manipulação de biomatéria.',
    requiredLevel: 10,
    parentClassId: 'tecno_aprendiz',
    baseStats: { hp: 180, mp: 100, atk: 20, def: 20, spd: 15 },
    statGrowthPerLevel: { hp: 18, mp: 8, atk: 2, def: 3, spd: 3 },
  },
  
  // Evoluções do Nível 40 (Power Spike)
  juggernaut_industrial: {
    id: 'juggernaut_industrial',
    name: 'Juggernaut Industrial',
    description: 'Um exoesqueleto massivo com escudos inquebráveis e blindagem pesada.',
    requiredLevel: 40,
    parentClassId: 'mecatronico',
    baseStats: { hp: 1200, mp: 300, atk: 180, def: 250, spd: 80 },
    statGrowthPerLevel: { hp: 45, mp: 10, atk: 8, def: 12, spd: 4 },
  },
  ciborgue_combate: {
    id: 'ciborgue_combate',
    name: 'Ciborgue de Combate',
    description: 'Implantes que sobrecarregam o sistema, trocando defesa por poder letal absoluto.',
    requiredLevel: 40,
    parentClassId: 'mecatronico',
    baseStats: { hp: 1000, mp: 100, atk: 280, def: 120, spd: 120 },
    statGrowthPerLevel: { hp: 35, mp: 5, atk: 15, def: 5, spd: 7 },
  },
  arquiteto_sistemas: {
    id: 'arquiteto_sistemas',
    name: 'Arquiteto de Sistemas',
    description: 'Capaz de reescrever a realidade local e evocar calamidades digitais.',
    requiredLevel: 40,
    parentClassId: 'eletromante',
    baseStats: { hp: 600, mp: 1200, atk: 350, def: 90, spd: 110 },
    statGrowthPerLevel: { hp: 15, mp: 30, atk: 18, def: 4, spd: 6 },
  },
  tecnomante: {
    id: 'tecnomante',
    name: 'Tecnomante',
    description: 'Mestre na reanimação de carcaças robóticas e drenagem de núcleos de energia.',
    requiredLevel: 40,
    parentClassId: 'eletromante',
    baseStats: { hp: 800, mp: 900, atk: 250, def: 140, spd: 90 },
    statGrowthPerLevel: { hp: 20, mp: 25, atk: 12, def: 7, spd: 5 },
  },
  atirador_optico: {
    id: 'atirador_optico',
    name: 'Atirador Óptico',
    description: 'Precisão computacional que ignora blindagens pesadas à distância.',
    requiredLevel: 40,
    parentClassId: 'operador_drones',
    baseStats: { hp: 700, mp: 200, atk: 300, def: 100, spd: 220 },
    statGrowthPerLevel: { hp: 18, mp: 8, atk: 16, def: 5, spd: 12 },
  },
  fantasma_silicio: {
    id: 'fantasma_silicio',
    name: 'Fantasma de Silício',
    description: 'Furtividade termóptica e ataques de assassinato ultrarrápidos.',
    requiredLevel: 40,
    parentClassId: 'operador_drones',
    baseStats: { hp: 600, mp: 300, atk: 350, def: 80, spd: 300 },
    statGrowthPerLevel: { hp: 15, mp: 10, atk: 18, def: 4, spd: 15 },
  },
  cirurgiao_mecanico: {
    id: 'cirurgiao_mecanico',
    name: 'Cirurgião Mecânico',
    description: 'Drenagem de fluidos e desconstrução de anomalias com precisão cirúrgica.',
    requiredLevel: 40,
    parentClassId: 'biotecnologo',
    baseStats: { hp: 900, mp: 600, atk: 220, def: 150, spd: 130 },
    statGrowthPerLevel: { hp: 25, mp: 15, atk: 12, def: 8, spd: 8 },
  },
  simbionte_sintetico: {
    id: 'simbionte_sintetico',
    name: 'Simbionte Sintético',
    description: 'Mutação incontrolável. Troca sua humanidade por resiliência infinita.',
    requiredLevel: 40,
    parentClassId: 'biotecnologo',
    baseStats: { hp: 1500, mp: 200, atk: 160, def: 200, spd: 90 },
    statGrowthPerLevel: { hp: 50, mp: 5, atk: 8, def: 12, spd: 5 },
  },
};

export function getAvailableEvolutions(currentClassId: string, playerLevel: number): ClassDefinition[] {
  return Object.values(CLASSES).filter(
    (cls) => cls.parentClassId === currentClassId && playerLevel >= cls.requiredLevel
  );
}
`
fs.writeFileSync('src/core/entities/classes.ts', classesContent);
console.log("Updated Classes!");
