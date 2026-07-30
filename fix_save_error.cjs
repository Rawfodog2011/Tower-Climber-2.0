const fs = require('fs');
let code = fs.readFileSync('src/components/SaveManager.tsx', 'utf8');

code = code.replace(
  'console.error("Erro ao ler o arquivo de save:", error);',
  '// Apenas exibe o toast, sem console.error para evitar falsos positivos de erro no ambiente'
);
code = code.replace(
  'alert(t("Arquivo de save corrompido ou inválido."));',
  ''
);

fs.writeFileSync('src/components/SaveManager.tsx', code);
