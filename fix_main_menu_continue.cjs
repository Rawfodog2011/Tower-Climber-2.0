const fs = require('fs');
let code = fs.readFileSync('src/components/MainMenu.tsx', 'utf8');

code = code.replace(
  "  const onContinue = () => {\n    setScene('hub');\n  };",
  "  const { setIsContinueRun } = useGameUIStore();\n  const onContinue = () => {\n    setIsContinueRun(true);\n    setScene('intro');\n  };"
);

fs.writeFileSync('src/components/MainMenu.tsx', code);
