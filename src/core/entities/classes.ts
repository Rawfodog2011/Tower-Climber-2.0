import { ClassDefinition } from '../../types';

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

export function getClassEvolutionNarrative(classId: string, originId?: string): string {
  const narratives: Record<string, Record<string, string>> = {
    mecatronico: {
      default: "LOG DO SISTEMA // ATIVAÇÃO PROTOCOLO MECATRÔNICO\n\nAtivação do protocolo de engenharia mecânica pesada. Suas ferramentas de campo agora ressoam com a vibração estrutural do Pináculo, soldando sucata em blindagem ativa. O metal responde à sua vontade.",
      cobaia_elite: "LOG DO SISTEMA // RECONEXÃO SENSORIAL KINETIX\n\nSeus implantes de blindagem pesada da Kinetix são reativados sob novas diretrizes auto-programadas. As juntas hidráulicas emitem um rosnado de pura potência industrial. Você recuperou o controle sobre sua própria pele mecânica.",
      especialista_evasao: "LOG DO SISTEMA // ADAPTAÇÃO TÁTICA AERODYNAMICS\n\nVocê reconfigura as ferramentas de precisão que roubou da AeroDynamics para moldar ligas metálicas reforçadas. A leveza dos novos chassis compensa a rigidez mecânica original.",
      renegado_omnicorp: "LOG DO SISTEMA // INTEGRAÇÃO NANITE OMNICORP\n\nVocê injeta uma matriz de nanorrobôs estruturais da OmniCorp em suas ferramentas de forja. O silício e o aço fundem-se em nível atômico com precisão clínica."
    },
    eletromante: {
      default: "LOG DO SISTEMA // PONTES DE INDUÇÃO CONECTADAS\n\nInstalação de bobinas de indução neurais nos terminais de seus braços. A rede elétrica instável da torre agora corre livremente através do seu sistema circulatório. Você aprendeu a direcionar a fúria energética do Pináculo.",
      cobaia_elite: "LOG DO SISTEMA // LIMPEZA NEURAL ATIVA\n\nO choque de alta frequência limpa o ruído estático de rastreamento da Kinetix em seu cérebro. Você canaliza a energia de sobrecarga diretamente nos seus canhões integrados sob medida.",
      especialista_evasao: "LOG DO SISTEMA // SOBREVOLTAGEM DE SINAL\n\nA fiação de alta velocidade de seu traje AeroDynamics reluz sob a nova voltagem extrema. A velocidade de condução sináptica atinge picos que o olho humano não consegue registrar.",
      renegado_omnicorp: "LOG DO SISTEMA // FLUXO ELETROQUÍMICO REORDENADO\n\nSuas experiências com condutividade eletroquímica finalmente dão frutos. O fluxo de elétrons obedece perfeitamente ao mapa de sinapses artificiais implantado em seu córtex."
    },
    operador_drones: {
      default: "LOG DO SISTEMA // LINK DE COMUNICAÇÃO ESTABELECIDO\n\nSincronização neural com frequências de rede de baixo nível da torre. Seus olhos agora operam em mosaico, compartilhando o processamento visual com drones batedores descartados que você trouxe de volta à vida.",
      cobaia_elite: "LOG DO SISTEMA // SEQUESTRO DE SINAL MILITAR KINETIX\n\nVocê sequestra a rede de satélites táticos de curto alcance da Kinetix. Os drones de caça locais agora o reconhecem como uma unidade comandante legada, não como alvo a ser limpo.",
      especialista_evasao: "LOG DO SISTEMA // CANAL DE RETORNO AERODYNAMICS\n\nSeu antigo terminal de piloto AeroDynamics intercepta comandos de malhas locais. Os pequenos quadricópteros executam manobras evasivas perfeitas sob seu controle remoto direto.",
      renegado_omnicorp: "LOG DO SISTEMA // PROCESSAMENTO COGNITIVO OMNICORP\n\nVocê calibra os microrreceptores ópticos usando patentes vazadas da OmniCorp. Suas unidades de voo autônomas mapeiam os andares com precisão analítica impecável."
    },
    biotecnologo: {
      default: "LOG DO SISTEMA // ESTABILIZAÇÃO BIOMÉTRICA CONCLUÍDA\n\nInjeção de soro bio-regenerativo ativo na corrente sanguínea. Suas feridas se fecham com filamentos de tecido fibroso artificial enquanto sensores em tempo real monitoram sua decomposição celular.",
      cobaia_elite: "LOG DO SISTEMA // NEUTRALIZAÇÃO DE STRESS KINETIX\n\nO estresse físico dos testes destrutivos da Kinetix é neutralizado por sua nova solução biossintética. Seus músculos artificiais cicatrizam instantaneamente após sobrecargas.",
      especialista_evasao: "LOG DO SISTEMA // OXIGENAÇÃO TÁTICA AMPLIADA\n\nVocê adiciona aditivos respiratórios leves para suportar a altitude extrema da fenda AeroDynamics. Seus pulmões artificiais oxigenam o sangue com eficiência triplicada.",
      renegado_omnicorp: "LOG DO SISTEMA // REPLICAÇÃO AUTÔNOMA DE MATRIZ\n\nO último frasco de nanogel regenerativo que você subtraiu da OmniCorp se integra totalmente à sua medula óssea. Suas células iniciam um processo de mitose hiper-acelerada autônoma."
    },
    juggernaut_industrial: {
      default: "LOG DO SISTEMA // EXOSQUELETO TITÃ IMPLANTADO\n\nInstalação de blindagem classe Titã sobre o chassis. Você não é mais apenas um explorador; você se tornou uma barreira mecânica intransponível que marcha pesadamente contra as anomalias do Pináculo.",
      cobaia_elite: "LOG DO SISTEMA // RETORNO AO PROJETO AEGIS\n\nReencontro completo de seus implantes originais Kinetix do antigo Projeto Aegis. Desta vez, porém, os códigos de autodestruição remotos foram apagados para sempre. Você é o mestre da sua própria fortaleza de ferro.",
      especialista_evasao: "LOG DO SISTEMA // CONVERGÊNCIA CONTRADITÓRIA DE CHASSIS\n\nO chassis AeroDynamics leve é fundido sob pressão extrema a placas de aço denso e reciclado. Uma fusão contraditória de mobilidade tática e blindagem massiva.",
      renegado_omnicorp: "LOG DO SISTEMA // AMORTECIMENTO BIOPOLIMÉRICO OMNICORP\n\nVocê injeta placas de biopolímero endurecido da OmniCorp em suas juntas hidráulicas. A rigidez muscular é compensada por um sistema de absorção de impacto molecular ativo."
    },
    ciborgue_combate: {
      default: "LOG DO SISTEMA // LIMITADORES TÉRMICOS DESATIVADOS\n\nTodos os limitadores térmicos do sistema foram desativados por completo. A dor é traduzida em pulsos de overclocking que maximizam sua força de impacto à custa do desgaste estrutural do chassi.",
      cobaia_elite: "LOG DO SISTEMA // OVERCLOCK DESCONTROLADO KINETIX\n\nSeus antigos implantes Kinetix de teste são forçados a operar a 200% da capacidade projetada. As cicatrizes do laboratório fumegam enquanto você rasga o ar.",
      especialista_evasao: "LOG DO SISTEMA // QUEBRA DA BARREIRA DE VÁCUO\n\nO gerador de aceleração AeroDynamics ultrapassa a barreira do som no vácuo dos andares. Você golpeia antes mesmo do sensor acústico inimigo registrar sua aproximação real.",
      renegado_omnicorp: "LOG DO SISTEMA // SANGUE MUTAGÊNICO ATIVO\n\nO soro mutagênico da OmniCorp é metabolizado instantaneamente, convertendo suas reservas de energia interna em impulsos de pura fúria biomecânica e velocidade letal."
    },
    arquiteto_sistemas: {
      default: "LOG DO SISTEMA // COMPILAÇÃO TOPOLÓGICA CONCLUÍDA\n\nSeu córtex cerebral está agora conectado diretamente às comportas de dados primárias do Pináculo. O espaço físico ao seu redor se fragmenta em códigos-fonte, permitindo reescrever as leis locais de combate.",
      cobaia_elite: "LOG DO SISTEMA // REDIRECIONAMENTO DE ESCUDO KINETIX\n\nOs pesados sistemas de direcionamento balístico Kinetix são inteiramente substituídos por uma projeção holográfica de vetores puramente eletrônicos.",
      especialista_evasao: "LOG DO SISTEMA // SATURAÇÃO DE ATMOSFERA AERODYNAMICS\n\nVocê hackeia a rede de monitoramento atmosférico de alta altitude da AeroDynamics, distorcendo o campo magnético local ao seu bel-prazer para pulverizar ameaças.",
      renegado_omnicorp: "LOG DO SISTEMA // FÓRMULAS EMPÍRICAS CONVERTIDAS\n\nAs fórmulas químicas secretas e equações físicas que você estudou nos laboratórios da OmniCorp são compiladas no ambiente local como leis físicas e elétricas absolutas."
    },
    tecnomante: {
      default: "LOG DO SISTEMA // INDUÇÃO DE SINAL FANTASMA\n\nSinais eletromagnéticos de baixa frequência de seus novos implantes forçam carcaças metálicas inertes a se reerguerem sob sua submissão. Você é a própria morte digital caminhando pelos andares.",
      cobaia_elite: "LOG DO SISTEMA // DESPERTAR DE SUCATA MILITAR KINETIX\n\nO cemitério de tanques táticos e drones pesados Kinetix agora responde aos seus comandos silenciosos. Drones desativados se levantam sob fumaça tóxica.",
      especialista_evasao: "LOG DO SISTEMA // MARIONETES DE VÔO AERODYNAMICS\n\nAs asas quebradas de drones de patrulha AeroDynamics caídos tremem no escuro, flutuando como marionetes flutuantes sob a sua rede de indução elétrica.",
      renegado_omnicorp: "LOG DO SISTEMA // REANIMAÇÃO POR NECROGEL OMNICORP\n\nO necrogel ativo desenvolvido pela OmniCorp reanima a matéria sintética descartada. Os tecidos artificiais mortos voltam a pulsar sob as diretrizes de sua mente renegada."
    },
    atirador_optico: {
      default: "LOG DO SISTEMA // CALIBRAÇÃO BALÍSTICA EXTREMA\n\nImplantação de lentes de rastreamento de longo alcance acopladas a calculadores de balística avançados. Obstáculos e blindagens pesadas tornam-se meras sugestões em sua mira eletrônica.",
      cobaia_elite: "LOG DO SISTEMA // PERFURAÇÃO TÉRMICA SELETIVA KINETIX\n\nVocê calibra o canhão Kinetix pesado com sistemas de mira ocular cirúrgicos. O cano expele fumaça térmica enquanto o alvo é perfurado perfeitamente a quilômetros de distância.",
      especialista_evasao: "LOG DO SISTEMA // AJUSTE DE MICRO-GRAU AERODYNAMICS\n\nO detector de vento e resistência atmosférica herdado da AeroDynamics ajusta seus disparos em tempo real. Nenhum projétil tático desvia um milímetro de sua rota calculada.",
      renegado_omnicorp: "LOG DO SISTEMA // ESPECTROMETRIA DE MASSA OMNICORP\n\nSua mira de raios-X baseada na espectrometria de massa desenvolvida pela OmniCorp detecta em tempo real os pontos fracos moleculares e rachaduras internas na armadura do oponente."
    },
    fantasma_silicio: {
      default: "LOG DO SISTEMA // MATRIZ DE REFRACÇÃO TERMÓPTICA COMPILADA\n\nInstalação de micro-prismas de silício sobre sua derme sintética. A luz e o calor contornam seu corpo físico, deixando apenas um rastro estático cintilante antes da execução fatal de suas lâminas.",
      cobaia_elite: "LOG DO SISTEMA // SILENCIADOR ELETROMAGNÉTICO KINETIX\n\nA força física bruta dos seus componentes Kinetix é mascarada por um silenciador eletromagnético total. Você se tornou um gigante invisível movendo-se silenciosamente no breu.",
      especialista_evasao: "LOG DO SISTEMA // TECNOLOGIA STEALTH EXPERIMENTAL\n\nVocê se move usando a camuflagem tática experimental AeroDynamics que outrora roubou dos laboratórios de ensaio. As câmeras de segurança registram apenas vácuo e brisa.",
      renegado_omnicorp: "LOG DO SISTEMA // DISPERSÃO DE NANO-NÉVOA OMNICORP\n\nSeus nanites OmniCorp dispersam um gás refletor de luz que absorve ondas infravermelhas. O inimigo ataca o espaço vazio enquanto você ressurge letalmente por trás."
    },
    cirurgiao_mecanico: {
      default: "LOG DO SISTEMA // SISTEMAS DE EXTRAÇÃO MOLECULAR ATIVOS\n\nLâminas de alta frequência de precisão cirúrgica acopladas aos seus membros superiores. Cada corte que você desfere drena os fluidos sintéticos vitais do oponente para realimentar seus próprios reservatórios metabólicos.",
      cobaia_elite: "LOG DO SISTEMA // DESCONSTRUÇÃO DE BLINDAGEM KINETIX\n\nVocê reprograma os bisturis térmicos Kinetix projetados para dissecar blindagens táticas. O aço e a quitina inimiga são abertos como tecido orgânico macio.",
      especialista_evasao: "LOG DO SISTEMA // FLUIDEZ CIRÚRGICA AERODYNAMICS\n\nMovimentos milimétricos e de alta velocidade herdados da engenharia de voo AeroDynamics tornam seus cortes extremamente limpos, quase imperceptíveis até que a anomalia colapse.",
      renegado_omnicorp: "LOG DO SISTEMA // LICENÇA DE VIVISSECÇÃO OMNICORP\n\nVocê recupera sua antiga licença de vivissecção da OmniCorp na forma de garras cirúrgicas moleculares. Desmontar anomalias biomecânicas é apenas mais um dia de trabalho no Pináculo."
    },
    simbionte_sintetico: {
      default: "LOG DO SISTEMA // COLAPSO ORGÂNICO CONCLUÍDO\n\nSua humanidade orgânica foi reduzida a menos de 5%. A massa muscular e as redes neurais fundiram-se em um polímero sintético em constante mutação, gerando uma resiliência biológica impensável.",
      cobaia_elite: "LOG DO SISTEMA // FUSÃO CELULAR CORRUPTA KINETIX\n\nOs implantes pesados Kinetix foram devorados por sua massa biológica infectada por nanites. O metal pesado e os tendões fundiram-se em uma amálgama viva de dor e resiliência infinita.",
      especialista_evasao: "LOG DO SISTEMA // EXPANSÃO DE POLÍMERO DENSO\n\nSeu chassi ágil AeroDynamics é completamente soterrado por uma massa de polímero denso regenerativo. Você se torna uma barreira mutante viva que absorve qualquer tempestade.",
      renegado_omnicorp: "LOG DO SISTEMA // O EXPERIMENTO PERFEITO OMNICORP\n\nO vírus de nanotecnologia biossintética que você roubou da OmniCorp tomou controle absoluto do seu metabolismo celular. Você se tornou o experimento perfeito e o pesadelo final de seus antigos criadores."
    }
  };

  const classNarratives = narratives[classId] || {};
  return classNarratives[originId || ""] || classNarratives.default || "LOG DO SISTEMA // PROTOCOLO ATIVADO\n\nSua classe evoluiu com sucesso. Seus sistemas integrados foram atualizados para um novo patamar de processamento mecânico.";
}

// TODO: valores provisórios, revisar em sessão de balanceamento dedicada.
const level40Classes = [
  'juggernaut_industrial',
  'ciborgue_combate',
  'arquiteto_sistemas',
  'tecnomante',
  'atirador_optico',
  'fantasma_silicio',
  'cirurgiao_mecanico',
  'simbionte_sintetico'
];

level40Classes.forEach(id40 => {
  const pCls = CLASSES[id40];
  if (!pCls) return;

  // Level 70 evolutions (A and B)
  const baseStats70 = {
    hp: Math.floor(pCls.baseStats.hp * 2.5),
    mp: Math.floor(pCls.baseStats.mp * 2.5),
    atk: Math.floor(pCls.baseStats.atk * 2.5),
    def: Math.floor(pCls.baseStats.def * 2.5),
    spd: Math.floor(pCls.baseStats.spd * 2.0)
  };
  const growth70 = {
    hp: Math.floor(pCls.statGrowthPerLevel.hp * 1.5),
    mp: Math.floor(pCls.statGrowthPerLevel.mp * 1.5),
    atk: Math.floor(pCls.statGrowthPerLevel.atk * 1.5),
    def: Math.floor(pCls.statGrowthPerLevel.def * 1.5),
    spd: Math.max(1, Math.floor(pCls.statGrowthPerLevel.spd * 1.5))
  };

  const id70a = `${id40}_70a`;
  CLASSES[id70a] = {
    id: id70a,
    name: `${pCls.name} Alfa`,
    description: 'Evolução de nível 70 — descrição a definir',
    requiredLevel: 70,
    parentClassId: id40,
    baseStats: baseStats70,
    statGrowthPerLevel: growth70
  };

  const id70b = `${id40}_70b`;
  CLASSES[id70b] = {
    id: id70b,
    name: `${pCls.name} Beta`,
    description: 'Evolução de nível 70 — descrição a definir',
    requiredLevel: 70,
    parentClassId: id40,
    baseStats: baseStats70,
    statGrowthPerLevel: growth70
  };

  // Level 100 Ascensions (1-to-1)
  [id70a, id70b].forEach(id70 => {
    const parent70 = CLASSES[id70];
    const baseStats100 = {
      hp: Math.floor(parent70.baseStats.hp * 2.5),
      mp: Math.floor(parent70.baseStats.mp * 2.5),
      atk: Math.floor(parent70.baseStats.atk * 2.5),
      def: Math.floor(parent70.baseStats.def * 2.5),
      spd: Math.floor(parent70.baseStats.spd * 2.0)
    };
    const growth100 = {
      hp: Math.floor(parent70.statGrowthPerLevel.hp * 1.5),
      mp: Math.floor(parent70.statGrowthPerLevel.mp * 1.5),
      atk: Math.floor(parent70.statGrowthPerLevel.atk * 1.5),
      def: Math.floor(parent70.statGrowthPerLevel.def * 1.5),
      spd: Math.max(1, Math.floor(parent70.statGrowthPerLevel.spd * 1.5))
    };

    const id100 = `${id70}_ascension`;
    CLASSES[id100] = {
      id: id100,
      name: `${parent70.name} [Ascensão]`,
      description: 'Ascensão de nível 100 — descrição a definir',
      requiredLevel: 100,
      parentClassId: id70,
      baseStats: baseStats100,
      statGrowthPerLevel: growth100
    };
  });
});


