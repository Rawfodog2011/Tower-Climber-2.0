import { STORAGE_KEYS, getStorageItem, setStorageItem } from './storage';

export interface OriginTimelineEntry {
  completed: boolean;
  completedAt?: number; // timestamp do momento em que completou
  rewardClaimed: boolean;
}

export interface TimelineCodex {
  saveVersion: number;
  origins: Record<string, OriginTimelineEntry>;
  allTimelinesCompleted: boolean;
  secretClassUnlocked: boolean;
}

export const CURRENT_CODEX_VERSION = 1;

export function createDefaultCodex(): TimelineCodex {
  return {
    saveVersion: CURRENT_CODEX_VERSION,
    origins: {
      ciborgue_foragido: { completed: false, rewardClaimed: false },
      nomade_silicio: { completed: false, rewardClaimed: false },
      quimico_sintetico: { completed: false, rewardClaimed: false },
      mercenario_elite: { completed: false, rewardClaimed: false },
    },
    allTimelinesCompleted: false,
    secretClassUnlocked: false,
  };
}

export function migrateCodex(data: any): TimelineCodex {
  if (!data) return createDefaultCodex();

  const codex = { ...data };

  if (!codex.origins) {
    codex.origins = {};
  }

  // Ensure standard origins exist and are sanitized
  const standardOrigins = ['ciborgue_foragido', 'nomade_silicio', 'quimico_sintetico', 'mercenario_elite'];
  standardOrigins.forEach(key => {
    if (!codex.origins[key]) {
      codex.origins[key] = { completed: false, rewardClaimed: false };
    } else {
      codex.origins[key] = {
        completed: !!codex.origins[key].completed,
        completedAt: codex.origins[key].completedAt ? Number(codex.origins[key].completedAt) : undefined,
        rewardClaimed: !!codex.origins[key].rewardClaimed,
      };
    }
  });

  if (codex.allTimelinesCompleted === undefined) {
    codex.allTimelinesCompleted = false;
  }
  if (codex.secretClassUnlocked === undefined) {
    codex.secretClassUnlocked = false;
  }

  codex.saveVersion = CURRENT_CODEX_VERSION;
  return codex as TimelineCodex;
}

export function loadTimelineCodex(): TimelineCodex {
  try {
    const data = getStorageItem<any | null>(STORAGE_KEYS.TIMELINE_CODEX, null);
    if (!data) {
      return createDefaultCodex();
    }
    return migrateCodex(data);
  } catch (error) {
    console.error('Erro ao carregar o Códice Temporal:', error);
    return createDefaultCodex();
  }
}

export function saveTimelineCodex(codex: TimelineCodex): void {
  try {
    codex.saveVersion = CURRENT_CODEX_VERSION;
    setStorageItem(STORAGE_KEYS.TIMELINE_CODEX, codex);
  } catch (error) {
    console.error('Erro ao salvar o Códice Temporal:', error);
  }
}

/**
 * Retorna os multiplicadores de bônus meta-persistente da Linha Temporal.
 * Cada origem completada concede +2% de XP e +2% de Ouro obtidos em combate (máx +8%).
 */
export function getTimelineMetaBonus(): { bonusPercent: number; xpMultiplier: number; goldMultiplier: number; completedCount: number } {
  const codex = loadTimelineCodex();
  const standardOrigins = ['ciborgue_foragido', 'nomade_silicio', 'quimico_sintetico', 'mercenario_elite'];
  let completedCount = 0;
  standardOrigins.forEach(key => {
    if (codex.origins[key]?.completed) {
      completedCount++;
    }
  });
  const bonusPercent = Math.min(completedCount, 4) * 2;
  const multiplier = 1 + (bonusPercent / 100);
  return {
    bonusPercent,
    xpMultiplier: multiplier,
    goldMultiplier: multiplier,
    completedCount
  };
}

/**
 * Concede as recompensas de conclusão de linha temporal.
 */
export function grantTimelineRewards(originId: string) {
  const titles: Record<string, string> = {
    ciborgue_foragido: "O Ativo que Não Aceitou ser Descartado",
    nomade_silicio: "A Frequência que Aprendeu a Desconectar",
    quimico_sintetico: "O Remédio que se Recusou a Curar o Sistema",
    mercenario_elite: "O Engenheiro que Encontrou o Ponto Fraco Errado"
  };

  const epilogueHints: Record<string, string> = {
    ciborgue_foragido: "Você vingou o metal, mas o rastro de sangue sintético aponta para o seu próprio número de série.",
    nomade_silicio: "O silêncio na rede revelou uma frequência que você jurava ter desligado com suas próprias mãos.",
    quimico_sintetico: "A cura que você injetou no mainframe tem exatamente a mesma assinatura genética de quem a sintetizou.",
    mercenario_elite: "O pagamento do contrato foi depositado em uma conta que já acumulava saldo há centenas de ciclos."
  };

  const title = titles[originId] || `Explorador Temporal (${originId})`;
  const { bonusPercent } = getTimelineMetaBonus();

  return {
    title,
    xpBonusPercent: 2,
    goldBonusPercent: 2,
    totalBonusPercent: bonusPercent,
    epilogueHint: epilogueHints[originId] || ''
  };
}

export interface TimelineMarkResult {
  changed: boolean;
  justCompletedAll: boolean;
}

/**
 * Marca uma origem como completa.
 * Atualiza o campo global `allTimelinesCompleted` se todas as 4 origens estiverem completas.
 * Retorna se houve mudança de estado real no Códice e se acabou de completar todas.
 */
export function markTimelineCompleted(originId: string): TimelineMarkResult {
  if (originId === 'nucleo_matriz_origin') {
    return { changed: false, justCompletedAll: false };
  }
  const codex = loadTimelineCodex();
  let changed = false;
  let justCompletedAll = false;

  if (codex.origins[originId]) {
    if (!codex.origins[originId].completed) {
      codex.origins[originId].completed = true;
      codex.origins[originId].completedAt = Date.now();
      changed = true;
    }
  } else {
    codex.origins[originId] = {
      completed: true,
      completedAt: Date.now(),
      rewardClaimed: false
    };
    changed = true;
  }

  // Verifica as 4 origens padrão
  const standardOrigins = ['ciborgue_foragido', 'nomade_silicio', 'quimico_sintetico', 'mercenario_elite'];
  const allCompleted = standardOrigins.every(key => codex.origins[key]?.completed);

  if (allCompleted && !codex.allTimelinesCompleted) {
    codex.allTimelinesCompleted = true;
    codex.secretClassUnlocked = true;
    justCompletedAll = true;
    changed = true;
  }

  if (changed) {
    saveTimelineCodex(codex);
  }

  return { changed, justCompletedAll };
}
