import { useEffect, useRef } from 'react';
import { useCombatStore } from '../store/useCombatStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useToast } from '../hooks/useToast';
import { getPendingTutorials, getTutorialName } from "../core/engine/tutorial";
import { checkAchievements } from "../core/engine/achievements";
import { processAdaptationTrackers } from '../core/entities/adaptations';
import { AudioManager } from '../core/engine/audio';
import { CombatEvent } from '../core/engine/combatEvents';
import { formatCombatEvent } from '../core/engine/logFormatter';

export const useCombatQueueRunner = () => {
  const isRunningRef = useRef(false);
  const popupIdRef = useRef(0);
  const { triggerToast } = useToast();
  const { setScene } = useGameUIStore();

  useEffect(() => {
    const checkQueue = async () => {
      if (isRunningRef.current) return;
      
      const store = useCombatStore.getState();
      const actionQueue = store.actionQueue;
      const visualState = store.visualCombatState;
      
      if (actionQueue.length === 0) {
        if (store.isProcessingQueue) store.setIsProcessingQueue(false);
        return;
      }
      
      if (!visualState) return;
      
      isRunningRef.current = true;
      if (!store.isProcessingQueue) store.setIsProcessingQueue(true);
      
      try {
        const action = actionQueue[0];
        const speedMs = store.combatSpeed === 'fast' ? 100 : 250;
        let delay = 0;
        
        // Update logs using LogFormatter
        const logText = formatCombatEvent(action);
        if (logText) {
           store.setVisualCombatState(prev => prev ? { ...prev, logs: [...prev.logs, logText] } : prev);
        }

        switch (action.type) {
          case 'TURN_STARTED':
            store.setVisualCombatState(prev => prev ? { ...prev, round: action.round } : prev);
            delay = speedMs;
            break;

          case 'ACTION_STARTED':
            store.setAttackerAnimating({ player: action.actor === 'player', monster: action.actor === 'monster' });
            setTimeout(() => useCombatStore.getState().setAttackerAnimating({ player: false, monster: false }), speedMs);
            if (!action.isSkill) {
              AudioManager.playSfx('combat.attack_basic');
            } else {
              AudioManager.playSfx('combat.skill_cast');
            }
            delay = speedMs;
            break;

          case 'DAMAGE_APPLIED':
            store.setVisualCombatState(prev => {
               if (!prev) return prev;
               return action.target === 'player' ? { ...prev, playerHp: action.newHp } : { ...prev, monsterHp: action.newHp };
            });
            store.setDmgPopups((prev: any) => [...prev, { target: action.target, amount: action.amount, id: popupIdRef.current++, type: action.isCrit ? 'crit' : 'damage' }]);
            AudioManager.playSfx(action.target === 'player' ? 'combat.damage_taken_player' : 'combat.damage_taken_monster');
            if (action.isCrit) AudioManager.playSfx('combat.crit_or_bonus');
            delay = speedMs;
            break;

          case 'HEAL_APPLIED':
            store.setVisualCombatState(prev => {
               if (!prev) return prev;
               return action.target === 'player' ? { ...prev, playerHp: action.newHp } : { ...prev, monsterHp: action.newHp };
            });
            store.setDmgPopups((prev: any) => [...prev, { target: action.target, amount: action.amount, id: popupIdRef.current++, type: 'heal' }]);
            AudioManager.playSfx('combat.skill_heal');
            delay = speedMs;
            break;

          case 'MISS':
            store.setDmgPopups((prev: any) => [...prev, { target: action.target, amount: 'ERROU!', id: popupIdRef.current++, type: 'miss' }]);
            delay = speedMs;
            break;

          case 'DODGE':
            store.setDmgPopups((prev: any) => [...prev, { target: action.target, amount: 'ESQUIVOU!', id: popupIdRef.current++, type: 'dodge' }]);
            delay = speedMs;
            break;

          case 'BLOCK':
            store.setDmgPopups((prev: any) => [...prev, { target: action.target, amount: 'BLOQUEOU!', id: popupIdRef.current++, type: 'block' }]);
            AudioManager.playSfx('combat.shield_block');
            delay = speedMs;
            break;

          case 'STATUS_APPLIED':
            store.setVisualCombatState(prev => {
               if (!prev) return prev;
               if (action.target === 'player') return { ...prev, playerStatuses: [...prev.playerStatuses, action.status] };
               return { ...prev, monsterStatuses: [...prev.monsterStatuses, action.status] };
            });
            break;

          case 'STATUS_REMOVED':
            store.setVisualCombatState(prev => {
               if (!prev) return prev;
               if (action.target === 'player') return { ...prev, playerStatuses: prev.playerStatuses.filter(s => s.type !== action.statusType) };
               return { ...prev, monsterStatuses: prev.monsterStatuses.filter(s => s.type !== action.statusType) };
            });
            break;

          case 'STAGGER_CHANGED':
            store.setVisualCombatState(prev => prev ? { ...prev, monsterStagger: action.newValue } : prev);
            break;

          case 'STAGGER_BROKEN':
            store.setVisualCombatState(prev => prev ? { ...prev, isMonsterStaggered: true } : prev);
            AudioManager.playSfx('combat.guard_break');
            break;

          case 'STAGGER_RECOVERED':
            store.setVisualCombatState(prev => prev ? { ...prev, isMonsterStaggered: false, monsterStagger: action.maxStagger } : prev);
            break;

          case 'MP_CONSUMED':
            store.setVisualCombatState(prev => prev ? { ...prev, playerMp: action.newMp } : prev);
            break;

          case 'BOSS_ENRAGE_TRIGGERED':
            store.setVisualCombatState(prev => prev ? { ...prev, isBossEnraged: true } : prev);
            AudioManager.playSfx('combat.boss_enrage');
            store.setEnrageFlash(true);
            setTimeout(() => useCombatStore.getState().setEnrageFlash(false), 500);
            delay = speedMs * 2;
            break;

          case 'LEVEL_UP':
            AudioManager.playSfx('combat.level_up');
            break;
            
          case 'WAIT':
            delay = store.combatSpeed === 'fast' ? Math.floor(action.ms / 2) : action.ms;
            break;

          case 'PLAY_SOUND':
            AudioManager.playSfx(action.sfxId as any);
            break;
            
          case 'CAMERA_SHAKE':
            store.setCameraShake(action.intensity);
            setTimeout(() => useCombatStore.getState().setCameraShake(null), 300);
            break;

          case 'COMBAT_END':
            store.setVisualCombatState(prev => prev ? { ...prev, isActive: false } : prev);
            if (action.result) {
              let updatedPlayer = action.result.updatedPlayer;
              if (action.result.trackers) {
                const { updatedPlayer: p2, levelUps } = processAdaptationTrackers(updatedPlayer, action.result.trackers);
                updatedPlayer = p2;
                levelUps.forEach(msg => triggerToast(msg));
              }
              if (action.result.winner === 'player') {
                if (action.result.loot?.items && action.result.loot.items.length > 0) {
                  action.result.loot.items.forEach((item, index) => {
                      triggerToast(`💎 Drop Raro: ${item.name}!`);
                     setTimeout(() => {
                       let lootId = 'combat.loot_common';
                       if (item.rarity === 'rare') lootId = 'combat.loot_rare';
                       else if (item.rarity === 'epic') lootId = 'combat.loot_epic';
                       else if (item.rarity === 'legendary') lootId = 'combat.loot_legendary';
                       else if (item.rarity === 'mythic') lootId = 'combat.loot_mythic';
                       AudioManager.playSfx(lootId as any);
                     }, index * 250);
                  });
                }
                AudioManager.playSfx('combat.victory');
                store.setCombatEndMessage({
                  title: 'Vitória!',
                  subtitle: `Você derrotou o ${visualState.monster.name} e obteve ${action.result.loot?.xp} XP e ${action.result.loot?.gold} Ouro.`,
                  isVictory: true
                });
              } else if (action.result.winner === 'flee') {
                store.setCombatEndMessage({
                  title: 'Retirada',
                  subtitle: 'Você escapou com vida, perdendo 10% do Ouro e XP atual.',
                  isVictory: false
                });
              } else {
                AudioManager.playSfx('combat.defeat');
                store.setCombatEndMessage({
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
              const pendingBefore = getPendingTutorials(usePlayerStore.getState().player);
              const pendingAfter = getPendingTutorials(finalPlayer);
              const newlyUnlocked = pendingAfter.filter(t => !pendingBefore.includes(t));
              
              usePlayerStore.getState().setPlayer(finalPlayer);
              
              if (newlyUnlocked.length > 0) {
                const unlockNames = newlyUnlocked.map(t => getTutorialName(t)).join(', ');
                triggerToast(`✨ Novo Recurso Desbloqueado: ${unlockNames}! Retornando ao Hub para calibração...`);
                setTimeout(() => {
                  setScene('hub');
                  useCombatStore.getState().setVisualCombatState(null);
                  useCombatStore.getState().setCombatEndMessage(null);
                }, 1500);
              }
            } else {
               store.setCombatEndMessage({
                  title: 'Exaustão',
                  subtitle: 'O combate se arrastou por tempo demais e os combatentes fugiram.',
                  isVictory: false
               });
            }
            break;
            
          // Handle new specific events
          case 'FLEE_ATTEMPT':
          case 'BOSS_PUZZLE_RESULT':
          case 'MONSTER_STUNNED_SKIP':
          case 'STAGGER_FAIL':
          case 'DEBUFF_RESISTED':
          case 'COMBAT_START':
            // These just generate logs, handled above, no other state changes needed
            delay = speedMs;
            break;
        }
        
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } finally {
        store.setActionQueue(prev => prev.slice(1));
        isRunningRef.current = false;
      }
    };
    
    const interval = setInterval(checkQueue, 20);
    return () => clearInterval(interval);
  }, []);
};
