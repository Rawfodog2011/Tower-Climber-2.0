## [Unreleased]
### Added
- **Combat Action Queue**: O motor de combate foi reescrito para gerar uma lista de `CombatQueueAction`. A UI agora as consome progressivamente.

# 📝 Changelog e Histórico de Versões: Tower Climber

Este documento atua como o registro cronológico oficial de todas as modificações significativas realizadas no **Tower Climber**. Ele deve ser atualizado rigorosamente ao final de cada Sprint ou liberação de versão (Release). 

O formato é baseado nos princípios do [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) adaptado para as necessidades do nosso ciclo de game design e engenharia.

---

## 📋 Modelo Oficial de Registro (Template)


## [Sprint 2] - 2026-07-24
**Foco da Sprint:** Correção da Revisão de PR #002 (Refinamento do App.tsx e Zustand)

### 🏗️ Refatorações e Mudanças Arquiteturais
- **App.tsx Limpo:** Removida a lógica de `handleEvolveClass` e de auto-evolução que estava acoplada ao componente principal. O `App.tsx` agora é um roteador puro.
- **Hook useClassEvolution:** Criado um novo hook customizado para lidar com a lógica de evolução manual e automática, transferindo responsabilidades do App.tsx e diminuindo complexidade de hooks existentes.
- **Eliminação Final de Prop Drilling:** Removida a passagem de parâmetros globais (`onComplete`, `hasSaveFile`, `language`, etc.) nas cenas `MainMenu`, `CharacterCreation`, `IntroSequence`, `EndingScreen`, `TimelineClosureScreen` e `TutorialOverlay`. Todas estas telas agora consomem Zustand de forma reativa.
- **Refatoração no HubScene:** Removemos prop drilling para `PlayerProfilePanel` e limpamos todos os imports não utilizados do `HubScene`.
- **Limpeza de Dead Code:** Removidos imports não utilizados (ex: `useCombatStore`, `useToast`, etc.) do `App.tsx` e `HubScene.tsx`.

## [Sprint 1] - 2024-05-18
**Foco da Sprint:** Desacoplamento Completo do App.tsx

### 🏗️ Refatorações e Mudanças Arquiteturais
- **App.tsx Refatorado:** Transformado em um roteador puro. O God Component foi desmantelado. App.tsx não gerencia mais lógica de negócio, não instancia hooks pesados de gameplay e não passa props em cascata (Prop Drilling). O tamanho do arquivo foi reduzido drasticamente.
- **Integração Zustand Concluída:** Todos os Hooks customizados (useInventory, useExploration, useCrafting, useCombatLogic, useGameEffects) foram reescritos para consumir os Stores globais do Zustand (`usePlayerStore`, `useExplorationStore`, `useGameUIStore`, `useCombatStore`) de forma independente, sem depender de injeção externa.
- **Scenes Desacopladas:** Componentes-mãe como `HubScene`, `CombatScene`, `EnvIntroScene`, `PuzzleScene` e `EventScene` agora acessam diretamente os stores e hooks, eliminando a dependência do App.tsx. O mesmo vale para sub-componentes complexos como `ExpeditionPanel`, `EndingScreen`, e `TimelineClosureScreen`.
- **Performance:** Redução maciça no número de renderizações desnecessárias. Componentes apenas se inscrevem nas fatias de estado relevantes no Zustand.



*Sempre copie o bloco abaixo e adicione no topo do histórico ao fechar uma nova Sprint.*

```markdown
## [Sprint X / Versão Y.Y.Y] - AAAA-MM-DD
**Foco da Sprint:** [Uma frase curta descrevendo o objetivo principal, ex: "Estabilização do Auto-Farm e Expansão do Hub"]

### 🚀 Novas Funcionalidades (Features)
- [Descrição clara da funcionalidade adicionada.]
- [Adição de sistema Z ou componente W.]

### ⚖️ Impactos no Gameplay e Balanceamento
- **[Sistema de Atributos]**: Modificado o cálculo de X para Y. 
- **[Economia]**: Custo da Forja de itens Épicos aumentado em 15% para prolongar o mid-game.
- **[Inimigos]**: HP base dos chefes a partir do Andar 20 escalona de forma quadrática em vez de linear.

### 🛠️ Correções (Bug Fixes)
- Corrigido o erro onde a habilidade X da classe Y não respeitava o Cooldown (CD).
- Resolvido o vazamento de memória quando o Auto-Combate rodava por mais de 2 horas.

### 🏗️ Refatorações e Mudanças Arquiteturais
- [Tech Debt] Extraída a lógica de roteamento do `App.tsx` para o gerenciador de cenas isolado.
- [UI] Substituídas chamadas diretas de CSS por classes utilitárias puras do Tailwind na tela de Hub.
```

---

## 📜 Histórico de Lançamentos

### [Sprint 4 / Versão 0.4.0] - 2026-07-24 (Exemplo/Atual)
**Foco da Sprint:** Documentação Oficial e Refinamento do Loop de Auto-Combate.

### 🚀 Novas Funcionalidades (Features)
- **Documentação Master:** Criados os arquivos fundamentais de governança (`DEVELOPMENT_CONSTITUTION.md`, `GAME_DESIGN.md`, `CODING_STANDARD.md`, etc) estabelecendo as regras de longo prazo.
- **Sistema de Idiomas:** Integrada a detecção dinâmica e troca de idiomas através do `useTranslation` no `MainMenu`.
- **Evolução de Classe Modals:** Adicionados fragmentos narrativos para as escolhas de evolução Alfa/Beta nível 70 da matriz de classes.

### ⚖️ Impactos no Gameplay e Balanceamento
- **[Progressão]**: O sistema agora exige confirmação visual na tela de Fragmentos de Memória antes de avançar para os próximos patamares, garantindo que o lore cibernético não seja ignorado pelo auto-farm.
- **[Automação]**: As regras de Auto-Combate (`SE HP < 50% ENTÃO Cura`) agora pausam corretamente ao encontrar quebra-cabeças (Puzzles) durante o *Dive*.

### 🛠️ Correções (Bug Fixes)
- Corrigido o erro `TypeError: onComplete is not a function` que impedia o fechamento da tela de `CharacterCreation` e o avanço para a introdução.
- Resolvido o *prop drilling* quebrado no roteamento de `EnvIntroScene` e `HubScene` injetando o Zustand e Props de forma coesa no `App.tsx`.
- Passagem incorreta da variável de tradução nas descrições longas de nível 70/100 na Matrix corrigida.

### 🏗️ Refatorações e Mudanças Arquiteturais
- **Roteamento Central (`App.tsx`)**: Refatorada a função `renderScene` centralizando injeção de dependências e `refs` de combate.
- **Tutoriais UI**: Removida a renderização solta do `<TutorialOverlay />` e tipada com `tutorialKey`, agora gerenciada pela conclusão registrada no estado do `Player`.
- **Limpeza ESLint/TypeScript**: Vários `any` implícitos foram suprimidos temporariamente, preparando caminho para a restrição forte de domínio.

### [1.2.0] - Combat Engine Architecture Fixes
- Removed completely the `mutateState` method from `CombatTurnBuilder`, replaced with explicit domain methods (`setPlayerGuarding`, `deactivateBossPuzzle`, `trackSkillUse`, etc).
- Wrapped `useCombatQueueRunner` loop inside a `try/finally` block to protect from deadlocks (e.g. `isRunningRef.current = false` and popping events is guaranteed).
- Eliminated all string parsing logic from the engine (such as checking if `action.name` includes "Skill"), instead passing boolean flags or structured data.
- Removed arbitrary TEXT_MESSAGE and TEXT_LOG strings from Combat Engine. It now emits purely semantic events (e.g. `FLEE_ATTEMPT`, `MONSTER_STUNNED_SKIP`, `BOSS_PUZZLE_RESULT`).
- Introduced a `LogFormatter` responsible for converting `CombatEvent` objects into visual logs for the UI.
