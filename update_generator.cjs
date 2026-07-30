const fs = require('fs');
let code = fs.readFileSync('src/core/entities/neuralMatrixGenerator.ts', 'utf8');

code = code.replace(
  `{ id: 'assault', name: 'Assalto', angle: 0, minorStats: { atk: 5 }, notableStats: { atk: 25 }, keystoneName: 'Canhão de Vidro', keystoneDesc: 'Dobra seu Ataque total, mas reduz seu HP Máximo pela metade.', keystoneStats: { atk: 50, hp: -25 } },`,
  `{ id: 'assault', name: 'Assalto', angle: 0, minorStats: { atk: 5 }, notableStats: { atk: 25 }, keystoneName: 'Sobrecarga de Matéria', keystoneDesc: 'Causa 50% mais dano total, mas recebe 15% de Dano Verdadeiro adicional de qualquer fonte.', keystoneStats: { atk: 50, hp: -25 }, mechanics: ['sobrecarga_materia'] },`
);

code = code.replace(
  `{ id: 'economy', name: 'Economia', angle: 216, minorStats: { mp: 10 }, notableStats: { mp: 50 }, keystoneName: 'Bateria Infinita', keystoneDesc: 'Habilidades custam 0 MP. Você não regenera MP naturalmente.', keystoneStats: { mp: 100 } },`,
  `{ id: 'economy', name: 'Economia', angle: 216, minorStats: { mp: 10 }, notableStats: { mp: 50 }, keystoneName: 'Overclock Termodinâmico', keystoneDesc: 'Habilidades custam HP ao invés de MP. Se não tiver HP suficiente, a habilidade falha.', keystoneStats: { hp: 50 }, mechanics: ['overclock_termodinamico'] },`
);

code = code.replace(
  `{ id: 'dot', name: 'Entropia', angle: 288, minorStats: { atk: 2, spd: 2 }, notableStats: { atk: 15, spd: 15 }, keystoneName: 'Colapso Sistêmico', keystoneDesc: 'Efeitos de Status causam 300% de dano. Dano direto reduzido em 50%.', keystoneStats: { atk: 20, def: 10 } }`,
  `{ id: 'dot', name: 'Entropia', angle: 288, minorStats: { atk: 2, spd: 2 }, notableStats: { atk: 15, spd: 15 }, keystoneName: 'Protocolo de Execução', keystoneDesc: 'Se o ataque deixar o alvo com menos de 10% de HP, o alvo é morto instantaneamente (HP = 0).', keystoneStats: { atk: 20, def: 10 }, mechanics: ['protocolo_execucao'] }`
);

// We also need to assign it dynamically when generating the node
const oldNodeInit = `      let statBonus = cluster.minorStats;`;
const newNodeInit = `      let statBonus = cluster.minorStats;
      let mechanicModifiers: string[] | undefined = undefined;`;
code = code.replace(oldNodeInit, newNodeInit);

const oldKeystoneStats = `        statBonus = cluster.keystoneStats;`;
const newKeystoneStats = `        statBonus = cluster.keystoneStats;
        if ((cluster as any).mechanics) {
          mechanicModifiers = (cluster as any).mechanics;
        }`;
code = code.replace(oldKeystoneStats, newKeystoneStats);

const oldNodeCreation = `        name,
        description,
        statBonus,
        connections: [previousId],`;
const newNodeCreation = `        name,
        description,
        statBonus,
        mechanicModifiers,
        connections: [previousId],`;
code = code.replace(oldNodeCreation, newNodeCreation);

fs.writeFileSync('src/core/entities/neuralMatrixGenerator.ts', code);
console.log('Fixed generator');
