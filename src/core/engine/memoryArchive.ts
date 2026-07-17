export type MemoryNodeKey = `${string}:${string}` | string;

export interface MemoryArchive {
  saveVersion: number;
  unlockedKeys: string[];
}

const MEMORY_ARCHIVE_KEY = 'towerclimber_memory_archive';
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
    const data = localStorage.getItem(MEMORY_ARCHIVE_KEY);
    if (!data) {
      return createDefaultMemoryArchive();
    }
    return migrateMemoryArchive(JSON.parse(data));
  } catch (error) {
    console.error('Erro ao carregar o Arquivo de Memórias:', error);
    return createDefaultMemoryArchive();
  }
}

export function saveMemoryArchive(archive: MemoryArchive): void {
  try {
    archive.saveVersion = CURRENT_MEMORY_ARCHIVE_VERSION;
    localStorage.setItem(MEMORY_ARCHIVE_KEY, JSON.stringify(archive));
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
  // TODO: núcleo de evento a definir
};

