const fs = require('fs');
let code = fs.readFileSync('TECH_DEBT.md', 'utf8');

// Remove the risk
code = code.replace(/\*   \*\*Re-Renders em Cascata:\*\* O componente \`App\.tsx\` ainda gerencia muitos \*refs\* e transições de cena pesadas\. A injeção de dependências via props \(mesmo com Zustand implementado em algumas áreas\) ainda pode causar re-renderizações acidentais em árvores de componentes grandes, como o \`HubScene\`\./, 
`*   **[RESOLVIDO] Re-Renders em Cascata:** O componente \`App.tsx\` foi refatorado para um Router puro. O problema foi sanado com o desacoplamento de estado e migração completa dos Hooks para consumir o Zustand diretamente.`);

// Add a paid debt section or entry to the backlog
const backlogTitle = "## 3. Backlog Técnico e Prioridades";
const entry = `## 3. Backlog Técnico e Prioridades

### 🛑 Dívidas Pagas Recentemente (Histórico de Sucesso)
*   **[PAGO] TD-001: God Component (App.tsx):** O App.tsx foi desmembrado com sucesso na Sprint de Desacoplamento. Todos os Hooks e Scenes agora utilizam Zustand independentemente. O prop drilling foi eliminado da arquitetura principal.
`;
code = code.replace(backlogTitle, entry);

fs.writeFileSync('TECH_DEBT.md', code);
