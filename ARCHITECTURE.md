# 🏗️ Arquitetura do Sistema: Tower Climber

Este documento detalha a arquitetura **real e atual** do projeto Tower Climber. Ele serve como o mapa definitivo de como as peças do sistema interagem, onde a lógica reside e como o fluxo de dados se comporta desde a interação do jogador até as engrenagens de cálculo do RPG.

---

## 1. Visão Geral da Stack Tecnológica

O Tower Climber é um *Single Page Application* (SPA) construído com as seguintes tecnologias base:

*   **Linguagem:** TypeScript (Strict mode).
*   **Framework UI:** React 19.
*   **Build Tool:** Vite.
*   **Gerenciamento de Estado:** Zustand (Fatiado por domínios).
*   **Estilização:** Tailwind CSS (Utility-first).
*   **Animações:** Motion (`motion/react`) para transições fluidas e modais.
*   **Ícones:** Lucide React (Estética limpa, SVG escalável).
*   **Áudio/TTS:** Integração com APIs nativas de SpeechSynthesis (narrador cibernético) através de um *engine* de TTS isolado.

---

## 2. Topologia do Projeto (Organização de Pastas)

A arquitetura de pastas impõe uma separação rígida entre as regras matemáticas do RPG, o armazenamento temporário em memória (Estado) e a renderização na tela.

| Diretório | Responsabilidade Arquitetural | Exemplos de Conteúdo |
| :--- | :--- | :--- |
| `/src/core/entities/` | Dicionários estáticos (Data-Driven) e tipos. | `classes.ts`, `origins.ts`, `items.ts` |
| `/src/core/engine/` | Lógica pura (Matemática, RNG, Dano, Save). | `combat.ts`, `crafting.ts`, `translation.ts` |
| `/src/store/` | Armazenamento de estado (Zustand). | `usePlayerStore.ts`, `useCombatStore.ts` |
| `/src/hooks/` | *Glue Code* (Liga UI ao Core e Stores). | `useCombatLogic.ts`, `useGameEffects.ts` |
| `/src/pages/` | Orquestração de grandes blocos de UI (Cenas). | `HubScene.tsx`, `CombatScene.tsx` |
| `/src/components/`| Blocos visuais "burros" e reativos. | `ForgePanel.tsx`, `TTSButton.tsx` |

---

## 3. Gerenciamento de Estado (Zustand)

O projeto abandonou a *Context API* devido a problemas de performance e adotou o **Zustand** fatiado. O estado não é um monolito; ele é dividido em múltiplos gomos (Stores) para evitar re-renderizações desnecessárias durante o loop acelerado de combate.

1.  `usePlayerStore`: É a **Fonte da Verdade Permanente**. Guarda HP, Nível, Inventário, Conquistas e Skills. É o único estado diretamente serializado no `localStorage`.
2.  `useCombatStore`: Guarda o **Estado Volátil da Batalha**. Quem ataca quem, HP do monstro, popups de dano, status de enfurecimento (enrage). É resetado entre incursões.
3.  `useExplorationStore`: Controla o **Loop de Dive**. Qual andar o jogador está, eventos ativos, *puzzles* em andamento e relatórios do *log* de exploração.
4.  `useGameUIStore`: Controla o **Fluxo de Telas**. Roteamento de cenas (Hub, Main Menu, Combat), abas ativas e caixas de diálogo narrativas.

---

## 4. Roteamento e Orquestração (`App.tsx`)

O `App.tsx` funciona como o grande Maestro (Orquestrador) e Roteador central do sistema.
Atualmente, o projeto não usa bibliotecas pesadas de roteamento (como `react-router`), pois o jogo é conceitualmente um fluxo linear de telas interligadas.

A navegação é feita via Renderização Condicional baseada na variável de estado `scene` (do `useGameUIStore`).

**Fluxo de Cenas Existentes:**
`main_menu` ➔ `character_creation` ➔ `intro` ➔ `hub` ⮂ (`env_intro` ➔ `combat` \| `event` \| `puzzle`) ➔ `timeline_closure` (Reset Quântico).

> ⚠️ *Nota Arquitetural:* O `App.tsx` também centraliza os Custom Hooks primários (como `useExploration` e `useCombatLogic`), injetando funções fundamentais via *props* para as *Scenes* (como o `HubScene`). 

---

## 5. Fluxo de Dados Bidirecional (Data Flow)

A arquitetura aplica um padrão rigoroso para evitar *God Objects*. Quando o jogador toma uma ação, o fluxo de dados segue a seguinte hierarquia:

1.  **Ação na UI:** Jogador clica em "Atacar" em um componente filho (ex: botão de skill dentro de `CombatScene`).
2.  **Interceptação no Hook:** O evento dispara um método no Hook aglutinador (ex: `handleCombatAction` em `useCombatLogic.ts`).
3.  **Processamento no Core:** O Hook lê os dados da Store (`player`, `combatState`), chama as funções matemáticas de `/core/engine/combat.ts` para calcular dano e RNG (esquiva, crítico).
4.  **Mutação de Estado:** O Hook invoca o `setPlayer` e `setCombatState` nas Stores (Zustand).
5.  **Re-render Reativo:** O Zustand notifica os componentes inscritos, que se atualizam com as novas barras de HP e enviam um *Damage Popup*.

---

## 6. Subsistemas Chaves (Arquiteturas Isoladas)

### 6.1. Sistema de Audio e Acessibilidade (TTS Engine)
Isolado em `core/engine/tts.ts`, o sistema de Text-to-Speech usa o padrão *Observer*. Componentes React como `TTSButton` e `SystemVoiceSelector` inscrevem-se no *engine* e recebem atualizações de estado (qual voz está falando) sem precisarem poluir o React com *timers* de áudio, permitindo um narrador responsivo que não bloqueia o loop da aplicação.

### 6.2. Persistência (Save Engine)
As rotinas de salvamento operam em `core/engine/saveGame.ts`. O armazenamento é feito via `localStorage`.
A arquitetura implementa rotinas defensivas de `fallback`. Se o objeto do Player carregado não tiver propriedades novas (ex: um atributo `relics` introduzido numa patch recente), o motor injeta os valores padrão para prevenir corrupção (Null-safety logic).

### 6.3. Tradução Dinâmica (i18n Padrão)
A localização não depende de bibliotecas externas complexas. A lógica opera em `core/engine/translation.ts` interceptando strings, aliada a um hook funcional `useTranslation` que força a re-renderização baseada no evento de alteração da língua atual (`pt-BR`, `en-US`), suportando o mapeamento de terminologia cyberpunk via regex (ex: descrição variante de Nível 70/100).

## Combat Engine
The combat engine is structured to be purely functional and strictly separated from the presentation layer:
- **Pure Functions**: Uses deterministic updates where state is immutable per turn.
- **CombatTurnBuilder**: Encapsulates all state modifications through explicit domain methods.
- **Semantic Events**: The engine emits specific typed `CombatEvent`s (e.g. `DAMAGE_APPLIED`, `FLEE_ATTEMPT`) rather than generic string logs or presentation data.
- **LogFormatter**: Parses semantic `CombatEvent`s into human-readable text logs for the UI.
- **Queue Runner**: A `useCombatQueueRunner` React hook iterates through events progressively to animate the UI, completely insulated from logic panics by a `try/finally` structure.
