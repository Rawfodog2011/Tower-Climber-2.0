# AUDIO_BIBLE // DIRETRIZES DE SÍNTESE PROCEDURAL DE ÁUDIO
*Guia de Referência Interna para Som, Trilha e Efeitos Sonoros via Tone.js*

Este documento serve como a bíblia técnica e conceitual para a arquitetura de áudio do Pináculo. Toda a sonorização do jogo deve ser gerada **proceduralmente em tempo real via síntese** utilizando a biblioteca **Tone.js**. É expressamente proibido o uso de arquivos de áudio externos (.mp3, .wav, samples) para garantir total controle analítico, consistência técnica e conformidade legal de propriedade intelectual.

---

## 1. Paleta Sonora por Facção
Ecoando a identidade visual tática estabelecida no terminal CRT e na paleta cromática do jogo (cyan, âmbar, laranja, roxo e verde), as facções e sistemas operacionais possuem timbres e texturas de síntese bem delineados:

### UI / Sistema Geral (Cyan de Alta Resolução)
* **Conceito:** Um terminal operacional confiável, robusto e de alta resposta.
* **Timbre:** Tons limpos, puros e focados. Uso predominante de osciladores de onda senoidal (*sine*) e triangular (*triangle*). Envelopes ADSR extremamente rápidos com ataque de 1ms e decaimento curto (50-100ms).
* **Textura:** Bips percussivos agudos, tons puros em intervalos de quarta ou quinta justa, sem distorção ou ruído. Passa uma sensação de segurança lógica e processamento perfeito.

### Kinetix / Combate Pesado (Laranja e Âmbar Industrial)
* **Conceito:** Maquinaria de impacto, fundições ruidosas e metalurgia pesada.
* **Timbre:** Sons extremamente graves, robustos e agressivos. Uso intenso de osciladores dente-de-serra (*sawtooth*) e ondas quadradas (*square*), enriquecidos com saturação e moduladores de anel (*ring modulation*).
* **Textura:** Zumbidos de sub-graves industriais, golpes de impacto metálico com decaimento longo e envelopes de filtro passa-baixa (*lowpass*) que simulam chapas hidráulicas batendo.

### AeroDynamics / Velocidade e Resposta Rápida (Cyan Claro e Vento Sônico)
* **Conceito:** Jatos pneumáticos, motores rotativos, voos de drones e resfriamento por ar.
* **Timbre:** Sons agudos, velozes e dinâmicos. Envelopes com *pitch bend* ascendentes e descendentes acentuados, e moduladores de frequência rápidos (LFO modulando a frequência do oscilador).
* **Textura:** "Whooshes" aerodinâmicos sintetizados através de ruído branco (*white noise*) passando por filtros passa-banda (*bandpass*) dinâmicos com alta ressonância (*Q* elevado).

### OmniCorp / Bio-Energia e Imunogel (Roxo e Verde Tóxico)
* **Conceito:** Replicação de nanites, fusão celular mutagênica e fluidos viscosos.
* **Timbre:** Modulação de frequência complexa (Síntese FM) que cria timbres metálicos não-harmônicos e oscilantes. Modulações de LFO lentas nos filtros para dar a sensação de gotejamento ou respiração biológica.
* **Textura:** Sintetizadores com timbre "líquido", *phasers* lentos integrados à cadeia de efeitos e envelopes de ataque macio (soft-attack) com curvas exponenciais de crescimento.

### Erro, Perigo e Dano Crítico (Vermelho Pulsante)
* **Conceito:** Falha catastrófica de hardware, curtos-circuitos e rachaduras de blindagem.
* **Timbre:** Alta dissonância e instabilidade acústica. Utilização de ruído branco de alta frequência e ondas dente-de-serra desafinadas (*detuned supersaw*).
* **Textura:** Curtos-circuitos estáticos, alarmes pulsantes dissonantes (ex: duas frequências próximas batendo para gerar pulsações físicas de cancelamento de fase) e batidas estridentes de alerta operacional.

---

## 2. Trilha Ambiente por Setor
A música ambiente de cada setor deve ser gerada algoritmicamente por meio de loops de sequenciamento em Tone.js, utilizando escalas musicais específicas para expressar a tensão de cada andar.

### A. Hub: Acampamento Base (Modo Lídio)
* **Vibe:** Segurança temporária, introspecção sob a luz fraca de terminais desligados.
* **BPM:** 80 - 90 BPM (andamento calmo e reflexivo).
* **Densidade:** Baixa-Média (2-3 camadas simultâneas).
* **Instrumentos Sintetizados:**
  1. *Soft Pad:* Onda senoidal de longo ataque e decaimento com filtro passa-baixa sutil, criando acordes suaves baseados na escala de Dó Lídio (Dó, Ré, Mi, Fá#, Sol, Lá, Si).
  2. *Sino de Silício:* Um sintetizador FM com modulação curta que emite notas esparsas e agudas, soando como pingos de luz fria caindo no chão de ferro.

### B. Refinaria Tóxica (Modo Frígio / Frígio Dominante)
* **Vibe:** Metais sendo corroídos, gases venenosos nos dutos e perigo constante.
* **BPM:** 110 BPM (andamento de marcha mecânica cautelosa).
* **Densidade:** Média (3-4 camadas).
* **Instrumentos Sintetizados:**
  1. *Sub-Drone:* Um drone contínuo de onda quadrada na oitava mais baixa, modulado por um LFO lento (0.2Hz) para dar a sensação de fumaça pesada subindo.
  2. *Acid Percussion:* Sequência rítmica curta de ondas dente-de-serra filtradas com alta ressonância, criando uma pulsação corrosiva.
  3. *Gotejamento de Reagente:* Toques aleatórios de pitch ultra-agudo com decaimento exponencial rápido simulando gotas de ácido caindo sobre placas Kinetix.

### C. Data-Core Congelado (Modo Dórico)
* **Vibe:** Servidores flutuantes no escuro gelado, dados intocados, solidão absoluta.
* **BPM:** 95 BPM (estável, frio e matemático).
* **Densidade:** Baixa (2 camadas densas e limpas).
* **Instrumentos Sintetizados:**
  1. *Crystalline Pad:* Ondas triangulares duplas com desafinação (*detune*) e um efeito de *ping-pong delay* lento, flutuando em intervalos harmônicos perfeitos.
  2. *Sino de Filtro Frio:* Sons metálicos finos que cruzam os canais estéreo de forma rápida, representando pacotes de informação correndo no silêncio da fenda criogênica.

### D. Fornalha de Plasma (Modo Lócrio)
* **Vibe:** Fusão atômica instável, fúria térmica, energia OmniCorp fluindo em alta pressão.
* **BPM:** 130 BPM (andamento acelerado e urgente).
* **Densidade:** Alta (4-5 camadas sobrepostas).
* **Instrumentos Sintetizados:**
  1. *Thermal Bass:* Linha de baixo sintetizada com dente-de-serra distorcida, executando arpejos agressivos em Modo Lócrio (tenso, instável e sem quinta justa).
  2. *Plasma Pulse:* Pulsos de ruído rosa (*pink noise*) filtrados que batem no tempo forte do compasso, imitando descargas térmicas cíclicas da fornalha.
  3. *Resonant Lead:* Um sintetizador agressivo de onda quadrada modulada que chora notas de alta tensão nas frequências médias-altas.

---

## 3. Tema do Núcleo Matriz (Andar 100)
O combate final e as salas do mainframe central exigem um tema exclusivo que represente a inteligência artificial definitiva que orquestra a Torre.

* **Modo Musical:** Escala Octatônica / Escala de Tons Inteiros (Dissonância geométrica perfeita, eliminando resoluções harmônicas familiares).
* **BPM:** 140 BPM (urgência absoluta).
* **Densidade:** Máxima (6 camadas operando simultaneamente).
* **Timbres Característicos:**
  1. *Machine Choir (Coro de Consciências):* Síntese de formantes utilizando filtros de banda dupla para criar um coro mecânico artificial assustador, representando os ecos assimilados pela Matriz.
  2. *Giga-Industrial Bass:* Ondas senoidais e dente-de-serra sobrepostas e distorcidas que tremem toda a estrutura com graves que simulam as engrenagens mestres do Pináculo se movendo.
  3. *Overloaded Lead:* Um som estridente desafinado com modulação FM complexa que executa linhas melódicas matemáticas, rápidas e impiedosas.

---

## 4. Vocabulário de SFX
Tabela tática de efeitos sonoros e sua respectiva personalidade e parâmetros recomendados de síntese:

* **Clique de Botão (UI):** Um bip senoidal extremamente curto (40ms) de alta frequência (880Hz) com transição rápida para (1200Hz), passando a sensação de clique mecânico tátil.
* **Abrir/Fechar Painel:** Ruído branco de baixíssima frequência (filtro passa-baixa em 150Hz) com rampa de ganho ascendente/descendente linear (150ms), simulando o selamento ou despressurização de uma porta pneumática.
* **Ataque Básico:** Impacto de onda triangular com ataque de 2ms e decaimento exponencial acentuado para uma frequência grave de ressonância mecânica.
* **Uso de Skill de Dano:** Descarga de onda dente-de-serra com pitch sweep rápido descendente e distorção de ganho ativada por envelope.
* **Uso de Skill de Cura:** Rampa senoidal ascendente harmônica com modulação de atraso (*feedback delay*) sutil e agudos limpos, soando como infusão regenerativa de imunogel.
* **Overheat (Status):** Zumbido grave constante e instável de onda dente-de-serra com filtro passa-baixa oscilando em LFO rápido (8Hz), indicando fervura térmica.
* **Corrosion (Status):** Estalidos intermitentes e aleatórios sintetizados com envelope de ruído branco agudo passando por filtro de alta ressonância (gotejamento corrosivo).
* **Shock (Status):** Pequenas rajadas estáticas rápidas e dissonantes de duas ondas quadradas desafinadas em frequência ultra-alta com silêncios milimétricos entre si.
* **Stun (Status):** Um zumbido agudo senoidal de volume decrescente, simulando perda temporária de audição por trauma elétrico.
* **Level Up:** Arpejo ascendente de 4 notas puras em quinta harmônica (Frequência Base, x1.5, x2, x2.5), culminando em um acorde límpido com ressonância profunda.
* **Loot Drop por Raridade:**
  * *Comum (White):* Um único bip de UI de frequência média estável (440Hz, 150ms).
  * *Raro (Blue):* Duas notas rápidas ascendentes (quarta harmônica, 250ms).
  * *Épico (Purple):* Três notas em arpejo maior com feedback de delay modulado leve (400ms).
  * *Lendário (Gold):* Acorde maior cheio sintetizado com osciladores de onda senoidal e dente-de-serra polifônica, emitindo uma pulsação sônica dourada e rica.
  * *Mítico (Red):* Uma explosão brilhante e brilhante contendo uma rampa de pitch harmônico, seguida por um eco espectral modulado de alta resolução.
* **Vitória de Combate:** Um acorde triunfante em Modo Lídio, com decaimento lento e ressonante que transmite alívio tático.
* **Derrota (Game Over):** Uma queda de pitch senoidal extremamente lenta e arrastada, simulando descarregamento total de energia ou despressurização vital, terminando em ruído filtrado de baixa frequência.
* **Boss Enrage:** Um rugido sintético composto por ruído rosa filtrado, modulador de anel, e uma onda quadrada pesada sofrendo distorção de fase agressiva.
* **Erro de Ação:** Um bi-tom dissonante e abafado na frequência de graves (120Hz e 127Hz tocando juntos por 120ms).
* **Puzzle Correto:** Um carrilhão duplo ascendente puríssimo de 520Hz para 1040Hz em 100ms.
* **Puzzle Incorreto:** Dois bips de frequência ultra-baixa com rampa de decaimento curta e estalido elétrico final.

---

## 5. Regras de Não-Poluição Auditiva
Para assegurar que a experiência do jogador permaneça focada e livre de estresse sensorial decorrente de saturação sonora, os seguintes parâmetros de controle arquitetural devem ser aplicados no código:

1. **Limite de Polifonia SFX:** No máximo 4 efeitos sonoros podem ser sintetizados simultaneamente. Sons de UI e alertas de perigo sempre têm prioridade absoluta sobre sons de ataques ou golpes repetidos.
2. **Debounce de Disparos Repetidos:** Eventos de som idênticos de alta frequência (ex: hits múltiplos de uma skill ou cliques sucessivos rápidos) devem passar por um debounce mínimo de 60ms para evitar distorção cumulativa por saturação de fase.
3. **Crossfade Suave de Setores:** Ao transicionar entre andares, cenas (Hub para Combate) ou ao derrotar o boss final, o sistema de música ambiente deve realizar um *crossfade* linear ou exponencial de pelo menos 1.5 a 2.0 segundos, evitando cortes bruscos na atmosfera sonora.
4. **Volume Normalizado por Camada:**
   * Música Ambiente de Fundo (BGM): Deve operar em um nível confortável (recomenda-se -18dB a -22dB).
   * Efeitos Sonoros de Combate (SFX): Nível médio (-10dB a -14dB).
   * Alertas Críticos, UI e Drops Raros: Nível destacado (-6dB a -8dB) para garantir foco operacional.
5. **Autoclean de Instâncias:** Todas as conexões de osciladores, envelopes e canais de efeito em Tone.js devem chamar o método `.dispose()` imediatamente após a conclusão de seus respectivos ciclos de reprodução para evitar vazamento de memória de áudio e travamento da máquina virtual.

---
*Fim da Diretriz // Registro AUDIO_BIBLE gravado com sucesso na raiz do sistema.*
