const fs = require('fs');
let code = fs.readFileSync('src/core/engine/translation.ts', 'utf8');

const newTranslations = `  // Save Manager
  "Backup Manual (Importar/Exportar)": "Manual Backup (Import/Export)",
  "Guarde seu progresso em um arquivo para não perdê-lo caso o cache do navegador seja limpo.": "Save your progress to a file to prevent data loss if the browser cache is cleared.",
  "Exportar Save": "Export Save",
  "Importar Save": "Import Save",
  "Progresso exportado com sucesso!": "Progress exported successfully!",
  "Erro ao exportar save": "Error exporting save",
  "Arquivo de save corrompido ou inválido.": "Corrupted or invalid save file.",
  "Erro: Arquivo inválido": "Error: Invalid file",
  "Erro ao ler arquivo": "Error reading file",
  "Progresso importado com sucesso! Reiniciando...": "Progress imported successfully! Restarting...",
  "Voltar ao Menu Principal": "Return to Main Menu",
`;

code = code.replace("  // Main Menu", newTranslations + "  // Main Menu");

fs.writeFileSync('src/core/engine/translation.ts', code);
