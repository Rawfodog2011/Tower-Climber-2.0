import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

imports = """import { useCombatLogic } from './hooks/useCombatLogic';
"""

if 'useCombatLogic' not in content:
    content = re.sub(r"import \{ useExploration \} from '\./hooks/useExploration';", imports + "import { useExploration } from './hooks/useExploration';", content)

hook_calls = """
  const { handleCombatAction } = useCombatLogic(
    player, setPlayer, combatState, setCombatState, setCombatEndMessage,
    setDmgPopups, popupIdRef, setEnrageFlash, setAttackerAnimating,
    triggerToast, selectedFloor
  );
"""

if 'handleCombatAction' not in content:
    content = re.sub(r"  const logContainerRef = useRef<HTMLDivElement>\(null\);", "  const logContainerRef = useRef<HTMLDivElement>(null);\n" + hook_calls, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

