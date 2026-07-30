import { MatrixNode, MatrixNodeType } from './neuralMatrix';
import { Stats } from '../../types';

interface ClusterConfig {
  id: string;
  name: string;
  angle: number;
  minorStats: Partial<Stats>;
  notableStats: Partial<Stats>;
  keystoneName: string;
  keystoneDesc: string;
  keystoneStats: Partial<Stats>;
  mechanics?: string[];
  themeColor: string;
  iconSvgPath: string;
}

function addPentagon(
  nodes: Record<string, MatrixNode>,
  centerX: number,
  centerY: number,
  prefix: string,
  spacing: number,
  clustersConfig: ClusterConfig[],
  isCentral: boolean,
  coreNodeOverride?: Partial<MatrixNode>
) {
  const coreId = isCentral ? 'core_start' : `${prefix}_core`;
  nodes[coreId] = {
    id: coreId,
    type: 'keystone',
    name: coreNodeOverride?.name || 'Core Neural',
    description: coreNodeOverride?.description || 'O início da matriz sináptica.',
    statBonus: coreNodeOverride?.statBonus || { hp: 50, mp: 50, atk: 10, def: 10, spd: 10 },
    connections: [],
    clusterId: prefix, pentagonId: prefix,
    themeColor: coreNodeOverride?.themeColor || '#ffffff',
    iconSvgPath: 'M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    x: centerX,
    y: centerY,
    ...coreNodeOverride
  };

  clustersConfig.forEach(cluster => {
    const rad = (cluster.angle * Math.PI) / 180;
    let previousId = coreId;
    for (let i = 1; i <= 7; i++) {
      const distance = i * spacing;
      const x = centerX + Math.cos(rad) * distance;
      const y = centerY + Math.sin(rad) * distance;

      let nodeId = isCentral ? `${cluster.id}_${i}` : `${prefix}_${cluster.id}_${i}`;
      let type: MatrixNodeType = 'minor';
      let name = isCentral ? `Trilha de ${cluster.name} ${i}` : `Fragmento de ${cluster.name} ${i}`;
      let description = isCentral ? `Aumenta sutilmente as capacidades de ${cluster.name}.` : 'Poder latente aguardando expansão.';
      let statBonus: Partial<Stats> = cluster.minorStats;
      let mechanicModifiers: string[] | undefined = undefined;

      if (i === 6) {
        nodeId = isCentral ? `${cluster.id}_notable` : `${prefix}_${cluster.id}_notable`;
        type = 'notable';
        name = isCentral ? `Conector: ${cluster.name} Avançado` : `Conector Sinergético`;
        description = isCentral ? `Aprimoramento massivo de ${cluster.name}.` : 'Elo de poder expandido.';
        statBonus = cluster.notableStats;
      } else if (i === 7) {
        nodeId = isCentral ? `${cluster.id}_keystone` : `${prefix}_${cluster.id}_keystone`;
        type = 'keystone';
        name = isCentral ? `Controlador: ${cluster.keystoneName}` : `Singularidade: ${cluster.keystoneName}`;
        description = isCentral ? cluster.keystoneDesc : cluster.keystoneDesc;
        statBonus = cluster.keystoneStats;
        if (cluster.mechanics) {
          mechanicModifiers = cluster.mechanics;
        }
      }

      nodes[nodeId] = {
        id: nodeId,
        type,
        name,
        description,
        statBonus,
        mechanicModifiers,
        clusterId: isCentral ? cluster.id : `${prefix}_${cluster.id}`, pentagonId: prefix,
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
  for (let i = 0; i < clustersConfig.length; i++) {
    const c1 = clustersConfig[i];
    const c2 = clustersConfig[(i + 1) % clustersConfig.length];

    // Conectar o nó minor 4 de um cluster ao nó minor 4 do outro
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

    const bridgeId = isCentral ? `bridge_${c1.id}_${c2.id}` : `${prefix}_bridge_${c1.id}_${c2.id}`;
    const n1Id = isCentral ? `${c1.id}_4` : `${prefix}_${c1.id}_4`;
    const n2Id = isCentral ? `${c2.id}_4` : `${prefix}_${c2.id}_4`;

    nodes[bridgeId] = {
      id: bridgeId,
      type: 'notable',
      name: `Sinergia: ${c1.name} & ${c2.name}`,
      description: `Funde as características de ${c1.name} e ${c2.name}.`,
      statBonus: { hp: 10, mp: 10, atk: 5, def: 5, spd: 5 },
      connections: [n1Id, n2Id],
      clusterId: isCentral ? `bridge_${c1.id}_${c2.id}` : `${prefix}_bridge`, pentagonId: prefix,
      themeColor: c1.themeColor,
      iconSvgPath: c1.iconSvgPath,
      x: bridgeX,
      y: bridgeY
    };

    // Atualizar as conexões dos vizinhos
    nodes[n1Id].connections.push(bridgeId);
    nodes[n2Id].connections.push(bridgeId);
  }
}

export function generateNeuralSkeleton(centerX: number = 0, centerY: number = 0, spacing: number = 80): Record<string, MatrixNode> {
  const nodes: Record<string, MatrixNode> = {};
  
  const centralClusters: ClusterConfig[] = [
    { id: 'assault', name: 'Assalto', angle: 0, minorStats: { atk: 5 }, notableStats: { atk: 25 }, keystoneName: 'Sobrecarga de Matéria', keystoneDesc: 'Causa 50% mais dano total, mas recebe 15% de Dano Verdadeiro adicional de qualquer fonte.', keystoneStats: { atk: 50, hp: -25 }, mechanics: ['sobrecarga_materia'], themeColor: '#ef4444', iconSvgPath: 'M14.5 17.5 3 6V3h3l11.5 11.5 M13 19l6-6 M16 16l4 4 M19 21l2-2' },
    { id: 'defense', name: 'Defesa', angle: 72, minorStats: { def: 5, hp: 10 }, notableStats: { def: 25, hp: 50 }, keystoneName: 'Baluarte Inabalável', keystoneDesc: 'Ganha +200% de Defesa, mas Velocidade é travada no mínimo.', keystoneStats: { def: 100, spd: -20 }, themeColor: '#3b82f6', iconSvgPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { id: 'speed', name: 'Velocidade', angle: 144, minorStats: { spd: 5 }, notableStats: { spd: 25 }, keystoneName: 'Aceleração Taquiônica', keystoneDesc: 'Sempre ataca primeiro e ganha evasão passiva, porém Dano reduzido em 30%.', keystoneStats: { spd: 50, atk: -10 }, themeColor: '#eab308', iconSvgPath: 'M5 12h14 M12 5l7 7-7 7' },
    { id: 'economy', name: 'Economia', angle: 216, minorStats: { mp: 10 }, notableStats: { mp: 50 }, keystoneName: 'Overclock Termodinâmico', keystoneDesc: 'Habilidades custam HP ao invés de MP. Se não tiver HP suficiente, a habilidade falha.', keystoneStats: { hp: 50 }, mechanics: ['overclock_termodinamico'], themeColor: '#06b6d4', iconSvgPath: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 'dot', name: 'Entropia', angle: 288, minorStats: { atk: 2, spd: 2 }, notableStats: { atk: 15, spd: 15 }, keystoneName: 'Protocolo de Execução', keystoneDesc: 'Se o ataque deixar o alvo com menos de 10% de HP, o alvo é morto instantaneamente (HP = 0).', keystoneStats: { atk: 20, def: 10 }, mechanics: ['protocolo_execucao'], themeColor: '#ec4899', iconSvgPath: 'M12 2c0 0-5 6.4-5 11.5A5.5 5.5 0 0 0 12 19a5.5 5.5 0 0 0 5-5.5C17 8.4 12 2 12 2z' }
  ];

  addPentagon(nodes, centerX, centerY, 'central', spacing, centralClusters, true);

  const synergies = [
    {
      name: 'Vanguarda Implacável',
      color: '#a855f7', // Roxo (Vermelho + Azul)
      desc: 'Mistura força bruta com resiliência estrutural. Foco em Bruxaria (Bruiser).',
      minorStats: { hp: 20, atk: 10, def: 10 },
      notableStats: { hp: 100, atk: 40, def: 40 },
      keystoneName: 'Armadura Reativa',
      keystoneDesc: 'Ganha bônus de Ataque igual a 50% da sua Defesa. Reflete 20% do dano recebido.',
      keystoneStats: { atk: 100, def: 100 },
      mechanics: ['armadura_reativa']
    },
    {
      name: 'Fantasma Cinético',
      color: '#10b981', // Verde (Azul + Amarelo)
      desc: 'Mobilidade tática e esquiva defensiva inatingível.',
      minorStats: { hp: 15, def: 5, spd: 15 },
      notableStats: { hp: 75, def: 25, spd: 60 },
      keystoneName: 'Bateria Cinética',
      keystoneDesc: 'Sempre que você esquivar, restaura 10% do seu HP Máximo e ganha 20% de Dano no próximo turno.',
      keystoneStats: { hp: 150, spd: 80 },
      mechanics: ['bateria_cinetica']
    },
    {
      name: 'Tempestade de Dados',
      color: '#f8fafc', // Branco/Prata (Amarelo + Ciano)
      desc: 'Maximização do fluxo de energia para ações quase instantâneas.',
      minorStats: { spd: 15, mp: 15 },
      notableStats: { spd: 60, mp: 75 },
      keystoneName: 'Loop de Processamento',
      keystoneDesc: 'Suas habilidades têm 30% de chance de custar 0 MP e não entrar em tempo de recarga (Cooldown).',
      keystoneStats: { spd: 100, mp: 150 },
      mechanics: ['loop_processamento']
    },
    {
      name: 'Simbionte Digital',
      color: '#6366f1', // Índigo (Ciano + Magenta)
      desc: 'Drenagem contínua dos recursos do alvo para sustentar a si mesmo.',
      minorStats: { mp: 10, atk: 10, spd: 5 },
      notableStats: { mp: 50, atk: 40, hp: 50 },
      keystoneName: 'Fome Algorítmica',
      keystoneDesc: 'Seu dano por tempo (DoT) cura você em 50% do valor e queima o MP do inimigo.',
      keystoneStats: { mp: 100, atk: 80 },
      mechanics: ['fome_algoritmica']
    },
    {
      name: 'Fissura Caótica',
      color: '#f97316', // Laranja (Magenta + Vermelho)
      desc: 'Destruição mútua assegurada. Sacrifício por poder absoluto.',
      minorStats: { atk: 15, hp: 15 },
      notableStats: { atk: 75, hp: 75 },
      keystoneName: 'Colapso do Núcleo',
      keystoneDesc: 'Seus ataques sacrificam 5% do seu HP atual para causar 2x esse valor como Dano Verdadeiro Adicional.',
      keystoneStats: { atk: 120, hp: 200 },
      mechanics: ['colapso_nucleo']
    }
  ];

  for (let i = 0; i < centralClusters.length; i++) {
    const c = centralClusters[i];
    const syn = synergies[i];

    const angleDeg = c.angle;
    const angleRad = (angleDeg * Math.PI) / 180;
    
    // Distância do núcleo central até o núcleo do pentágono externo
    const newPentagonDist = 16 * spacing; 

    const pCenterX = centerX + Math.cos(angleRad) * newPentagonDist;
    const pCenterY = centerY + Math.sin(angleRad) * newPentagonDist;

    const pentagonPrefix = `outer_${c.id}`;
    
    const outerClusters: ClusterConfig[] = [];
    for (let j = 0; j < 5; j++) {
      outerClusters.push({
        id: `branch_${j}`,
        name: `${syn.name} - Ramo ${j+1}`,
        angle: (angleDeg + 180 + j * 72) % 360, 
        minorStats: syn.minorStats,
        notableStats: syn.notableStats,
        keystoneName: syn.keystoneName,
        keystoneDesc: syn.keystoneDesc,
        keystoneStats: syn.keystoneStats,
        mechanics: syn.mechanics,
        themeColor: syn.color,
        iconSvgPath: 'M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'
      });
    }

    addPentagon(nodes, pCenterX, pCenterY, pentagonPrefix, spacing, outerClusters, false, {
      name: `Sinergia Externa: ${syn.name}`,
      description: syn.desc,
      themeColor: syn.color
    });

    // Connect the central keystone to the outer pentagon's inner-pointing keystone
    const centralKeystoneId = `${c.id}_keystone`;
    const outerInnerKeystoneId = `${pentagonPrefix}_branch_0_keystone`;
    
    nodes[centralKeystoneId].connections.push(outerInnerKeystoneId);
    nodes[outerInnerKeystoneId].connections.push(centralKeystoneId);
  }

  return nodes;
}
