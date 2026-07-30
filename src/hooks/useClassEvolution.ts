import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { unlockMemory } from '../core/engine/memoryArchive';
import { getClassEvolutionNarrative } from '../core/entities/classes';
import { Player } from '../types';
import { useToastStore } from '../store/useToastStore';
import { AudioManager } from '../core/engine/audio';

export function useClassEvolution() {
  const { player, setPlayer } = usePlayerStore();
  const { setActiveMemoryKey, setActiveEvolutionNarrative } = useGameUIStore();
  const { triggerToast } = useToastStore();

  const handleEvolveClass = (newClassId: string) => {
    AudioManager.playSfx('combat.class_evolution');
    const originId = player.originId || 'ciborgue_foragido';
    const key = `${originId}:${newClassId}`;
    const firstTime = unlockMemory(key);
    
    if (firstTime) {
      setActiveMemoryKey(key);
    } else {
      triggerToast("Fragmento de memória já registrado");
    }
    
    setPlayer((prev: Player) => {
      const nextPlayer = {
        ...prev,
        currentClassId: newClassId,
      };
      
      // Some classes might clear skills on auto-evolution, let's keep the existing logic.
      // Wait, in useGameEffects it clears learnedSkills:
      // currentClassId: newClass.id, learnedSkills: []
      // Let's just update currentClassId for manual evolution as in App.tsx
      return nextPlayer;
    });
  };

  const autoEvolveClass = (newClassId: string) => {
    AudioManager.playSfx('combat.class_evolution');
    const originId = player.originId || 'ciborgue_foragido';
    const key = `${originId}:${newClassId}`;
    const firstTime = unlockMemory(key);
    
    if (firstTime) {
      setActiveMemoryKey(key);
    } else {
      triggerToast("Fragmento de memória já registrado");
    }
    
    setPlayer((prev: Player) => {
      const nextPlayer = {
        ...prev,
        currentClassId: newClassId,
        learnedSkills: [] // useGameEffects does this
      };
      const text = getClassEvolutionNarrative(newClassId, prev.originId);
      setActiveEvolutionNarrative({ classId: newClassId, text });
      return nextPlayer;
    });
  };

  return { handleEvolveClass, autoEvolveClass };
}
