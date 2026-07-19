/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sword, Power, Trophy, Shield, Cpu, Zap, Crosshair, Activity, Flame, Crosshair as CrosshairIcon, Terminal, Settings , Fingerprint, HardHat, Shirt, Footprints, Watch , User } from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Player, Item } from './types';
import { CLASSES, getAvailableEvolutions, getClassEvolutionNarrative } from './core/entities/classes';
import { ClassEvolutionModal } from './components/ClassEvolutionModal';
import { getXpRequiredForNextLevel } from './core/math/progression';
import { generateMonsterForFloor } from './core/entities/monsters';
import { ITEMS_DATABASE } from './core/entities/items';
import { startCombat, processTurn, CombatState, CombatAction } from './core/engine/combat';
import { calculatePlayerStats } from './core/entities/player';
import { equipItem, unequipItem, autoEquipAll } from './core/engine/inventory';
import { SKILLS_DATABASE, canClassUseSkill } from './core/entities/skills';
import { NEURAL_MATRIX_DATABASE } from './core/entities/neuralMatrix';
import { NeuralMatrix } from './components/NeuralMatrix';
import { canClassEquipItem } from './core/entities/items';
import { saveGame, loadGame } from './core/engine/saveGame';
import { dismantleItem, craftItem, convertMaterials, CRAFTING_COSTS, MATERIAL_NAMES, sellItem, dismantleItemsBatch, sellItemsBatch, GOLD_VALUES } from './core/engine/crafting';
import { RELICS_DATABASE, upgradeRelic, getRelicUpgradeCost } from './core/entities/relics';
import { getAutoBattleAction } from './core/engine/autobattle';
import { processAdaptationTrackers, ADAPTATIONS_DATABASE } from './core/entities/adaptations';
import { AutoBattleCondition, AutoBattleAction } from './types';
import { getRandomEvent, EventOption } from './core/entities/events';
import { checkAchievements, ACHIEVEMENTS_DATABASE } from './core/engine/achievements';
import { getRandomItemByRarityAndClass } from './core/entities/items';
import { EquipmentTerminal } from './components/equipment/EquipmentTerminal';
import { ForgePanel } from './components/ForgePanel';
import { WeldingBenchPanel } from './components/WeldingBenchPanel';
import { RelicsPanel } from './components/RelicsPanel';
import { AdaptationsPanel } from './components/AdaptationsPanel';
import { AutoBattlePanel } from './components/AutoBattlePanel';
import { HubNavigation } from './components/HubNavigation';
import { MainMenu } from './components/MainMenu';
import { IntroSequence } from './components/IntroSequence';
import { PlayerProfilePanel } from './components/PlayerProfilePanel';
import { ExpeditionPanel } from './components/ExpeditionPanel';
import { BlackMarketPanel } from './components/BlackMarketPanel';
import { ContractsPanel } from './components/ContractsPanel';
import { BestiaryPanel } from './components/BestiaryPanel';
import { EndingScreen } from './components/EndingScreen';
import { CharacterCreation } from './components/CharacterCreation';
import { ORIGINS } from './core/entities/origins';
import { TutorialOverlay } from './components/TutorialOverlay';
import { markTimelineCompleted } from './core/engine/timelineCodex';
import { TimelineClosureScreen } from './components/TimelineClosureScreen';
import { unlockMemory } from './core/engine/memoryArchive';
import { MemoryFragmentScreen } from './components/MemoryFragmentScreen';
import { MemoryArchivePanel } from './components/MemoryArchivePanel';
import { useTranslation, translate, setLanguage, getLanguage, Language } from './core/engine/translation';
import { random } from './core/engine/rng';

import { getSectorForFloor } from './core/math/worldScaling';
import { STORAGE_KEYS, getStorageString, setStorageString } from './core/engine/storage';
import { AudioManager } from './core/engine/audio';

function getPendingTutorials(player: Player): string[] {
  const completed = player.completedTutorials || [];
  const pending: string[] = [];
  
  if (!completed.includes('initial')) {
    pending.push('initial');
  }
  if ((player.level >= 3 || player.highestFloorUnlocked >= 3) && !completed.includes('adaptacoes')) {
    pending.push('adaptacoes');
  }
  if ((player.level >= 4 || player.highestFloorUnlocked >= 3) && !completed.includes('conquistas')) {
    pending.push('conquistas');
  }
  if ((player.level >= 5 || player.highestFloorUnlocked >= 5) && !completed.includes('forja')) {
    pending.push('forja');
  }
  if ((player.level >= 6 || player.highestFloorUnlocked >= 5) && !completed.includes('contratos')) {
    pending.push('contratos');
  }
  if ((player.level >= 8 || player.highestFloorUnlocked >= 8) && !completed.includes('soldagem')) {
    pending.push('soldagem');
  }
  if (player.level >= 10 && !completed.includes('habilidades')) {
    pending.push('habilidades');
  }
  if ((player.level >= 12 || player.highestFloorUnlocked >= 10) && !completed.includes('reliquias')) {
    pending.push('reliquias');
  }
  if ((player.level >= 15 || player.highestFloorUnlocked >= 15) && !completed.includes('mercado')) {
    pending.push('mercado');
  }
  if ((player.level >= 20 || player.highestFloorUnlocked >= 20) && !completed.includes('auto')) {
    pending.push('auto');
  }
  
  return pending;
}

function getTutorialName(key: string): string {
  switch (key) {
    case 'initial': return 'Guia de Integração';
    case 'adaptacoes': return 'Painel de Adaptações';
    case 'conquistas': return 'Registro de Conquistas';
    case 'forja': return 'Forja de Equipamentos';
    case 'contratos': return 'Terminal de Contratos';
    case 'soldagem': return 'Módulo de Soldagem e Circuitos';
    case 'habilidades': return 'Matriz de Habilidades de Classe';
    case 'reliquias': return 'Dispositivo de Relíquias';
    case 'mercado': return 'Rede Mercantil Clandestina';
    case 'auto': return 'Auto-Combate e Auto-Farm';
    default: return 'Nova Tecnologia';
  }
}


function renderManufacturerBadge(item: import('./types').Item) {
  if (!item.manufacturer) return null;
  let color = 'text-slate-400 border-slate-500/50 bg-slate-900/50';
  if (item.manufacturer === 'Kinetix') color = 'text-orange-400 border-orange-500/50 bg-orange-900/50';
  if (item.manufacturer === 'AeroDynamics') color = 'text-cyan-400 border-cyan-500/50 bg-cyan-900/50';
  if (item.manufacturer === 'OmniCorp') color = 'text-purple-400 border-purple-500/50 bg-purple-900/50';
  
  return (
    <span className={`text-[8px] font-mono px-1 py-0.5 rounded border uppercase tracking-wider ${color} ml-2`}>
      {item.manufacturer}
    </span>
  );
}

function getActiveSets(player: import('./types').Player) {
  const counts: Record<string, number> = { Kinetix: 0, AeroDynamics: 0, OmniCorp: 0 };
  const equipSlots = ['weapon', 'armor', 'helmet', 'pants', 'boots', 'bracers', 'accessory1', 'accessory2', 'accessory3'] as const;
  equipSlots.forEach(slot => {
    const item = player.equipment[slot];
    if (item?.manufacturer) counts[item.manufacturer]++;
  });
  return counts;
}

function createDefaultPlayer() {
  return {
    level: 1,
    currentXp: 0,
    currentClassId: 'tecno_aprendiz',
    gold: 0,
    inventory: [
      ITEMS_DATABASE['weapon_common_classless_1'], 
      ITEMS_DATABASE['weapon_common_classless_2'],    
      ITEMS_DATABASE['accessory_common_classless_1'],
      ITEMS_DATABASE['accessory_common_classless_2'] 
    ].filter(Boolean),
    equipment: {},
    highestFloorUnlocked: 1,
    learnedSkills: [],
    materials: { common: 0, rare: 0, epic: 0 },
    soulShards: 0,
    relics: {},
    achievements: [],
    gameStats: { monstersKilled: 0, puzzlesSolved: 0, bossesDefeated: 0 },
    runStats: { goldSpent: 0, totalTurns: 0 },
    autoBattleRules: [],
    isAutoBattleActive: false,
    isFarmActive: false,
    matrixPoints: 0,
    unlockedNodes: ['core_start'],
    adaptations: {
      'blindagem_reativa': { level: 0, exp: 0 },
      'overclock_combate': { level: 0, exp: 0 },
      'dissipacao_calor': { level: 0, exp: 0 }
    },
    contracts: [],
    bestiary: {}
  };
}

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231f2937' stroke='%23374151' stroke-width='4'/><text x='50' y='55' font-family='monospace' font-size='40' fill='%23ef4444' text-anchor='middle'>X</text></svg>";
};

export default function App() {
  const { t, language } = useTranslation();
  const [player, setPlayer] = useState<Player>(() => {
    const saved = loadGame();
    if (saved) {
      return saved;
    }
    return {
      level: 1,
      currentXp: 0,
      currentClassId: 'tecno_aprendiz',
      gold: 0,
      inventory: [
        ITEMS_DATABASE['weapon_common_classless_1'], 
        ITEMS_DATABASE['weapon_common_classless_2'],    
        ITEMS_DATABASE['accessory_common_classless_1'],
        ITEMS_DATABASE['accessory_common_classless_2'] 
      ].filter(Boolean),
      learnedSkills: [],
      equipment: {
        weapon: ITEMS_DATABASE['weapon_common_classless_3'],
        armor: ITEMS_DATABASE['armor_common_classless_1']
      },
      highestFloorUnlocked: 1,
      matrixPoints: 0,
      unlockedNodes: ['core_start'],
      materials: { common: 0, rare: 0, epic: 0 },
      soulShards: 0,
      relics: {},
      achievements: [],
      gameStats: { monstersKilled: 0, puzzlesSolved: 0, bossesDefeated: 0 },
      autoBattleRules: [],
      isAutoBattleActive: false,
      isFarmActive: false,
      adaptations: {
        'blindagem_reativa': { level: 0, exp: 0 },
        'overclock_combate': { level: 0, exp: 0 },
        'dissipacao_calor': { level: 0, exp: 0 }
      },
      completedTutorials: []
    };
  });

  const [scene, setScene] = useState<'main_menu' | 'intro' | 'hub' | 'combat' | 'event' | 'puzzle' | 'ending' | 'character_creation' | 'timeline_closure'>('main_menu');
  const [justCompletedAll, setJustCompletedAll] = useState<boolean>(false);
  const [isContinueRun, setIsContinueRun] = useState(false);
  const [hubTab, setHubTab] = useState<'expedicao' | 'perfil' | 'geral' | 'habilidades' | 'forja' | 'soldagem' | 'reliquias' | 'adaptacoes' | 'auto' | 'conquistas' | 'mercado' | 'contratos' | 'bestiario' | 'memorias'>('expedicao');
  const [selectedFloor, setSelectedFloor] = useState(player.highestFloorUnlocked);
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [combatLogFilter, setCombatLogFilter] = useState<'all' | 'important'>('all');
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [eventLog, setEventLog] = useState<string | null>(null);
  const [lastEventId, setLastEventId] = useState<string | null>(null);
  const [activePuzzle, setActivePuzzle] = useState<{ vibrationHz: number, temperatureC: number, correctPort: number } | null>(null);
  const [inventoryMessage, setInventoryMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  const [activeEvolutionNarrative, setActiveEvolutionNarrative] = useState<{ classId: string; text: string } | null>(null);
  const [activeMemoryKey, setActiveMemoryKey] = useState<string | null>(null);

  const playerCombatSkills = React.useMemo(() => {
    return Object.keys(SKILLS_DATABASE).filter(skillId => {
      const skill = SKILLS_DATABASE[skillId];
      if (!skill) return false;
      const isNeuralUnlocked = player.unlockedNodes?.some(nodeId => NEURAL_MATRIX_DATABASE[nodeId]?.skillId === skill.id);
      return canClassUseSkill(player.currentClassId, skill) || isNeuralUnlocked || player.learnedSkills?.includes(skill.id);
    });
  }, [player.currentClassId, player.unlockedNodes, player.learnedSkills]);
  const [combatEndMessage, setCombatEndMessage] = useState<{ title: string, subtitle: string, isVictory: boolean } | null>(null);
  const [toasts, setToasts] = useState<{id: number, message: string}[]>([]);

  const [combatSpeed, setCombatSpeed] = useState<'normal' | 'fast'>(() => {
    return (getStorageString(STORAGE_KEYS.COMBAT_SPEED, 'normal') as 'normal' | 'fast') || 'normal';
  });

  const toggleCombatSpeed = () => {
    setCombatSpeed(prev => {
      const next = prev === 'normal' ? 'fast' : 'normal';
      setStorageString(STORAGE_KEYS.COMBAT_SPEED, next);
      return next;
    });
  };


  
  // States para animações de combate
  const prevPlayerHpRef = useRef<number | null>(null);
  const prevMonsterHpRef = useRef<number | null>(null);
  const [dmgPopups, setDmgPopups] = useState<{ target: 'player' | 'monster', amount: number, id: number }[]>([]);
  const popupIdRef = useRef(0);

  
  useEffect(() => {
    const isCombatActive = scene === 'combat' && !combatEndMessage;
    if (isCombatActive) {
      const handler = setTimeout(() => {
        saveGame(player);
      }, 500);
      return () => clearTimeout(handler);
    } else {
      saveGame(player);
    }
  }, [player, scene, combatEndMessage]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scene === 'combat') {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }
  }, [combatState?.logs, scene, combatLogFilter]);

  // Hook para Auto-Batalha
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (scene === 'combat' && combatState?.isActive && player.isAutoBattleActive) {
      const action = getAutoBattleAction(player, combatState);
      const delay = combatSpeed === 'fast' ? 300 : 800;
      timeout = setTimeout(() => {
        handleCombatAction(action);
      }, delay);
    }
    return () => clearTimeout(timeout);
  }, [scene, combatState?.round, combatState?.isActive, player.isAutoBattleActive, combatSpeed]);

  // Hook para Auto-Farm (reinicia o combate se auto e farm ativos)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (scene === 'combat' && combatState && !combatState.isActive && combatEndMessage && player.isFarmActive && player.isAutoBattleActive) {
      const delay = combatSpeed === 'fast' ? 1000 : 2500;
      timeout = setTimeout(() => {
        handleStartDive(selectedFloor, true);
      }, delay);
    }
    return () => clearTimeout(timeout);
  }, [scene, combatState?.isActive, combatEndMessage, player.isFarmActive, player.isAutoBattleActive, selectedFloor, combatSpeed]);

  // Hook para gerenciar música de fundo procedural de acordo com o contexto/setor
  useEffect(() => {
    if (scene === 'combat') {
      if (combatEndMessage) {
        // Ao fim do combate mostrando combatEndMessage, faça crossfade de volta pra música do hub
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
      // Outras cenas (hub, event, puzzle, etc.) usam o tema do Hub
      AudioManager.playMusic('music.hub');
    }
  }, [scene, combatEndMessage, combatState?.monster?.id, selectedFloor]);

  // Hook para detectar mudança de HP e disparar Damage Popups
  useEffect(() => {
    if (!combatState) {
      prevPlayerHpRef.current = null;
      prevMonsterHpRef.current = null;
      return;
    }

    const currentPHp = combatState.playerHp;
    const currentMHp = combatState.monsterHp;
    
    if (prevPlayerHpRef.current !== null && currentPHp < prevPlayerHpRef.current) {
      const dmg = prevPlayerHpRef.current - currentPHp;
      const id = popupIdRef.current++;
      setDmgPopups(prev => [...prev, { target: 'player', amount: dmg, id }]);
      const popupDuration = combatSpeed === 'fast' ? 500 : 1000;
      setTimeout(() => setDmgPopups(prev => prev.filter(p => p.id !== id)), popupDuration);
    }
    
    if (prevMonsterHpRef.current !== null && currentMHp < prevMonsterHpRef.current) {
      const dmg = prevMonsterHpRef.current - currentMHp;
      const id = popupIdRef.current++;
      setDmgPopups(prev => [...prev, { target: 'monster', amount: dmg, id }]);
      const popupDuration = combatSpeed === 'fast' ? 500 : 1000;
      setTimeout(() => setDmgPopups(prev => prev.filter(p => p.id !== id)), popupDuration);
    }

    prevPlayerHpRef.current = currentPHp;
    prevMonsterHpRef.current = currentMHp;
  }, [combatState?.playerHp, combatState?.monsterHp, combatSpeed]);

  // Auto-ascensão de nível 100
  useEffect(() => {
    if (player.level >= 100) {
      const evols = getAvailableEvolutions(player.currentClassId, player.level);
      if (evols.length === 1) {
        const newClass = evols[0];
        if (player.currentClassId !== newClass.id) {
          const originId = player.originId || 'ciborgue_foragido';
          const key = `${originId}:${newClass.id}`;
          const firstTime = unlockMemory(key);
          if (firstTime) {
            setActiveMemoryKey(key);
          } else {
            triggerToast("Fragmento de memória já registrado");
          }

          setPlayer(prev => {
            const nextPlayer = {
              ...prev,
              currentClassId: newClass.id,
              learnedSkills: []
            };
            const text = getClassEvolutionNarrative(newClass.id, prev.originId);
            setActiveEvolutionNarrative({ classId: newClass.id, text });
            return nextPlayer;
          });
        }
      }
    }
  }, [player.level, player.currentClassId, player.originId]);

  const triggerToast = (message: string) => {
    const id = Date.now() + random();
    setToasts(prev => [...prev, { id, message }]);
    
    // Play appropriate sound based on message content
    if (message.includes('⚠️') || message.includes('⚡') || message.includes('AVISO') || message.includes('Erro') || message.includes('Pendente') || message.includes('pendente')) {
      AudioManager.playSfx('ui.error');
    } else {
      AudioManager.playSfx('ui.notification');
    }

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (inventoryMessage) {
      if (inventoryMessage.type === 'error') {
        AudioManager.playSfx('ui.error');
      } else {
        AudioManager.playSfx('ui.click');
      }
    }
  }, [inventoryMessage]);

  const handleStartDive = (floor: number, forceCombat: boolean = false) => {
    const pending = getPendingTutorials(player);
    if (pending.length > 0) {
      triggerToast(`⚠️ Calibração pendente! Por favor, conclua o tutorial do sistema.`);
      setScene('hub');
      return;
    }
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
      setCombatEndMessage(null);
      setScene('combat');
    }
  };

  const generatePuzzle = () => {
    const vibrationHz = Math.floor(random() * 120) + 20; // 20 a 139 Hz
    const temperatureC = Math.floor(random() * 80) + 50; // 50 a 129 ºC
    
    let correctPort = 3;
    if (vibrationHz > 80 && temperatureC > 100) {
      correctPort = 2;
    } else if (vibrationHz < 50) {
      correctPort = 1;
    }
    
    return { vibrationHz, temperatureC, correctPort };
  };

  const handlePuzzleSelect = (index: number) => {
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
      const hpDamage = Math.floor(calculatePlayerStats(player).hp * 0.25);
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
  };

  const handleSkipPuzzle = () => {
    AudioManager.playSfx('event.puzzle_skip');
    let nextPlayer = { ...player };
    if (selectedFloor === nextPlayer.highestFloorUnlocked) {
      nextPlayer.highestFloorUnlocked += 1;
    }
    setPlayer(nextPlayer);
    setEventLog("Você contornou o Terminal de Segurança Instável. O terminal permanece ativo, mas você conseguiu seguir em frente sem sofrer choques ou perdas de recursos.");
    setScene('event');
    setActivePuzzle(null);
  };

  const handleEventOption = (option: EventOption) => {
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
  };

  const handleCombatAction = (action: CombatAction) => {
    setPlayer(prev => {
      const p = { ...prev };
      if (!p.runStats) p.runStats = { goldSpent: 0, totalTurns: 0 };
      p.runStats.totalTurns += 1;
      return p;
    });
    if (!combatState || !combatState.isActive) return;

    const { nextState, combatResult } = processTurn(player, combatState, action, selectedFloor);
    setCombatState(nextState);

    // Process sound effects based on log patterns and status effect updates
    const oldLogsCount = combatState.logs ? combatState.logs.length : 0;
    const newLogs = nextState.logs.slice(oldLogsCount);

    const getNewStatuses = (oldList: any[] = [], newList: any[] = []) => {
      const oldTypes = new Set(oldList.map(s => s.type));
      return newList.filter(s => !oldTypes.has(s.type)).map(s => s.type);
    };
    const newPlayerStatuses = getNewStatuses(combatState.playerStatuses, nextState.playerStatuses);
    const newMonsterStatuses = getNewStatuses(combatState.monsterStatuses, nextState.monsterStatuses);
    const allNewStatuses = Array.from(new Set([...newPlayerStatuses, ...newMonsterStatuses]));

    allNewStatuses.forEach(type => {
      if (type === 'overheat') AudioManager.playSfx('combat.status_overheat');
      else if (type === 'corrosion') AudioManager.playSfx('combat.status_corrosion');
      else if (type === 'shock') AudioManager.playSfx('combat.status_shock');
      else if (type === 'stun') AudioManager.playSfx('combat.status_stun');
    });

    let hasVictory = false;
    let hasDefeat = false;
    let hasLevelUp = false;
    let hasHeal = false;
    let hasSkillDamage = false;
    let maxSkillDamageMultiplier = 1.0;
    let hasCritOrBonus = false;
    let hasBossEnrage = false;
    let hasDamageTakenPlayer = false;
    let hasDamageTakenMonster = false;
    let hasAttackBasic = false;

    newLogs.forEach(log => {
      if (log.includes('Vitória')) {
        hasVictory = true;
      } else if (log.includes('sucumbiu') || log.includes('derrotado')) {
        if (!log.includes('Vitória')) {
          hasDefeat = true;
        }
      }
      if (log.includes('LEVEL UP')) {
        hasLevelUp = true;
      }
      if (log.includes('Sinergia') || log.includes('Choque ampliou') || log.includes('CRÍTICO')) {
        hasCritOrBonus = true;
      }
      if (log.includes('PROTOCOLO DE EXTERMÍNIO') || log.includes('FÚRIA') || log.includes('AMEAÇA CLASSE ÔMEGA')) {
        hasBossEnrage = true;
      }
      if (log.includes('curou') || log.includes('recuperou')) {
        hasHeal = true;
      }
      if (log.includes('usou')) {
        const matchedSkill = Object.values(SKILLS_DATABASE).find(s => log.includes(s.name));
        if (matchedSkill) {
          if (matchedSkill.type === 'heal') {
            hasHeal = true;
          } else {
            hasSkillDamage = true;
            if (matchedSkill.multiplier > maxSkillDamageMultiplier) {
              maxSkillDamageMultiplier = matchedSkill.multiplier;
            }
          }
        } else {
          hasSkillDamage = true;
        }
      }
      if (log.includes('ataca e causa') || log.includes('sofre') || log.includes('incinera')) {
        if (log.includes('Jogador') || log.includes('jogador')) {
          hasDamageTakenPlayer = true;
        } else {
          hasDamageTakenMonster = true;
        }
        if (log.includes('ataca') && !log.includes('Skill') && !log.includes('Soro')) {
          hasAttackBasic = true;
        }
      }
    });

    if (hasVictory) {
      AudioManager.playSfx('combat.victory');
    } else if (hasDefeat) {
      AudioManager.playSfx('combat.defeat');
    }
    if (hasLevelUp) {
      AudioManager.playSfx('combat.level_up');
    }
    if (hasBossEnrage) {
      AudioManager.playSfx('combat.boss_enrage');
    }
    if (hasCritOrBonus) {
      AudioManager.playSfx('combat.crit_or_bonus');
    }

    if (hasHeal) {
      AudioManager.playSfx('combat.skill_heal');
    } else if (hasSkillDamage) {
      AudioManager.playSfx('combat.skill_damage', { damageMultiplier: maxSkillDamageMultiplier });
    } else if (hasAttackBasic) {
      AudioManager.playSfx('combat.attack_basic');
    }

    if (hasDamageTakenPlayer) {
      AudioManager.playSfx('combat.damage_taken_player');
    } else if (hasDamageTakenMonster) {
      AudioManager.playSfx('combat.damage_taken_monster');
    }

    if (combatResult) {
      let updatedPlayer = combatResult.updatedPlayer;
      
      if (combatResult.trackers) {
        const { updatedPlayer: p2, levelUps } = processAdaptationTrackers(updatedPlayer, combatResult.trackers);
        updatedPlayer = p2;
        levelUps.forEach(msg => triggerToast(msg));
      }
      
      if (combatResult.winner === 'player') {
        if (selectedFloor === updatedPlayer.highestFloorUnlocked) {
          updatedPlayer = {
            ...updatedPlayer,
            highestFloorUnlocked: updatedPlayer.highestFloorUnlocked + 1
          };
        }
        
        if (combatResult.loot?.items && combatResult.loot.items.length > 0) {
          combatResult.loot.items.forEach((item, index) => {
             triggerToast(`💎 Drop Raro: ${item.name}!`);
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
          subtitle: `Você derrotou o ${nextState.monster.name} e obteve ${combatResult.loot?.xp} XP e ${combatResult.loot?.gold} Ouro.`,
          isVictory: true
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
    } else if (!nextState.isActive) {
      setCombatEndMessage({
        title: 'Exaustão',
        subtitle: 'O combate se arrastou por tempo demais e os combatentes fugiram.',
        isVictory: false
      });
    }
  };

  const handleReturnToHub = () => {
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
  };

  const handleEvolveClass = (newClassId: string) => {
    const originId = player.originId || 'ciborgue_foragido';
    const key = `${originId}:${newClassId}`;
    const firstTime = unlockMemory(key);
    if (firstTime) {
      setActiveMemoryKey(key);
    } else {
      triggerToast("Fragmento de memória já registrado");
    }

    setPlayer(prev => {
      const nextPlayer = {
        ...prev,
        currentClassId: newClassId,
        learnedSkills: []
      };
      const text = getClassEvolutionNarrative(newClassId, prev.originId);
      setActiveEvolutionNarrative({ classId: newClassId, text });
      return nextPlayer;
    });
  };

  
  const handleSocketModule = (
    moduleItem: import('./types').Item,
    invIndex: number,
    selectedEquipment: { item: import('./types').Item; source: string; index: number },
    socketIndex: number
  ) => {
    const { source, index, item } = selectedEquipment;
    
    const updatedItem = { ...item };
    updatedItem.hardwareSlots = [...(item.hardwareSlots || [])];
    const oldModule = updatedItem.hardwareSlots[socketIndex];
    updatedItem.hardwareSlots[socketIndex] = moduleItem;
    
    setPlayer(p => {
      const nextPlayer = { ...p, inventory: [...p.inventory] };
      nextPlayer.inventory.splice(invIndex, 1);
      if (oldModule) {
        nextPlayer.inventory.push(oldModule);
      }
      
      if (source === 'inventory') {
        nextPlayer.inventory[index] = updatedItem;
      } else {
        nextPlayer.equipment = { ...p.equipment, [source]: updatedItem };
      }
      
      return nextPlayer;
    });
    triggerToast(`Módulo instalado com sucesso!`);
    return updatedItem;
  };

  
  const handleMergeChips = (baseItem: import('./types').Item) => {
    // Find all identical items with same level in inventory
    const identicals = player.inventory.filter(i => i.id === baseItem.id && i.level === baseItem.level);
    if (identicals.length < 3) {
      triggerToast("São necessários 3 módulos idênticos do mesmo nível para a fusão.");
      return;
    }
    
    const mergeCost = 50 * (baseItem.level || 1);
    if (player.gold < mergeCost) {
      triggerToast(`Ouro insuficiente para a fusão (${mergeCost}G necessários).`);
      return;
    }
    
    setPlayer(p => {
      const nextPlayer = { ...p, inventory: [...p.inventory] };
      nextPlayer.gold -= mergeCost;
      
      // Remove 3 identical items
      let removed = 0;
      for (let i = nextPlayer.inventory.length - 1; i >= 0; i--) {
        if (nextPlayer.inventory[i].id === baseItem.id && nextPlayer.inventory[i].level === baseItem.level && removed < 3) {
          nextPlayer.inventory.splice(i, 1);
          removed++;
        }
      }
      
      // Create new upgraded item
      const nextLevel = (baseItem.level || 1) + 1;
      const upgradedItem = { ...baseItem, level: nextLevel, name: `${baseItem.name}` };
      
      // Scale stats
      if (upgradedItem.statModifiers) {
        upgradedItem.statModifiers = { ...upgradedItem.statModifiers };
        Object.entries(upgradedItem.statModifiers).forEach(([key, val]) => {
          upgradedItem.statModifiers![key as keyof import('./types').Stats] = Math.floor(val * 1.5);
        });
      }
      if (upgradedItem.passiveEffects) {
        upgradedItem.passiveEffects = { ...upgradedItem.passiveEffects };
        if (upgradedItem.passiveEffects.lifesteal) {
          upgradedItem.passiveEffects.lifesteal = Number((upgradedItem.passiveEffects.lifesteal * 1.5).toFixed(3));
        }
        if (upgradedItem.passiveEffects.statusResistance) {
          upgradedItem.passiveEffects.statusResistance = Number((upgradedItem.passiveEffects.statusResistance * 1.2).toFixed(2));
        }
      }
      
      nextPlayer.inventory.push(upgradedItem);
      return nextPlayer;
    });
    triggerToast(`Fusão concluída! ${baseItem.name} evoluiu para Nv. ${(baseItem.level || 1) + 1}.`);
  };

  const handleUnsocketModule = (
    socketIndex: number,
    selectedEquipment: { item: import('./types').Item; source: string; index: number }
  ) => {
    const { source, index, item } = selectedEquipment;
    
    const updatedItem = { ...item };
    if (!updatedItem.hardwareSlots || !updatedItem.hardwareSlots[socketIndex]) return;
    
    const oldModule = updatedItem.hardwareSlots[socketIndex];
    updatedItem.hardwareSlots = [...updatedItem.hardwareSlots];
    updatedItem.hardwareSlots[socketIndex] = null;
    
    setPlayer(p => {
      const nextPlayer = { ...p, inventory: [...p.inventory, oldModule] };
      if (source === 'inventory') {
        nextPlayer.inventory[index] = updatedItem;
      } else {
        nextPlayer.equipment = { ...p.equipment, [source]: updatedItem };
      }
      return nextPlayer;
    });
    triggerToast(`Módulo removido com sucesso.`);
    return updatedItem;
  };

  
  const handleAutoEquip = () => {
    const result = autoEquipAll(player);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  };

  const handleEquip = (item: Item) => {
    const result = equipItem(player, item);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  };

  const handleUnequip = (slot: keyof Player['equipment']) => {
    const result = unequipItem(player, slot);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  };

  const handleDismantle = (index: number) => {
    const result = dismantleItem(player, index);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  };

  const handleSell = (index: number) => {
    const result = sellItem(player, index);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  };

  const handleDismantleBatch = (items: Item[]) => {
    const result = dismantleItemsBatch(player, items);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  };

  const handleSellBatch = (items: Item[]) => {
    const result = sellItemsBatch(player, items);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  };

  const handleCraft = (rarity: import('./types').Rarity) => {
    const result = craftItem(player, rarity);
    if (result.success) {
      AudioManager.playSfx('event.craft_success', { rarity });
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  };

  const handleConvertMaterials = (direction: 'common_to_rare' | 'rare_to_epic', quantity: number = 1) => {
    const result = convertMaterials(player, direction, quantity);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3500);
  };

  const handleUpgradeRelic = (relicId: string) => {
    const result = upgradeRelic(player, relicId);
    if (result.success) {
      AudioManager.playSfx('event.relic_upgrade');
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  };

  // Helper de estilos de Raridade
  const getRarityStyle = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'text-slate-300 border-slate-600 bg-slate-950/40 shadow-[inset_0_0_10px_rgba(100,116,139,0.1)]';
      case 'rare': return 'text-cyan-400 border-cyan-500 bg-cyan-950/20 shadow-[inset_0_0_15px_rgba(34,211,238,0.15),0_0_8px_rgba(34,211,238,0.2)]';
      case 'epic': return 'text-purple-400 border-purple-500 bg-purple-950/20 shadow-[inset_0_0_20px_rgba(192,132,252,0.25),0_0_12px_rgba(192,132,252,0.4)]';
      case 'legendary': return 'text-amber-400 border-amber-500 bg-amber-950/20 shadow-[inset_0_0_20px_rgba(245,158,11,0.25),0_0_15px_rgba(245,158,11,0.5)]';
      case 'mythic': return 'text-red-400 border-red-500 bg-red-950/20 shadow-[inset_0_0_25px_rgba(239,68,68,0.35),0_0_20px_rgba(239,68,68,0.7)]';
      default: return 'text-slate-300 bg-slate-950/40';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-500';
      case 'rare': return 'bg-gradient-to-br from-cyan-600 to-blue-900 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]';
      case 'epic': return 'bg-gradient-to-br from-purple-500 to-indigo-900 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.7)]';
      case 'legendary': return 'bg-gradient-to-br from-amber-500 to-orange-800 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.85)]';
      case 'mythic': return 'bg-gradient-to-br from-red-600 to-rose-950 border-red-400 shadow-[0_0_25px_rgba(239,68,68,1)]';
      default: return 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-500';
    }
  };

  const renderItemRequirements = (item: import('./types').Item) => {
    if (!item.allowedClassIds || item.allowedClassIds.length === 0) return null;
    const isCompatible = canClassEquipItem(player.currentClassId, item);
    const classNames = item.allowedClassIds.map(id => CLASSES[id]?.name || id).join(', ');
    
    return (
      <div className={`mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded inline-block ${isCompatible ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50' : 'bg-red-900/30 text-red-400 border border-red-800/50'}`}>
        [COMPATIBILIDADE: {classNames}]
      </div>
    );
  };

  const getItemIcon = (type: string, className = "w-4 h-4") => {
    switch(type) {
      case 'weapon': return <Sword className={className} />;
      case 'armor': return <Shirt className={className} />;
      case 'helmet': return <HardHat className={className} />;
      case 'pants': return <Shield className={className} />;
      case 'boots': return <Footprints className={className} />;
      case 'bracers': return <Watch className={className} />;
      case 'accessory': return <Cpu className={className} />;
      case 'accessory1': return <Cpu className={className} />;
      case 'accessory2': return <Cpu className={className} />;
      case 'accessory3': return <Cpu className={className} />;
      default: return <Zap className={className} />;
    }
  };

  const lineageSkills = React.useMemo(() => {
    const isClassInLineage = (playerClassId: string, targetClassId: string): boolean => {
      let currentClass: any = CLASSES[playerClassId];
      while (currentClass) {
        if (currentClass.id === targetClassId) return true;
        currentClass = currentClass.parentClassId ? CLASSES[currentClass.parentClassId] : undefined;
      }
      currentClass = CLASSES[targetClassId];
      while (currentClass) {
        if (currentClass.id === playerClassId) return true;
        currentClass = currentClass.parentClassId ? CLASSES[currentClass.parentClassId] : undefined;
      }
      return false;
    };

    return Object.values(SKILLS_DATABASE)
      .filter(skill => isClassInLineage(player.currentClassId, skill.allowedClassId))
      .sort((a, b) => {
        const reqA = CLASSES[a.allowedClassId]?.requiredLevel || 1;
        const reqB = CLASSES[b.allowedClassId]?.requiredLevel || 1;
        return reqA - reqB;
      });
  }, [player.currentClassId]);

  if (scene === 'main_menu') {
    return (
      <MainMenu
        hasSaveFile={!!loadGame()}
        onContinue={() => {
          const saved = loadGame();
          if (saved) {
            setPlayer(saved);
            setIsContinueRun(true);
            setScene('intro');
          }
        }}
        onNewGame={() => {
          setPlayer(createDefaultPlayer());
          setIsContinueRun(false);
          setScene('intro');
        }}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  if (scene === 'intro') {
    return (
      <IntroSequence 
        onComplete={() => {
          if (isContinueRun && player.originId) {
            setScene('hub');
          } else {
            setScene('character_creation');
          }
        }} 
        isContinue={isContinueRun} 
      />
    );
  }

  if (scene === 'character_creation') {
    return (
      <CharacterCreation 
        onComplete={(originId) => {
          setPlayer(prev => {
            const originSkillId = ORIGINS[originId].skillId;
            const updated = { 
              ...prev, 
              originId,
              learnedSkills: originSkillId && !prev.learnedSkills.includes(originSkillId)
                ? [...prev.learnedSkills, originSkillId]
                : prev.learnedSkills
            };
            saveGame(updated);
            return updated;
          });
          setScene('hub');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        <header className="border-b border-cyan-500/30 pb-4 md:pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight mb-1">
              [SYSTEM] Tower Climber
            </h1>
            <p className="text-cyan-200/60 font-mono text-sm uppercase tracking-wider">
              {scene === 'hub' ? `>> Safe Zone: ${t('Acampamento Base')}` : `>> ${t('Andar')} ${selectedFloor} [${t(getSectorForFloor(selectedFloor).name)}]: ${t('Em Combate')}`}
            </p>
          </div>
          {scene === 'hub' && (
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <button
                onClick={() => {
                  saveGame(player);
                  setScene('main_menu');
                }}
                className="bg-slate-900/50 hover:bg-red-900/30 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-400 font-mono text-xs uppercase tracking-widest px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                <Power className="w-4 h-4" /> {t("Menu Principal")}
              </button>
              <div className="text-left md:text-right system-panel px-4 py-2">
                <div className="text-cyan-400 font-mono text-sm uppercase tracking-widest text-shadow">{t("Andar Máximo Liberado")}</div>
                <div className="text-2xl font-bold text-white">{player.highestFloorUnlocked}</div>
              </div>
            </div>
          )}
        </header>

        {scene === 'hub' ? (
          <div className="flex flex-col gap-6 w-full">
            <HubNavigation hubTab={hubTab} setHubTab={setHubTab} player={player} />
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
            

            {/* Tab Contents */}
            <div className="w-full">
              {hubTab === 'perfil' && (
                <PlayerProfilePanel 
                  player={player}
                  CLASSES={CLASSES}
                  handleEvolveClass={handleEvolveClass}
                />
              )}
              
              {hubTab === 'expedicao' && (
                <ExpeditionPanel 
                  player={player}
                  selectedFloor={selectedFloor}
                  setSelectedFloor={setSelectedFloor}
                  handleStartDive={handleStartDive}
                  setPlayer={setPlayer}
                />
              )}
              
              <div className={`w-full ${['perfil', 'expedicao'].includes(hubTab) ? 'hidden' : 'block'}`}>
            {/* Direita: Inventário, Equipamentos & Forja */}
            <div className="w-full space-y-6 transition-all duration-300">
              

              {hubTab === 'geral' && (
                <EquipmentTerminal 
                  handleAutoEquip={handleAutoEquip}
                  player={player}
                  stats={calculatePlayerStats(player)}
                  CLASSES={CLASSES}
                  inventoryMessage={inventoryMessage}
                  handleEquip={handleEquip}
                  handleUnequip={handleUnequip}
                  canClassEquipItem={canClassEquipItem}
                  getItemIcon={getItemIcon}
                  getRarityStyle={getRarityStyle}
                  getRarityGradient={getRarityGradient}
                  renderManufacturerBadge={renderManufacturerBadge}
                />
              )}

              {hubTab === 'habilidades' && (
                <div className="h-[80vh] w-full">
                  <NeuralMatrix player={player} setPlayer={setPlayer} />
                </div>
              )}

              {hubTab === 'forja' && (
                <ForgePanel
                  player={player}
                  setPlayer={setPlayer}
                  handleCraft={handleCraft}
                  handleConvertMaterials={handleConvertMaterials}
                  handleDismantle={handleDismantle}
                  handleSell={handleSell}
                  handleDismantleBatch={handleDismantleBatch}
                  handleSellBatch={handleSellBatch}
                  inventoryMessage={inventoryMessage}
                  getRarityStyle={getRarityStyle}
                  getRarityGradient={getRarityGradient}
                  getItemIcon={getItemIcon}
                  renderManufacturerBadge={renderManufacturerBadge}
                />
              )}
              
              {hubTab === 'soldagem' && (
                <WeldingBenchPanel
                  player={player}
                  handleSocketModule={handleSocketModule}
                  handleUnsocketModule={handleUnsocketModule}
                  handleMergeChips={handleMergeChips}
                  getRarityStyle={getRarityStyle}
                />
              )}

              {hubTab === 'reliquias' && (
                <RelicsPanel
                  player={player}
                  handleUpgradeRelic={handleUpgradeRelic}
                  inventoryMessage={inventoryMessage}
                />
              )}
              {hubTab === 'bestiario' && (
                <BestiaryPanel player={player} />
              )}

              {hubTab === 'memorias' && (
                <MemoryArchivePanel player={player} />
              )}
              
              {hubTab === 'contratos' && (
                <ContractsPanel player={player} setPlayer={setPlayer} />
              )}
              
              {hubTab === 'mercado' && (
                <BlackMarketPanel player={player} setPlayer={setPlayer} />
              )}
              
              {hubTab === 'conquistas' && (
                <>
                  <div className="system-panel">
                    <div className="border-b border-purple-500/20 bg-purple-950/40 px-4 py-3 flex justify-between items-center">
                      <span className="font-bold text-purple-400 tracking-widest uppercase text-sm">{t("Parede de Troféus")}</span>
                      <span className="text-purple-300 font-mono text-xs">{player.achievements.length} / {ACHIEVEMENTS_DATABASE.length}</span>
                    </div>
                    <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ACHIEVEMENTS_DATABASE.map(ach => {
                          const unlocked = player.achievements.includes(ach.id);
                          return (
                            <div key={ach.id} className={`p-4 rounded border flex flex-col justify-between ${unlocked ? 'bg-slate-900/60 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.1)]' : 'bg-slate-900/30 border-slate-800 opacity-60'}`}>
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`font-bold tracking-wider text-sm ${unlocked ? 'text-purple-300' : 'text-slate-500'}`}>{t(ach.name)}</span>
                                  {unlocked ? (
                                    <span className="text-purple-400 text-xs">{t("Desbloqueado")}</span>
                                  ) : (
                                    <span className="text-slate-600 text-xs">{t("Bloqueado")}</span>
                                  )}
                                </div>
                                <p className={`text-xs mb-2 leading-relaxed ${unlocked ? 'text-purple-200/70' : 'text-slate-500 line-through'}`}>{t(ach.description)}</p>
                                <p className="text-[10px] text-slate-400 italic mb-2">"{unlocked ? t(ach.secretDescription) : '???'}"</p>
                              </div>
                              <div className="mt-2 pt-2 border-t border-slate-800/50">
                                <span className={`text-[10px] font-mono tracking-wide ${unlocked ? 'text-purple-400/80' : 'text-slate-600'}`}>{t("Recompensa")}: {t(ach.rewardText)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {hubTab === 'adaptacoes' && (
                <AdaptationsPanel player={player} />
              )}

              {hubTab === 'auto' && (
                <AutoBattlePanel
                  player={player}
                  setPlayer={setPlayer}
                  playerCombatSkills={playerCombatSkills}
                />
              )}

            </div>
            </div>
          </div>
          </div>
          </div>
        ) : scene === 'combat' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Painel de Ações Esquerdo */}
            <div className="system-panel flex flex-col w-full lg:w-[35%] min-w-[320px]">
              <div className="tech-panel-header px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-cyan-50 tracking-widest uppercase text-sm">Módulos de Combate</span>
                </div>
                <button 
                  onClick={() => setPlayer(p => ({ ...p, isAutoBattleActive: !p.isAutoBattleActive }))}
                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded transition-colors border cursor-pointer ${player.isAutoBattleActive ? 'bg-emerald-900/60 text-emerald-400 border-emerald-500/50 hover:bg-emerald-800/60 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'bg-slate-900 text-slate-500 border-slate-700 hover:text-cyan-400 hover:border-cyan-700'}`}
                  title="Modo Automático"
                >
                  AUTO {player.isAutoBattleActive ? 'ON' : 'OFF'}
                </button>
              </div>
              
              <div className="p-4 space-y-3 flex-1 flex flex-col relative">
                {player.isAutoBattleActive && combatState?.isActive && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center m-4 rounded border border-emerald-900/50">
                    <Activity className="w-8 h-8 text-emerald-500 animate-pulse mb-2" />
                    <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm animate-pulse">Automação Ativa</span>
                    <span className="text-emerald-500/50 text-[10px] font-mono mt-1">IA da nave no controle...</span>
                  </div>
                )}
                {combatState && combatState.isActive ? (
                  <>
                    {combatState.bossPuzzle?.active && (
                      <div className="bg-red-950/40 border border-red-500 p-4 rounded mb-4 animate-[pulse_2s_infinite]">
                        <h4 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
                          <Zap className="w-5 h-5" /> Sobrescrita Plug & Play
                        </h4>
                        <p className="text-xs text-red-200 mb-4 font-mono">
                          Vibração: {combatState.bossPuzzle.vibrationHz} Hz | Temp: {combatState.bossPuzzle.temperatureC} °C<br/>
                          (Fórmula: 2x Vibração + Temp)
                        </p>
                        <div className="flex gap-2">
                          {[
                            combatState.bossPuzzle.correctPort,
                            combatState.bossPuzzle.correctPort + 15,
                            combatState.bossPuzzle.correctPort - 10
                          ].sort(() => random() - 0.5).map((port, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleCombatAction({ type: 'boss_puzzle', port })}
                              className="flex-1 bg-red-900 hover:bg-red-700 text-white font-bold py-2 rounded text-xs font-mono transition-colors"
                            >
                              Porta {port}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleCombatAction({ type: 'attack' })}
                      className="w-full bg-slate-900/80 hover:bg-cyan-950/60 border border-cyan-800/50 hover:border-cyan-500 text-white font-bold py-3 px-4 rounded transition-all text-left flex justify-between items-center cursor-pointer hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] active:scale-[0.98] group"
                    >
                      <div className="flex items-center gap-3">
                        <CrosshairIcon className="w-5 h-5 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
                        <span className="uppercase tracking-widest text-sm text-cyan-50">Ataque Básico</span>
                      </div>
                      <span className="text-cyan-500/50 text-[10px] font-mono border border-cyan-900/50 px-2 py-0.5 rounded">SYS.ATK</span>
                    </button>
                    
                    <div className="w-full h-px bg-cyan-900/30 my-2 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                    </div>
                    
                    {playerCombatSkills.map(skillId => {
                      const skill = SKILLS_DATABASE[skillId];
                      const isNeuralUnlocked = player.unlockedNodes?.some(nodeId => NEURAL_MATRIX_DATABASE[nodeId]?.skillId === skill.id);
                      const canUseClass = canClassUseSkill(player.currentClassId, skill) || isNeuralUnlocked || player.learnedSkills.includes(skill.id);
                      const cd = combatState.cooldowns[skill.id] || 0;
                      const noMp = combatState.playerMp < skill.mpCost;
                      
                      const isDesligado = cd > 0;
                      
                      return (
                        <button 
                          key={skill.id}
                          disabled={!canUseClass || isDesligado || noMp}
                          onClick={() => handleCombatAction({ type: 'skill', skillId: skill.id })}
                          className={`w-full text-left font-bold py-3 px-4 rounded transition-all flex justify-between items-center border relative overflow-hidden active:scale-[0.98] ${
                            !canUseClass ? 'bg-slate-950/80 border-slate-800 text-slate-600 cursor-not-allowed' :
                            isDesligado ? 'bg-red-950/20 border-red-900/30 text-slate-500 cursor-not-allowed grayscale filter' :
                            noMp ? 'bg-slate-950/80 border-cyan-900/30 text-cyan-800/50 cursor-not-allowed' :
(() => {
                              const fromNeural = player.unlockedNodes?.some(nodeId => NEURAL_MATRIX_DATABASE[nodeId]?.skillId === skill.id);
                              const fromAdaptation = Object.values(ADAPTATIONS_DATABASE).some(def => def.isFusion && def.grantedSkillId === skill.id && player.learnedSkills.includes(skill.id));
                              const isClassSkill = canClassUseSkill(player.currentClassId, skill);
                              
                              if (isClassSkill && fromNeural) return 'border border-transparent [background:linear-gradient(rgba(8,51,68,0.5),rgba(69,26,3,0.5))_padding-box,linear-gradient(to_right,#06b6d4,#f59e0b)_border-box] hover:[background:linear-gradient(rgba(8,51,68,0.8),rgba(69,26,3,0.8))_padding-box,linear-gradient(to_right,#06b6d4,#f59e0b)_border-box] text-cyan-100 cursor-pointer hover:shadow-[inset_0_0_15px_rgba(6,182,212,0.3),0_0_15px_rgba(245,158,11,0.4)] group';
                              if (fromAdaptation) return 'bg-purple-950/30 hover:bg-purple-900/50 border-purple-500/50 text-purple-100 cursor-pointer hover:shadow-[inset_0_0_15px_rgba(168,85,247,0.2),0_0_15px_rgba(168,85,247,0.4)] group';
                              if (isClassSkill) return 'bg-cyan-950/30 hover:bg-cyan-900/50 border-cyan-500/50 text-cyan-100 cursor-pointer hover:shadow-[inset_0_0_15px_rgba(6,182,212,0.2),0_0_15px_rgba(6,182,212,0.4)] group';
                              if (fromNeural) return 'bg-amber-950/30 hover:bg-amber-900/50 border-amber-500/50 text-amber-100 cursor-pointer hover:shadow-[inset_0_0_15px_rgba(245,158,11,0.2),0_0_15px_rgba(245,158,11,0.4)] group';
                              return 'bg-indigo-950/30 hover:bg-indigo-900/50 border-indigo-500/50 text-indigo-100 cursor-pointer hover:shadow-[inset_0_0_15px_rgba(99,102,241,0.2),0_0_15px_rgba(99,102,241,0.4)] group';
                            })()
                          }`}
                          title={!canUseClass ? `Requer classe: ${CLASSES[skill.allowedClassId]?.name || skill.allowedClassId}` : skill.description}
                        >
                          {isDesligado && (
                            <div className="absolute inset-0 bg-red-900/10 pointer-events-none"></div>
                          )}
                          
                          <div className="flex items-center gap-3 relative z-10">
                            <Zap className={`w-5 h-5 ${isDesligado ? 'text-red-900/50' : 'text-current opacity-80 group-hover:opacity-100'}`} />
                            <div className="flex flex-col">
                              <span className="uppercase tracking-widest text-sm">{skill.name}</span>
                              <span className="text-[10px] font-mono font-normal mt-0.5 opacity-60 flex gap-2">
                                <span>{skill.type === 'damage' ? `PWR:${skill.multiplier * 100}%` : skill.type === 'heal' ? `HEAL:${skill.multiplier * 100}%` : 'BUFF'}</span>
                                <span className="opacity-50">|</span>
                                <span>CD:{skill.cooldown}</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="relative z-10">
                            {isDesligado ? (
                              <span className="text-red-500/80 text-2xl font-bold font-mono drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]">
                                {cd}
                              </span>
                            ) : (
                              <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${noMp ? 'border-cyan-900/50 text-cyan-800/50' : 'border-indigo-500/30 bg-indigo-950/50 text-indigo-300'}`}>
                                {skill.mpCost} EP
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    {combatEndMessage && (
                      <div className={`p-4 border rounded ${combatEndMessage.isVictory ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-red-950/30 border-red-500/50'}`}>
                        <h4 className={`text-xl uppercase tracking-widest font-bold mb-2 ${combatEndMessage.isVictory ? 'text-emerald-400' : 'text-red-400'}`}>
                          {combatEndMessage.title}
                        </h4>
                        <p className="text-sm font-mono text-cyan-100">{combatEndMessage.subtitle}</p>
                      </div>
                    )}
                    {player.isFarmActive && player.isAutoBattleActive && (
                      <div className="text-xs font-mono text-cyan-400 animate-pulse bg-cyan-950/20 border border-cyan-500/30 px-4 py-2 rounded flex items-center gap-2">
                        <Cpu className="w-4 h-4 animate-spin-slow text-cyan-400" />
                        AUTO-FARM ATIVO: REINICIANDO EM INSTANTES...
                      </div>
                    )}
                    
                    {/* Controle de Velocidade de Combate */}
                    <div className="w-full flex items-center justify-between bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg">
                      <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">{t("Velocidade de Combate")}</span>
                      <button
                        type="button"
                        onClick={toggleCombatSpeed}
                        className={`px-3 py-1.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider transition-all border ${
                          combatSpeed === 'fast'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {combatSpeed === 'fast' ? t('⚡ Rápida (2x)') : t('🐢 Normal')}
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                      {combatEndMessage?.isVictory && (
                        <button 
                          onClick={() => {
                            const nextF = selectedFloor + 1;
                            setSelectedFloor(nextF);
                            handleStartDive(nextF);
                          }}
                          className="w-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-50 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
                        >
                          Avançar (Andar {selectedFloor + 1})
                        </button>
                      )}
                      <button 
                        onClick={() => handleStartDive(selectedFloor, true)}
                        className="w-full bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-50 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                      >
                        Lutar Novamente (Andar {selectedFloor})
                      </button>
                      <button 
                        onClick={handleReturnToHub}
                        className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-600 text-slate-300 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(148,163,184,0.3)] cursor-pointer"
                      >
                        Voltar ao Hub
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Arena Central & Logs */}
            <div className="flex flex-col w-full lg:w-[65%] space-y-4">
              
              {/* Alerta de Anomalia e Chefes */}
              {combatState && combatState.monster.isBoss && (
                <div className="bg-red-950/40 border border-red-500/50 text-red-400 p-2 mb-4 rounded flex items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <span className="font-bold uppercase tracking-widest text-sm flex items-center gap-2"><span className="animate-pulse">⚠️</span> AMEAÇA CLASSE ÔMEGA DETECTADA</span>
                  <span className="font-mono text-xs opacity-80">PROBABILIDADE DE SOBREVIVÊNCIA: 12%</span>
                </div>
              )}
              {combatState && combatState.anomaly && (
                <div className="bg-yellow-950/40 border border-yellow-500/50 text-yellow-400 p-2 mb-4 rounded flex flex-col md:flex-row items-start md:items-center justify-between shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                  <div className="flex items-center gap-2 mb-1 md:mb-0">
                    <span className="animate-pulse">⚡</span>
                    <span className="font-bold uppercase tracking-widest text-sm">{combatState.anomaly.name}</span>
                  </div>
                  <span className="font-mono text-xs opacity-90 text-yellow-200/80">{combatState.anomaly.description}</span>
                </div>
              )}

              {/* Palco Isométrico de Combate */}
              {combatState && (
                <div className="system-panel h-64 relative overflow-hidden flex items-center justify-center iso-stage" style={{ '--sector-rgb': getSectorForFloor(selectedFloor).rgb } as React.CSSProperties}>
                  {/* Informações Narrativas e de Efeito do Setor */}
                  <div className="absolute top-2 left-2 flex flex-col max-w-[240px] bg-slate-950/90 border border-slate-800/80 rounded p-2 z-20 text-[9px] font-mono leading-relaxed backdrop-blur-md shadow-md text-left">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                      <span className={`w-2 h-2 rounded-full animate-pulse ${getSectorForFloor(selectedFloor).colorTheme === 'green' ? 'bg-green-500' : getSectorForFloor(selectedFloor).colorTheme === 'blue' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                      <span className={getSectorForFloor(selectedFloor).color}>{getSectorForFloor(selectedFloor).name}</span>
                    </div>
                    <p className="text-slate-400 text-[8px] mt-1 italic">{getSectorForFloor(selectedFloor).flavorText}</p>
                    <div className="border-t border-slate-850 mt-1.5 pt-1 text-[7.5px] text-amber-500/90">
                      <span className="font-bold uppercase tracking-widest">{t("Aviso Ambiental")}:</span> {getSectorForFloor(selectedFloor).description}
                    </div>
                  </div>

                  {combatState.anomaly && combatState.isBossEnraged && (
                    <div className="absolute top-2 right-2 bg-yellow-950/80 border border-yellow-500/50 text-yellow-400 p-1 rounded z-20 text-[8px] font-mono shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                      <span className="animate-pulse mr-1">⚡</span>{combatState.anomaly.name}
                    </div>
                  )}
                  {/* Chão Isométrico */}
                  <div className="absolute w-80 h-80 iso-floor"></div>
                  
                  {/* Entidades 2D no palco 3D */}
                  <div className="absolute flex justify-between items-end w-64 -mt-10 z-30">
                    
                    {/* Jogador Sprite Box */}
                    <div className="relative flex flex-col items-center">
                      {dmgPopups.filter(p => p.target === 'player').map(p => (
                        <div key={p.id} className="absolute -top-8 text-red-500 font-bold font-mono text-xl animate-float-up z-20 text-shadow" style={{ animationDuration: combatSpeed === 'fast' ? '0.5s' : '1s' }}>-{p.amount}</div>
                      ))}
                      <img 
                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.currentClassId}`} 
                        onError={handleImageError} 
                        alt="Player" 
                        className={`w-24 h-24 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] ${dmgPopups.some(p => p.target === 'player') ? 'animate-shake animate-hit-flash' : ''}`} 
                        style={dmgPopups.some(p => p.target === 'player') ? { animationDuration: combatSpeed === 'fast' ? '0.2s, 0.075s' : '0.4s, 0.15s' } : undefined}
                      />
                      
                      {/* Barras de Status do Jogador flutuantes */}
                      <div className="absolute top-24 w-20 space-y-1">
                        <div className="flex gap-1 justify-center flex-wrap mb-1 w-[120%] -ml-[10%]">
                          {combatState.playerStatuses?.map((s, i) => (
                            <span key={i} className={`text-[8px] px-1 rounded font-bold ${s.type==='overheat'?'bg-orange-500/20 text-orange-400 border border-orange-500/50':s.type==='corrosion'?'bg-green-500/20 text-green-400 border border-green-500/50':'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'}`}>
                              {s.type==='overheat'?'[CALOR:':s.type==='corrosion'?'[ÁCIDO:':'[CHOQUE:'}{s.duration}t]
                            </span>
                          ))}
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded border border-slate-700 overflow-hidden">
                          <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${(combatState.playerHp / calculatePlayerStats(player).hp) * 100}%` }}></div>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded border border-slate-700 overflow-hidden">
                          <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${(combatState.playerMp / calculatePlayerStats(player).mp) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Monstro Sprite Box */}
                    <div className="relative flex flex-col items-center">
                       {dmgPopups.filter(p => p.target === 'monster').map(p => (
                        <div key={p.id} className="absolute -top-8 text-red-500 font-bold font-mono text-xl animate-float-up z-20 text-shadow" style={{ animationDuration: combatSpeed === 'fast' ? '0.5s' : '1s' }}>-{p.amount}</div>
                      ))}
                      <img 
                        src={`https://robohash.org/${combatState.monster.name}?set=set2&size=150x150`} 
                        onError={handleImageError} 
                        alt="Monster" 
                        className={`w-32 h-32 drop-shadow-[0_15px_15px_rgba(255,0,0,0.3)] ${dmgPopups.some(p => p.target === 'monster') ? 'animate-shake animate-hit-flash' : ''} ${combatState.isBossEnraged ? 'animate-pulse drop-shadow-[0_0_40px_rgba(255,0,0,1)]' : ''}`} 
                        style={dmgPopups.some(p => p.target === 'monster') ? { animationDuration: combatSpeed === 'fast' ? '0.2s, 0.075s' : '0.4s, 0.15s' } : undefined}
                      />
                      
                      {/* Barras de Status do Monstro flutuantes */}
                      <div className="absolute top-28 w-24 space-y-1">
                        <div className="flex gap-1 justify-center flex-wrap mb-1 w-[120%] -ml-[10%]">
                          {combatState.monsterStatuses?.map((s, i) => (
                            <span key={i} className={`text-[8px] px-1 rounded font-bold ${s.type==='overheat'?'bg-orange-500/20 text-orange-400 border border-orange-500/50':s.type==='corrosion'?'bg-green-500/20 text-green-400 border border-green-500/50':'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'}`}>
                              {s.type==='overheat'?'[CALOR:':s.type==='corrosion'?'[ÁCIDO:':'[CHOQUE:'}{s.duration}t]
                            </span>
                          ))}
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded border border-slate-700 overflow-hidden">
                          <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${(combatState.monsterHp / combatState.monster.stats.hp) * 100}%` }}></div>
                        </div>
                        <div className="text-center text-[10px] font-mono font-bold text-red-200 mt-1 uppercase tracking-widest bg-slate-900/80 rounded px-1">{combatState.monster.name}</div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Registro de Combate (Logs) */}
              <div className="system-panel flex-1 flex flex-col min-h-[200px]">
                <div className="tech-panel-header px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-cyan-500/70" />
                    <span className="font-bold text-cyan-500/70 tracking-widest uppercase text-[10px]">Terminal de Registro</span>
                  </div>
                  <select 
                    className="bg-slate-900 border border-slate-700 text-cyan-300 text-[10px] rounded px-1 py-0.5 outline-none font-mono"
                    value={combatLogFilter}
                    onChange={(e) => setCombatLogFilter(e.target.value as 'all' | 'important')}
                  >
                    <option value="all">Tudo</option>
                    <option value="important">Eventos Importantes</option>
                  </select>
                </div>
                <div ref={logContainerRef} className="p-4 overflow-y-auto max-h-64 font-mono text-[11px] leading-relaxed space-y-1.5 flex-1 custom-scrollbar">
                  {combatState && combatState.logs.filter(log => {
                    if (combatLogFilter === 'all') return true;
                    const kw = ['[ANOMALIA', 'FÚRIA', 'CRÍTICO', 'Vitória', 'sucumbiu', 'derrotado', 'LEVEL UP', 'Turno', 'aplicou', 'ATORDOADO', 'PROTOCOLO', 'SOBRESCRITA', 'Curto-Circuito', 'Sinergia'];
                    return kw.some(k => log.includes(k));
                  }).map((log, i) => {
                    let logStyle = 'text-cyan-200/60';
                    let prefix = '';
                    
                    if (log.includes('Vitória')) {
                      logStyle = 'text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]';
                      prefix = '[WIN] ';
                    } else if (log.includes('derrotado') || log.includes('sucumbiu')) {
                      logStyle = 'text-red-400 font-bold drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]';
                      prefix = '[FATAL] ';
                    } else if (log.includes('LEVEL UP')) {
                      logStyle = 'text-amber-400 font-bold uppercase drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]';
                      prefix = '[SYS] ';
                    } else if (log.includes('--- Turno')) {
                      logStyle = 'text-cyan-500 mt-4 block font-bold border-b border-cyan-900/30 pb-1 mb-2 tracking-widest text-[10px] uppercase';
                    } else if (log.includes('usou')) {
                      logStyle = 'text-indigo-300';
                      prefix = '>> ';
                    } else if (log.includes('causou') || log.includes('dano')) {
                      logStyle = 'text-red-300/90';
                      prefix = '>> ';
                    } else if (log.includes('curou') || log.includes('recuperou')) {
                      logStyle = 'text-emerald-300/90';
                      prefix = '>> ';
                    } else if (log.includes('Loot:')) {
                      logStyle = 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.6)]';
                      prefix = '[LOOT] ';
                    } else {
                      prefix = '> ';
                    }
                    
                    return (
                      <div key={i} className={logStyle}>
                        {log.includes('--- Turno') ? log : <span className="opacity-70 mr-1 select-none">{prefix}</span>}
                        {log.includes('--- Turno') ? null : <span className="drop-shadow-[0_0_2px_rgba(34,211,238,0.2)]">{log}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
              
            </div>
          </div>
        ) : scene === 'event' && activeEvent ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
            <div className="system-panel max-w-2xl w-full flex flex-col overflow-hidden">
              <div className="tech-panel-header px-6 py-4 flex justify-between items-center">
                <span className="font-bold text-cyan-50 tracking-widest uppercase text-lg">{activeEvent.title}</span>
                <span className="text-cyan-400 font-mono text-sm border border-cyan-900/50 px-2 py-1 rounded shadow-[0_0_10px_rgba(34,211,238,0.2)]">Evento de Exploração</span>
              </div>
              
              <div className="p-8 space-y-8 flex-1">
                {!eventLog ? (
                  <>
                    <p className="text-cyan-100 text-lg leading-relaxed text-center font-serif italic mb-8">
                      "{activeEvent.description}"
                    </p>
                    <div className="space-y-4">
                      {activeEvent.options.map((opt: EventOption, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleEventOption(opt)}
                          className="w-full bg-slate-900/80 hover:bg-slate-800/80 border border-cyan-700/50 text-white font-bold py-4 px-6 rounded transition-all text-center cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] uppercase tracking-widest"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-8">
                    <p className="text-emerald-300 text-xl font-bold leading-relaxed max-w-lg mx-auto">
                      {eventLog}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <button
                        onClick={() => {
                          const nextF = selectedFloor + 1;
                          setSelectedFloor(nextF);
                          handleStartDive(nextF);
                        }}
                        className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-50 font-bold py-3 px-6 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                      >
                        Avançar (Andar {selectedFloor + 1})
                      </button>
                      <button
                        onClick={handleReturnToHub}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-600 text-slate-300 font-bold py-3 px-6 rounded uppercase tracking-widest transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(148,163,184,0.3)]"
                      >
                        Retornar ao Hub
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : scene === 'puzzle' && activePuzzle ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
            <div className="system-panel max-w-2xl w-full flex flex-col overflow-hidden">
              <div className="border-b border-rose-500/20 bg-rose-950/40 px-6 py-4 flex justify-between items-center">
                <span className="font-bold text-rose-50 tracking-widest uppercase text-lg">{t("Diagnóstico de Maquinário Instável")}</span>
                <span className="text-rose-400 font-mono text-sm border border-rose-900/50 px-2 py-1 rounded shadow-[0_0_10px_rgba(244,63,94,0.2)] animate-pulse">{t("ALERTA DE SISTEMA")}</span>
              </div>
              <div className="p-8 flex-1 flex flex-col items-center">
                <div className="w-full bg-slate-950/80 border border-cyan-500/30 rounded p-6 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] mb-8 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-rose-500 to-cyan-500 opacity-50"></div>
                  
                  <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-widest mb-4 border-b border-cyan-900 pb-2">{t("Sensores de Telemetria")}</h3>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-900 border border-slate-700 p-4 flex flex-col items-center justify-center rounded group hover:border-cyan-500 transition-colors">
                      <span className="text-slate-400 font-mono text-xs mb-1">{t("VIBRAÇÃO DO NÚCLEO")}</span>
                      <span className={`font-mono text-3xl font-bold ${activePuzzle.vibrationHz > 80 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                        {activePuzzle.vibrationHz} <span className="text-sm">Hz</span>
                      </span>
                    </div>
                    <div className="bg-slate-900 border border-slate-700 p-4 flex flex-col items-center justify-center rounded group hover:border-cyan-500 transition-colors">
                      <span className="text-slate-400 font-mono text-xs mb-1">{t("TEMPERATURA")}</span>
                      <span className={`font-mono text-3xl font-bold ${activePuzzle.temperatureC > 100 ? 'text-orange-500 animate-pulse' : 'text-blue-400'}`}>
                        {activePuzzle.temperatureC} <span className="text-sm">ºC</span>
                      </span>
                    </div>
                  </div>
 
                  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded">
                    <p className="text-slate-300 font-mono text-xs leading-relaxed">
                      <span className="text-cyan-400 font-bold">{t("> MANUAL DE EMERGÊNCIA:")}</span><br/>
                      - {t("- Se VIBRAÇÃO > 80Hz E TEMPERATURA > 100ºC:")} <span className="text-rose-400 font-bold">{t("Usar Porta 2")}</span> ({t("Desvio de Calor")})<br/>
                      - {t("- Senão, se VIBRAÇÃO < 50Hz:")} <span className="text-emerald-400 font-bold">{t("Usar Porta 1")}</span> ({t("Injeção Direta")})<br/>
                      - {t("- Caso contrário:")} <span className="text-amber-400 font-bold">{t("Usar Porta 3")}</span> ({t("Fluxo Padrão")})
                    </p>
                  </div>
                </div>
                
                <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-center">{t("Selecione a Porta de Conexão:")}</h4>
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex gap-4 w-full">
                    {[1, 2, 3].map((port) => (
                      <button
                        key={port}
                        onClick={() => handlePuzzleSelect(port)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-cyan-400 text-white font-bold font-mono text-xl py-6 rounded transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] flex flex-col items-center justify-center gap-2"
                      >
                        <span className="text-slate-500 text-xs tracking-widest">{t("PORTA")}</span>
                        <span className="text-cyan-400">{port}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSkipPuzzle}
                    className="w-full bg-slate-950/80 hover:bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 font-bold font-mono text-xs uppercase tracking-widest py-3 rounded transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] mt-2"
                  >
                    {t("Ignorar Terminal")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : scene === 'ending' ? (
          <EndingScreen 
            player={player} 
            onContinue={() => {
              setPlayer(prev => {
                const updated = { ...prev, campaignBeaten: true };
                saveGame(updated);
                return updated;
              });
              setScene('hub');
            }} 
          />
        ) : scene === 'timeline_closure' ? (
          <TimelineClosureScreen
            player={player}
            justCompletedAll={justCompletedAll}
            onComplete={() => {
              const defaultPlayer = createDefaultPlayer();
              setPlayer(defaultPlayer);
              saveGame(defaultPlayer);
              setScene('character_creation');
            }}
          />
        ) : null}
      </div>
      
      {/* Sistema de Toasts (Conquistas) */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-slate-900/95 border-2 border-purple-400 text-purple-100 px-6 py-4 rounded shadow-[0_0_20px_rgba(168,85,247,0.6)] flex items-center gap-3 animate-slide-in-right">
            <span className="font-bold font-mono text-sm uppercase tracking-wider">{toast.message}</span>
          </div>
        ))}
      </div>

      {scene === 'hub' && getPendingTutorials(player).length > 0 && (
        <TutorialOverlay 
          tutorialKey={getPendingTutorials(player)[0]} 
          onComplete={() => {
            const currentKey = getPendingTutorials(player)[0];
            setPlayer(prev => {
              const updated = {
                ...prev,
                completedTutorials: [...(prev.completedTutorials || []), currentKey]
              };
              saveGame(updated);
              return updated;
            });
          }}
        />
      )}

      {activeEvolutionNarrative && (
        <ClassEvolutionModal
          classId={activeEvolutionNarrative.classId}
          className={CLASSES[activeEvolutionNarrative.classId]?.name || ""}
          narrativeText={activeEvolutionNarrative.text}
          onClose={() => setActiveEvolutionNarrative(null)}
        />
      )}

      {activeMemoryKey && (
        <MemoryFragmentScreen
          player={player}
          memoryKey={activeMemoryKey}
          onComplete={() => setActiveMemoryKey(null)}
        />
      )}
      
    </div>
  );
}
