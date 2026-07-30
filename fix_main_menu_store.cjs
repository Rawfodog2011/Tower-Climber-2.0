const fs = require('fs');
let code = fs.readFileSync('src/components/MainMenu.tsx', 'utf8');

code = code.replace(
  "  const { savedPlayerPreview, setScene } = useGameUIStore();\n  const hasSaveFile = !!savedPlayerPreview;\n  \n  const { setIsContinueRun } = useGameUIStore();",
  "  const { savedPlayerPreview, setScene, setIsContinueRun } = useGameUIStore();\n  const hasSaveFile = !!savedPlayerPreview;"
);

fs.writeFileSync('src/components/MainMenu.tsx', code);
