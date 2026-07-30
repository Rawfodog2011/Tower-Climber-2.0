import { useCallback } from 'react';
import { CombatAction, processTurn } from '../core/engine/combat';
import { usePlayerStore } from '../store/usePlayerStore';
import { useCombatStore } from '../store/useCombatStore';
import { useExplorationStore } from '../store/useExplorationStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { checkAchievements } from '../core/engine/achievements';
import { processAdaptationTrackers } from '../core/entities/adaptations';
import { getPendingTutorials, getTutorialName } from '../core/engine/tutorial';
import { AudioManager } from '../core/engine/audio';
import { useToastStore } from '../store/useToastStore';

export const useCombatLogic = () => {
  const { player, setPlayer } = usePlayerStore();
  const { combatState, setCombatState, setCombatEndMessage, setDmgPopups } = useCombatStore();
  const { selectedFloor } = useExplorationStore();
  const { setScene } = useGameUIStore();
  const { triggerToast } = useToastStore();

  const handleCombatAction = useCallback((action: CombatAction) => {
    setPlayer(prev => {
      const p = { ...prev };
      if (!p.runStats) p.runStats = { goldSpent: 0, totalTurns: 0 };
      p.runStats.totalTurns += 1;
      return p;
    });

    if (!combatState || !combatState.isActive) return;

    const { nextState, combatResult } = processTurn(player, combatState, action, selectedFloor);
    
    setCombatState(nextState);

    if (combatResult) {
      let updatedPlayer = combatResult.updatedPlayer;
      
      if (combatResult.trackers) {
        const { updatedPlayer: p2, levelUps } = processAdaptationTrackers(updatedPlayer, combatResult.trackers);
        updatedPlayer = p2;
        levelUps.forEach(msg => triggerToast(msg));
      }

      if (combatResult.winner === 'player') {
        if (selectedFloor === updatedPlayer.highestFloorUnlocked) {
          updatedPlayer.highestFloorUnlocked += 1;
        }
        if (combatResult.loot?.items && combatResult.loot.items.length > 0) {
          combatResult.loot.items.forEach((item, index) => {
            let msg = `📦 Item Obtido: ${item.name}!`;
            if (item.rarity === 'rare') msg = `💎 Drop Raro: ${item.name}!`;
            else if (item.rarity === 'epic') msg = `⚡ DROP ÉPICO: ${item.name}!`;
            else if (item.rarity === 'legendary') msg = `👑 DROP LENDÁRIO: ${item.name}!`;
            else if (item.rarity === 'mythic') msg = `🔥 DROP MÍTICO SUPREMO: ${item.name}!`;

            triggerToast(msg);
            setTimeout(() => {
              let lootId = 'combat.loot_common';
              if (item.rarity === 'rare') lootId = 'combat.loot_rare';
              else if (item.rarity === 'epic') lootId = 'combat.loot_epic';
              else if (item.rarity === 'legendary') lootId = 'combat.loot_legendary';
              else if (item.rarity === 'mythic') lootId = 'combat.loot_mythic';
              AudioManager.playSfx(lootId);
            }, index * 250);
          });
        }
        if (combatState.monster.isBoss) {
          AudioManager.playSfx('combat.boss_defeat');
        } else {
          AudioManager.playSfx('combat.victory');
        }
        setCombatEndMessage({
          title: 'Vitória!',
          subtitle: `Você derrotou o ${combatState.monster.name} e obteve ${combatResult.loot?.xp} XP e ${combatResult.loot?.gold} Ouro.`,
          isVictory: true
        });
      } else if (combatResult.winner === 'flee') {
        setCombatEndMessage({
          title: 'Retirada',
          subtitle: 'Você escapou com vida, perdendo 10% do Ouro e XP atual.',
          isVictory: false
        });
      } else if (combatResult.winner === 'exhausted') {
        setCombatEndMessage({
          title: 'Exaustão',
          subtitle: 'O combate se arrastou por tempo demais e os combatentes fugiram.',
          isVictory: false
        });
      } else {
        AudioManager.playSfx('combat.defeat');
        setCombatEndMessage({
          title: 'Derrota...',
          subtitle: 'Você sucumbiu. Uma penalidade de 20% do XP atual e Ouro foi aplicada.',
          isVictory: false
        });
      }

      const achResult = checkAchievements(updatedPlayer);
      if (achResult.unlocked.length > 0) {
        AudioManager.playSfx('event.achievement_unlock');
        achResult.unlocked.forEach(ach => triggerToast(`🏆 Conquista Desbloqueada: ${ach.name}!`));
      }
      const finalPlayer = achResult.updatedPlayer;
      
      const pendingBefore = getPendingTutorials(player);
      const pendingAfter = getPendingTutorials(finalPlayer);
      const newlyUnlocked = pendingAfter.filter(t => !pendingBefore.includes(t));

      setPlayer(finalPlayer);

      if (newlyUnlocked.length > 0) {
        const unlockNames = newlyUnlocked.map(t => getTutorialName(t)).join(', ');
        triggerToast(`✨ Novo Recurso Desbloqueado: ${unlockNames}! Retornando ao Hub para calibração...`);
        setTimeout(() => {
          setScene('hub');
          setCombatState(null);
          setCombatEndMessage(null);
        }, 1500);
      }
    }
  }, [player, combatState, selectedFloor, setPlayer, setCombatState, setCombatEndMessage, triggerToast, setScene, setDmgPopups]);

  return { handleCombatAction };
};
