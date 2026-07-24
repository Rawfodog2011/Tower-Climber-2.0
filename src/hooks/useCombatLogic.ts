import { useCallback } from 'react';
import { CombatAction, processTurn } from '../core/engine/combat';
import { usePlayerStore } from '../store/usePlayerStore';
import { useCombatStore } from '../store/useCombatStore';
import { useExplorationStore } from '../store/useExplorationStore';

export const useCombatLogic = () => {
  const { player, setPlayer } = usePlayerStore();
  const { logicalCombatState, setLogicalCombatState } = useCombatStore();
  const { selectedFloor } = useExplorationStore();

  const handleCombatAction = useCallback((action: CombatAction) => {
    setPlayer(prev => {
      const p = { ...prev };
      if (!p.runStats) p.runStats = { goldSpent: 0, totalTurns: 0 };
      p.runStats.totalTurns += 1;
      return p;
    });

    if (!logicalCombatState || !logicalCombatState.isActive) return;

    const { nextState, events, combatResult } = processTurn(player, logicalCombatState, action, selectedFloor);

    // Update the logical state immediately so further actions are correct.
    // The visual state will be updated sequentially by the queue runner.
    setLogicalCombatState(nextState);

    useCombatStore.getState().setActionQueue(prev => {
      const q = [...prev, ...events];
      if (combatResult && !events.some(e => e.type === 'COMBAT_END')) {
         // Fallback if end combat event wasn't generated somehow
         q.push({ type: 'COMBAT_END', winner: combatResult.winner, result: combatResult } as any);
      }
      return q;
    });

  }, [player, logicalCombatState, selectedFloor, setPlayer, setLogicalCombatState]);

  return { handleCombatAction };
};
