with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

call_code = """
  const { handleCombatAction } = useCombatLogic(
    player, setPlayer, combatState, setCombatState,
    setCombatEndMessage, setDmgPopups, popupIdRef,
    setEnrageFlash, setAttackerAnimating, triggerToast,
    selectedFloor
  );
"""

for i in range(len(lines)):
    if '  const handleClassEvolution = (newClassId: string) => {' in lines[i]:
        lines.insert(i, call_code)
        break

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
