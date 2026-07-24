# ✔️ Review Checklist & Quality Gate: Tower Climber

Este documento atua como o principal **Quality Gate** do projeto. Ele estabelece os critérios absolutos para a aprovação de Pull Requests (PRs) e o fechamento de Sprints no desenvolvimento do **Tower Climber**. Nenhuma funcionalidade deve ser fundida à *branch* principal sem passar rigorosamente por esta checklist.

---

## 1. Checklist de Encerramento de Sprint (Sprint Completion)

Antes de considerar qualquer Sprint como "Concluída", o Tech Lead e os desenvolvedores envolvidos devem garantir que:

- [ ] Todas as features planejadas foram implementadas e integradas.
- [ ] O sistema de Save/Load foi testado e nenhuma corrupção de estado (Save Incompatibility) foi introduzida.
- [ ] O Auto-Farm e o Auto-Battle foram testados por pelo menos 50 ciclos ininterruptos sem falhas ou vazamentos de memória.
- [ ] O `CHANGELOG.md` foi atualizado com todas as alterações, refatorações e impactos de gameplay.
- [ ] Novas dívidas técnicas (se houveram) foram devidamente registradas no `TECH_DEBT.md`.
- [ ] O build de produção (`npm run build`) compila com sucesso, sem erros de TypeScript (strict mode) ou avisos críticos do linter.

---

## 2. Critérios para Aprovação de Pull Requests (PRs)

O revisor do código (Code Reviewer) deve validar os seguintes pontos antes de aprovar qualquer PR:

### 2.1. Critérios de Arquitetura
- [ ] **Separação de Preocupações:** A lógica de RPG (cálculo de dano, chance de *crafting*, algoritmos de drop) está isolada em `core/engine/` e não misturada nos componentes React.
- [ ] **Data-Driven:** Novos itens, inimigos ou habilidades foram adicionados aos dicionários estáticos (`core/entities/`) em vez de estarem *hardcoded* na UI.
- [ ] **Mutação de Estado:** O estado global via Zustand (`store/`) foi modificado usando os padrões imutáveis recomendados. A reatividade do jogo não foi comprometida.
- [ ] **Coesão de Componentes:** Não foram criados "Componentes Deus" (God Components). Sub-componentes lógicos foram extraídos adequadamente.

### 2.2. Critérios de Performance
- [ ] **Renderizações Excessivas (Re-renders):** Componentes pesados (como o log de combate e o inventário) não estão re-renderizando a cada frame de pulso do jogo.
- [ ] **Eficiência do Loop de Combate:** A lógica assíncrona do combate baseado em Velocidade de Pulso (SPD) está otimizada. Não há arrays complexos sendo filtrados a cada centésimo de segundo sem necessidade (uso de `useMemo` adequado).
- [ ] **Timers e Limpeza:** Todo `setInterval` ou `setTimeout` iniciado em um `useEffect` (especialmente em modais de evento e efeitos de dano) possui uma função de limpeza (`clearTimeout` / `clearInterval`) no retorno.

### 2.3. Critérios de Gameplay
- [ ] **Robustez de Edge Cases:** O jogo lida corretamente com situações extremas (ex: HP chega a 0 exato, jogador tenta equipar item sem nível suficiente, limite máximo do inventário foi atingido).
- [ ] **Balanceamento Matemático:** Fórmulas introduzidas (ex: escalonamento de HP de monstros em andares profundos) não quebram o fluxo do jogo (nem muito fácil a ponto de tornar o Auto-Farm irrelevante, nem impossível).
- [ ] **Feedback do Combate:** Novas mecânicas de combate refletem adequadamente nos Logs de Combate e nos "Damage Popups", para que o jogador entenda o que está acontecendo matematicamente.

### 2.4. Critérios de Experiência do Usuário (UX) e UI
- [ ] **Estética Consistente:** A funcionalidade nova segue a paleta de cores, tipografia (fontes monoespaçadas para dados) e estilo visual Cyberpunk/Sci-Fi (Tons de Cyan, Slate, Red/Emerald neon) com Tailwind.
- [ ] **Acessibilidade de Interface:** O contraste entre os textos e os fundos escuros da Torre é legível. Ícones da `lucide-react` são utilizados para auxiliar a leitura rápida.
- [ ] **Feedback Tátil:** Botões interativos possuem estados de `hover`, `active` e `disabled` bem definidos. Ações críticas disparam *Toasts* (notificações) para avisar o jogador (ex: "Item forjado com sucesso").
- [ ] **Responsividade:** A interface se adapta corretamente em monitores *ultrawide*, desktops convencionais e telas menores, sem quebrar os painéis de *Hub* ou combate.

### 2.5. Critérios de Testes (QA Manual / Automatizado)
- [ ] **Teste de Incursão (Dive Test):** O desenvolvedor executou manualmente uma run completa (do Andar 1 ao 5) com as novas mudanças aplicadas.
- [ ] **Teste de Stress do Auto-Farm:** O "Auto-Battle" foi deixado ativado com as novas habilidades/inimigos presentes para garantir que a lógica condicional não trava o loop assíncrono.
- [ ] **Tratamento de Estado Corrompido:** Testes foram feitos simulando dados legados sendo carregados no formato novo, garantindo que variáveis inexistentes no save antigo tenham valores *fallback* consistentes.

### 2.6. Critérios de Documentação
- [ ] **Atualização do Game Design:** Se uma regra central mudou (ex: como a armadura reduz o dano), o `GAME_DESIGN.md` foi atualizado para refletir isso.
- [ ] **Comentários no Código:** Lógicas matemáticas densas ou integrações complexas (especialmente nas matrizes de evolução) possuem comentários claros explicando o *porquê* da escolha, e não apenas o *como*.
