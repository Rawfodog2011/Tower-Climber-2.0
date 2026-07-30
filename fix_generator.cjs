const fs = require('fs');
let code = fs.readFileSync('src/core/entities/neuralMatrixGenerator.ts', 'utf8');

const clustersOld = `  const clusters = [
    { id: 'assault', name: 'Assalto', angle: 0, minorStats: { atk: 5 }, notableStats: { atk: 25 }, keystoneName: 'Sobrecarga de Matéria', keystoneDesc: 'Causa 50% mais dano total, mas recebe 15% de Dano Verdadeiro adicional de qualquer fonte.', keystoneStats: { atk: 50, hp: -25 }, mechanics: ['sobrecarga_materia'] },
    { id: 'defense', name: 'Defesa', angle: 72, minorStats: { def: 5, hp: 10 }, notableStats: { def: 25, hp: 50 }, keystoneName: 'Baluarte Inabalável', keystoneDesc: 'Ganha +200% de Defesa, mas Velocidade é travada no mínimo.', keystoneStats: { def: 100, spd: -20 } },
    { id: 'speed', name: 'Velocidade', angle: 144, minorStats: { spd: 5 }, notableStats: { spd: 25 }, keystoneName: 'Aceleração Taquiônica', keystoneDesc: 'Sempre ataca primeiro e ganha evasão passiva, porém Dano reduzido em 30%.', keystoneStats: { spd: 50, atk: -10 } },
    { id: 'economy', name: 'Economia', angle: 216, minorStats: { mp: 10 }, notableStats: { mp: 50 }, keystoneName: 'Overclock Termodinâmico', keystoneDesc: 'Habilidades custam HP ao invés de MP. Se não tiver HP suficiente, a habilidade falha.', keystoneStats: { hp: 50 }, mechanics: ['overclock_termodinamico'] },
    { id: 'dot', name: 'Entropia', angle: 288, minorStats: { atk: 2, spd: 2 }, notableStats: { atk: 15, spd: 15 }, keystoneName: 'Protocolo de Execução', keystoneDesc: 'Se o ataque deixar o alvo com menos de 10% de HP, o alvo é morto instantaneamente (HP = 0).', keystoneStats: { atk: 20, def: 10 }, mechanics: ['protocolo_execucao'] }
  ];`;

const clustersNew = `  const clusters = [
    { id: 'assault', name: 'Assalto', angle: 0, minorStats: { atk: 5 }, notableStats: { atk: 25 }, keystoneName: 'Sobrecarga de Matéria', keystoneDesc: 'Causa 50% mais dano total, mas recebe 15% de Dano Verdadeiro adicional de qualquer fonte.', keystoneStats: { atk: 50, hp: -25 }, mechanics: ['sobrecarga_materia'], themeColor: '#ef4444', iconSvgPath: 'M14.5 17.5 3 6V3h3l11.5 11.5 M13 19l6-6 M16 16l4 4 M19 21l2-2' },
    { id: 'defense', name: 'Defesa', angle: 72, minorStats: { def: 5, hp: 10 }, notableStats: { def: 25, hp: 50 }, keystoneName: 'Baluarte Inabalável', keystoneDesc: 'Ganha +200% de Defesa, mas Velocidade é travada no mínimo.', keystoneStats: { def: 100, spd: -20 }, themeColor: '#3b82f6', iconSvgPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { id: 'speed', name: 'Velocidade', angle: 144, minorStats: { spd: 5 }, notableStats: { spd: 25 }, keystoneName: 'Aceleração Taquiônica', keystoneDesc: 'Sempre ataca primeiro e ganha evasão passiva, porém Dano reduzido em 30%.', keystoneStats: { spd: 50, atk: -10 }, themeColor: '#eab308', iconSvgPath: 'M5 12h14 M12 5l7 7-7 7' },
    { id: 'economy', name: 'Economia', angle: 216, minorStats: { mp: 10 }, notableStats: { mp: 50 }, keystoneName: 'Overclock Termodinâmico', keystoneDesc: 'Habilidades custam HP ao invés de MP. Se não tiver HP suficiente, a habilidade falha.', keystoneStats: { hp: 50 }, mechanics: ['overclock_termodinamico'], themeColor: '#10b981', iconSvgPath: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 'dot', name: 'Entropia', angle: 288, minorStats: { atk: 2, spd: 2 }, notableStats: { atk: 15, spd: 15 }, keystoneName: 'Protocolo de Execução', keystoneDesc: 'Se o ataque deixar o alvo com menos de 10% de HP, o alvo é morto instantaneamente (HP = 0).', keystoneStats: { atk: 20, def: 10 }, mechanics: ['protocolo_execucao'], themeColor: '#a855f7', iconSvgPath: 'M12 2c0 0-5 6.4-5 11.5A5.5 5.5 0 0 0 12 19a5.5 5.5 0 0 0 5-5.5C17 8.4 12 2 12 2z' }
  ];`;

code = code.replace(clustersOld, clustersNew);

const coreNodeOld = `  nodes['core_start'] = {
    id: 'core_start',
    type: 'keystone',
    name: 'NÚCLEO MATRIZ',
    description: 'Ponto de ignição da sua estrutura neural.',
    connections: [],
    x: 0,
    y: 0
  };`;

const coreNodeNew = `  nodes['core_start'] = {
    id: 'core_start',
    type: 'keystone',
    name: 'NÚCLEO MATRIZ',
    description: 'Ponto de ignição da sua estrutura neural.',
    connections: [],
    x: 0,
    y: 0,
    themeColor: '#06b6d4',
    iconSvgPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
  };`;

code = code.replace(coreNodeOld, coreNodeNew);

const nodeCreationOld = `        name,
        description,
        statBonus,
        mechanicModifiers,
        connections: [previousId],
        x,
        y
      };`;

const nodeCreationNew = `        name,
        description,
        statBonus,
        mechanicModifiers,
        clusterId: cluster.id,
        themeColor: cluster.themeColor,
        iconSvgPath: cluster.iconSvgPath,
        connections: [previousId],
        x,
        y
      };`;

code = code.replace(nodeCreationOld, nodeCreationNew);

fs.writeFileSync('src/core/entities/neuralMatrixGenerator.ts', code);
console.log('Fixed generator');
