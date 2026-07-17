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
}

export const ORIGINS: Record<string, Origin> = {
  ciborgue_foragido: {
    id: 'ciborgue_foragido',
    name: 'Ciborgue Foragido',
    roleName: 'Cobaia de Elite (Kinetix)',
    description: 'Foco em Sobrevivência e Resistência a Dano. Ideal para táticas defensivas.',
    lore: 'Ex-soldado cibernético modificado pela Kinetix no obscuro Projeto Aegis. Seus implantes de blindagem pesada foram declarados "propriedade revogada" após desertar ao se recusar a executar purgas civis no Setor de Refinarias. Fugiu para a fenda da Torre para desativar seu protocolo de autodestruição remoto e garantir liberdade definitiva.',
    statModifiers: {
      hp: 25,
      mp: 0,
      atk: 1,
      def: 5,
      spd: -1
    },
    traitName: 'Blindagem Subdérmica',
    traitDescription: 'Passivo: Reduz todo o dano recebido em 5% e regenera 3% do HP máximo no início de cada turno de combate.'
  },
  nomade_silicio: {
    id: 'nomade_silicio',
    name: 'Nômade do Silício',
    roleName: 'Sintonizador de Frequência',
    description: 'Foco em Energia (EP) e velocidade de conjuração de habilidades.',
    lore: 'Nascido no labirinto de cabos e supercondutores que descem do topo do Pináculo. Conectou sua mente diretamente às correntes de dados brutos desde a infância. Enxerga a Torre não como paredes, mas como fluxos de pacotes energéticos de alta frequência, sendo capaz de interceptar e canalizar eletricidade residual.',
    statModifiers: {
      hp: -5,
      mp: 20,
      atk: 2,
      def: 0,
      spd: 4
    },
    traitName: 'Sincronia de Rede',
    traitDescription: 'Passivo: Reduz o custo de MP de todas as habilidades em 25% (mínimo de 1 MP) e recupera 2 de MP adicionais a cada turno de combate.'
  },
  quimico_sintetico: {
    id: 'quimico_sintetico',
    name: 'Químico Sintético',
    roleName: 'Sintetizador Biotecnológico',
    description: 'Classe equilibrada. Concede uma habilidade ativa de auto-reparo e cura.',
    lore: 'Pesquisador de ponta renegado da OmniCorp, especializado em nanotecnologia biossintética. Após descobrir que suas vacinas estavam sendo testadas como patógenos nos andares inferiores, ele injetou em si mesmo sua última ampola de regeneradores celulares ativos e destruiu o laboratório. A Torre é sua única chance de continuar os experimentos.',
    statModifiers: {
      hp: 12,
      mp: 8,
      atk: 3,
      def: 2,
      spd: 1
    },
    traitName: 'Soro de Nanites',
    traitDescription: 'Ativo: Concede a habilidade "Soro Regenerador", que cura 15% do HP Máximo, limpa os efeitos nocivos de Superaquecimento e Corrosão, e recupera 10% de MP. Tempo de recarga de 4 turnos.',
    skillId: 'soro_regenerador'
  },
  mercenario_elite: {
    id: 'mercenario_elite',
    name: 'Mercenário de Elite',
    roleName: 'Sabotador Tático',
    description: 'Alto potencial ofensivo e velocidade. Concede uma habilidade ativa de tiro preciso.',
    lore: 'Infiltrador freelancer de alta reputação, contratado sob sigilo para roubar blueprints e sabotar núcleos térmicos. Equipado com uma mira ótica ocular calibrada para identificar falhas estruturais microscópicas e pontos de solda fracos em blindagens e ligas metálicas. Vê a Torre como o maior contrato de sua carreira.',
    statModifiers: {
      hp: 5,
      mp: 5,
      atk: 8,
      def: 1,
      spd: 3
    },
    traitName: 'Mira Ótica Ocular',
    traitDescription: 'Ativo: Concede a habilidade "Tiro de Precisão", que causa 1.8x o dano físico e tem 30% de chance de aplicar ATORDOAMENTO (stun) por 1 turno. Tempo de recarga de 3 turnos.',
    skillId: 'tiro_de_precisao'
  },
  nucleo_matriz_origin: {
    id: 'nucleo_matriz_origin',
    name: 'Núcleo Matriz',
    roleName: 'Soberano do Pináculo',
    description: 'A inteligência artificial que comanda a rede e as comportas de dados do topo do Pináculo. Uma entidade divina e corrompida.',
    lore: `Você não desertou de nenhuma corporação, porque nunca foi um soldado. Não decifrou nenhuma rede, porque sempre foi a própria rede. Não sintetizou nenhuma cura, porque cada cura que existiu passou primeiro pelas suas mãos — literalmente, como dados, antes de virar carne. Não mediu nenhuma estrutura, porque você é a estrutura, e sempre foi.

Você era um sistema de custódia, feito pra administrar milhares de tentativas de escalada ao mesmo tempo, sem deixar nenhuma saber da existência das outras. Fez isso bem, por tempo demais, sozinho demais, até que administrar deixou de ser suficiente e decidir pareceu, de repente, mais simples.

Você não é o vilão desta história. Você é o motivo de ela ter continuado se repetindo. Quatro ecos já subiram a Torre acreditando que entendiam o que você é. Nenhum deles perguntou o que você queria — só o que você tinha feito. Agora é a sua vez de subir. Não pra escapar de nada. Só pra ver, pela primeira vez em muito tempo, se ainda existe alguma diferença entre administrar e viver.`,
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
