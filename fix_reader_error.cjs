const fs = require('fs');
let code = fs.readFileSync('src/components/SaveManager.tsx', 'utf8');

code = code.replace(
  'console.error("Erro no FileReader");',
  '// silent'
);

fs.writeFileSync('src/components/SaveManager.tsx', code);
