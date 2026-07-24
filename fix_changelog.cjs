const fs = require('fs');
let content = fs.readFileSync('CHANGELOG.md', 'utf8');

const sprint2 = `
## [Sprint 2] - 2026-07-24
**Foco da Sprint:** Correção da Revisão de PR #002 (Refinamento do App.tsx e Zustand)

### 🏗️ Refatorações e Mudanças Arquiteturais
- **App.tsx Limpo:** Removida a lógica de \`handleEvolveClass\` e de auto-evolução que estava acoplada ao componente principal. O \`App.tsx\` agora é um roteador puro.
- **Hook useClassEvolution:** Criado um novo hook customizado para lidar com a lógica de evolução manual e automática, transferindo responsabilidades do App.tsx e diminuindo complexidade de hooks existentes.
- **Eliminação Final de Prop Drilling:** Removida a passagem de parâmetros globais (\`onComplete\`, \`hasSaveFile\`, \`language\`, etc.) nas cenas \`MainMenu\`, \`CharacterCreation\`, \`IntroSequence\`, \`EndingScreen\`, \`TimelineClosureScreen\` e \`TutorialOverlay\`. Todas estas telas agora consomem Zustand de forma reativa.
- **Refatoração no HubScene:** Removemos prop drilling para \`PlayerProfilePanel\` e limpamos todos os imports não utilizados do \`HubScene\`.
- **Limpeza de Dead Code:** Removidos imports não utilizados (ex: \`useCombatStore\`, \`useToast\`, etc.) do \`App.tsx\` e \`HubScene.tsx\`.

`;

content = content.replace(/## \[Sprint 1\] - 2024-05-18/, sprint2 + '## [Sprint 1] - 2024-05-18');

fs.writeFileSync('CHANGELOG.md', content);
