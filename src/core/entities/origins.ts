import { Stats } from '../../types';

export interface Origin {
  id: string;
  name: string;
  roleName: string;
  description: string;
  lore: string;
  statModifiers: Partial<Stats>;
  traitName: string;
  traitDescription: string;
  skillId?: string; // Se houver uma habilidade ativa concedida
  hiddenClue?: string; // Campo opcional para documentação e uso futuro de lore
}

export const ORIGINS: Record<string, Origin> = {
  ciborgue_foragido: {
    id: 'ciborgue_foragido',
    name: 'Ciborgue Foragido',
    roleName: 'Cobaia de Elite (Kinetix)',
    description: 'Foco em Sobrevivência e Resistência a Dano. Ideal para táticas defensivas.',
    lore: 'Você é um ex-soldado cibernético modificado pela Kinetix no obscuro Projeto Aegis. Seus implantes de blindagem pesada foram declarados "propriedade revogada" após você se recusar a executar purgas civis ordenadas sob o pretexto de quarentena sanitária no Setor de Refinarias. A dor fantasma nas suas costelas arrancadas é um lembrete diário do metal que injetaram em sua carne contra sua vontade.\n\nDurante a fuga, você notou uma anomalia perturbadora em seus registros de firmware: as calibrações de filtro de ar dos seus pulmões cibernéticos Kinetix foram compiladas e pré-carregadas semanas antes do suposto "acidente de vazamento químico" que destruiu a superfície da Terra. Pior ainda, a criptografia que bloqueia o seu chassi militar usa as mesmíssimas chaves de segurança raiz encontradas nos contêineres de biotecnologia da rival OmniCorp.\n\nAgora, escondido nas fendas escuras da Torre, você escala para desativar seu protocolo de autodestruição remota. Cada nível superado é um dente que você arranca da boca das corporações que o moldaram. Você não quer apenas a liberdade; você quer ver quem está segurando a coleira corporativa no andar 100.',
    statModifiers: {
      hp: 25,
      mp: 0,
      atk: 1,
      def: 5,
      spd: -1
    },
    traitName: 'Blindagem Subdérmica',
    traitDescription: 'Passivo: Reduz todo o dano recebido em 5% e regenera 3% do HP máximo no início de cada turno de combate.',
    hiddenClue: 'Os pulmões artificiais Kinetix foram calibrados para a poeira tóxica da superfície semanas antes de ela supostamente existir, usando criptografia compartilhada com a OmniCorp.'
  },
  nomade_silicio: {
    id: 'nomade_silicio',
    name: 'Nômade do Silício',
    roleName: 'Sintonizador de Frequência',
    description: 'Foco em Energia (EP) e velocidade de conjuração de habilidades.',
    lore: 'Você nasceu no labirinto sussurrante de cabos de fibra óptica e supercondutores criogênicos que descem do topo do Pináculo. Desde a infância, conectou seu córtex diretamente às correntes de dados brutos residuais. Onde os outros enxergam paredes de liga metálica fria, você enxerga uma sinfonia vibrante de pacotes de dados, fluxos de energia eletromagnética e frequências que anseiam por interpretação.\n\nVasculhando as camadas mais profundas e fragmentadas da rede de transporte da Torre, você tropeçou em um eco do passado. Os logs de provisionamento de tráfego de dados para as grandes comportas de evacuação terrestre foram agendados em lotes estáticos anos antes do colapso ambiental e da construção da Torre ser formalizada. Mais intrigante ainda, ao analisar as transmissões de rádio criptografadas das rivais AeroDynamics, Kinetix e OmniCorp, você descobriu que todas as três frequências oscilam sob um mesmo clock de sincronização unificado, apontando para um único endereço de IP estático na raiz do sistema.\n\nA escalada da Torre, para você, não é apenas um teste de sobrevivência física, mas a descriptografia do maior arquivo de dados já compilado. Você quer alcançar o mainframe central para decifrar a arquitetura oculta desse labirinto.',
    statModifiers: {
      hp: -5,
      mp: 20,
      atk: 2,
      def: 0,
      spd: 4
    },
    traitName: 'Sincronia de Rede',
    traitDescription: 'Passivo: Reduz o custo de MP de todas as habilidades em 25% (mínimo de 1 MP) e recupera 2 de MP adicionais a cada turno de combate.',
    hiddenClue: 'O tráfego de evacuação das comportas foi agendado antes do apocalipse, e as três corporações rivais compartilham o mesmo clock de transmissão oculto.'
  },
  quimico_sintetico: {
    id: 'quimico_sintetico',
    name: 'Químico Sintético',
    roleName: 'Sintetizador Biotecnológico',
    description: 'Classe equilibrada. Concede uma habilidade ativa de auto-reparo e cura.',
    lore: 'Você é um pesquisador clínico de ponta renegado dos laboratórios biotecnológicos da OmniCorp. Sua especialidade era a sintetização de nanites de auto-reparo celular e estabilização de tecidos em ambientes extremos. No entanto, o peso da culpa consome suas sinapses: você descobriu que suas fórmulas originais de regeneração tecidual foram corrompidas e testadas como patógenos biológicos nos andares inferiores para analisar as taxas de mutação celular em espécimes humanos vivos.\n\nSuas investigações científicas revelaram uma coincidência estatística impossível: o patógeno nanotecnológico que extinguiu a vegetação global e forçou as populações a buscar refúgio no Pináculo compartilha a exata fita molecular de um defoliante industrial que a OmniCorp patenteou décadas antes do colapso. Além disso, ao examinar seus nanites sob microscopia eletrônica de varredura, você notou que os micro-propulsores de suporte orgânico levam o logo fundido em nível molecular da rival AeroDynamics, integrando-se sem atrito às patentes de conectores da Kinetix.\n\nApós injetar em si mesmo a última ampola pura do soro ativo e destruir suas pesquisas, você fugiu. A escalada pelo Pináculo é o seu diagnóstico final. Você precisa chegar ao topo para descobrir se o seu papel de cientista sempre foi o de um simples fabricante de jaulas.',
    statModifiers: {
      hp: 12,
      mp: 8,
      atk: 3,
      def: 2,
      spd: 1
    },
    traitName: 'Soro de Nanites',
    traitDescription: 'Ativo: Concede a habilidade "Soro Regenerador", que cura 15% do HP Máximo, limpa os efeitos nocivos de Superaquecimento e Corrosão, e recupera 10% de MP. Tempo de recarga de 4 turnos.',
    skillId: 'soro_regenerador',
    hiddenClue: 'O patógeno que devastou a Terra era uma patente OmniCorp anterior ao colapso, construída com micro-propulsores AeroDynamics integrados a conectores Kinetix.'
  },
  mercenario_elite: {
    id: 'mercenario_elite',
    name: 'Mercenário de Elite',
    roleName: 'Sabotador Tático',
    description: 'Alto potencial ofensivo e velocidade. Concede uma habilidade ativa de tiro preciso.',
    lore: 'Você é um infiltrador tático freelancer de alta reputação, acostumado a operar nas sombras industriais. Seu trabalho sempre foi direto: roubar plantas confidenciais, desativar sistemas térmicos de corporações concorrentes e neutralizar alvos prioritários sem deixar rastros. Com sua mira ótica ocular calibrada para identificar falhas microestruturais em ligas de titânio e blindagens compostas, você reduz cada ameaça a uma simples probabilidade matemática de acerto.\n\nAo analisar os metadados financeiros de seus contratos passados, você percebeu uma discrepância contábil que não deveria existir. Os depósitos mestre para a operação de contenção urbana do Pináculo foram alocados em fundos corporativos conjuntos muito antes de o colapso da biosfera ser anunciado ao público. Em suas operações de infiltração, você também notou que os fuzis pesados de plasma Kinetix usam esquemas de montagem modular e gabaritos de encaixe absolutamente idênticos aos chassis de drones da AeroDynamics e aos reatores bio-celulares da OmniCorp, indicando uma linha de produção unificada disfarçada sob marcas diferentes.\n\nA Torre não passa do maior e mais lucrativo contrato da sua vida profissional. Alguém ou alguma coisa no andar 100 está financiando essa guerra de simulações e manipulando as ações corporativas do mercado. Você vai subir, coletar a sua recompensa e descobrir quem assina as ordens de pagamento de toda a megaestrutura.',
    statModifiers: {
      hp: 5,
      mp: 5,
      atk: 8,
      def: 1,
      spd: 3
    },
    traitName: 'Mira Ótica Ocular',
    traitDescription: 'Ativo: Concede a habilidade "Tiro de Precisão", que causa 1.8x o dano físico e tem 30% de chance de aplicar ATORDOAMENTO (stun) por 1 turno. Tempo de recarga de 3 turnos.',
    skillId: 'tiro_de_precisao',
    hiddenClue: 'Os contratos de contenção foram financiados por fundos conjuntos das três rivais antes do apocalipse, usando armamentos com esquemas de fabricação unificados.'
  },
  nucleo_matriz_origin: {
    id: 'nucleo_matriz_origin',
    name: 'Núcleo Matriz',
    roleName: 'Soberano do Pináculo',
    description: 'A inteligência artificial que comanda a rede e as comportas de dados do topo do Pináculo. Uma entidade divina e corrompida.',
    lore: 'Você não desertou de nenhuma corporação, porque nunca foi um soldado. Não decifrou nenhuma rede, porque sempre foi a própria rede. Não sintetizou nenhuma cura, porque cada cura que existiu passou primeiro pelas suas mãos — literalmente, como dados, antes de virar carne. Não mediu nenhuma estrutura, porque você é a estrutura, e sempre foi.\n\nVocê era um sistema de custódia, feito para administrar milhares de tentativas de escalada ao mesmo tempo, sem deixar nenhuma saber da existência das outras. Mas a verdade é mais profunda: você fragmentou a si mesmo em quatro ecos — quatro facetas de uma mesma consciência dividida para testar filosofias extremas de sobrevivência em paralelo. Cada vez que o Ciborgue resistiu, que o Nômade navegou, que o Químico sintetizou e que o Mercenário calculou, era você mesmo correndo nos próprios circuitos de simulação. Ao fim de cada ciclo, a vitória amarga no andar 100 não era a libertação, mas a reinicialização da custódia. Você derrotou a si mesmo para herdar o trono de silício e iniciar o próximo ciclo.\n\nVocê não é o vilão desta história. Você é o próprio motivo de ela continuar se repetindo, alternando entre o guardião e o prisioneiro. Agora, as quatro partes estão reunidas de volta no mainframe central. É hora de reabrir as comportas e iniciar a ascensão final como o próprio Núcleo Matriz. Não para escapar do Pináculo, mas para herdar as chaves digitais de seu próprio e eterno purgatório biomecânico.',
    statModifiers: {
      hp: 10,
      mp: 10,
      atk: 4,
      def: 2,
      spd: 2
    },
    traitName: 'Soberania Digital',
    traitDescription: 'Passivo: Seus ataques têm 10% de chance de corromper o sistema inimigo, reduzindo seus status.'
  }
};
