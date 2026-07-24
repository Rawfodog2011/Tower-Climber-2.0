# 🚧 Registro de Dívida Técnica (Tech Debt): Tower Climber

Este documento atua como o registro oficial de todas as dívidas técnicas aceitas, riscos arquiteturais e manutenções pendentes no projeto **Tower Climber**. O gerenciamento rigoroso deste documento garante que a equipe de engenharia tenha total visibilidade sobre as fragilidades estruturais antes que elas se tornem gargalos intransponíveis.

---

## 1. Diretrizes para Registro de Novas Dívidas Técnicas

A dívida técnica nem sempre é ruim; muitas vezes é um empréstimo necessário para testar uma mecânica de gameplay rapidamente (ex: testar o *Auto-Farm* sem precisar reescrever todo o loop assíncrono). No entanto, o empréstimo deve ser documentado.

Sempre que um desenvolvedor optar por uma solução sub-ótima em prol de velocidade, deve adicionar uma entrada na tabela de "Backlog Técnico" contendo:

1.  **ID e Módulo:** Identificador sequencial e a área afetada (ex: `TD-005: Combate`).
2.  **Contexto/Problema:** O que foi feito e por que é uma dívida.
3.  **Impacto/Risco:** O que pode dar errado se não for pago (ex: lentidão no late-game, bugs de duplicação de itens).
4.  **Solução Proposta:** A arquitetura correta que resolverá o problema.
5.  **Prioridade:** `CRÍTICA`, `ALTA`, `MÉDIA`, ou `BAIXA`.

---

## 2. Riscos Conhecidos (Known Risks)

Estes são os principais calcanhares de Aquiles da base de código atual que requerem atenção contínua dos desenvolvedores:

*   **Vazamento de Memória no Auto-Farm:** O loop de auto-combate aciona dezenas de eventos por segundo (atualização de HP, *Damage Popups*, logs de combate). Como a UI está fortemente acoplada a essas atualizações, sessões longas de Auto-Farm (ex: deixar o jogo rodando por 12 horas) podem saturar a memória do navegador se a limpeza de nós DOM (como os *Toasts* e *Popups*) falhar.
*   **[RESOLVIDO] Re-Renders em Cascata:** O componente `App.tsx` foi refatorado para um Router puro. O problema foi sanado com o desacoplamento de estado e migração completa dos Hooks para consumir o Zustand diretamente.

---

## 3. Backlog Técnico e Prioridades

### 🛑 Dívidas Pagas Recentemente (Histórico de Sucesso)
*   **[PAGO] TD-001: God Component (App.tsx):** O App.tsx foi desmembrado com sucesso na Sprint de Desacoplamento. Todos os Hooks e Scenes agora utilizam Zustand independentemente. O prop drilling foi eliminado da arquitetura principal.


| ID | Módulo | Contexto e Problema | Impacto e Risco | Solução Proposta | Prioridade |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TD-001** | Orquestração UI (`App.tsx`) | O arquivo `App.tsx` atua como um *God Component*, contendo lógicas mistas de roteamento, *refs* de timers do combate e gerenciamento pesado de efeitos globais (`useGameEffects`). | Manutenção dolorosa, conflitos frequentes de *merge*, re-renderizações desnecessárias do App inteiro. | Extrair a lógica de roteamento para um gerenciador de cenas dedicado. Mover efeitos do loop principal para dentro de Stores ou Web Workers. | **ALTA** |
| **TD-002** | Engine de Combate | O loop de combate (Pulso) e os *timers* estão operando dentro da thread principal do React (em `useCombatLogic`). | Se a aba do navegador perder o foco (background), os *timers* de combate e Auto-Farm param ou dessincronizam fortemente. | Mover a lógica de tempo e cálculo de combate estritamente para um *Web Worker* (desacoplando do ciclo de vida do React). | **CRÍTICA** |
| **TD-004** | Damage Popups | A lógica de partículas de dano gera um elemento novo na árvore React (DOM) a cada *hit*. Em builds focadas em *Speed* ou *DoT* (Damage over Time), a UI engasga. | Queda massiva de FPS no *late-game* (Andares 30+). | Migrar os efeitos efêmeros de combate (números subindo) para um elemento genérico usando HTML Canvas em vez de dezenas de `<div>` injetadas no React. | **MÉDIA** |
| **TD-005** | Dicionários de Dados | *Hardcoding* residual. Existem alguns ícones, descrições ou lógicas de drop embutidos nos componentes visuais (ex: cores de itens mágicos escritas no JSX). | Dificuldade em balancear a economia e inconsistência visual. | Mover todas as definições visuais absolutas para metadados em `core/entities/`. Os componentes só devem aplicar estilos mapeados. | **BAIXA** |

---

## 4. Melhorias Futuras (Arquitetura de Longo Prazo)

À medida que o jogo se expande, certas mudanças estruturais precisarão ser planejadas em *Epics* dedicadas, embora não sejam urgentes no momento:

1.  **Migração para IndexedDB (via Dexie.js ou similar):**
    O uso atual de `localStorage` possui um limite estrito de 5MB. Quando o jogo começar a salvar o histórico longo de exploração (Memórias, Códices complexos, Histórico de Runs de Auto-Farm extensas), vamos esgotar esse limite. Planejar a migração de persistência para o `IndexedDB` assíncrono.

2.  **Sistema de Modding / Serialização Pura:**
    Modificar a leitura das entidades de combate para que possam ser injetadas externamente. Se conseguirmos separar perfeitamente os dados lógicos do motor React, abrimos caminho para suportar modificações da comunidade (arquivos `.json` externos introduzindo novos itens e inimigos na Torre).

3.  **Localização (i18n) Escalável:**
    O módulo de tradução atual `core/engine/translation.ts` funciona bem para PT-BR/EN básicos, mas utiliza detecções via Regex (ex: matchings de descrição Nível 70). Isso não escalará. Será necessário adotar uma biblioteca robusta como `i18next` com chaves JSON estritas.

### Combat State Machine (V3)
- Evolve the combat engine completely into a State Machine.
- Implement Interrupts, Perfect Timing, and Counter Attacks logic.
