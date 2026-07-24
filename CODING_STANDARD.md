# 💻 Padrões de Codificação (Coding Standard): Tower Climber

Este documento define as regras absolutas de engenharia de software para o desenvolvimento de **Tower Climber**. Todos os engenheiros devem seguir estas diretrizes para garantir que a base de código permaneça escalável, legível e livre de dívida técnica crônica ao longo dos anos.

---

## 1. Estrutura de Pastas e Arquitetura de Módulos

A organização do projeto segue uma divisão estrita entre Interface (UI), Estado Global (Stores) e Regras de Negócio (Core Engine).

```text
src/
├── components/      # Componentes React reutilizáveis de UI (ex: Botões, Paineis, Modais). Devem ser o mais "burros" (puros) possível.
├── pages/           # Cenas principais do jogo que orquestram componentes menores (ex: HubScene, CombatScene, EnvIntroScene).
├── hooks/           # Custom hooks do React para agrupar lógica de interface e orquestrar side-effects (ex: useCombatLogic, useInventory).
├── store/           # Gerenciamento de Estado Global utilizando Zustand, divididos por domínio (ex: usePlayerStore, useCombatStore).
├── core/            # Coração do Jogo (Independente de UI)
│   ├── engine/      # Lógica de negócio, cálculos, algoritmos (ex: combat.ts, saveGame.ts, translation.ts).
│   └── entities/    # Dicionários de dados estáticos e tipagens essenciais (ex: items.ts, skills.ts, origins.ts).
├── types.ts         # Tipagens e Interfaces globais transversais do domínio.
└── App.tsx          # Ponto de entrada (Entrypoint), gerenciador de roteamento de cenas e provedor de efeitos globais.
```

---

## 2. Regras de Nomenclatura (Naming Conventions)

Nomes devem ser descritivos, claros e não abreviados (exceto em casos universalmente aceitos, como `id`, `max`, `min`).

*   **Componentes React, Interfaces e Classes:** `PascalCase`. 
    *   *Ex:* `PlayerProfilePanel`, `CombatState`, `ItemRecord`.
*   **Variáveis, Funções, Hooks e Métodos:** `camelCase`. 
    *   *Ex:* `handleCombatAction`, `useInventory`, `calculatePlayerStats`.
*   **Constantes Globais, Enums e Dicionários de Dados:** `UPPER_SNAKE_CASE`. 
    *   *Ex:* `SKILLS_DATABASE`, `MAX_INVENTORY_SLOTS`, `STORAGE_KEYS`.
*   **Arquivos TypeScript/React:** 
    *   Componentes UI (`.tsx`): `PascalCase.tsx` (ex: `MainMenu.tsx`).
    *   Módulos utilitários, lógicos e hooks (`.ts`/`.tsx`): `camelCase.ts` (ex: `useCombatLogic.ts`, `combat.ts`).
*   **Tratamento de Eventos (Event Handlers):** Funções que respondem a ações de UI devem sempre começar com `handle`. Propriedades de callback passadas para componentes devem começar com `on`.
    *   *Ex:* `<Button onClick={handleEquipItem} />` ou `function MyComponent({ onComplete }) { ... }`

---

## 3. Padrões TypeScript (Tipagem Estrita)

*   **Proibição do `any`:** O uso explícito de `any` é considerado um defeito de código severo. Se um tipo for genuinamente dinâmico, utilize `unknown` e faça *Type Narrowing*.
*   **Interfaces sobre Tipos:** Dê preferência a `interface` para objetos de domínio por causa da melhor performance do compilador do TypeScript e extensibilidade. Use `type` apenas para uniões complexas (`Unions`), tuplas ou funções.
*   **Tipagem de Retorno:** Funções complexas de lógica de negócio em `core/engine/` devem ter tipagem de retorno explícita (ex: `function calculateDamage(...): number { ... }`).
*   **Optional Chaining Seguro:** Use `?.` e Nullish Coalescing `??` no lugar de verificações manuais longas (ex: `const dmg = attack?.baseDamage ?? 0;`).

---

## 4. Organização das Stores (Zustand)

O estado global via Zustand substitui hierarquias profundas de Context API e prop drilling massivo.

*   **Fatiamento de Domínio (Slicing):** Não crie uma única mega-store. O estado deve ser fatiado. O estado atual possui `usePlayerStore` (dados persistentes do jogador), `useCombatStore` (estado efêmero da batalha), `useExplorationStore` e `useGameUIStore`.
*   **Separação de Ações e Estado:** Prefira incluir as funções de mutação (ações) dentro da própria definição da store (quando simples) ou exportar mutadores independentes.
*   **Não polua o Zustand com Lógica de Negócio Pesada:** As funções dentro da store devem focar na mutação do estado (`set()`). A matemática pesada de RPG deve vir importada da pasta `core/engine/`.

---

## 5. Padrões React

*   **Componentes Funcionais Estritos:** Componentes de Classe são terminantemente proibidos.
*   **Desestruturação de Props:** Sempre desestruture as `props` diretamente na assinatura da função. 
    *   *Certo:* `const MyComponent = ({ player, onAction }) => { ... }`
*   **UseMemo e UseCallback:** Utilize apenas onde for estritamente necessário (cálculos matemáticos complexos como `calculatePlayerStats` ou passagem de funções para componentes fortemente renderizados). Otimização prematura é anti-padrão.
*   **Não Misture Lógica de Jogo com UI:** Um componente React como `ForgePanel` não deve saber calcular as chances de forja. O cálculo fica em `core/engine/crafting.ts`, a UI apenas exibe os resultados e dispara a ação.

---

## 6. Regras de Performance

1.  **Vazamento de Referência de Objetos:** Em componentes que sofrem re-renderizações rápidas (como o painel de combate rodando no Auto-Battle), nunca passe objetos inline não memoizados em props (`style={{ margin: 10 }}`). Utilize o Tailwind.
2.  **Lógica Pesada Fora do Render Cycle:** Loops complexos (ex: calcular buffs de todo o inventário, iterar matrizes de habilidade) nunca devem ocorrer soltos no corpo de um componente. Eles devem estar envoltos em `useMemo` ou calculados apenas na hora do disparo da ação (onClick).
3.  **Gerenciamento de Arrays no useEffect:** Se um `useEffect` é ativado muitas vezes acidentalmente, há um bug. Use referências numéricas/primitivas no array de dependências em vez de passar um objeto completo (`player.hp` no lugar de `player`).

---

## 7. Regras de Refatoração (Boy Scout Rule)

*   **Componentes Gigantes:** Qualquer arquivo React (exceção clara para o `App.tsx` que roteia cenas, ou cenas globais enormes consolidadas) que ultrapasse ~400-500 linhas está violando a coesão. Extraia sub-componentes ou mova lógica de manipulação de estado para Custom Hooks na pasta `hooks/`.
*   **Deixe mais limpo do que encontrou:** Ao editar um arquivo para resolver uma *Issue* ou adicionar uma funcionalidade, dedique 10 minutos para limpar importações mortas, tipar variáveis fracamente tipadas ou remover lixo residual na área onde você já está mexendo.
*   **Cuidado com Props Drilling:** Se você está passando a prop `player` ou `setPlayer` por 3 níveis ou mais de profundidade de componentes de apresentação genéricos, interrompa a refatoração e conecte o componente profundo diretamente à `usePlayerStore`.
