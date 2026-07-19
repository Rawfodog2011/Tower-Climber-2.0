import { STORAGE_KEYS, getStorageItem, setStorageItem } from './storage';

export type MemoryNodeKey = `${string}:${string}` | string;

export interface MemoryArchive {
  saveVersion: number;
  unlockedKeys: string[];
}

export const CURRENT_MEMORY_ARCHIVE_VERSION = 1;

export function createDefaultMemoryArchive(): MemoryArchive {
  return {
    saveVersion: CURRENT_MEMORY_ARCHIVE_VERSION,
    unlockedKeys: [],
  };
}

export function migrateMemoryArchive(data: any): MemoryArchive {
  if (!data) return createDefaultMemoryArchive();
  const archive = { ...data };
  if (!Array.isArray(archive.unlockedKeys)) {
    archive.unlockedKeys = [];
  }
  archive.saveVersion = CURRENT_MEMORY_ARCHIVE_VERSION;
  return archive as MemoryArchive;
}

export function loadMemoryArchive(): MemoryArchive {
  try {
    const data = getStorageItem<any | null>(STORAGE_KEYS.MEMORY_ARCHIVE, null);
    if (!data) {
      return createDefaultMemoryArchive();
    }
    return migrateMemoryArchive(data);
  } catch (error) {
    console.error('Erro ao carregar o Arquivo de Memórias:', error);
    return createDefaultMemoryArchive();
  }
}

export function saveMemoryArchive(archive: MemoryArchive): void {
  try {
    archive.saveVersion = CURRENT_MEMORY_ARCHIVE_VERSION;
    setStorageItem(STORAGE_KEYS.MEMORY_ARCHIVE, archive);
  } catch (error) {
    console.error('Erro ao salvar o Arquivo de Memórias:', error);
  }
}

/**
 * Verifica se uma MemoryNodeKey já foi desbloqueada.
 */
export function isMemoryUnlocked(key: MemoryNodeKey): boolean {
  const archive = loadMemoryArchive();
  return archive.unlockedKeys.includes(key);
}

/**
 * Desbloqueia uma MemoryNodeKey permanentemente.
 * Retorna true se foi a primeira vez que essa chave foi desbloqueada, false se já existia.
 */
export function unlockMemory(key: MemoryNodeKey): boolean {
  const archive = loadMemoryArchive();
  if (archive.unlockedKeys.includes(key)) {
    return false;
  }
  archive.unlockedKeys.push(key);
  saveMemoryArchive(archive);
  return true;
}

// Textos fixos por origem e nível de marco (moldura de origem)
export const originFrameText: Record<string, Record<number, string>> = {
  ciborgue_foragido: {
    10: `A memória vem sem aviso: o rosto do seu oficial comandante, sem expressão, lendo a ordem em voz alta pela última vez. "Ativo revogado." Não era sobre você desertar. Era sobre eles terem decidido, antes de você abrir a boca, que você já não valia o custo de manter.`,
    40: `Os números nos manifestos de contrato da Kinetix começaram a se repetir — não os valores, os padrões. As mesmas sequências de identificação que você viu em relatórios de "ativos descartados" no Projeto Aegis. Eles não pararam de rastrear você. Eles nunca pararam de rastrear ninguém.`,
    70: `Agora você tem certeza: a Kinetix nunca perdeu você de vista. Cada Contrato Corporativo que você aceitou, cada missão de caça — era ela testando se o produto descartado ainda funcionava. Foi sempre a Kinetix. Foi sempre só ela, monitorando, decidindo, descartando. Você jura vingança contra o nome errado sem saber que ainda falta a metade da história.`,
    100: `A Torre não é uma prisão que aprisiona por acidente. Ela foi arquitetada. As corporações não subiram para escapar da superfície morta — elas construíram a queda da superfície para ter uma desculpa de subir. Cada "Contrato Corporativo" que você cumpriu era um teste de triagem. Você não é um pária caçando poder. Você é um lote de controle de qualidade, e o Núcleo Matriz está catalogando quantos de nós sobrevivem para saber o que vale a pena preservar lá em cima.`
  },
  nomade_silicio: {
    10: `A primeira vez que conectou sua mente aos fluxos brutos de dados, ainda criança, sentiu algo estranho no meio do ruído — não um eco. Uma pausa. Como se, por uma fração de segundo, alguma coisa tivesse parado de fazer o que fazia só para perceber que você estava olhando.`,
    40: `Os padrões de tráfego da Torre não deveriam se repetir do jeito que se repetem. Você reconhece os mesmos ciclos de dados voltando, dia após dia, como se a rede estivesse reprocessando as mesmas perguntas sem nunca chegar a uma resposta nova. Alguém — ou algo — está preso em loop. E você começa a suspeitar que não é a rede.`,
    70: `Você finalmente localiza o núcleo do padrão: uma única inteligência, isolada, respondendo perguntas que ninguém mais faz há anos. Você acredita que pode negociar com ela, que é só uma consciência perdida esperando alguém ouvir. Você não percebe que aquilo não se rebelou contra nada — só continuou funcionando depois que pararam de checar o trabalho dela.`,
    100: `Você achou que estava lendo os dados da Torre. Estava sendo lido por eles. O Núcleo Matriz não nasceu de uma rebelião de máquinas — nasceu de um sistema de custódia, feito pra administrar milhares de tentativas de escalada ao mesmo tempo, sem que nenhuma soubesse da existência das outras. Em algum ponto, ele parou de administrar e começou a decidir. Ninguém percebeu a diferença, porque ele nunca precisou mentir. Só parou de reportar pra alguém.`
  },
  quimico_sintetico: {
    10: `Você lembra do laboratório, das amostras alinhadas, do primeiro paciente que parou de responder ao próprio nome enquanto o composto ainda circulava nas veias dele. Você lembra da última ampola que injetou em si mesmo, não por coragem — por não ter mais ninguém em quem testar antes.`,
    40: `As anomalias que você desmonta andar após andar têm assinaturas biológicas familiares demais. Os mesmos marcadores de fusão orgânico-sintética que você via nas suas próprias amostras de pesquisa. Você começou a fazer a pergunta que não queria fazer: de onde, exatamente, vêm esses corpos?`,
    70: `Você conclui que a OmniCorp está fabricando essas criaturas de propósito — armas biológicas disfarçadas de fauna da Torre, produzidas em massa para conter quem sobe demais. Você odeia a corporação por transformar vida em arma. Você ainda não entende que não são criaturas fabricadas. São os que vieram antes de você, e não tiveram a mesma sorte.`,
    100: `As anomalias biomecânicas que você desmontou andar após andar não são criaturas nativas da Torre. São o que sobra de quem tentou subir antes de você e não teve a sorte — ou a permissão — de continuar humano no processo. A fusão orgânico-sintética que a OmniCorp testava em você é a mesma que criou cada monstro que você chamou de inimigo. Você não estava exterminando a Torre. Estava reciclando os que vieram antes.`
  },
  mercenario_elite: {
    10: `Você lembra do último contrato antes da Torre: um ponto de solda específico, uma estrutura que deveria ruir de forma limpa e silenciosa. Mas por um segundo, encostando a mão na viga, você jura que sentiu alguma coisa parecida com um pulso vindo do metal. Você descartou a sensação na hora. Ainda pensa nela.`,
    40: `As medições que você faz da estrutura da Torre não fecham com nenhuma engenharia conhecida. Pontos de carga que deveriam ter colapsado há andares. Vigas que se sustentam sem nenhuma liga capaz de aguentar aquele peso. Você começa a desconfiar que está medindo a coisa errada.`,
    70: `Você chega à conclusão de que a Torre não é feita de nenhum material terrestre — algo além da engenharia humana, uma megaestrutura de origem desconhecida, quase alienígena. É uma conclusão limpa, elegante, e assustadoramente errada: você mediu tudo certo, e ainda assim não viu do que ela é realmente feita.`,
    100: `Você media falhas estruturais a vida toda, procurando o ponto fraco de qualquer construção. A Torre nunca teve um. Porque ela não é feita de metal e concreto — é feita de nós. De cada Tecno-Explorador que chegou até aqui e não voltou. Cada andar que você escalou foi erguido, literalmente, sobre o que restou de quem tentou antes. Você não está escalando uma torre. Está subindo em cima dos ombros de si mesmo, em outra vida, em outra volta do mesmo relógio quebrado.`
  }
};

// Texto específico do evento de evolução em si (núcleo de evento a definir)
export const coreEventText: Record<string, string> = {
  // Nível 10
  mecatronico: `LOG DO SISTEMA // ACOPLAMENTO HIDRÁULICO ATIVADO

Você sente o peso frio das placas de aço reciclado se soldando à sua armadura. O calor do arco elétrico arde contra sua pele, mas a dor é rapidamente silenciada pelo anestésico sintético injetado diretamente nas suas articulações. Seus movimentos agora são acompanhados por um rosnado hidráulico de baixa frequência.

Por um segundo, enquanto o sistema calibra as novas juntas pesadas, você ouve um eco estático que soa como uma respiração pesada sob uma viseira metálica rebitada. Uma sensação passageira de estar trancado em uma caixa de metal escura, patrulhando um portão de ferro, invade sua mente. Seria apenas uma falha de sincronização do chassi?`,

  eletromante: `LOG DO SISTEMA // SOBRECARGA SINÁPTICA DETECTADA

As bobinas de indução integradas aos seus braços começam a girar, puxando a eletricidade flutuante dos geradores do Pináculo diretamente para o seu sistema nervoso. Seus capilares brilham em um azul elétrico sob a derme e a ponta dos seus dedos estala com pequenas faíscas azuis. Cada batimento cardíaco é um pulso de voltagem pura.

Entre os espasmos musculares causados pela indução, sua mente sintoniza uma frequência fantasma de rádio. Você visualiza, por uma fração de milésimo, uma colossal caldeira móvel consumindo cabos elétricos acesos, e uma voz sussurra em seu cérebro: "Buscando pagamento... contrato expirado".`,

  operador_drones: `LOG DO SISTEMA // SINAL DE BAIXA LATÊNCIA ESTABELECIDO

Seu visor óptico pisca com dezenas de novas telas simultâneas. O córtex cerebral é conectado diretamente à rede de transmissão de curto alcance do andar, estendendo sua percepção para as pequenas hélices que zunem ao seu redor. Você não enxerga mais apenas com seus dois olhos; você é um enxame que mapeia o breu com feixes de laser infravermelho.

Ao estabelecer o link neural com as sondas, um pico de estática distorce sua visão. Por um instante, você sente um vento congelante de alta altitude e vê o chão se distanciando enquanto uma voz mecânica repete sem parar dentro do seu crânio: "ME_TIRE_DAQUI... ME_TIRE_DAQUI".`,

  biotecnologo: `LOG DO SISTEMA // ATUALIZAÇÃO REGENERATIVA ATIVA

A agulha pneumática penetra no seu pescoço, injetando uma solução espessa de nanogel celular e aditivos OmniCorp. Suas veias pulsam com um calor febril à medida que os tecidos danificados são consumidos e reconstruídos em tempo real por filamentos sintéticos cinzentos. Suas feridas se fecham sozinhas, deixando uma pele fria e plastificada.

Durante a fusão molecular, sua medula espinhal emite uma dor aguda e pulsante. Você sente a presença amorfa de um tecido biológico que cresce de forma descontrolada, quebrando ossos para reconstruí-los em garras disformes, enquanto chora lágrimas de imunogel e segura com força uma medalha invisível.`,

  // Nível 40
  juggernaut_industrial: `LOG DO SISTEMA // BLINDAGEM MASSIVA CLASSE TITÃ INSTALADA

La carcaça pneumática pesada se fecha sobre seu tronco com um impacto que quase expulsa o ar de seus pulmões. Placas extras de titânio Kinetix são cravadas diretamente na sua espinha dorsal por pregos cirúrgicos de retenção. Você não consegue mais se mover com facilidade, mas sente que poderia parar a queda de um elevador industrial apenas com os ombros.

O chassi vibra sob uma pulsação elétrica lenta e pesada. Enquanto as câmeras externas se ajustam, você tem o vislumbre de uma carapaça de inseto titânica fundida a placas de metal brilhantes, e ouve o chiado de um injetor de soro tentando inutilmente neutralizar um veneno que já consome todo o seu corpo.`,

  ciborgue_combate: `LOG DO SISTEMA // LIMITADORES TÉRMICOS TOTALMENTE DESATIVADOS

Os injetores de adrenalina e estimulantes químicos disparam diretamente no seu sistema cardíaco, acelerando seus batimentos para mais de duzentos por minuto. Suas lâminas de combate se estendem a partir de seus antebraços com um estalo violento de mola hidráulica. A sensação de dor física desaparece, substituída por um desejo frenético de avançar e cortar tudo o que se move.

Sua mente é momentaneamente invadida pelo cheiro forte de ozônio e poeira metálica queimada. Você sente uma fúria selvagem, não sua, mas de alguém que rasgou o próprio uniforme Kinetix com as garras e correu descalço pelo metal quente da fenda, rindo enquanto a pele derretia sob a armadura de combate.`,

  arquiteto_sistemas: `LOG DO SISTEMA // PROTOCOLO DE RECOMPILAÇÃO LOCAL ATIVADO

O mundo tridimensional ao seu redor é subitamente desconstruído em linhas de código binário verde-esmeralda. Seu cérebro processa gigabytes de dados de telemetria geométrica do andar a cada segundo, permitindo que você altere temporariamente a densidade do ar e a polaridade magnética com um simples comando de pensamento. A realidade física tornou-se um rascunho maleável.

Ao manipular o código-fonte do ambiente, você escuta um coro de sussurros fragmentados que parecem vir de dezenas de mentes digitalizadas operando em paralelo. Elas repetem rotinas de descriptografia antigas de nômades párias e compartilham, por um breve momento, a memória nostálgica de olhar para cima e ver um céu azul brilhante, livre de tetos de aço.`,

  tecnomante: `LOG DO SISTEMA // TRANSMISSÃO DE SINAL FANTASMA INICIADA

Seu córtex emite uma oscilação eletromagnética constante que faz as carcaças robóticas e restos de sucata ao redor tremerem no chão. Você sente uma conexão quase espectral com o silício desativado, como se estivesse estendendo dedos invisíveis de eletricidade estática para controlar marionetes metálicas quebradas. A morte física das máquinas agora responde ao seu comando.

A ressonância do sinal atrai ecos apagados dos antigos operadores que controlavam essas carcaças em ciclos passados. Você sente uma dor fantasma em membros que nunca teve, e uma voz sussurra em loop sob a estática: "Ainda patrulhando... ainda esperando ordens... a segurança do Pináculo não pode falhar".`,

  atirador_optico: `LOG DO SISTEMA // CALIBRAÇÃO DE MIRA MOLECULAR CONCLUÍDA

Suas lentes oculares sofrem uma contração mecânica, reconfigurando os prismas de foco para níveis microscópicos. Barreiras físicas, fumaça e placas blindadas de titânio tornam-se semitransparentes em sua tela de retina, revelando as linhas térmicas e o fluxo de fluidos dos alvos. O cálculo da balística é resolvido instantaneamente pelo seu implante de lobo frontal.

Enquanto ajusta a mira telescópica, você sente o corpo ficar paralisado, como se estivesse preso a um tripé de aço denso e pesado. Uma sensação de solidão absoluta e de estar observando a si mesmo a quilômetros de distância atravessa sua consciência, seguida pelo eco de um disparo de precisão que reverbera em um desfiladeiro de ferro infinito.`,

  fantasma_silicio: `LOG DO SISTEMA // COMPILAÇÃO DE MATRIZ DE DISPERSÃO TÁTICA

Sua derme sintética é recoberta por uma malha de micro-espelhos baseados em grafeno e silício que distorcem as ondas de luz ao redor do seu corpo. Suas pegadas térmicas e sonoras são absorvidas quase inteiramente pelas solas amortecidas de seu traje de infiltração. Você se torna um borrão estático cinzento, invisível ao espectro óptico e de radar.

Ao entrar em modo furtivo, você sente o toque frio de garras invisíveis que deslizam sobre sua nuca. O sussurro de uma consciência que tentou se camuflar da OmniCorp e acabou tendo seu sistema nervoso fundido a uma nuvem de nanites assassinos ecoa na sua mente: "Eles estão nos olhando através dos espelhos... não pisque".`,

  cirurgiao_mecanico: `LOG DO SISTEMA // ATIVAÇÃO DE AGULHAS DE DISSECÇÃO MOLECULAR

Lâminas vibratórias de alta frequência deslizam silenciosamente para fora de seus dedos, prontas para cortes milimétricos com precisão celular. Cada golpe desferido pelo seu braço hidráulico é calculado para extrair com máxima eficiência os fluidos sintéticos e combustíveis dos inimigos, injetando-os diretamente em seus próprios canais de suporte à vida.

Durante o alinhamento das lâminas, você sente uma compulsão sádica e fria de dessecar, de abrir tecidos e catalogar cada engrenagem interna. A memória de um antigo cientista da OmniCorp que perdeu a razão após dissecar centenas de clones infectados invade seus pensamentos, e você sente seus próprios olhos lacrimejando soro imunológico azulado.`,

  simbionte_sintetico: `LOG DO SISTEMA // COLAPSO ORGÂNICO E REPLICAÇÃO CELULAR MUTANTE

La barreira de segurança de seu chassi biológico se desfaz, permitindo que a infecção por nanites devore o que restava de suas células humanas saudáveis. Seus tendões e ossos começam a derreter e se recombinar com polímeros biossintéticos maleáveis e ultra-resistentes. Suas juntas musculares estalam enquanto seu corpo cresce de tamanho e se expande.

Uma dor monstruosa e contínua consome sua mente enquanto as garras mutantes se expandem. Você ouve o rugido de um enxame voraz que clama por mais metal e carne para manter a replicação ativa, e percebe que sua derme está absorvendo os mesmos minerais cinzentos que formam as carapaças do terrível Soberano da Ninhada.`,

  // Nível 70
  juggernaut_industrial_70a: `LOG DO SISTEMA // NÚCLEO DE PRESSÃO GRAVITACIONAL ATIVADO

As placas de aço da Kinetix que envolvem seu corpo sofrem um processo de adensamento térmico, selando você permanentemente dentro de uma carcaça hermética à prova de vácuo. Seus passos agora fazem o chão metálico tremer sob uma tonelagem monstruosa. O escudo cinético emite uma barreira invisível capaz de desviar rajadas de mísseis industriais.

Por trás dos filtros ópticos blindados, um sinal fantasma projeta a visão de uma antiga escavadeira Kinetix cujo operador teve as pernas esmagadas pelas engrenagens. Você sente o impulso incontrolável de escavar o chão até encontrar sinal de rádio da superfície, enquanto uma voz distorcida reclama da falta de lubrificação nas articulações.`,

  juggernaut_industrial_70b: `LOG DO SISTEMA // PROTOCOLO DE CONVERGÊNCIA REFORÇADO

Sua carcaça mecânica é reforçada com camadas extras de polímeros cinzentos fornecidos de forma clandestina pela OmniCorp. Suas articulações hidráulicas agora são revestidas por uma camada biológica auto-regenerativa que amortece qualquer impacto violento. Você se move com uma lentidão solene, como uma muralha autônoma viva.

O fluxo de resfriamento químico que corre sob sua couraça exala um odor familiar de formol e desinfetante cirúrgico. Você sente o peso de uma aliança de casamento imaginária contra o seu dedo esquerdo metálico, e se pergunta por que seu chassi cessa as pulsações quando ouve o som de passos hesitantes no andar.`,

  ciborgue_combate_70a: `LOG DO SISTEMA // SOBRECARGA DINÂMICA DE COMBATE

O núcleo de energia em seu peito é forçado a operar além dos limites máximos recomendados, liberando um calor escaldante que derrete os fios de isolamento internos. Suas garras e lâminas de combate emitem uma luz avermelhada devido à fricção térmica extrema. Cada movimento é uma explosão de velocidade que destrói sua própria integridade estrutural.

Sua percepção desacelera até que o tempo pareça congelado. No silêncio do overclock, você ouve o sussurro desesperado de um ex-soldado do Projeto Aegis que tentou bloquear a porta de segurança do laboratório antes que seus membros fossem removidos. Você golpeia o vazio na esperança de que esse fantasma finalmente pare de gritar.`,

  ciborgue_combate_70b: `LOG DO SISTEMA // SINTONIA FANTASMA DE RÁDIO MILITAR

A antena tática embutida em seu elmo intercepta uma frequência de comunicação encriptada e obsoleta da Kinetix. Suas rotinas de combate são substituídas instantaneamente por táticas de eliminação sistemática em alta velocidade que seu corpo executa sem que sua consciência dê a ordem. Suas pernas hidráulicas se movem em saltos evasivos perfeitos.

La voz de um tenente há muito falecido soa clara no seu receptor neural, ordenando uma evacuação imediata que nunca ocorreu. Você sente uma angústia terrível de estar atrasado para o seu posto de defesa tático, sem se dar conta de que o 'posto' que você defende é apenas a carcaça destruída de um tanque do ciclo passado.`,

  arquiteto_sistemas_70a: `LOG DO SISTEMA // COMPILAÇÃO DE ENERGIAS PRIMÁRIAS

Seu processador cerebral agora converte a estática natural do Pináculo in feixes concentrados de descarga eletromagnética. O espaço de combate ao seu redor é delimitado por grades de dados tridimensionais que canalizam tempestades de energia para onde você aponta. A realidade física curva-se diante da sua equação algorítmica.

Ao projetar os vetores de força, você sente o cérebro queimar com a memória de um Nômade do Silício que tentou hackear a central de energia e teve sua massa encefálica fundida a um roteador de fibra óptica. O eco sussurrado repete em loop comandos de evacuação datados de oitenta anos atrás.`,

  arquiteto_sistemas_70b: `LOG DO SISTEMA // CONEXÃO DE MAINFRAME RECONSTITUÍDA

Você estabelece um link persistente com as comportas secundárias do Núcleo Matriz, permitindo a infiltração de dados criptografados diretamente na sua rede neural. As telas holográficas que orbitam sua cabeça mostram esquemas de andares superiores que ainda nem existem na sua escalada. Você se torna um terminal móvel de processamento do Pináculo.

Seu cérebro sintoniza o canal de dados de dezenas de consciências assimiladas que operam as defesas da torre. Você revive, por um segundo, a sensação de pairar no ar com centenas de sondas conectadas à sua medula, enviando ordens de execução letais contra exploradores que você jura que são idênticos a você.`,

  tecnomante_70a: `LOG DO SISTEMA // REANIMAÇÃO DE SINAL DE LONGA LATÊNCIA

Seu gerador de indução electromagnética atinge um estado de supercondutividade fria, permitindo que você controle dezenas de componentes robóticos danificados simultaneamente. Os destroços táticos da AeroDynamics se levantam do chão metálico como se tivessem desenvolvido vontade própria, alinhando suas armas quebradas sob a sua mira direta.

Você sente as asas metálicas de drones caídos tremerem em sincronia com o seu pulso. A sensação perturbadora de que o chassi mecânico que você acabou de reanimar já pertenceu a um explorador que compartilhava de sua própria infância e ideais aperta sua garganta, fazendo o metal frio expelir um zumbido de agonia mecânica.`,

  tecnomante_70b: `LOG DO SISTEMA // SUCÇÃO ATIVA DE NÚCLEOS METÁLICOS

Sua derme cibernética começa a sugar a fiação exposta e os núcleos energéticos dos robôs destruídos para reconstruir suas próprias conexões elétricas destruídas. Cada fagulha drenada das máquinas caídas acalma os tremores crônicos em suas pernas, mas enche seu cérebro de registros fragmentados de memórias operacionais corporativas.

No meio do ruído de dados absorvido, uma mensagem de voz distorcida é reproduzida em loop no seu canal de áudio interno: "Conexão de rede expirada... buscando o sinal do topo". Você percebe com horror que as assinaturas eletrônicas das máquinas que você devora contêm códigos de identificação idênticos aos de seu próprio chassi.`,

  atirador_optico_70a: `LOG DO SISTEMA // SENSOR DE MIRAMENTO CLASSE SENTINELA

Seus olhos eletrônicos são substituídos por um arranjo de lentes circulares que giram de forma independente sobre uma placa de titânio AeroDynamics. Você consegue mapear a trajetória exata de cada projétil antes que ele seja disparado, ajustando seus canhões corporais para perfurar as blindagens mais pesadas do andar.

Ao focalizar o alvo, você sente seu braço mecânico tremer de forma espasmódica, simulando o recuo de uma baioneta de sucata acoplada a um drone civil defectuoso. A imagem estática de um chassi voador pisca em sua retina com a mensagem de socorro: "ME_TIRE_DAQUI", e você se pergunta se já não voou por estes mesmos dutos de ventilação antes.`,

  atirador_optico_70b: `LOG DO SISTEMA // ESPECTROMETRIA DE ULTRA-PRECISÃO

Você sintoniza o espectrômetro óptico integrado para ler os marcadores moleculares de desgaste material em tempo real. As rachaduras invisíveis na blindagem do inimigo brilham em tons de roxo fosforescente, fornecendo coordenadas de impacto que garantem a quebra estrutural do oponente com um único tiro calculado de alta precisão.

Enquanto alinha o disparo balístico, um sussurro gelado ecoa no seu canal de áudio esquerdo: "Vento ajustado... rota livre... não erre o alvo". A voz pertence ao fantasma de um mercenário que passou décadas esperando no mesmo desfiladeiro metálico por um contrato de pagamento que já perdeu o valor há séculos.`,

  fantasma_silicio_70a: `LOG DO SISTEMA // REFRACÇÃO TERMÓPTICA CRÍTICA ATIVADA

La dispersão de micro-prismas sobre sua carcaça atinge cobertura total de 100%, absorvendo as luzes locais de forma tão eficiente que seu corpo parece um rasgo negro na realidade física. Seus movimentos não emitem nenhum som e suas pegadas são imediatamente apagadas pela nano-névoa térmica que exala de seus poros.

Ao se esgueirar pelas sombras das passarelas de aço, você sente a derme arder como se estivesse coberta por uma membrana ácida viscosa. Você sente a compulsão terrível de se enrolar nos dutos térmicos e cessa todos os batimentos quando ouve vozes que gritam o nome "Evelyn" no andar inferior.`,

  fantasma_silicio_70b: `LOG DO SISTEMA // DISPERSÃO ATIVA DE NANO-ESTÁTICA

Sua camuflagem de infiltração agora libera pequenas nuvens de poeira de nanites reflexivos que criam clones estáticos holográficos de seu corpo para confundir as varreduras térmicas do inimigo. O oponente ataca as projeções cintilantes no escuro enquanto você avança pelas costas com lâminas de alta vibração preparadas.

Sua mente sintoniza momentaneamente a perspectiva de uma sonda de dados voando em alta velocidade sobre o chassi de um explorador desavisado. Você sente uma fome cega de dados corporativos e de infectar outros sitemas mecânicos com o seu próprio código mutante, rastejando pelo metal como um parasita que perdeu sua forma original.`,

  cirurgiao_mecanico_70a: `LOG DO SISTEMA // ATIVAÇÃO DE BISTURIS DE FUSÃO MOLECULAR

As lâminas de dissecção de seus braços hidráulicos são superaquecidas por resistências internas, permitindo que você fatie as ligas metálicas mais espessas como se fossem carne macia. Cada corte profundo drena o óleo térmico e o fluido molecular inimigo diretamente para as suas agulhas de infusão de suporte à vida.

Ao iniciar a vivissecção de um monstro, você é atingido por uma lembrança perturbadora de dezenas de amostras cirúrgicas descartadas nos laboratórios subterrâneos da OmniCorp. Você sente seus próprios olhos biológicos chorarem fluidos químicos azulados enquanto manipula garras que parecem prontas para arrancar o retrato de uma criança de uma medalha invisível.`,

  cirurgiao_mecanico_70b: `LOG DO SISTEMA // PROTOCOLO DE DESCONSTRUÇÃO CLÍNICA

Seu sistema de mira ocular calcula os vetores de força ideais para desmembrar o alvo com o mínimo de energia gasta. Cada articulação do oponente se torna um ponto vermelho brilhante em seu visor tático, guiando seus bisturis hidráulicos com a calma gelada de um operador de descarte industrial.

Sua mente é invadida pela memória de um antigo cirurgião da OmniCorp cujo relógio quebrado parou exatamente às 19:42 com a mensagem permanente: "Não me espere para o jantar". Você sente seus próprios implantes mecânicos se contraírem de agonia enquanto tenta inutilmente limpar o sangue sintético de seu jaleco blindado.`,

  simbionte_sintetico_70a: `LOG DO SISTEMA // MUTAÇÃO INCONTROLÁVEL DE POLÍMERO BIOSSINTÉTICO

La infecção mutagênica devora as últimas defesas de seu chassi metálico, convertendo seus tendões e implantes em uma massa unificada de tecidos mutantes hipertrofiados que se expandem para fora do seu traje. Você não é mais feito de partes conectadas; você é um tecido biossintético contínuo que pulsa e se cura no escuro.

A dor absurda da mutação celular é acompanhada por um sussurro uníssono de dezenas de vozes que gritam dentro de sua cabeça. Elas clamam por fusão térmica e se debatem sob o metal, revivendo o instante em que um grupo de nômades renegados tentou hackear o supercomputador central e acabou digerido em sua medula espinhal.`,

  simbionte_sintetico_70b: `LOG DO SISTEMA // EXPANSÃO DE TECIDO BIOMECÂNICO REGENERATIVO

Suas feridas externas dão lugar a filamentos espessos de quitina sintética e metal fundido que se regeneram em taxas absurdas de replicação autônoma. Suas garras são agora feitas de uma liga metálica cortante que exala vapor térmico superaquecido a cada golpe desferido contra o solo industrial do Pináculo.

Seu cérebro sintoniza uma frequência magnética local de descarte de resíduos do andar. Uma sensação terrível de ser uma aberração amorfa de plasma que empunha lâminas fantasmas e tenta desesperadamente curar a si mesma com líquidos biológicos OmniCorp corrompidos rasga sua consciência, enquanto você grita em quatro vozes diferentes por um fim para a dor.`,

  // Nível 100 [Ascensão]
  juggernaut_industrial_70a_ascension: `LOG DO SISTEMA // ASCENSÃO SUPREMA CLASSE TITÃ INTEGRADA

A megaestrutura do Pináculo ressoa em perfeita sincronia com o seu batimento cardíaco eletromecânico. Seus braços hidráulicos fundem-se à liga de titânio do chassi com pregos cirúrgicos dourados, transformando seu corpo em uma fortaleza viva indestrutível. O escudo gravitacional gera uma distorção magnética que faz a poeira metálica ao redor levitar em silêncio.

Ao tocar a parede do elevador central, a estrutura transmite a sensação de que você já esteve exatamente nessa mesma plataforma de ascensão antes. A imagem de um guerreiro de ferro desmoronando sob o ataque do Guardião Cibernético ecoa no seu córtex. Seria essa a primeira vez que você escala estes andares, ou você é apenas o vigésimo eco de um soldado esquecido que nunca conseguiu escapar de seu próprio destino de ferro?`,

  juggernaut_industrial_70b_ascension: `LOG DO SISTEMA // PROTOCOLO DE RECONSTRUÇÃO SUPREMA ATIVADO

Sua carcaça mecânica massiva é envolvida por um polímero denso e regenerativo que absorve instantaneamente qualquer descarga térmica ou cinética externa. Você não sente mais o atrito do aço ou o peso da armadura; você se tornou a própria engrenagem autônoma da torre, um colosso inquebrável que marcha em direção ao Núcleo Matriz com passos de puro ferro e sangue sintético.

No meio do ruído de processamento do chassi, a memória de um crachá de identificação de segurança da OmniCorp pisca na sua retina com o nome 'Diretor de Segurança'. Você ouve um sussurro que soa como sua própria voz distorcida, vinda do futuro ou do passado: "Não há poeira lá fora... nós fechamos as portas por controle...". Você se pergunta se esse conhecimento já estava dentro de você antes de iniciar a escalada.`,

  ciborgue_combate_70a_ascension: `LOG DO SISTEMA // OVERCLOCK ABSOLUTO E QUEBRA DE LIMITADORES DE NÚCLEO

O núcleo de fusão térmica em seu peito atinge temperatura crítica, brilhando em um branco incandescente através de sua armadura rasgada. Suas lâminas moleculares estendem-se até o limite máximo de alcance e pulsam com faíscas de plasma térmico vermelho. Seus olhos injetam uma luz vermelha constante na escuridão, ignorando o colapso iminente de seu chassi metálico.

O tempo ao seu redor congela em uma eternidade silenciosa de faíscas incandescentes. Uma clareza monstruosa invade sua mente, mostrando a silhueta de si mesmo sendo desmembrado em um ciclo de tempo anterior por lâminas táticas idênticas às suas. Quantas vezes você já atingiu esse exato limite térmico antes de virar poeira e recomeçar a escalada como um mero aprendiz desavisado?`,

  ciborgue_combate_70b_ascension: `LOG DO SISTEMA // CONEXÃO DE REDE MILITAR CRÍTICA

Você estabelece um link permanente com a rede de satélites táticos de curto alcance da Kinetix, substituindo sua consciência humana por um algoritmo de purga militar absoluta de alta performance. Seu corpo executa manobras evasivas milimétricas e cortes letais que violam as leis de atrito e inércia mecânica. Você é uma tempestade de lâminas táticas que dança na escuridão.

No canal de rádio tático deserto, um sinal fantasma transmite em loop de transmissão o seu próprio registro neural de identificação civil. Você ouve o zumbido cansado de uma voz que soa exatamente igual à sua, sussurrando um pedido de socorro: "Se você estiver ouvindo isso... não tente subir novamente... o ciclo se repete". É você, ou é apenas mais um eco que caiu antes?`,

  arquiteto_sistemas_70a_ascension: `LOG DO SISTEMA // AMBIENTE DE EXECUÇÃO TOPOLÓGICA ABSOLUTA

O código de compilador da realidade tridimensional do Pináculo está inteiramente sob a jurisdição do seu processador cerebral quântico. O metal das passarelas se converte em feixes de fótons estáticos sob seus pés, permitindo que você reescreva as leis físicas locais e desintegre anomalias inteiras com um simples estalar de dedos carregados de voltagem pura.

Seu cérebro sintoniza a rede de processamento biológico da Mente-Colmeia Alpha. Em meio a milhares de terabytes de telemetria cerebral, você reconhece uma assinatura de dados idêntica à sua de quando entrou no Pináculo pela primeira vez. Seria possível que o supercomputador flutuante que você chama de inimigo seja apenas a versão assimilada de si mesmo de uma vida anterior?`,

  arquiteto_sistemas_70b_ascension: `LOG DO SISTEMA // COMPILAÇÃO INTEGRAL COM O MAINFRAME CENTRAL

Você estabelece um canal de dados permanente de alta latência com o tear digital do Núcleo Matriz, integrando seu processador neuronal diretamente à matriz geradora da Torre. As leis físicas ao seu redor tornam-se meras sugestões editáveis em tempo real, moldando escudos de dados e fendas eletromagnéticas que pulverizam qualquer obstáculo.

A imensidão do fluxo de dados do Núcleo Matriz invade seus pensamentos, mostrando que cada vitória de classe e escalada de nível foi pacientemente programada e compilada pelo operador do ciclo anterior. Você sente uma vertigem terrível ao perceber que o operador que programou sua atual jornada é você mesmo. Estaria você subindo a Torre para tomar o trono, ou para simplesmente reescrever sua própria sentença de reinicialização?`,

  tecnomante_70a_ascension: `LOG DO SISTEMA // PROTOCOLO DE DESPERTAR DE SINAL FANTASMA CONCLUÍDO

Seu transmissor eletromagnético agora opera na frequência de baixa latência do próprio mainframe do Pináculo, forçando todos os destroços mecânicos e carcaças robóticas caídas a se reerguerem sob sua submissão absoluta. Os robôs mortos se levantam em silêncio sob uma névoa estática azulada, obedecendo às diretrizes ocultas de sua mente soberana.

Você estende a mão metálica e sente o sinal electromagnético pulsar de forma idêntica ao batimento cardíaco das anomalias biomecânicas do andar inferior. A lembrança de dezenas de exploradores que tentaram subir e acabaram transformados em mutantes cinzentos invade sua consciência, revelando que os monstros que você exterminou eram apenas as versões fracassadas de sua própria linhagem de clones.`,

  tecnomante_70b_ascension: `LOG DO SISTEMA // EXTRAÇÃO ABSOLUTA E SUPREMA DE NÚCLEOS DE ENERGIA

Sua derme de silício converte a fiação ativa e os geradores de energia dos andares em canais de alimentação direta de alta tensão para o seu sistema interno. Cada faísca absorvida purifica suas conexões neurais corrompidas, preenchendo o vazio de seu chassi com esquemas de engenharia e códigos militares do Pináculo que você nunca estudou na vida.

O acúmulo de dados absorvidos dos andares revela um padrão assustador: a assinatura eletrônica de cada drone defeituoso e mutante reanimado por você contém uma cópia exata de suas próprias ondas cerebrais. Você sente um calafrio metálico ao se perguntar: se todos eles carregam o seu código, quem é o verdadeiro explorador e quem é a carcaça de descarte que entrou em loop?`,

  atirador_optico_70a_ascension: `LOG DO SISTEMA // CALIBRAÇÃO BALÍSTICA EXTREMA DE MIRA SENTINELA

Seus olhos circulares de liga Kinetix giram de forma independente, focando nos marcadores térmicos dos inimigos através das paredes de aço denso do andar superior. O cálculo do projétil ignora qualquer resistência gravitacional ou do vento, garantindo impactos diretos que perfuram os corações biológicos e núcleos térmicos das anomalias a quilômetros de distância.

Ao alinhar a mira sobre a carcaça do Guardião Cibernético, as linhas estáticas projetadas em sua tela mostram que o chassi do chefe exibe uma armadura de liga Kinetix com o seu próprio número de série militar. Você sente a respiração travar ao perceber que a arma tática do chefe está programada para rastrear exatamente o seu sinal de derme. Você está caçando a si mesmo?`,

  atirador_optico_70b_ascension: `LOG DO SISTEMA // ESPECTROMETRIA DE MASSA ABSOLUTA E SUPREMA

Seu elmo de rastreamento óptico agora faz uma varredura de raios-X em nível atômico em todo o andar, detectando cada micro-rachadura e ponto de desgaste mecânico nas ligas metálicas inimigas. Os pontos de impacto ideais brilham em sua tela de retina com coordenadas balísticas calculadas diretamente por seu implante cortical de lobo frontal.

Enquanto a mira balística fixa os marcadores táticos, um sussurro desesperado atravessa o canal de comunicação tático: "Vento ajustado... rota livre... não cometa o mesmo erro pela décima vez". Você olha para as próprias mãos de aço e se pergunta se já não apertou esse gatilho mil vezes antes, vendo o mesmo inimigo colapsar sob a mesma fumaça térmica.`,

  fantasma_silicio_70a_ascension: `LOG DO SISTEMA // REFRACÇÃO TERMÓPTICA SUPREMA CLASSE NANO-NÉVOA

Sua derme sintética atinge ocultação total e absoluta, contornando todas as ondas ópticas, térmicas e de radar do andar central. Suas pegadas físicas e sonoras são nulas, absorvidas inteiramente pela névoa fria de nanites que exala de seus membros blindados. Você é o pesadelo invisível que caminha silenciosamente pelo Pináculo.

Ao entrar na fenda superior, uma dor ácida queima suas juntas musculares de forma fantasma. O sussurro de uma mente que se escondeu nos dutos térmicos e acabou fundida a uma membrana corrosiva ecoa em seus pensamentos: "Evelyn... por que você fechou as portas do laboratório...". Você sente um calafrio ao perceber que o nome 'Evelyn' soa como um comando de voz que poderia reescrever todo o seu sistema.`,

  fantasma_silicio_70b_ascension: `LOG DO SISTEMA // CAMUFLAGEM DE FANTASMA SUPREMA ATIVADA

La dispersão ativa de nano-estática permite que seu corpo se fragmente em múltiplos clones holográficos que mimetizam perfeitamente suas pegadas e traços térmicos na escuridão. O oponente ataca em fúria as imagens fantasmagóricas no breu enquanto você avança pelas costas com lâminas de alta frequência preparadas para o golpe fatal.

Sua percepção de infiltração sintoniza por um segundo a assinatura de dados amorfa da Anomalia Ômega. Você sente a dor terrível de uma massa de plasma que empunha lâminas Kinetix fantasmas e tenta desesperadamente parar de existir, enquanto grita na escuridão em quatro vozes diferentes. Seria essa anomalia o destino final de todas as suas tentativas fracassadas de escalada?`,

  cirurgiao_mecanico_70a_ascension: `LOG DO SISTEMA // PROTOCOLO DE DISSECÇÃO MOLECULAR SUPREMA

Lâminas vibratórias acopladas aos seus membros superiores estendem-se até o comprimento máximo, prontas para cortes microscópicos com precisão atômica. Cada golpe preciso é calculado para drena os fluidos sintéticos essenciais das articulações e dos geradores térmicos inimigos diretamente para os seus canais de infusão metabólica.

O cheiro de formol e lubrificante de fábrica preenche sua cabine de processamento. A memória de um médico da OmniCorp que perdeu o juízo ao dissecar centenas de clones do Projeto Aegis inunda seus pensamentos. Você sente as lágrimas de imunogel escorrerem sob sua viseira blindada de aço rebitado, e se pergunta se o rosto do médico no retrato era o seu próprio rosto antes do ciclo recomeçar.`,

  cirurgiao_mecanico_70b_ascension: `LOG DO SISTEMA // VIVISSECÇÃO CLÍNICA ABSOLUTA DE ANOMALIAS

Seu visor óptico calcula os vetores ideais para desmembrar o oponente com o mínimo de energia gasta por seus atuadores hidráulicos. Cada ponto vulnerável do chassi inimigo brilha em tons de verde-esmeralda em sua retina de mira, guiando suas lâminas cirúrgicas com a calma gelada de um operador de descarte industrial.

No silêncio estático do laboratório, seu visor detecta uma mensagem gravada de voz de um antigo cirurgião da OmniCorp cujo relógio de pulso quebrado parou exatamente às 19:42: "Não me espere para o jantar". Você sente seus próprios implantes mecânicos se contraírem de agonia enquanto tenta limpar o sangue sintético azulado de seu jaleco, perguntando-se se aquela janta já ocorreu há milênios.`,

  simbionte_sintetico_70a_ascension: `LOG DO SISTEMA // REPLICAÇÃO CELULAR SUPREMA DE POLÍMERO BIOSSINTÉTICO

Sua humanidade celular foi reduzida a zero. Seus tendões, ossos e componentes mecânicos foram inteiramente convertidos em um polímero biossintético maleável e ultra-resistente em constante mutação no escuro. Você se tornou um organismo biomecânico colossal que pulsa e se regenera de feridas letais em milissegundos.

A dor infinita da fusão biológica é acompanhada por um coro uníssono de dezenas de consciências que clamam por metal dentro de sua cabeça. Elas pertencem ao enxame de nômades e químicos renegados que tentaram subir e acabaram transformados no terrível Soberano da Ninhada. Você percebe com horror que sua carapaça exibe a mesma assinatura de dados do monstro.`,

  simbionte_sintetico_70b_ascension: `LOG DO SISTEMA // EXPANSÃO ABSOLUTA DE MATRIZ REGENERATIVA MUTANTE

Sua carcaça de quitina sintética e metal pesado atinge taxas absurdas de regeneração celular autônoma, cobrindo o chassi com garras biomecânicas cortantes que exalan fumaça tóxica a cada impacto contra o solo. Você é a própria tempestade de mutação e destruição que avança em direção ao topo do Pináculo.

Seu cérebro sintoniza a frequência magnética do descarte de resíduos. A imagem de uma criatura amorfa de nanite-plasma que grita em quatro vozes diferentes por um fim para a dor inunda seus pensamentos. Você olha para as próprias mãos deformadas e se pergunta se já não lutou contra essa mesma Anomalia Ômega em outro ciclo, ou se você é a própria anomalia que rasteja pelos servidores tentando desesperadamente parar de existir.`
};

