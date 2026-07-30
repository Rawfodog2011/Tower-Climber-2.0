const fs = require('fs');

// EventScene
let eventCode = fs.readFileSync('src/pages/EventScene.tsx', 'utf8');
eventCode = eventCode.replace(
  "const { handleEventOption, handleStartDive, handleReturnToHub } = useExploration();",
  "const { handleEventOption, handleStartDive, handleReturnToHub } = useExploration();\n\n  if (!activeEvent) return null;"
);
fs.writeFileSync('src/pages/EventScene.tsx', eventCode);

// PuzzleScene
let puzzleCode = fs.readFileSync('src/pages/PuzzleScene.tsx', 'utf8');
puzzleCode = puzzleCode.replace(
  "const { t } = useTranslation();",
  "const { t } = useTranslation();\n\n  if (!activePuzzle) return null;"
);
fs.writeFileSync('src/pages/PuzzleScene.tsx', puzzleCode);
