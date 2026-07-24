import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

hook_calls = """
  const {
    proceedWithDive,
    handleStartDive,
    handlePuzzleSelect,
    handleSkipPuzzle,
    handleEventOption,
    handleReturnToHub
  } = useExploration(
    player, setPlayer, setScene, setCombatState, setActiveEvent,
    setEventLog, setLastEventId, setActivePuzzle, setIntroSector,
    setIntroStep, setPendingDiveParams, triggerToast, lastEventId,
    pStatsMemo, combatEndMessage, setCombatEndMessage, selectedFloor,
    setHubTab, setJustCompletedAll
  );
"""

if 'proceedWithDive' not in content:
    content = re.sub(r"  const logContainerRef = useRef<HTMLDivElement>\(null\);", "  const logContainerRef = useRef<HTMLDivElement>(null);\n" + hook_calls, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

