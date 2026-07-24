# Nova Arquitetura do App.tsx

## Responsabilidades Atuais
O arquivo `App.tsx` concentra as seguintes responsabilidades:
1. **Roteamento de Cenas (Scene Management):** Controle de qual tela renderizar (`main_menu`, `hub`, `combat`, etc).
2. **Estado Global (State Management):** `player`, `toasts`, `inventoryMessage`, estados de configurações.
3. **Lógica de Domínio:** Funções gigantes como `handleStartDive`, `handleCombatAction`, `handleEventOption`, crafting, equipamentos.
4. **Áudio e Efeitos:** Disparo de SFX, gerenciamento de BGM, popups de dano, flash na tela.
5. **Renderização de UI:** Estruturas complexas em linha para cada cena.

## Nova Estrutura de Diretórios
```
src/
 ├── App.tsx (Entrada principal, apenas provedores e roteamento)
 ├── store/
 │    └── GameContext.tsx (Estado global: player, scene, configurações, métodos de save)
 ├── hooks/
 │    ├── useAudioFX.ts (Gerencia efeitos e BGM com base nas mudanças de estado)
 │    ├── useCombat.ts (Lógica de handleCombatAction e popups)
 │    ├── useInventory.ts (Equip, unequip, sell, dismantle)
 │    ├── useEvents.ts (Lógica de processamento de eventos e puzzles)
 │    └── useToasts.ts (Sistema de notificações)
 ├── layouts/
 │    └── MainLayout.tsx (Wrapper que contém Toasts, Efeitos Globais e Header/Footer se houver)
 ├── pages/
 │    ├── MainMenu/
 │    ├── Hub/
 │    ├── Combat/
 │    ├── Event/
 │    ├── Puzzle/
 │    └── ... (outras cenas)
 └── components/
      └── ui/ (Componentes de UI genéricos)
```

## Dependências e Fluxo de Dados
- **GameContext** será o provedor global do `player` e da função `setPlayer`.
- As **Pages** (ex: `CombatPage`) consumirão o `GameContext` e usarão hooks específicos (ex: `useCombat`) para as regras de negócio de sua cena.
- **Hooks** separarão a lógica complexa (como `handleStartDive` em `useExploration`).
- O **App.tsx** terá menos de 250 linhas, focando no `GameProvider`, `MainLayout` e um `SceneRouter` (um `switch/case` retornando a `Page` correta).

Avançarei para a extração do roteador de cenas em componentes individuais (Passo 1).
