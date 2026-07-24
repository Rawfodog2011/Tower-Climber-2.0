import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

imports = """import { useGameEffects } from './hooks/useGameEffects';
"""

if 'useGameEffects' not in content:
    content = re.sub(r"import \{ useCombatLogic \} from '\./hooks/useCombatLogic';", imports + "import { useCombatLogic } from './hooks/useCombatLogic';", content)

hook_calls = """
  const { triggerToast } = useGameEffects(
    player, setPlayer, scene, combatState, combatEndMessage,
    combatSpeed, selectedFloor, playerCombatSkills,
    handleCombatAction, handleStartDive, logContainerRef,
    combatLogFilter, prevPlayerHpRef, prevMonsterHpRef,
    prevLogLengthRef, setEnrageFlash, setAttackerAnimating,
    popupIdRef, setDmgPopups, setActiveMemoryKey,
    setActiveEvolutionNarrative, inventoryMessage,
    introStep, setToasts
  );
"""

if 'useGameEffects(' not in content:
    # Inject it before the useExploration since it needs handleStartDive
    content = re.sub(r"  const \{ handleStartDive", hook_calls + "  const { handleStartDive", content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

