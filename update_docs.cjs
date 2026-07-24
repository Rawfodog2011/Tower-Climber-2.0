const fs = require('fs');

let arch = fs.readFileSync('ARCHITECTURE.md', 'utf8');
arch = arch.replace(
  '### 3. Combat Engine',
  `### 3. Combat Engine
O Combat Engine utiliza uma **Fila de Ações (Combat Action Queue)**. O cálculo do turno (Combat Simulation) roda instantaneamente gerando a sequência de ações lógicas, que são então reproduzidas pela UI de forma isolada do código de negócio (Combat Presentation e Timing).`
);
fs.writeFileSync('ARCHITECTURE.md', arch);

let changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
changelog = `## [Unreleased]
### Added
- **Combat Action Queue**: O motor de combate foi reescrito para gerar uma lista de \`CombatQueueAction\`. A UI agora as consome progressivamente.

` + changelog;
fs.writeFileSync('CHANGELOG.md', changelog);

let techDebt = fs.readFileSync('TECH_DEBT.md', 'utf8');
techDebt = techDebt.replace(
  '- Eliminar inicialização de hooks de negócio dentro de `App.tsx` (ex: `useGameEffects`)',
  '- ~~Eliminar inicialização de hooks de negócio dentro de `App.tsx` (ex: `useGameEffects`)~~ (Removido o loop que verificava animações do combate, mas o hook ainda tem outras funções)'
);
fs.writeFileSync('TECH_DEBT.md', techDebt);
