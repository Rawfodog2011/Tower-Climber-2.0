# 📜 Development Constitution: Tower Climber

## 1. Filosofia de Desenvolvimento e Hierarquia Documental

Como equipe de desenvolvimento do **Tower Climber**, nossa missão é criar um RPG incremental imersivo, focado em progressão profunda e sistemas interligados.

### Hierarquia de Documentação (Order of Precedence)
Caso haja qualquer conflito, redundância ou inconsistência de informações entre os documentos oficiais, a seguinte ordem de precedência deve ser respeitada permanentemente para a tomada de decisões:

1. **DEVELOPMENT_CONSTITUTION.md** (Regras absolutas e filosofia)
2. **GAME_DESIGN.md** (Visão, pilares e regras de negócio)
3. **ARCHITECTURE.md** (Estrutura técnica e fluxo de dados)
4. **CODING_STANDARD.md** (Regras de sintaxe e padrões de código)
5. **REVIEW_CHECKLIST.md** (Critérios de aprovação e qualidade)
6. **TECH_DEBT.md** (Dívidas mapeadas e riscos)
7. **CHANGELOG.md** (Histórico de alterações)

*Nenhuma funcionalidade deve ser implementada se contradisser qualquer documento acima. A documentação deve sempre ser mantida sincronizada com o código.*

### Princípios Base
*   **Legibilidade Acima de Esperteza:** O código deve ser escrito para o próximo desenvolvedor (ou para você mesmo no futuro). Soluções claras e óbvias são sempre preferíveis a abstrações excessivamente complexas ou "código inteligente".
*   **Débito Técnico Consciente:** Escolhemos a solução com o menor débito técnico possível. Quando um atalho for necessário, o débito deve ser isolado, documentado e ter um plano claro para resolução.
*   **Progressão Incremental Sustentável:** O jogo crescerá através de sistemas modulares. Nenhuma feature deve quebrar a fundação existente. Grandes refatorações devem ser divididas em etapas verificáveis.
*   **Respeito pelo Tempo do Jogador:** A performance e a estabilidade não são recursos opcionais. O loop de gameplay deve ser fluído e responsivo em todos os momentos.

## 2. Princípios de Arquitetura

*   **Separação de Preocupações (Separation of Concerns):** A lógica de negócios (core engine), o estado do jogo (stores) e a apresentação (componentes UI) devem permanecer estritamente separados. 
*   **Estado Centralizado Previsível:** O estado global do jogo deve ser gerenciado de forma previsível (usando Zustand), com mutações isoladas e rastreáveis.
*   **Design Orientado a Dados (Data-Driven Design):** Entidades como itens, habilidades, classes e inimigos devem ser definidas em estruturas de dados estáticas (Data Dictionaries/Registries) e nunca hardcoded dentro da lógica de apresentação.
*   **Composição sobre Herança:** Sistemas do jogo devem ser construídos através de composição de regras e propriedades, garantindo flexibilidade na criação de novo conteúdo (ex: modificadores de status, passivas).

## 3. Processo de Desenvolvimento

1.  **Planejamento:** Nenhuma linha de código deve ser escrita sem um plano claro que entenda os trade-offs e identifique riscos.
2.  **Execução em Pequenos Lotes:** Grandes tarefas devem ser divididas em pequenos incrementos lógicos e verificáveis.
3.  **Verificação Contínua:** Após cada etapa lógica, o projeto deve compilar e o loop principal deve ser validado para evitar regressões.
4.  **Isolamento de Erros:** Se uma regressão for detectada, o desenvolvimento de novas features para imediatamente até que a regressão seja corrigida.
5.  **Revisão (Self-Review):** Antes de considerar uma funcionalidade pronta, o desenvolvedor deve revisar o próprio código contra o `REVIEW_CHECKLIST.md`.

## 4. Definition of Done (DoD)

Uma funcionalidade, classe ou sistema só é considerado "Pronto" quando:

*   [ ] O código implementa o escopo planejado sem introduzir complexidade desnecessária.
*   [ ] O código passou por uma revisão interna focada em legibilidade e manutenibilidade.
*   [ ] Nenhuma regressão foi introduzida no loop principal (Exploração, Combate, Inventário).
*   [ ] O estado do jogo é salvo e carregado corretamente (persistência validada se aplicável).
*   [ ] Se introduziu um débito técnico justificado, ele foi documentado no `TECH_DEBT.md`.
*   [ ] A aplicação compila sem erros (TypeScript strict mode respeitado).
*   [ ] Os warnings do Linter foram analisados e resolvidos (ou suprimidos com justificativa em comentário).
*   [ ] A interface está responsiva e respeita os padrões visuais (Tailwind).

## 5. Regras Permanentes de Engenharia

*   **Proibido *God Objects*:** Arquivos ou componentes que acumulam múltiplas responsabilidades (ex: um componente que gerencia combate, inventário e salva o jogo simultaneamente) devem ser refatorados imediatamente.
*   **Imutabilidade do Estado:** O estado (React state ou Zustand) nunca deve ser mutado diretamente. Sempre utilize abordagens funcionais (ex: spread operator, immer).
*   **Tratamento Explícito de Erros:** Exceções não devem ser engolidas silenciosamente. Erros críticos devem degradar graciosamente a experiência e informar o estado corrompido de forma adequada.
*   **Tipagem Forte:** O uso de `any` no TypeScript é estritamente proibido em novos códigos. Tipos genéricos, interfaces e enums devem ser usados para modelar domínios complexos.

## 6. Critérios de Qualidade

*   **Resiliência a Longo Prazo:** O código deve estar pronto para suportar 10x mais conteúdo sem exigir reescritas na fundação.
*   **Performance:** Modificações na UI ou no loop de combate não podem causar vazamento de memória ou re-renderizações infinitas (cuidado especial com arrays de dependência em `useEffect`).
*   **Experiência do Usuário (UX):** Interações comuns devem exigir o mínimo de cliques. O feedback visual (toast, animações) deve ser imediato para ações importantes.
*   **Consistência Temática:** O texto, nomenclatura de variáveis de domínio e mensagens do sistema devem manter a imersão na temática cyberpunk/sci-fi do jogo.
