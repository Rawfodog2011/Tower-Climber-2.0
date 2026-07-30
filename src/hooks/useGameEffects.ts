import { useEffect, useRef } from 'react';
import { AudioManager } from '../core/engine/audio';
import { CLASSES } from '../core/entities/classes';
import { ORIGINS } from '../core/entities/origins';
import { translate as t } from '../core/engine/translation';
import { SKILLS_DATABASE, canClassUseSkill } from '../core/entities/skills';
import { NEURAL_MATRIX_DATABASE } from '../core/entities/neuralMatrix';
import { saveGame, loadGame } from "../core/engine/saveGame";
import { getSectorForFloor } from '../core/math/worldScaling';
import { getAvailableEvolutions, getClassEvolutionNarrative } from '../core/entities/classes';
import { unlockMemory } from '../core/engine/memoryArchive';
import { getAutoBattleAction } from '../core/engine/autobattle';
import { random } from '../core/engine/rng';
import { usePlayerStore } from '../store/usePlayerStore';
import { useClassEvolution } from './useClassEvolution';
import { useGameUIStore } from '../store/useGameUIStore';
import { useExplorationStore } from '../store/useExplorationStore';
import { useCombatStore } from '../store/useCombatStore';
import { useToastStore } from '../store/useToastStore';
import { useExploration } from './useExploration';
import { useCombatLogic } from './useCombatLogic';

export const useGameEffects = () => {
  const { player, setPlayer } = usePlayerStore();
  const { autoEvolveClass } = useClassEvolution();
  const {
    scene, setActiveMemoryKey, setActiveEvolutionNarrative,
    inventoryMessage, introStep, setSavedPlayerPreview, setIntroStep
  } = useGameUIStore();
  const { selectedFloor } = useExplorationStore();
  const {
    combatState: combatState, combatEndMessage, combatSpeed,
    setEnrageFlash, setAttackerAnimating, setDmgPopups
  } = useCombatStore();
  const { triggerToast } = useToastStore();

  const { handleStartDive, handleReturnToHub } = useExploration();
  const { handleCombatAction } = useCombatLogic();

  const prevPlayerHpRef = useRef<number | null>(null);
  const prevMonsterHpRef = useRef<number | null>(null);
  const prevLogLengthRef = useRef<number>(0);
  const popupIdRef = useRef(0);
  const playerRef = useRef(player);
  const sceneRef = useRef(scene);
  
  useEffect(() => { playerRef.current = player; }, [player]);
  useEffect(() => { sceneRef.current = scene; }, [scene]);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setSavedPlayerPreview({
        name: saved.name || saved.playerName,
        avatar: saved.avatar,
        className: t(CLASSES[saved.currentClassId]?.name || 'Desconhecido'),
        originName: saved.originId && ORIGINS[saved.originId] ? t(ORIGINS[saved.originId].name) : null,
        level: saved.level,
        highestFloorUnlocked: saved.highestFloorUnlocked,
        gold: saved.gold,
        quantumLevel: saved.quantumLevel || 0
      });
    }
  }, [setSavedPlayerPreview]);

  useEffect(() => {
    if (scene === 'main_menu' || scene === 'intro' || scene === 'character_creation' || scene === 'loading' || scene === 'env_intro') {
      return; // Evita salvar por cima ao carregar o jogo
    }
    if (player.level > 1 || player.gold > 0 || player.currentXp > 0 || player.inventory.length > 0) {
      saveGame(player);
    }
  }, [player, scene]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (scene === 'combat' && combatState?.isActive && !combatEndMessage) {
      if (player.isAutoBattleActive) {
        let actionInterval = 300;
        if (combatSpeed === 'fast') actionInterval = 100;
        
        timeout = setTimeout(() => {
          const action = getAutoBattleAction(player, combatState);
          handleCombatAction(action);
        }, actionInterval);
      }
    } else if (scene === 'hub' && player.isFarmActive) {
      const waitTime = random() * 1500 + 1000; 
      timeout = setTimeout(() => {
        if (sceneRef.current === 'hub' && playerRef.current.isFarmActive) {
           handleStartDive(selectedFloor, true);
        }
      }, waitTime);
    } else if (scene === 'combat' && combatEndMessage && player.isFarmActive) {
      timeout = setTimeout(() => {
        if (sceneRef.current === 'combat' && playerRef.current.isFarmActive && combatEndMessage) {
           handleStartDive(selectedFloor, true);
        }
      }, 1500);
    }

    return () => clearTimeout(timeout);
  }, [scene, combatState?.isActive, combatEndMessage, player.isFarmActive, player.isAutoBattleActive, selectedFloor, combatSpeed, handleCombatAction, handleStartDive, handleReturnToHub]);

  useEffect(() => {
    if (scene === 'combat') {
      if (combatEndMessage) {
        AudioManager.playMusic('music.hub');
      } else if (combatState?.monster) {
        const monster = combatState.monster;
        if (monster.isBoss) {
          const isMainframePrime = monster.id === 'mainframe_prime';
          AudioManager.playMusic('music.boss_theme', { isMainframePrime });
        } else {
          const sector = getSectorForFloor(selectedFloor);
          if (sector.hazard === 'toxic_refinery') {
            AudioManager.playMusic('music.sector_toxic_refinery');
          } else if (sector.hazard === 'frozen_datacore') {
            AudioManager.playMusic('music.sector_frozen_datacore');
          } else if (sector.hazard === 'plasma_furnace') {
            AudioManager.playMusic('music.sector_plasma_furnace');
          }
        }
      }
    } else if (scene === 'main_menu') {
      AudioManager.stopMusic(2.0);
    } else {
      AudioManager.playMusic('music.hub');
    }
  }, [scene, combatEndMessage, combatState?.monster?.id, selectedFloor]);

  
  useEffect(() => {
    if (player.level >= 100) {
      const evols = getAvailableEvolutions(player.currentClassId, player.level);
      if (evols.length === 1) {
        const newClass = evols[0];
        if (player.currentClassId !== newClass.id) {
          autoEvolveClass(newClass.id);
        }
      }
    }
  }, [player.level, player.currentClassId, player.originId, autoEvolveClass]);

  useEffect(() => {
    if (inventoryMessage) {
      if (inventoryMessage.type === 'error') {
        AudioManager.playSfx('ui.error');
      } else {
        AudioManager.playSfx('ui.click');
      }
    }
  }, [inventoryMessage]);

  useEffect(() => {
    if (scene === 'env_intro' && introStep === 'danger') {
      AudioManager.playSfx('ui.danger_siren');
      const interval = setInterval(() => {
        AudioManager.playSfx('ui.danger_siren');
      }, 600);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setIntroStep('details');
        AudioManager.playSfx('ui.sector_reveal');
      }, 2400);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [scene, introStep, setIntroStep]);

  useEffect(() => {
    if (scene !== 'combat') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (player.isAutoBattleActive && combatState?.isActive) return;
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      if (e.key === 'Escape') {
        if (combatEndMessage) {
          handleReturnToHub();
        }
        return;
      }
      
      if (combatEndMessage || !combatState?.isActive) return;
      
      if (e.key === '1' || e.key === ' ') {
        e.preventDefault();
        handleCombatAction({ type: 'attack' });
        return;
      }
      
      const keyNum = parseInt(e.key);
      if (!isNaN(keyNum) && keyNum >= 2 && keyNum <= 9) {
        const skillIndex = keyNum - 2;
        const skillId = player.learnedSkills[skillIndex];
        if (skillId) {
          const skill = SKILLS_DATABASE[skillId];
          const isNeuralUnlocked = player.unlockedNodes?.some(nodeId => NEURAL_MATRIX_DATABASE[nodeId]?.skillId === skill.id);
          const isClassSkill = canClassUseSkill(player.currentClassId, skill);
          const canUseClass = isClassSkill || isNeuralUnlocked || player.learnedSkills.includes(skill.id);
          
          const cd = combatState.cooldowns[skill.id] || 0;
          const noMp = combatState.playerMp < skill.mpCost;
          
          if (canUseClass && cd === 0 && !noMp) {
            e.preventDefault();
            handleCombatAction({ type: 'skill', skillId: skill.id });
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, player.isAutoBattleActive, combatState, combatEndMessage, player.currentClassId, player.unlockedNodes, player.learnedSkills, handleCombatAction, handleReturnToHub]);

  return {};
};
