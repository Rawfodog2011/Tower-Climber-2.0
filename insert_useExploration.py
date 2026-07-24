with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

call_code = """
  const {
    proceedWithDive,
    handleStartDive,
    handlePuzzleSelect,
    handleSkipPuzzle,
    handleEventOption,
    handleReturnToHub
  } = useExploration(
    player,
    setPlayer,
    setScene,
    setCombatState,
    setActiveEvent,
    setEventLog,
    setLastEventId,
    setActivePuzzle,
    setIntroSector,
    setIntroStep,
    setPendingDiveParams,
    triggerToast,
    lastEventId,
    pStatsMemo,
    combatEndMessage,
    setCombatEndMessage,
    selectedFloor,
    setHubTab,
    setJustCompletedAll
  );
"""

for i in range(len(lines)):
    if '  const handleClassEvolution = (newClassId: string) => {' in lines[i]:
        lines.insert(i, call_code)
        break

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
