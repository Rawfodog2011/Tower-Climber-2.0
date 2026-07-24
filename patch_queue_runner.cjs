const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCombatQueueRunner.ts', 'utf8');

// I will insert imports if missing and update the switch statement
code = `
import { useEffect, useRef } from 'react';
import { useCombatStore } from '../store/useCombatStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useToast } from '../hooks/useToast';
import { getPendingTutorials, getTutorialName } from "../core/engine/tutorial";
import { checkAchievements } from "../core/engine/achievements";
import { processAdaptationTrackers } from '../core/entities/adaptations';
import { AudioManager } from '../core/engine/audio';
import { CombatQueueAction } from '../core/engine/combatQueue';

export const useCombatQueueRunner = () => {
  const isRunningRef = useRef(false);
  const popupIdRef = useRef(0);
  const { triggerToast } = useToast();
  const { setScene } = useGameUIStore();
  const { player, setPlayer } = usePlayerStore();

  useEffect(() => {
    const checkQueue = async () => {
      if (isRunningRef.current) return;
      
      const { actionQueue, setActionQueue, setCombatState, combatSpeed, setAttackerAnimating, setEnrageFlash, setDmgPopups, setCombatEndMessage, combatState } = useCombatStore.getState();
      
      if (actionQueue.length === 0) {
        useCombatStore.getState().setIsAnimating(false);
        return;
      }
      
      if (!combatState) return;

      isRunningRef.current = true;
      useCombatStore.getState().setIsAnimating(true);
      
      const action = actionQueue[0];
      const speedMs = combatSpeed === 'fast' ? 100 : 250;
      
      switch (action.type) {
        case 'TEXT_LOG':
          setCombatState({ ...useCombatStore.getState().combatState!, logs: [...useCombatStore.getState().combatState!.logs, action.text] });
          if (action.text.includes('Vitória')) AudioManager.playSfx('combat.victory');
          else if (action.text.includes('sucumbiu') || action.text.includes('derrotado')) AudioManager.playSfx('combat.defeat');
          if (action.text.includes('LEVEL UP')) AudioManager.playSfx('combat.level_up');
          if (action.text.includes('PROTOCOLO DE EXTERMÍNIO') || action.text.includes('FÚRIA')) {
            AudioManager.playSfx('combat.boss_enrage');
            setEnrageFlash(true);
            setTimeout(() => setEnrageFlash(false), 500);
          }
          if (action.text.includes('Sinergia') || action.text.includes('CRÍTICO')) AudioManager.playSfx('combat.crit_or_bonus');
          if (action.text.includes('curou') || action.text.includes('recuperou')) AudioManager.playSfx('combat.skill_heal');
          if (action.text.includes('ataca') || action.text.includes('usou')) {
             setAttackerAnimating({ player: action.text.includes('Jogador'), monster: !action.text.includes('Jogador') });
             setTimeout(() => setAttackerAnimating({ player: false, monster: false }), speedMs);
             AudioManager.playSfx('combat.attack_basic');
          }
          await new Promise(r => setTimeout(r, speedMs));
          break;
          
        case 'HP_CHANGE':
          setCombatState({ 
             ...useCombatStore.getState().combatState!, 
             [action.target === 'player' ? 'playerHp' : 'monsterHp']: action.newHp 
          });
          setDmgPopups((prev: any) => [...prev, {
             target: action.target,
             amount: action.isMiss ? 'FALHOU!' : action.amount,
             id: popupIdRef.current++,
             type: action.isMiss ? 'miss' : (action.isHeal ? 'heal' : 'damage')
          }]);
          if (!action.isHeal) AudioManager.playSfx(action.target === 'player' ? 'combat.damage_taken_player' : 'combat.damage_taken_monster');
          await new Promise(r => setTimeout(r, speedMs));
          break;
          
        case 'STAGGER_CHANGE':
          setCombatState({ ...useCombatStore.getState().combatState!, monsterStagger: action.newStagger });
          break;
          
        case 'MP_CHANGE':
          setCombatState({ ...useCombatStore.getState().combatState!, playerMp: action.newMp });
          break;
          
        case 'ROUND_START':
          setCombatState({ ...useCombatStore.getState().combatState!, round: action.round });
          break;

        case 'COMBAT_END':
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
                   triggerToast(\`💎 Drop Raro: \${item.name}!\`);
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
              setCombatEndMessage({
                title: 'Vitória!',
                subtitle: \`Você derrotou o \${combatState.monster.name} e obteve \${action.result.loot?.xp} XP e \${action.result.loot?.gold} Ouro.\`,
                isVictory: true
              });
            } else if (action.result.winner === 'flee') {
              setCombatEndMessage({
                title: 'Retirada',
                subtitle: 'Você escapou com vida, perdendo 10% do Ouro e XP atual.',
                isVictory: false
              });
            } else {
              setCombatEndMessage({
                title: 'Derrota...',
                subtitle: 'Você sucumbiu. Uma penalidade de 20% do XP atual e Ouro foi aplicada.',
                isVictory: false
              });
            }
            const achResult = checkAchievements(updatedPlayer);
            if (achResult.unlocked.length > 0) {
               AudioManager.playSfx('event.achievement_unlock');
               achResult.unlocked.forEach(ach => triggerToast(\`🏆 Conquista Desbloqueada: \${ach.name}!\`));
            }
            const finalPlayer = achResult.updatedPlayer;
            const pendingBefore = getPendingTutorials(usePlayerStore.getState().player);
            const pendingAfter = getPendingTutorials(finalPlayer);
            const newlyUnlocked = pendingAfter.filter(t => !pendingBefore.includes(t));
            
            usePlayerStore.getState().setPlayer(finalPlayer);
            
            if (newlyUnlocked.length > 0) {
              const unlockNames = newlyUnlocked.map(t => getTutorialName(t)).join(', ');
              triggerToast(\`✨ Novo Recurso Desbloqueado: \${unlockNames}! Retornando ao Hub para calibração...\`);
              setTimeout(() => {
                setScene('hub');
                setCombatState(null);
                setCombatEndMessage(null);
              }, 1500);
            }
          } else {
             setCombatEndMessage({
                title: 'Exaustão',
                subtitle: 'O combate se arrastou por tempo demais e os combatentes fugiram.',
                isVictory: false
             });
          }
          break;
      }
      
      setActionQueue(prev => prev.slice(1));
      isRunningRef.current = false;
    };
    
    const interval = setInterval(checkQueue, 50);
    return () => clearInterval(interval);
  }, []);
};
`;

fs.writeFileSync('src/hooks/useCombatQueueRunner.ts', code);
