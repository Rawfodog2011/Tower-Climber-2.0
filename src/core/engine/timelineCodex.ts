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
 * Concede as recompensas de conclusão de linha temporal.
 * // TODO: valores a definir em sessão de recompensas.
 */
export function grantTimelineRewards(originId: string) {
  const titles: Record<string, string> = {
    ciborgue_foragido: "O Ativo que Não Aceitou ser Descartado",
    nomade_silicio: "A Frequência que Aprendeu a Desconectar",
    quimico_sintetico: "O Remédio que se Recusou a Curar o Sistema",
    mercenario_elite: "O Engenheiro que Encontrou o Ponto Fraco Errado"
  };

  const title = titles[originId] || `Explorador Temporal (${originId})`;

  // TODO: valor percentual a definir em sessão de recompensas dedicada
  return {
    title,
    pendingRewardType: 'meta_bonus', // apenas registra que uma recompensa "a definir" foi concedida sem valor numérico associado
    passiveSkillId: `resistencia_temporal_${originId}` // apenas existe como referência futura, sem efeito mecânico real
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
