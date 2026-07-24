const fs = require('fs');
let code = fs.readFileSync('CHANGELOG.md', 'utf8');

const newEntry = `
## [Sprint 1] - 2024-05-18
**Foco da Sprint:** Desacoplamento Completo do App.tsx

### 🏗️ Refatorações e Mudanças Arquiteturais
- **App.tsx Refatorado:** Transformado em um roteador puro. O God Component foi desmantelado. App.tsx não gerencia mais lógica de negócio, não instancia hooks pesados de gameplay e não passa props em cascata (Prop Drilling). O tamanho do arquivo foi reduzido drasticamente.
- **Integração Zustand Concluída:** Todos os Hooks customizados (useInventory, useExploration, useCrafting, useCombatLogic, useGameEffects) foram reescritos para consumir os Stores globais do Zustand (\`usePlayerStore\`, \`useExplorationStore\`, \`useGameUIStore\`, \`useCombatStore\`) de forma independente, sem depender de injeção externa.
- **Scenes Desacopladas:** Componentes-mãe como \`HubScene\`, \`CombatScene\`, \`EnvIntroScene\`, \`PuzzleScene\` e \`EventScene\` agora acessam diretamente os stores e hooks, eliminando a dependência do App.tsx. O mesmo vale para sub-componentes complexos como \`ExpeditionPanel\`, \`EndingScreen\`, e \`TimelineClosureScreen\`.
- **Performance:** Redução maciça no número de renderizações desnecessárias. Componentes apenas se inscrevem nas fatias de estado relevantes no Zustand.

`;

code = code.replace(/## 📋 Modelo Oficial de Registro \(Template\)/, "## 📋 Modelo Oficial de Registro (Template)\n" + newEntry);
fs.writeFileSync('CHANGELOG.md', code);
