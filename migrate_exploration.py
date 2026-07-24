import re

with open('src/App.tsx', 'r') as f:
    c = f.read()

c = c.replace("import { useCombatStore } from './store/useCombatStore';", "import { useCombatStore } from './store/useCombatStore';\nimport { useExplorationStore } from './store/useExplorationStore';")

c = re.sub(r"const \[selectedFloor, setSelectedFloor\] = useState.*?\n", "", c)
c = re.sub(r"const \[activeEvent, setActiveEvent\] = useState.*?\n", "", c)
c = re.sub(r"const \[eventLog, setEventLog\] = useState.*?\n", "", c)
c = re.sub(r"const \[lastEventId, setLastEventId\] = useState.*?\n", "", c)
c = re.sub(r"const \[activePuzzle, setActivePuzzle\] = useState.*?\n", "", c)
c = re.sub(r"const \[pendingDiveParams, setPendingDiveParams\] = useState.*?\n", "", c)
c = re.sub(r"const \[justCompletedAll, setJustCompletedAll\] = useState.*?\n", "", c)

store_call = """
  const {
    selectedFloor, setSelectedFloor, activeEvent, setActiveEvent,
    eventLog, setEventLog, lastEventId, setLastEventId,
    activePuzzle, setActivePuzzle, pendingDiveParams, setPendingDiveParams,
    justCompletedAll, setJustCompletedAll
  } = useExplorationStore();
"""

c = c.replace("const playerCombatSkills = useMemo", store_call + "\n  const playerCombatSkills = useMemo")

with open('src/App.tsx', 'w') as f:
    f.write(c)

