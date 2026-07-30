# Arquitetura e Estrutura de Estado: Tower Climber

## Arquitetura Atual
O `App.tsx` atua estritamente como um roteador e orquestrador de cenas limpo (~100 linhas). O gerenciamento de estado global foi migrado da antiga proposta de Context API para **Zustand fatiado por domínios**, evitando re-renders em cascata e prop drilling.

## Estrutura de Diretórios
```
src/
 ├── App.tsx (Roteador de cenas e orquestrador principal)
 ├── store/ (Zustand Stores fatiadas)
 │    ├── usePlayerStore.ts (HP, XP, Atributos, Inventário, Persistência Local)
 │    ├── useCombatStore.ts (Estado volátil de batalha, HP do monstro, Popups)
 │    ├── useExplorationStore.ts (Avanço na Torre, Andar, Puzzles, Eventos)
 │    └── useGameUIStore.ts (Cena ativa, Modais, Abas da UI)
 ├── hooks/
 │    ├── useCombatLogic.ts (Execução e loop de combate)
 │    ├── useGameEffects.ts (Efeitos visuais e audio globais)
 │    ├── useToasts.ts (Sistema de notificações)
 │    └── ... (outros hooks desacoplados)
 ├── pages/ (Cenas do jogo: HubScene, CombatScene, MainMenuScene, etc.)
 ├── components/ (Componentes visuais e painéis modulares)
 └── core/
      ├── engine/ (Regras de negócio, cálculo de dano, salvamento, i18n)
      └── entities/ (Metadados e dicionários estáticos do jogo)
```

## Fluxo de Dados e Estado (Zustand)
- **Stores Independentes**: Cada store gerencia seu próprio domínio e pode ser consumida diretamente por qualquer componente ou hook sem necessitar de React Context.
- **Hooks Desacoplados**: Os custom hooks agem como *glue code*, consumindo as stores necessárias e invocando as funções puras de `/core/engine/`.
- **Roteamento Leve**: `App.tsx` consulta `useGameUIStore((state) => state.scene)` para realizar renderização condicional da página apropriada.

