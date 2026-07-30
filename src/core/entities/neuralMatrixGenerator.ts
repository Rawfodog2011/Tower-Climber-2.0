import { MatrixNode, MatrixNodeType } from './neuralMatrix';

export function generateNeuralSkeleton(centerX: number = 0, centerY: number = 0, spacing: number = 80): Record<string, MatrixNode> {
  const nodes: Record<string, MatrixNode> = {};

  const coreId = 'core_start';
  nodes[coreId] = {
    id: coreId,
    type: 'keystone',
    name: 'Core Neural',
    description: 'O início da matriz sináptica. Desperta as capacidades latentes do traje.',
    statBonus: { hp: 50, mp: 50, atk: 10, def: 10, spd: 10 },
    connections: [],
    x: centerX,
    y: centerY
  };

  const clusters = [
    { id: 'assault', name: 'Assalto', angle: 0, minorStats: { atk: 5 }, notableStats: { atk: 25 }, keystoneName: 'Sobrecarga de Matéria', keystoneDesc: 'Causa 50% mais dano total, mas recebe 15% de Dano Verdadeiro adicional de qualquer fonte.', keystoneStats: { atk: 50, hp: -25 }, mechanics: ['sobrecarga_materia'], themeColor: '#ef4444', iconSvgPath: 'M14.5 17.5 3 6V3h3l11.5 11.5 M13 19l6-6 M16 16l4 4 M19 21l2-2' },
    { id: 'defense', name: 'Defesa', angle: 72, minorStats: { def: 5, hp: 10 }, notableStats: { def: 25, hp: 50 }, keystoneName: 'Baluarte Inabalável', keystoneDesc: 'Ganha +200% de Defesa, mas Velocidade é travada no mínimo.', keystoneStats: { def: 100, spd: -20 }, themeColor: '#3b82f6', iconSvgPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { id: 'speed', name: 'Velocidade', angle: 144, minorStats: { spd: 5 }, notableStats: { spd: 25 }, keystoneName: 'Aceleração Taquiônica', keystoneDesc: 'Sempre ataca primeiro e ganha evasão passiva, porém Dano reduzido em 30%.', keystoneStats: { spd: 50, atk: -10 }, themeColor: '#eab308', iconSvgPath: 'M5 12h14 M12 5l7 7-7 7' },
    { id: 'economy', name: 'Economia', angle: 216, minorStats: { mp: 10 }, notableStats: { mp: 50 }, keystoneName: 'Overclock Termodinâmico', keystoneDesc: 'Habilidades custam HP ao invés de MP. Se não tiver HP suficiente, a habilidade falha.', keystoneStats: { hp: 50 }, mechanics: ['overclock_termodinamico'], themeColor: '#10b981', iconSvgPath: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 'dot', name: 'Entropia', angle: 288, minorStats: { atk: 2, spd: 2 }, notableStats: { atk: 15, spd: 15 }, keystoneName: 'Protocolo de Execução', keystoneDesc: 'Se o ataque deixar o alvo com menos de 10% de HP, o alvo é morto instantaneamente (HP = 0).', keystoneStats: { atk: 20, def: 10 }, mechanics: ['protocolo_execucao'], themeColor: '#a855f7', iconSvgPath: 'M12 2c0 0-5 6.4-5 11.5A5.5 5.5 0 0 0 12 19a5.5 5.5 0 0 0 5-5.5C17 8.4 12 2 12 2z' }
  ];

  clusters.forEach(cluster => {
    const rad = (cluster.angle * Math.PI) / 180;
    let previousId = coreId;

    for (let i = 1; i <= 7; i++) {
      const distance = i * spacing;
      const x = centerX + Math.cos(rad) * distance;
      const y = centerY + Math.sin(rad) * distance;

      let nodeId = `${cluster.id}_${i}`;
      let type: MatrixNodeType = 'minor';
      let name = `Trilha de ${cluster.name} ${i}`;
      let description = `Aumenta sutilmente as capacidades de ${cluster.name}.`;
      let statBonus = cluster.minorStats;
      let mechanicModifiers: string[] | undefined = undefined;

      if (i === 6) {
        nodeId = `${cluster.id}_notable`;
        type = 'notable';
        name = `Conector: ${cluster.name} Avançado`;
        description: `Aprimoramento massivo de ${cluster.name}.`;
        statBonus = cluster.notableStats;
      } else if (i === 7) {
        nodeId = `${cluster.id}_keystone`;
        type = 'keystone';
        name = `Controlador: ${cluster.keystoneName}`;
        description = cluster.keystoneDesc;
        statBonus = cluster.keystoneStats;
        if ((cluster as any).mechanics) {
          mechanicModifiers = (cluster as any).mechanics;
        }
      }

      nodes[nodeId] = {
        id: nodeId,
        type,
        name,
        description,
        statBonus,
        mechanicModifiers,
        clusterId: cluster.id,
        themeColor: cluster.themeColor,
        iconSvgPath: cluster.iconSvgPath,
        connections: [previousId],
        x,
        y
      };

      // Bidirectional connection
      nodes[previousId].connections.push(nodeId);
      previousId = nodeId;
    }
  });

  // Criar as Pontes (Bridges)
  for (let i = 0; i < clusters.length; i++) {
    const c1 = clusters[i];
    const c2 = clusters[(i + 1) % clusters.length];

    // Conectar o nó minor 4 de um cluster ao nó minor 4 do outro, passando por um nódulo Conector
    const distToBridgeLevel = 4 * spacing;
    const a1 = (c1.angle * Math.PI) / 180;
    const a2 = (c2.angle * Math.PI) / 180;
    
    const x1 = centerX + Math.cos(a1) * distToBridgeLevel;
    const y1 = centerY + Math.sin(a1) * distToBridgeLevel;
    
    const x2 = centerX + Math.cos(a2) * distToBridgeLevel;
    const y2 = centerY + Math.sin(a2) * distToBridgeLevel;

    // Midpoint
    const bridgeX = (x1 + x2) / 2;
    const bridgeY = (y1 + y2) / 2;

    const bridgeId = `bridge_${c1.id}_${c2.id}`;
    const n1Id = `${c1.id}_4`;
    const n2Id = `${c2.id}_4`;

    nodes[bridgeId] = {
      id: bridgeId,
      type: 'notable',
      name: `Sinergia: ${c1.name} & ${c2.name}`,
      description: `Funde as características de ${c1.name} e ${c2.name}, criando um elo no circuito.`,
      statBonus: { hp: 10, mp: 10, atk: 5, def: 5, spd: 5 },
      connections: [n1Id, n2Id],
      x: bridgeX,
      y: bridgeY
    };

    // Atualizar as conexões dos vizinhos
    nodes[n1Id].connections.push(bridgeId);
    nodes[n2Id].connections.push(bridgeId);
  }

  return nodes;
}
