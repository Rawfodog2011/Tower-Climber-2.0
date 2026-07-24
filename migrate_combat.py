import re

with open('src/App.tsx', 'r') as f:
    c = f.read()

c = c.replace("import { useGameUIStore } from './store/useGameUIStore';", "import { useGameUIStore } from './store/useGameUIStore';\nimport { useCombatStore } from './store/useCombatStore';")

c = re.sub(r"const \[combatState, setCombatState\] = useState.*?\n", "", c)
c = re.sub(r"const \[combatLogFilter, setCombatLogFilter\] = useState.*?\n", "", c)
c = re.sub(r"const \[combatEndMessage, setCombatEndMessage\] = useState.*?\n", "", c)
c = re.sub(r"const \[combatSpeed, setCombatSpeed\] = useState.*?\n", "", c)
c = re.sub(r"const \[dmgPopups, setDmgPopups\] = useState.*?\n", "", c)
c = re.sub(r"const \[enrageFlash, setEnrageFlash\] = useState.*?\n", "", c)
c = re.sub(r"const \[attackerAnimating, setAttackerAnimating\] = useState.*?\n", "", c)

store_call = """
  const {
    combatState, setCombatState, combatLogFilter, setCombatLogFilter,
    combatEndMessage, setCombatEndMessage, combatSpeed, setCombatSpeed,
    dmgPopups, setDmgPopups, enrageFlash, setEnrageFlash,
    attackerAnimating, setAttackerAnimating
  } = useCombatStore();
"""

c = c.replace("const { toasts, triggerToast } = useToast();", store_call + "\n  const { toasts, triggerToast } = useToast();")

with open('src/App.tsx', 'w') as f:
    f.write(c)

