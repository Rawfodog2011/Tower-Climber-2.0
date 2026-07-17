import { ORIGINS } from './origins';
import { CLASSES } from './classes';
import { originFrameText, coreEventText } from '../engine/memoryArchive';

export interface MemoryFragment {
  key: string;
  title: string;
  originId: string;
  classId: string;
  originFrame: string;      // Metadata header info shown in the top box
  originFrameText: string;  // The static story text based on origin and level milestone
  coreEventText: string;    // Class evolution event story text
  coreText: string;         // Combined text for fallback / backward compatibility
}

/**
 * Retorna ou gera um fragmento de memória para qualquer combinação de origem e classe.
 * O conteúdo agora é montado combinando originFrameText[origin][level] + coreEventText[evolutionId].
 */
export function getMemoryFragment(originId: string, classId: string): MemoryFragment {
  const key = `${originId}:${classId}`;
  
  const originDef = ORIGINS[originId] || { name: 'Explorador', roleName: 'Andarilho' };
  const classDef = CLASSES[classId] || { name: 'Evoluído', requiredLevel: 10 };
  const level = classDef.requiredLevel || 10;

  // 1. Obter o texto de moldura de origem (originFrameText)
  const oId = originId.toLowerCase();
  const matchedOriginFrames = originFrameText[oId] || originFrameText['ciborgue_foragido'];
  const frameText = matchedOriginFrames?.[level] || `A vibração da Torre sintoniza suas lembranças antigas com a frequência do nível ${level}.`;

  // 2. Obter o texto específico do evento de evolução (coreEventText)
  const eventText = coreEventText[classId] || '// TODO: núcleo de evento a definir';

  // Título e metadados
  const title = `Semente de Consciência: ${classDef.name.toUpperCase()}`;
  const originFrame = `SINAL NEURAL CRIPTOGRAFADO RECONSTITUÍDO // ID: ${originId.toUpperCase()}\nStatus de Origem: ${originDef.name} (${originDef.roleName})\nClassificação: ${classDef.name} — Nível ${level}`;

  // Texto completo combinado
  const coreText = `${frameText}\n\n${eventText}`;

  return {
    key,
    originId,
    classId,
    title,
    originFrame,
    originFrameText: frameText,
    coreEventText: eventText,
    coreText
  };
}
