const fs = require('fs');
let content = fs.readFileSync('TECH_DEBT.md', 'utf8');

content = content.replace(/- \[x\] \*\*Zustand Migration \(App\.tsx\)\*\*[\s\S]*?- \[x\] Eliminar inicialização de hooks de negócio dentro de App\.tsx/, 
`- [x] **Zustand Migration (App.tsx)**
  - [x] Extrair estado de UI (menus, modais ativos) para useGameUIStore.
  - [x] Extrair estado e lógica de Combate para useCombatStore.
  - [x] Extrair estado e lógica de Exploração para useExplorationStore.
  - [x] Refatorar App.tsx para atuar exclusivamente como um Router puro (apenas decide qual página/cena renderizar).
  - [x] Eliminar prop drilling em HubScene e suas child views.
  - [x] Eliminar prop drilling em views de transição (MainMenu, CharacterCreation, IntroSequence, EndingScreen, TimelineClosureScreen).
  - [x] Eliminar lógica de negócio de App.tsx (handleEvolveClass) extraindo-a para o hook useClassEvolution.
  - [x] Eliminar inicialização de hooks de negócio dentro de App.tsx`);

fs.writeFileSync('TECH_DEBT.md', content);
