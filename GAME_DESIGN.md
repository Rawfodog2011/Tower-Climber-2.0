# 🎮 Game Design Document (GDD): Tower Climber

## 1. Visão do Jogo

**Tower Climber** é um RPG Incremental de temática Cyberpunk/Sci-Fi focado em mecânicas profundas de progressão e automação tática. O jogador assume o papel de uma entidade cibernética (um Nômade do Silício, Ciborgue Foragido, etc.) escalando uma megaestrutura opressiva conhecida como "A Torre" (ou O Pináculo). O jogo funde a gratificação contínua dos jogos idle/incrementais com a densidade tática de RPGs clássicos, permitindo que o jogador gerencie ativamente sua build e automatize a execução do combate e coleta de recursos.

## 2. Pilares do Gameplay

1.  **Progressão em Múltiplas Camadas:** O avanço nunca para em um único eixo. O jogador progride através de Níveis, Evolução de Classes (Matriz de Habilidades), Forja de Equipamentos, Instalação de Módulos (Chips), Relíquias e Adaptações Genéticas/Cibernéticas.
2.  **Automação Programável:** A transição do microgerenciamento ativo para a automação tática (Auto-Battle e Auto-Farm via regras condicionais lógicas) é uma recompensa central, respeitando o tempo do jogador.
3.  **Temática Sombria e Criptográfica:** Toda interface, descrição de item e fragmento de memória reforça a narrativa de um sistema corrompido, distópico e mecânico. O *lore* é descoberto, não entregue gratuitamente.
4.  **Agência na Customização (Buildcrafting):** Não existe apenas "uma arma melhor". As escolhas de classes, *sockets* de equipamento e relíquias devem oferecer sinergias únicas (ex: builds de evasão, dano bruto, dano por tempo, resiliência).

## 3. Loop Principal (Core Loop)

O fluxo de engajamento do jogador se divide nas seguintes etapas cíclicas:

1.  **Preparação (The Hub):** Gerenciamento de inventário, forja de equipamentos, soldagem de circuitos, alocação de atributos e evolução de classes.
2.  **Incursão (The Dive):** Seleção de um andar da Torre para exploração.
3.  **Resolução de Conflitos:** Enfrentar inimigos em combates em turnos, resolver quebra-cabeças técnicos (Puzzles) e interagir com anomalias/eventos narrativos.
4.  **Extração de Recursos:** Obtenção de Ouro, Materiais de Forja, Fragmentos de Memória e Equipamentos.
5.  **Reinvestimento:** Retorno ao Hub para aplicar as recompensas obtidas, fortalecendo a entidade para andares mais profundos e perigosos.

## 4. Combate

O combate é projetado para ser numérico, rápido e pautado por turnos assíncronos baseados em Velocidade de Pulso (SPD).

*   **Status Principais:** HP (Integridade), EP (Energia de Rede), ATK (Poder de Ataque), DEF (Defesa Integrada), SPD (Velocidade de Pulso).
*   **Habilidades:** Determinadas pelas classes e origens. Possuem tempos de recarga (cooldowns) e custos de EP.
*   **Lógica do Auto-Combate:** Módulo programável onde o jogador define regras (Ex: `SE HP < 50% ENTÃO Usar Cura`) para automatizar ações táticas sem perder eficiência.

## 5. Exploração e Torre

A Torre é estruturada em **Andares (Floors)** escalonáveis em dificuldade.

*   **Nós de Exploração:** Cada incursão avança por uma porcentagem até o chefe do andar.
*   **Eventos (EventNodes):** Decisões narrativas de texto que podem conceder buffs temporários, itens raros ou punições.
*   **Puzzles (Quebra-cabeças):** Desafios lógicos (ex: alinhar Frequência de Vibração e Temperatura para abrir portas blindadas). Ignorá-los acelera a run mas sacrifica loot.

## 6. Economia do Jogo

A economia é estritamente isolada e balanceada (sem mecânicas predatórias do mundo real).

| Recurso | Função Principal | Obtenção |
| :--- | :--- | :--- |
| **Ouro (Créditos)** | Compra de consumíveis no Mercado Negro, taxas de forja e evolução. | Drops de inimigos, venda de itens, contratos. |
| **Sucata / Materiais** | Crafting de itens na Forja e Upgrades de Relíquias. | Desmanche de equipamentos (Dismantle), drops. |
| **Módulos / Chips** | Inseridos em Sockets de equipamentos para bônus de status específicos. | Exploração avançada, eventos raros, fusão de chips. |
| **Pontos Quânticos** | Moeda de Prestígio (Reset). | Resetar a run mantendo melhorias permanentes. |

## 7. Progressão e Classes

O sistema de classes simula a reescrita do código fonte do protagonista.
*   **Origem:** Definida na criação do personagem, concede modificadores base e uma habilidade inerente (Ativa ou Passiva).
*   **Evolução Matriz:** A progressão segue uma árvore ramificada.
*   **Especialização (Nível 70):** O jogador escolhe entre ramificações táticas (Ex: Variante *Alfa* para dano/agressão ou *Beta* para resiliência/suporte).
*   **Ascensão (Nível 100):** Sincronização neural plena com a Torre, desbloqueando capacidades de *Endgame*.

## 8. Equipamentos e Forja

O *loot* é procedural e central para a satisfação do jogador.
*   **Raridades:** Comum (Branco) -> Incomum (Verde) -> Raro (Azul) -> Épico (Roxo) -> Lendário (Dourado) -> Exótico (Vermelho).
*   **Sistema de Sockets:** Equipamentos de maior raridade possuem "Sockets" onde *Chips de Memória/Circuitos* podem ser instalados para customizar os atributos.
*   **Desmanche (Dismantle):** Transforma lixo orgânico/metálico indesejado em materiais úteis de progressão.

## 9. Inspirações e Referências (Benchmarking)

*   **Melvor Idle / Antimatter Dimensions:** Para a filosofia de progressão infinita, sistemas de *Prestige* e automação gratificante.
*   **Cyberpunk 2077 / Ghost in the Shell:** Direção de arte, nomenclatura de UI (Terminais, Neuro-links, Matrizes), e foco em trans-humanismo e degradação cibernética.
*   **Slay the Spire / Darkest Dungeon:** Para o modelo de exploração por "nós", eventos textuais imprevisíveis e a atmosfera punitiva.
*   **Diablo / Path of Exile:** Para a estrutura viciante do *loot*, cores de raridade e o sistema engenhoso de *Sockets* e *Gems* (Chips).

## 10. Mecânicas Proibidas (Anti-Patterns)

Para manter a integridade do design, a equipe de engenharia e game design **NÃO DEVE NUNCA** implementar:

1.  **Microtransações ou P2W:** A progressão deve ser alcançada através do tempo jogado e da otimização tática.
2.  **Ação em Tempo Real / Reflexos:** O jogo deve permanecer 100% tático, baseado em UI, turnos e decisões de gerenciamento. Nenhuma mecânica de desvio de projéteis ou *Quick Time Events* de reflexo motor.
3.  **Grind Manual Obrigatório Permanente:** O jogador *deve* receber ferramentas para automatizar tarefas repetitivas (Auto-Farm) após provar que as domina manualmente. Punir o jogador com cliques infinitos é falha de design.
4.  **Navegação 3D ou Espacial Complexa:** A imersão vem da abstração dos terminais, sons e textos. Renderização de mapas 3D ou locomoção por *joystick* estão fora de escopo.

## 11. Objetivos Futuros (Backlog de Design)

*   **Sistema de Contratos (Bounties):** Missões diárias geradas proceduralmente para abater alvos específicos com modificadores perigosos.
*   **Expansão do Quantum Prestige:** Implementar bônus persistentes e mutadores de mundo real que alterem as regras da Torre após um "reset" completo da Matrix.
*   **Integração Profunda de Lore (Memory Fragments):** Conectar os fragmentos de memória desbloqueáveis com bônus passivos ocultos, encorajando os jogadores a ler e colecionar o *codex* inteiro.
