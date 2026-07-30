import { useCallback, useMemo } from 'react';
import { random } from '../core/engine/rng';
import { getRandomEvent, EventOption } from '../core/entities/events';
import { generateMonsterForFloor } from '../core/entities/monsters';
import { startCombat } from '../core/engine/combat';
import { getSectorForFloor } from '../core/math/worldScaling';
import { getPendingTutorials, getTutorialName } from '../core/engine/tutorial';
import { getRandomItemByRarityAndClass } from '../core/entities/items';
import { checkAchievements } from '../core/engine/achievements';
import { markTimelineCompleted } from '../core/engine/timelineCodex';
import { AudioManager } from '../core/engine/audio';
import { calculatePlayerStats } from '../core/entities/player';
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useExplorationStore } from '../store/useExplorationStore';
import { useCombatStore } from '../store/useCombatStore';
import { useToastStore } from '../store/useToastStore';

export const useExploration = () => {
  const { player, setPlayer } = usePlayerStore();
  const { setScene, setHubTab, setIntroSector, setIntroStep } = useGameUIStore();
  const {
    selectedFloor, activeEvent, setActiveEvent, setEventLog,
    lastEventId, setLastEventId, activePuzzle, setActivePuzzle,
    setPendingDiveParams, setJustCompletedAll
  } = useExplorationStore();
  const { combatState, setCombatState, combatEndMessage, setCombatEndMessage } = useCombatStore();
  const { triggerToast } = useToastStore();

  const pStatsMemo = useMemo(() => calculatePlayerStats(player), [player]);

  const proceedWithDive = useCallback((floor: number, forceCombat: boolean = false) => {
    const isBoss = floor % 10 === 0;
    const isFarming = player.isFarmActive;

    if (!isFarming && !forceCombat && !isBoss && random() < 0.25) {
      const ev = getRandomEvent(lastEventId);
      setActiveEvent(ev);
      setEventLog(null);
      setScene('event');
      setLastEventId(ev.id);
    } else {
      const monster = generateMonsterForFloor(floor);
      const initialState = startCombat(player, monster, floor);
      setCombatState(initialState);
      (initialState);
      setCombatEndMessage(null);
      setScene('combat');
    }
  }, [player.isFarmActive, lastEventId, setActiveEvent, setEventLog, setScene, setLastEventId, setCombatState, setCombatEndMessage]);

  const handleStartDive = useCallback((floor: number, forceCombat: boolean = false) => {
    const pending = getPendingTutorials(player);
    if (pending.length > 0) {
      const tutorialKey = pending[0];
      const tabMap: Record<string, 'expedicao' | 'perfil' | 'geral' | 'habilidades' | 'forja' | 'soldagem' | 'reliquias' | 'adaptacoes' | 'auto' | 'conquistas' | 'mercado' | 'contratos' | 'bestiario' | 'memorias'> = {
        'adaptacoes': 'adaptacoes',
        'conquistas': 'conquistas',
        'forja': 'forja',
        'contratos': 'contratos',
        'soldagem': 'soldagem',
        'habilidades': 'habilidades',
        'reliquias': 'reliquias',
        'mercado': 'mercado',
        'auto': 'auto'
      };
      const targetTab = tabMap[tutorialKey];
      if (targetTab) {
        setHubTab(targetTab);
      }
      triggerToast(`⚠️ Calibração pendente! Abrindo painel correspondente...`);
      setScene('hub');
      return;
    }

    const sector = getSectorForFloor(floor);
    const visited = player.visitedSectors || [];
    if (!visited.includes(sector.hazard)) {
      setIntroSector(sector);
      setIntroStep('danger');
      setPendingDiveParams({ floor, forceCombat });
      setScene('env_intro');
      return;
    }
    proceedWithDive(floor, forceCombat);
  }, [player, setHubTab, triggerToast, setScene, setIntroSector, setIntroStep, setPendingDiveParams, proceedWithDive]);

  const generatePuzzle = useCallback(() => {
    const vibrationHz = Math.floor(random() * 120) + 20; // 20 a 139 Hz
    const temperatureC = Math.floor(random() * 80) + 50; // 50 a 129 ºC
    
    let correctPort = 3;
    if (vibrationHz > 80 && temperatureC > 100) {
      correctPort = 2;
    } else if (vibrationHz < 50) {
      correctPort = 1;
    }
    
    return { vibrationHz, temperatureC, correctPort };
  }, []);

  const handlePuzzleSelect = useCallback((index: number) => {
    if (!activePuzzle) return;

    let nextPlayer = { ...player };
    
    if (index === activePuzzle.correctPort) {
      AudioManager.playSfx('event.puzzle_correct');
      const rarity = 'epic';
      const newItem = getRandomItemByRarityAndClass(rarity, player.currentClassId);
      
      nextPlayer.gameStats = { ...nextPlayer.gameStats };
      nextPlayer.gameStats.puzzlesSolved += 1;
      nextPlayer.materials = { ...nextPlayer.materials };
      nextPlayer.materials.rare += 2;
      nextPlayer.materials.epic += 1;
      
      let msg = "Você recalibrou os nós com perfeição! O receptáculo se abriu e revelou materiais raros.";
      if (newItem) {
         nextPlayer.inventory = [...nextPlayer.inventory, newItem];
         msg += ` Loot: ${newItem.name} (ÉPICO)!`;
      }
      
      if (selectedFloor === nextPlayer.highestFloorUnlocked) {
        nextPlayer.highestFloorUnlocked += 1;
      }
      
      const achResult = checkAchievements(nextPlayer);
      if (achResult.unlocked.length > 0) {
         AudioManager.playSfx('event.achievement_unlock');
         achResult.unlocked.forEach(ach => triggerToast(`🏆 Conquista Desbloqueada: ${ach.name}!`));
      }
      
      const finalPlayer = achResult.updatedPlayer;
      const pendingBefore = getPendingTutorials(player);
      const pendingAfter = getPendingTutorials(finalPlayer);
      const newlyUnlocked = pendingAfter.filter(t => !pendingBefore.includes(t));
      
      setPlayer(finalPlayer);
      setEventLog(msg);

      if (newlyUnlocked.length > 0) {
        const unlockNames = newlyUnlocked.map(t => getTutorialName(t)).join(', ');
        triggerToast(`✨ Novo Recurso Desbloqueado: ${unlockNames}! Retornando ao Hub para calibração...`);
        setTimeout(() => {
          setScene('hub');
          setActivePuzzle(null);
          setEventLog(null);
        }, 1500);
      }
    } else {
      AudioManager.playSfx('event.puzzle_incorrect');
      const hpDamage = Math.floor(pStatsMemo.hp * 0.25);
      const materialsLost = Math.floor(player.materials.common * 0.2);

      nextPlayer.materials.common = Math.max(0, nextPlayer.materials.common - materialsLost);
      if (selectedFloor === nextPlayer.highestFloorUnlocked) {
        nextPlayer.highestFloorUnlocked += 1;
      }
      
      const pendingBefore = getPendingTutorials(player);
      const pendingAfter = getPendingTutorials(nextPlayer);
      const newlyUnlocked = pendingAfter.filter(t => !pendingBefore.includes(t));
      
      setPlayer(nextPlayer);
      triggerToast(`⚡ CHOQUE ARCANO! O traje absorveu ${hpDamage} de dano no HP e ${materialsLost} Materiais Comuns!`);
      setEventLog(`Você conectou a porta errada! O painel entra em curto-circuito e emite uma descarga severa, queimando seus materiais.`);

      if (newlyUnlocked.length > 0) {
        const unlockNames = newlyUnlocked.map(t => getTutorialName(t)).join(', ');
        triggerToast(`✨ Novo Recurso Desbloqueado: ${unlockNames}! Retornando ao Hub para calibração...`);
        setTimeout(() => {
          setScene('hub');
          setActivePuzzle(null);
          setEventLog(null);
        }, 1500);
      }
    }

    setScene('event');
    setActivePuzzle(null);
  }, [activePuzzle, player, pStatsMemo.hp, selectedFloor, setPlayer, setEventLog, setScene, setActivePuzzle, triggerToast]);

  const handleSkipPuzzle = useCallback(() => {
    AudioManager.playSfx('event.puzzle_skip');
    let nextPlayer = { ...player };
    if (selectedFloor === nextPlayer.highestFloorUnlocked) {
      nextPlayer.highestFloorUnlocked += 1;
    }
    setPlayer(nextPlayer);
    setEventLog("Você contornou o Terminal de Segurança Instável. O terminal permanece ativo, mas você conseguiu seguir em frente sem sofrer choques ou perdas de recursos.");
    setScene('event');
    setActivePuzzle(null);
  }, [player, selectedFloor, setPlayer, setEventLog, setScene, setActivePuzzle]);

  const handleEventOption = useCallback((option: EventOption) => {
    if (!activeEvent) return;
    AudioManager.playSfx('event.exploration_choice');
    const result = option.action(player, selectedFloor);

    let nextPlayer = result.updatedPlayer;
    
    if (result.triggerPuzzle) {
       setActivePuzzle(generatePuzzle());
       setScene('puzzle');
       return;
    }
    
    if (selectedFloor === nextPlayer.highestFloorUnlocked) {
       nextPlayer = {
         ...nextPlayer,
         highestFloorUnlocked: nextPlayer.highestFloorUnlocked + 1
       };
    }
    
    const achResult = checkAchievements(nextPlayer);
    if (achResult.unlocked.length > 0) {
       AudioManager.playSfx('event.achievement_unlock');
       achResult.unlocked.forEach(ach => triggerToast(`🏆 Conquista Desbloqueada: ${ach.name}!`));
    }
    
    const finalPlayer = achResult.updatedPlayer;
    const pendingBefore = getPendingTutorials(player);
    const pendingAfter = getPendingTutorials(finalPlayer);
    const newlyUnlocked = pendingAfter.filter(t => !pendingBefore.includes(t));
    
    setPlayer(finalPlayer);
    setEventLog(result.message);

    if (newlyUnlocked.length > 0) {
      const unlockNames = newlyUnlocked.map(t => getTutorialName(t)).join(', ');
      triggerToast(`✨ Novo Recurso Desbloqueado: ${unlockNames}! Retornando ao Hub para calibração...`);
      setTimeout(() => {
        setScene('hub');
        setEventLog(null);
      }, 1500);
    }
  }, [activeEvent, player, selectedFloor, setActivePuzzle, generatePuzzle, setScene, setPlayer, setEventLog, triggerToast]);

  const handleReturnToHub = useCallback(() => {
    const originId = player.originId || 'ciborgue_foragido';
    if (combatState?.monster.id === 'mainframe_prime' && combatEndMessage?.isVictory && originId !== 'nucleo_matriz_origin') {
      const res = markTimelineCompleted(originId);
      setJustCompletedAll(res.justCompletedAll);
      setScene('timeline_closure');
      setCombatState(null);
      setCombatEndMessage(null);
      return;
    }
    setScene('hub');
    setCombatState(null);
    setCombatEndMessage(null);
  }, [player.originId, combatState?.monster?.id, combatEndMessage?.isVictory, setJustCompletedAll, setScene, setCombatState, setCombatEndMessage]);

  return {
    proceedWithDive,
    handleStartDive,
    handlePuzzleSelect,
    handleSkipPuzzle,
    handleEventOption,
    handleReturnToHub
  };
};
