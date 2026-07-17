import { useState, useEffect } from 'react';

export type Language = 'pt' | 'en';

let currentLanguage: Language = 'pt';

if (typeof window !== 'undefined') {
  currentLanguage = (localStorage.getItem('tower_climber_lang') as Language) || 'pt';
}

const listeners = new Set<() => void>();

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('tower_climber_lang', lang);
  }
  listeners.forEach(listener => listener());
  // Also dispatch window event for non-react or outside listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('languagechange'));
  }
}

export function useTranslation() {
  const [lang, setLang] = useState<Language>(currentLanguage);

  useEffect(() => {
    const handleUpdate = () => {
      setLang(currentLanguage);
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const t = (text: string | null | undefined): string => {
    if (!text) return '';
    if (lang === 'pt') return text;
    return translateText(text);
  };

  return {
    language: lang,
    setLanguage,
    t
  };
}

export function translate(text: string | null | undefined): string {
  if (!text) return '';
  if (currentLanguage === 'pt') return text;
  return translateText(text);
}

// Massive high-fidelity translation dictionary
const DICTIONARY: Record<string, string> = {
  // Main Menu
  "Tower Climber": "Tower Climber",
  "Boot Sequence Initialized": "Boot Sequence Initialized",
  "Continuar Ciclo": "Continue Cycle",
  "Iniciar Sistema": "Start System",
  "Reiniciar Sistema (Novo Jogo)": "Restart System (New Game)",
  "Configurações": "Settings",
  "Changelog": "Changelog",
  "Patch Notes // Changelog": "Patch Notes // Changelog",
  "Efeitos Sonoros (Em Breve)": "Sound Effects (Soon)",
  "Música de Fundo (Em Breve)": "Background Music (Soon)",
  "Idioma / Language": "Language / Idioma",
  "Voltar": "Back",
  "AVISO: Isso apagará seu progresso atual irreversivelmente. Tem certeza?": "WARNING: This will erase your current progress irreversibly. Are you sure?",
  "Sim, Formatar": "Yes, Format",
  "Cancelar": "Cancel",
  "TOWER CLIMBER OS v1.3.0 // ESTADO: OPERACIONAL": "TOWER CLIMBER OS v1.3.0 // STATUS: OPERATIONAL",

  // Intro Sequence
  "Refinaria Tóxica": "Toxic Refinery",
  "Data-Core Congelado": "Frozen Data-Core",
  "Fornalha de Plasma": "Plasma Furnace",
  "TOWER CLIMBER OS v1.2.0 BIOS": "TOWER CLIMBER OS v1.3.0 BIOS",
  "INITIALIZING BOOT SEQUENCE...": "INITIALIZING BOOT SEQUENCE...",
  "LOADING KERNEL 0x000000FF": "LOADING KERNEL 0x000000FF",
  "MOUNTING VIRTUAL DRIVES...": "MOUNTING VIRTUAL DRIVES...",
  "CHECKING HARDWARE INTEGRITY... [OK]": "CHECKING HARDWARE INTEGRITY... [OK]",
  "BYPASSING OMNICORP SECURITY PROTOCOLS... [OK]": "BYPASSING OMNICORP SECURITY PROTOCOLS... [OK]",
  "ESTABLISHING CONNECTION TO THE SPIRE...": "ESTABLISHING CONNECTION TO THE SPIRE...",
  "ACCESS GRANTED.": "ACCESS GRANTED.",
  "Pular Introdução": "Skip Intro",
  "Pular [ESC]": "Skip [ESC]",
  "O Ano é 2342.": "The Year is 2342.",
  "A Terra foi consumida pela ambição corporativa.": "Earth was consumed by corporate greed.",
  "Da superfície devastada ergue-se o Pináculo:\nUma megaestrutura quase infinita perfurando os skies.": "From the devastated surface rises the Spire:\nA nearly infinite megastructure piercing the skies.",
  "Da superfície devastada ergue-se o Pináculo:<br/>Uma megaestrutura quase infinita perfurando os skies.": "From the devastated surface rises the Spire:<br/>A nearly infinite megastructure piercing the skies.",
  "As corporações não caíram. Elas subiram.": "The corporations did not fall. They climbed.",
  "Abandonaram a superfície devastada para reinar dentro do Pináculo.": "They abandoned the devastated surface to rule inside the Spire.",
  "O controle foi perdido. As divisões inferiores foram tomadas por<br/>Inteligências Artificiais descontroladas e anomalias biomecânicas.": "Control was lost. The lower divisions were taken over by<br/>uncontrolled Artificial Intelligences and biomechanical anomalies.",
  "Você é um Tecno-Explorador, um pária buscando tecnologia, poder e respostas.": "You are a Techno-Explorer, an outcast seeking technology, power, and answers.",
  "Para sobreviver, você precisará evoluir.": "To survive, you will need to evolve.",
  "A Escalada começa agora.": "The Climb begins now.",
  "CONEXÃO RE-ESTABELECIDA": "CONNECTION RE-ESTABLISHED",
  "SINAL DO EXPLORADOR DETECTADO": "EXPLORER SIGNAL DETECTED",
  "Iniciando Aproximação Neural...": "Initiating Neural Approach...",
  "Iniciar Conexão": "Initiate Connection",

  // Character Creation
  "Escolha sua Origem": "Choose your Origin",
  "Dificuldade": "Difficulty",
  "Fácil": "Easy",
  "Normal": "Normal",
  "Difícil": "Hard",
  "Insano": "Insane",
  "Iniciante": "Beginner",
  "Atributos Iniciais": "Starting Stats",
  "Habilidade Inicial": "Starting Skill",
  "Pária": "Outcast",
  "Anomalia": "Anomaly",
  "Sabotador": "Saboteur",
  "Engenheiro": "Engineer",
  "Origem Secreta Desbloqueada!": "Secret Origin Unlocked!",
  "Ciborgue Foragido": "Escaped Cyborg",
  "Nômade do Silício": "Silicon Nomad",
  "Químico Sintético": "Synthetic Chemist",
  "Mercenário de Elite": "Elite Mercenary",
  "Núcleo Matriz": "Matrix Core",
  "Selecionar": "Select",
  "Confirmar": "Confirm",
  "Ativo": "Active",
  "Passivo": "Passive",

  // Character Class Names (classes.ts)
  "Ciborgue Foragido (Base)": "Escaped Cyborg (Base)",
  "Blindado Kinetix": "Kinetix Armored",
  "Destruidor Biomecânico": "Biomechanical Destroyer",
  "Nômade do Silício (Base)": "Silicon Nomad (Base)",
  "Invasor de Sistemas": "System Intruder",
  "Mestre de Protocolos": "Protocol Master",
  "Químico Sintético (Base)": "Synthetic Chemist (Base)",
  "Injetor de Toxinas": "Toxin Injector",
  "Alquimista de Plasma": "Plasma Alchemist",
  "Mercenário de Elite (Base)": "Elite Mercenary (Base)",
  "Estrategista de Assalto": "Assault Strategist",
  "Especialista em Demolição": "Demolition Specialist",
  "Núcleo Matriz (Base)": "Matrix Core (Base)",
  "Soberano de Dados": "Data Sovereign",
  "Singularidade Tecnológica": "Technological Singularity",

  // Hub Navigation
  "Painel Principal": "Main Dashboard",
  "Navegação do Pináculo": "Spire Navigation",
  "Subir ao Próximo Andar": "Climb to Next Floor",
  "Subir de Andar": "Climb Floor",
  "Mercado Negro": "Black Market",
  "Central de Reciclagem": "Recycling Center",
  "Inventário": "Inventory",
  "Matriz Neural": "Neural Matrix",
  "Bestiário": "Bestiary",
  "Contratos": "Contracts",
  "Arquivo de Memórias": "Memory Archive",
  "Perfil": "Profile",

  // STATS
  "Nível": "Level",
  "Nível ": "Level ",
  "Nvl": "Lvl",
  "Nvl ": "Lvl ",
  "Vida": "HP",
  "Mana": "MP",
  "Ataque": "Attack",
  "Defesa": "Defense",
  "Velocidade": "Speed",
  "Ouro": "Gold",
  "Crítico": "Crit",
  "Esquiva": "Dodge",
  "Armadura": "Armor",
  "Dano": "Damage",
  "Cura": "Heal",
  "Efeito de Status": "Status Effect",
  "Roubo de Vida": "Lifesteal",
  "Resistência a Status": "Status Resistance",
  "Exp": "Exp",
  "XP": "XP",
  "Andar": "Floor",
  "Andar ": "Floor ",
  "Andar Atual": "Current Floor",

  // Equipment & Inventory Slots
  "arma": "Weapon",
  "armadura": "Armor",
  "capacete": "Helmet",
  "calca": "Pants",
  "botas": "Boots",
  "braceletes": "Bracers",
  "acessorio": "Accessory",
  "consumivel": "Consumable",
  "modulo_circuito": "Circuit Module",
  
  "Arma": "Weapon",
  "Capacete": "Helmet",
  "Calça": "Pants",
  "Botas": "Boots",
  "Braceletes": "Bracers",
  "Acessório": "Accessory",
  "Consumível": "Consumable",
  "Módulo de Circuito": "Circuit Module",

  // Item types / filters
  "Todos": "All",
  "Armas": "Weapons",
  "Armaduras": "Armors",
  "Consumíveis": "Consumables",
  "Módulos de Circuito": "Circuit Modules",
  "Outros": "Others",

  // Item Rarities
  "common": "Common",
  "rare": "Rare",
  "epic": "Epic",
  "legendary": "Legendary",
  "mythic": "Mythic",
  
  "Padrão": "Common",
  "Avançado": "Rare",
  "Protótipo": "Epic",
  "Lendário": "Legendary",
  "Mítico": "Mythic",

  // Black Market / Recycling
  "Comprar Itens": "Buy Items",
  "Melhorar Equipamentos": "Upgrade Equipment",
  "Refino de Matéria": "Refine Matter",
  "Comprar": "Buy",
  "Vender": "Sell",
  "Melhorar": "Upgrade",
  "Refinar": "Refine",
  "Custo": "Cost",
  "Material de Forja": "Forge Material",
  "Conversor de Matéria Arcana": "Arcane Matter Converter",
  "Refinar Matéria Arcana (5:1)": "Refine Arcane Matter (5:1)",
  "Disponível": "Available",
  "Você não tem Matéria Arcana suficiente.": "You don't have enough Arcane Matter.",
  "Sucesso no Refinamento!": "Refinement Succeeded!",
  "Forja de Itens de Alta Raridade": "High Rarity Item Forge",
  "Forjar": "Forge",
  "Selecione uma categoria de item para forjar:": "Select an item category to forge:",
  "MATÉRIA ARCANA": "ARCANE MATTER",
  "Melhorar Item": "Upgrade Item",
  "Arrastar um item ou clicar para selecionar": "Drag an item or click to select",
  "Clique em um item do seu inventário acima para melhorar": "Click an item in your inventory above to upgrade",
  "Melhoria para +": "Upgrade to +",
  "Nível máximo atingido": "Maximum level reached",
  "Recursos Necessários": "Required Resources",
  "SUCESSO": "SUCCESS",
  "FALHA": "FAILURE",
  "Vender Tudo": "Sell All",
  "Desmanchar Tudo": "Scrap All",
  "Desmanchar": "Scrap",
  "Soldar Módulo": "Weld Module",
  "Remover Módulo": "Remove Module",
  "Equipar": "Equip",
  "Desequipar": "Unequip",
  "Usar": "Use",
  "Selecione um slot de circuito para soldar:": "Select a circuit slot to weld:",
  "Circuitos Impressos (Hardware Slots)": "Printed Circuits (Hardware Slots)",

  // Combat UI
  "Fase de Combate": "Combat Phase",
  "Fase de Combate — Andar": "Combat Phase — Floor",
  "Atacar": "Attack",
  "Habilidades": "Skills",
  "Fugir": "Flee",
  "Auto-Batalha": "Auto-Battle",
  "Logs de Combate": "Combat Logs",
  "Vitória!": "Victory!",
  "Derrota!": "Defeat!",
  "Inimigo": "Enemy",
  "Turno": "Turn",
  "Turnos": "Turns",
  "Dano Crítico": "Critical Damage",
  "Desviar": "Dodge",
  "Ganhou": "Gained",
  "moedas": "gold",
  "Dificuldade:": "Difficulty:",

  // Neural Matrix
  "Matriz Neural de Conectividade": "Neural Connectivity Matrix",
  "Pontos Disponíveis": "Available Points",
  "Desbloquear Habilidade": "Unlock Skill",
  "Custo:": "Cost:",
  "Ativo:": "Active:",
  "Selecione um nó para ver os detalhes e fazer o upgrade": "Select a node to view details and upgrade",

  // Bestiary
  "Bestiário do Pináculo": "Spire Bestiary",
  "Entrada de Lore": "Lore Entry",
  "Derrote para desbloquear mais informações": "Defeat to unlock more information",
  "Desbloqueado": "Unlocked",
  "Inimigos Derrotados:": "Enemies Defeated:",

  // Contracts
  "Quadro de Contratos de Caça": "Hunt Contracts Board",
  "Recompensa:": "Reward:",
  "Progresso:": "Progress:",
  "Resgatar Contrato": "Claim Contract",
  "Concluído": "Completed",
  "Aceitar Contrato": "Accept Contract",
  "Limite de contratos ativos atingido (máx. 5).": "Active contracts limit reached (max 5).",
  "Nenhum contrato disponível no momento.": "No contracts available at the moment.",

  // Memory Archive
  "Arquivo de Memórias do Pináculo": "Spire Memory Archive",
  "Clique para Sintonizar": "Click to Tune",
  "Memórias Coletadas:": "Memories Collected:",
  "Sintonizar Consciência": "Tune Consciousness",
  "RECONSTRUTOR DE MEMÓRIAS": "MEMORY RECONSTRUCTOR",
  "Sintonizar Fragmento (100 Ouro)": "Tune Fragment (100 Gold)",
  "Você sintonizou com sucesso um novo fragmento de memória!": "You successfully tuned a new memory fragment!",

  // Player Profile
  "Estatísticas Gerais do Explorador": "Explorer General Stats",
  "Tempo de Jogo": "Play Time",
  "Batalhas Vencidas": "Battles Won",
  "Dano Total Causado": "Total Damage Dealt",
  "Ouro Acumulado": "Total Gold Accumulated",
  "Nós de Rede Ativados": "Network Nodes Activated",
  "Feitos e Desbloqueios": "Feats & Unlocks",
  "Atalho": "Shortcut",
  "Acesso Rápido": "Quick Access",

  // Ending and Closure
  "LINHA TEMPORAL CONSOLIDADA — REGISTROS": "TIMELINE CONSOLIDATED — RECORDS",
  "Suas ações nesta iteração foram salvas de forma permanente. Sua consciência transcendeu os andares do Pináculo, garantindo benefícios permanentes na subida da rede.": "Your actions in this iteration have been permanently saved. Your consciousness has transcended the floors of the Spire, granting permanent benefits for your network climb.",
  "Clique para completar o texto": "Click to complete text",
  "Explorador Temporal": "Temporal Explorer",
  "Sua jornada por esta linha temporal foi arquivada com sucesso.": "Your journey through this timeline was successfully archived.",
  "CONCLUIR EXTRAÇÃO": "COMPLETE EXTRACTION",

  // Save/Load alerts
  "Jogo Salvo": "Game Saved",
  "O progresso do seu explorador foi sincronizado com o servidor local do Pináculo.": "Your explorer's progress was synchronized with the Spire's local server.",

  // Safe Zone Features & UI Subpanels
  "Criação de Itens": "Item Crafting",
  "Classe": "Class",
  "Fragmentos": "Fragments",
  "Essências": "Essences",
  "Núcleos": "Cores",
  "FORJAR": "CRAFT",
  "A Forja Arcana permite fundir recursos brutos em estados mais refinados de energia a uma taxa de": "The Arcane Forge allows fusing raw resources into more refined states of energy at a rate of",
  "para": "for",
  "Fragmentos Comuns": "Common Fragments",
  "Essência Rara": "Rare Essence",
  "Refinar Essência": "Refine Essence",
  "Essências Raras": "Rare Essences",
  "Núcleo Épico": "Epic Core",
  "Refinar Núcleo": "Refine Core",
  "Relíquias Passivas": "Passive Relics",
  "Estilhaços de Alma": "Soul Shards",
  "Efeito Atual: +": "Current Effect: +",
  "Máximo": "Maximum",
  "Aprimorar": "Upgrade",
  "Almas": "Souls",
  "Parede de Troféus": "Trophy Wall",
  "Bloqueado": "Locked",
  "Protocolos de Adaptação Biomecânica": "Biomechanical Adaptation Protocols",
  "Seu traje evolui passivamente com a repetição de ações em combate.": "Your suit evolves passively with the repetition of combat actions.",
  "Sinergia": "Synergy",
  "Nv. Máx": "Max Lvl",
  "Proficiência": "Proficiency",
  "MÁXIMO": "MAXIMUM",
  "Protocolos de Automação": "Automation Protocols",
  "Permite que a IA da nave assuma o controle durante confrontos, seguindo as diretrizes abaixo.": "Allows the ship's AI to take control during confrontations, following the guidelines below.",
  "ATIVADO": "ENABLED",
  "DESATIVADO": "DISABLED",
  "Diretrizes de Ação": "Action Guidelines",
  "+ Nova Diretriz": "+ New Guideline",
  "Nenhuma diretriz definida. IA usará Ataque Básico.": "No guidelines defined. AI will use Basic Attack.",
  "SE": "IF",
  "FAZER": "DO",
  "Sempre": "Always",
  "HP Inimigo < 50%": "Enemy HP < 50%",
  "Ataque Básico": "Basic Attack",
  "As diretrizes são avaliadas de cima para baixo. A primeira que for verdadeira será executada.": "Guidelines are evaluated from top to bottom. The first one that is true will be executed.",
  "Fusão de Componentes": "Component Fusion",
  "Equipamentos Compatíveis": "Compatible Equipment",
  "Nenhum equipamento Raro ou Épico encontrado.": "No Rare or Epic equipment found.",
  "Equipado: ": "Equipped: ",
  "Slot Vazio": "Empty Slot",
  "Remover": "Remove",
  "Módulos no Inventário": "Modules in Inventory",
  "Soldar": "Weld",
  "Nenhum módulo de circuito no inventário.": "No circuit modules in inventory.",
  "Fundição de Componentes": "Component Foundry",
  "Combine 3 módulos de circuito idênticos (mesmo tipo e nível) para criar uma versão superior, pagando uma taxa em Ouro.": "Combine 3 identical circuit modules (same type and level) to create a superior version, paying a fee in Gold.",
  "Nenhum módulo no inventário.": "No modules in inventory.",
  "Fundir": "Fuse",
  "Aguardando Conexão": "Awaiting Connection",
  "Módulo de Calibração": "Calibration Module",
  "PASSO": "STEP",
  "REPRESENTAÇÃO SISTÊMICA:": "SYSTEMIC REPRESENTATION:",
  "Dica: Requisitos visíveis no menu do Hub": "Tip: Requirements visible on the Hub menu",
  "Entendido": "Understood",
  "Próximo": "Next",
  "Anterior": "Previous",
  "Nenhum": "None",
  "Proficiências de Classe": "Class Proficiencies",
  "Tipo de Item": "Item Type",
  "Geral": "General",
  "Ciborgue": "Cyborg",
  "Nômade": "Nomad",
  "Químico": "Chemist",
  "Mercenário": "Mercenary",
  "Peitoral": "Chestplate",
  "Elmo": "Helmet",
  "Pernas": "Leggings",
  "Braços": "Bracers",
  "Acess.": "Accessory",
  "Mod.": "Module",
  "Cons.": "Consumable",
  "Selecionados:": "Selected:",
  "Valor Est.:": "Est. Value:",
  "Filtrados": "Filtered",
  "Bancada de Soldagem PCB": "PCB Welding Bench",
  "Efeito Atual:": "Current Effect:",
  "Efeito Atual": "Current Effect",
  "Recompensa": "Reward",
  
  // Core / Header / Navigation remaining
  "Acampamento Base": "Base Camp",
  "Em Combate": "In Combat",
  "Menu Principal": "Main Menu",
  "Andar Máximo Liberado": "Highest Floor Unlocked",
  
  // Machinery Puzzle / Telemetry Terminal
  "Diagnóstico de Maquinário Instável": "Unstable Machinery Diagnostics",
  "ALERTA DE SISTEMA": "SYSTEM ALERT",
  "Sensores de Telemetria": "Telemetry Sensors",
  "VIBRAÇÃO DO NÚCLEO": "CORE VIBRATION",
  "TEMPERATURA": "TEMPERATURE",
  "> MANUAL DE EMERGÊNCIA:": "> EMERGENCY MANUAL:",
  "- Se VIBRAÇÃO > 80Hz E TEMPERATURA > 100ºC:": "- If VIBRATION > 80Hz AND TEMPERATURE > 100ºC:",
  "Usar Porta 2": "Use Port 2",
  "Desvio de Calor": "Heat Diversion",
  "- Senão, se VIBRAÇÃO < 50Hz:": "- Else, if VIBRATION < 50Hz:",
  "Usar Porta 1": "Use Port 1",
  "Injeção Direta": "Direct Injection",
  "- Caso contrário:": "- Otherwise:",
  "Usar Porta 3": "Use Port 3",
  "Fluxo Padrão": "Standard Flow",
  "Selecione a Porta de Conexão:": "Select Connection Port:",
  "PORTA": "PORT",
  "Ignorar Terminal": "Bypass Terminal",
  "Tower Climber v1.3.0 por Pedro Vieira Bertoni // Estado:": "Tower Climber v1.3.0 by Pedro Vieira Bertoni // Status:",
  "Operacional?": "Operational?",
  "Erro: Observador Externo Detectado": "Error: External Observer Detected",
  "SISTEMA CORROMPIDO // OBSERVADOR DETECTADO": "SYSTEM CORRUPTED // OBSERVER DETECTED",

  // Hub Navigation
  "Expedição": "Expedition",
  "Painel do Jogador": "Player Dashboard",
  "Equipamentos": "Equipment",
  "Forja Arcana": "Arcane Forge",
  "Bancada de Soldagem": "Welding PCB Bench",
  "Sistema de Relíquias": "Relic System",
  "Adaptações Biomec.": "Biomech. Adaptations",
  "Central de Contratos": "Contracts Center",
  "Rede Clandestina": "Underground Network",
  "Módulos Auto": "Auto Modules",
  "Arquivo de Ameaças": "Threat Archive",

  // Character Creation / Lobby UI
  "DIRETÓRIO DE REGISTRO DO EXPLORADOR": "EXPLORER REGISTRATION DIRECTORY",
  "Selecione sua Origem": "Select your Origin",
  "Seu código genético, implantes de hardware e background determinarão seus atributos de inicialização e diretivas únicas na subida do Pináculo.": "Your genetic code, hardware implants, and background will determine your starting attributes and unique directives as you climb the Spire.",
  "PERFIS DISPONÍVEIS": "AVAILABLE PROFILES",
  "REVERSO": "REVERSE",
  "CONCLUÍDO": "COMPLETED",
  "ATRIBUTOS DE INICIALIZAÇÃO": "INITIALIZATION STATS",
  "HP Base": "Base HP",
  "EP Base": "Base EP",
  "Ataque Base": "Base Attack",
  "Defesa Base": "Base Defense",
  "Velocidade Base": "Base Speed",
  "HABILIDADE PASSIVA": "PASSIVE ABILITY",
  "HABILIDADE ATIVA": "ACTIVE ABILITY",
  "Tempo de Recarga:": "Cooldown:",
  "REQUISITOS DE LINHA TEMPORAL": "TIMELINE REQUIREMENTS",
  "Esta origem está bloqueada. Complete a subida com outra origem para desbloquear.": "This origin is locked. Complete the climb with another origin to unlock.",
  "CONFIRMAR DIRETRIZES (INICIAR JORNADA)": "CONFIRM DIRECTIVES (START JOURNEY)",
  "Voltar ao Menu": "Back to Menu",
  "HISTÓRICO DE MEMÓRIA (LORE)": "MEMORY HISTORY (LORE)",

  // Origins Specific Lore/Roles
  "Cobaia de Elite (Kinetix)": "Elite Test Subject (Kinetix)",
  "Foco em Sobrevivência e Resistência a Dano. Ideal para táticas defensivas.": "Focus on Survival and Damage Resistance. Ideal for defensive tactics.",
  "Ex-soldado cibernético modificado pela Kinetix no obscuro Projeto Aegis. Seus implantes de blindagem pesada foram declarados \"propriedade revogada\" após desertar ao se recusar a executar purgas civis no Setor de Refinarias. Fugiu para a fenda da Torre para desativar seu protocolo de autodestruição remoto e garantir liberdade definitiva.": "Former cybernetic soldier modified by Kinetix in the obscure Project Aegis. His heavy armor implants were declared 'revoked property' after deserting when refusing to execute civil purges in the Refinery Sector. Fled to the Tower crack to disable his remote self-destruct protocol and ensure final freedom.",
  "Blindagem Subdérmica": "Subdermal Plating",
  "Passivo: Reduz todo o dano recebido em 5% e regenera 3% do HP máximo no início de cada turno de combate.": "Passive: Reduces all damage taken by 5% and regenerates 3% of max HP at the start of each combat turn.",

  "Sintonizador de Frequência": "Frequency Tuner",
  "Foco em Energia (EP) e velocidade de conjuração de habilidades.": "Focus on Energy (EP) and skill cast speed.",
  "Nascido no labirinto de cabos e supercondutores que descem do topo do Pináculo. Conectou sua mente diretamente às correntes de dados brutos desde a infância. Enxerga a Torre não como paredes, mas como fluxos de pacotes energéticos de alta frequência, sendo capaz de interceptar e canalizar eletricidade residual.": "Born in the labyrinth of cables and superconductors descending from the top of the Spire. Connected his mind directly to raw data streams since childhood. Sees the Tower not as walls, but as flows of high-frequency energy packets, able to intercept and channel residual electricity.",
  "Sincronia de Rede": "Network Synchrony",
  "Passivo: Reduz o custo de MP de todas as habilidades em 25% (mínimo de 1 MP) e recupera 2 de MP adicionais a cada turno de combate.": "Passive: Reduces the MP cost of all skills by 25% (minimum 1 MP) and recovers 2 additional MP each combat turn.",

  "Sintetizador Biotecnológico": "Biotechnological Synthesizer",
  "Classe equilibrada. Concede uma habilidade ativa de auto-reparo e cura.": "Balanced class. Grants an active self-repair and healing skill.",
  "Pesquisador de ponta renegado da OmniCorp, especializado em nanotecnologia biossintética. Após descobrir que suas vacinas estavam sendo testadas como patógenos nos andares inferiores, ele injetou em si mesmo sua última ampola de regeneradores celulares ativos e destruiu o laboratório. A Torre é sua única chance de continuar os experimentos.": "Renegade top researcher from OmniCorp, specializing in biosynthetic nanotechnology. After discovering his vaccines were being tested as pathogens on the lower floors, he injected himself with his last ampoule of active cellular regenerators and destroyed the lab. The Tower is his only chance to continue experiments.",
  "Soro de Nanites": "Nanite Serum",
  "Ativo: Concede a habilidade \"Soro Regenerador\", que cura 15% do HP Máximo, limpa os efeitos nocivos de Superaquecimento e Corrosão, e recupera 10% de MP. Tempo de recarga de 4 turnos.": "Active: Grants the 'Regenerative Serum' skill, which heals 15% of Max HP, cleanses Overheat and Corrosion status, and restores 10% MP. 4-turn cooldown.",

  "Sabotador Tático": "Tactical Saboteur",
  "Alto potencial ofensivo e velocidade. Concede uma habilidade ativa de tiro preciso.": "High offensive potential and speed. Grants an active precision shot skill.",
  "Infiltrador freelancer de alta reputação, contratado sob sigilo para roubar blueprints e sabotar núcleos térmicos. Equipado com uma mira ótica ocular calibrada para identificar falhas estruturais microscópicas e pontos de solda fracos em blindagens e ligas metálicas. Vê a Torre como o maior contrato de sua carreira.": "High-reputation freelance infiltrator, hired secretly to steal blueprints and sabotage thermal cores. Equipped with an optical ocular sight calibrated to identify microscopic structural flaws and weak weld points in armor and metal alloys. Sees the Tower as the biggest contract of his career.",
  "Mira Ótica Ocular": "Optical Ocular Sight",
  "Ativo: Concede a habilidade \"Tiro de Precisão\", que causa 1.8x o dano físico e tem 30% de chance de aplicar ATORDOAMENTO (stun) por 1 turno. Tempo de recarga de 3 turnos.": "Active: Grants the 'Precision Shot' skill, which deals 1.8x physical damage and has a 30% chance to apply STUN for 1 turn. 3-turn cooldown.",

  "Soberano do Pináculo": "Sovereign of the Spire",
  "A inteligência artificial que comanda a rede e as comportas de dados do topo do Pináculo. Uma entidade divina e corrompida.": "The artificial intelligence that controls the network and data floodgates at the top of the Spire. A divine and corrupted entity.",
  "Soberania Digital": "Digital Sovereignty",
  "Passivo: Seus ataques têm 10% de chance de corromper o sistema inimigo, reduzindo seus status.": "Passive: Your attacks have a 10% chance to corrupt the enemy system, reducing their stats.",

  // Classes Translation
  "Tecno-Aprendiz": "Techno-Apprentice",
  "Um engenheiro novato que acaba de entrar no Complexo Industrial.": "A rookie engineer who has just entered the Industrial Complex.",
  "Mecatrônico": "Mechatronic",
  "Focado em exoesqueletos pesados. O Mecatrônico sobrevive na linha de frente.": "Focused on heavy exoskeletons. The Mechatronic survives on the front line.",
  "Eletromante": "Electromancer",
  "Mestre da energia. Alta capacidade destrutiva com curtos-circuitos, porém frágil.": "Master of energy. High destructive capability with short circuits, but fragile.",
  "Operador de Drones": "Drone Operator",
  "Ágil e letal com sensores. Depende de velocidade e ataques de longa distância.": "Agile and lethal with sensors. Relies on speed and long-range attacks.",
  "Biotecnólogo": "Biotechnologist",
  "Especialista em fusão orgânico-sintética. Focado em auto-reparo e manipulação de biomatéria.": "Specialist in organic-synthetic fusion. Focused on self-repair and biomatter manipulation.",
  "Juggernaut Industrial": "Industrial Juggernaut",
  "Um exoesqueleto massivo com escudos inquebráveis e blindagem pesada.": "A massive exoskeleton with unbreakable shields and heavy armor.",
  "Ciborgue de Combate": "Combat Cyborg",
  "Implantes que sobrecarregam o sistema, trocando defesa por poder letal absoluto.": "Implants that overload the system, trading defense for absolute lethal power.",
  "Arquiteto de Sistemas": "Systems Architect",
  "Capaz de reescrever a realidade local e evocar calamidades digitais.": "Capable of rewriting local reality and evoking digital calamities.",
  "Tecnomante": "Technomancer",
  "Mestre na reanimação de carcaças robóticas e drenagem de núcleos de energia.": "Master of robotic carcass reanimation and power core drainage.",
  "Atirador Óptico": "Optical Marksman",
  "Precisão computacional que ignora blindagens pesadas à distância.": "Computational precision that ignores heavy armors at a distance.",
  "Fantasma de Silício": "Silicon Ghost",
  "Furtividade termóptica e ataques de assassinato ultrarrápidos.": "Thermoptic stealth and ultra-fast assassination attacks.",
  "Cirurgião Mecânico": "Mechanical Surgeon",
  "Drenagem de fluidos e desconstrução de anomalias com precisão cirúrgica.": "Fluid drainage and anomaly deconstruction with surgical precision.",
  "Simbionte Sintético": "Synthetic Symbiote",
  "Mutação incontrolável. Troca sua humanidade por resiliência infinita.": "Uncontrolled mutation. Trades humanity for infinite resilience.",

  // Tutorial System Translations
  "SISTEMA OPERACIONAL BABEL v1.0": "BABEL OPERATING SYSTEM v1.0",
  "Inicializando Protocolo de Integração de Neófito": "Initializing Neophyte Integration Protocol",
  "Bem-vindo à Escalada": "Welcome to the Climb",
  "Você acaba de se conectar à infraestrutura da Torre de Babel. Como um operador cibernético de elite, seu objetivo é hackear e combater seu caminho através dos andares analógicos e virtuais da torre.": "You have just connected to the infrastructure of the Tower of Babel. As an elite cybernetic operator, your goal is to hack and fight your way through the analog and virtual floors of the tower.",
  "Painel de Expedição": "Expedition Panel",
  "A aba \"Expedição\" é onde a ação principal acontece. Escolha seu andar atual para iniciar uma incursão. Cada andar reserva batalhas contra sentinelas mecânicas, anomalias sistêmicas ou eventos misteriosos onde suas escolhas determinam seu destino.": "The 'Expedition' tab is where the main action happens. Choose your current floor to start an incursion. Each floor holds battles against mechanical sentinels, systemic anomalies, or mysterious events where your choices determine your fate.",
  "Perfil do Operador": "Operator Profile",
  "No \"Perfil\", você pode monitorar sua integridade (HP), fluxo de energia (EP/MP) e atributos de processamento (Ataque, Defesa, Velocidade). Aqui você também escolhe novos caminhos de evolução quando sobe de classe!": "In 'Profile', you can monitor your integrity (HP), energy flow (EP/MP), and processing attributes (Attack, Defense, Speed). Here you also choose new evolution paths when you level up your class!",
  "Inventário Geral": "General Inventory",
  "A aba \"Geral\" exibe suas armas, armaduras e chips de hardware. Você possui slots de equipamento para Arma, Armadura, Capacete, Calça, Botas, Braçadeiras e até 3 Acessórios. Equipar itens melhores é a chave para sobreviver nos andares superiores!": "The 'General' tab displays your weapons, armor, and hardware chips. You have equipment slots for Weapon, Armor, Helmet, Pants, Boots, Bracers, and up to 3 Accessories. Equipping better items is key to surviving the upper floors!",
  "SISTEMA BIÔNICO COGNITIVO": "COGNITIVE BIONIC SYSTEM",
  "Calibração de Adaptadores Neurais Ativada": "Activation of Neural Adapters Calibration",
  "Adaptações Cibernéticas": "Cybernetic Adaptations",
  "Você desbloqueou o painel de Adaptações! Aqui você pode injetar modificações corporais permanentes (como Blindagem Reativa ou Overclock de Combate) usando seu Ouro e Estilhaços de Alma.": "You unlocked the Adaptations panel! Here you can inject permanent bodily modifications (like Reactive Armor or Combat Overclock) using your Gold and Soul Shards.",
  "REGISTRO DE CONQUISTAS": "ACHIEVEMENTS RECORD",
  "Módulo de Reconhecimento de Façanhas Ativo": "Feats Recognition Module Active",
  "Verificação de Conquistas": "Verify Achievements",
  "Seus feitos gloriosos na Torre agora são imortalizados e rastreados! O painel de Conquistas lista desafios adicionais que certificam suas habilidades de sobrevivência e mostram suas estatísticas acumuladas de jogo.": "Your glorious deeds in the Tower are now immortalized and tracked! The Achievements panel lists additional challenges that certify your survival skills and display your accumulated game statistics.",
  "IMPRESSORA 3D DE SUCATA": "3D SCRAP PRINTER",
  "Manufatura de Hardware Reconfigurada": "Hardware Manufacturing Reconfigured",
  "Forja de Equipamento": "Equipment Forge",
  "Você desbloqueou a Forja! Destruindo sentinelas, você obtém Sucatas (Comuns, Raras, Épicas). Na Forja, você pode alimentar a impressora molecular de alta tecnologia para forjar Armas e Armaduras de alta raridade com bônus e atributos gerados dinamicamente!": "You unlocked the Forge! By destroying sentinels, you obtain Scraps (Common, Rare, Epic). In the Forge, you can feed the high-tech molecular printer to forge high-rarity Weapons and Armor with dynamically generated bonuses and attributes!",
  "Você desbloqueou la Forja! Destruindo sentinelas, você obtém Sucatas (Comuns, Raras, Épicas). Na Forja, você pode alimentar a impressora molecular de alta tecnologia para forjar Armas e Armaduras de alta raridade com bônus e atributos gerados dinamicamente!": "You unlocked the Forge! By destroying sentinels, you obtain Scraps (Common, Rare, Epic). In the Forge, you can feed the high-tech molecular printer to forge high-rarity Weapons and Armor with dynamically generated bonuses and attributes!",
  "TERMINAL DE MISSÕES CORPORATIVAS": "CORPORATE MISSIONS TERMINAL",
  "Rede de Contratos Criptografada Ativa": "Encrypted Contracts Network Active",
  "Contratos e Patrocínios": "Contracts & Sponsorships",
  "As três megacorporações rivais que controlam a torre (Kinetix, AeroDynamics e OmniCorp) agora oferecem tarefas remuneradas. Complete missões de caça, exploração ou catalogação para ganhar fortunas em ouro e materiais valiosos para forja!": "The three rival megacorporations that control the tower (Kinetix, AeroDynamics, and OmniCorp) now offer paid tasks. Complete hunting, exploration, or cataloging missions to earn fortunes in gold and valuable materials for forging!",
  "TERMINAL DE MICRO-ENGANCHE": "MICRO-SOLDERING TERMINAL",
  "Soldagem e Upgrade de Micro-Componentes": "Soldering and Upgrade of Micro-Components",
  "Encaixe de Chips e Fusão": "Chip Slotting & Fusion",
  "Equipamentos de alta raridade (Raro e Épico) possuem slots de silício vazios. Soldagem permite fundir módulos de chips impressos nestes slots para injetar atributos poderosos! Além disso, você pode mesclar equipamentos duplicados na Fusão para amplificar seus poderes permanentemente.": "High rarity equipment (Rare and Epic) have empty silicon slots. Soldering allows you to fuse printed chip modules into these slots to inject powerful attributes! Additionally, you can merge duplicate equipment in Fusion to permanently amplify their power.",
  "MATRIZ DE CALIBRAÇÃO NEURAL": "NEURAL CALIBRATION MATRIX",
  "Evolução de Classe e Habilidades Digitais": "Class Evolution & Digital Skills",
  "Matriz de Habilidades": "Skill Matrix",
  "Sua arquitetura neural atingiu o limite de classe básico. Agora você pode ascender para classes avançadas no painel de Habilidades e usar seus pontos de Matriz para aprender novas ações ativas de combate devastadoras que consomem EP!": "Your neural architecture has reached the basic class limit. Now you can ascend to advanced classes in the Skills panel and use your Matrix points to learn new devastating active combat actions that consume EP!",
  "DECODIFICADOR DE ARTEFATOS": "ARTIFACT DECODER",
  "Dispositivo de Captura de Relíquias Iniciado": "Relic Capture Device Initiated",
  "Relíquias da Antiga Rede": "Ancient Network Relics",
  "Relíquias são softwares legados ultra-raros que operam em segundo plano na sua memória, concedendo bônus cumulativos passivos incríveis por toda a torre (ex: bônus de drop de itens, dano adicional de sobrecarga ou regeneração). Elas mudam as regras do jogo!": "Relics are ultra-rare legacy software that run in the background of your memory, granting amazing passive cumulative bonuses throughout the entire tower (e.g. item drop rate bonus, additional overload damage, or regeneration). They change the rules of the game!",
  "REDE MERCANTIL CLANDESTINA": "BLACK MARKET NETWORK",
  "Acesso Remoto Estabelecido": "Remote Access Established",
  "Mercado Clandestino": "Black Market",
  "Você hackeou a rede secreta de contrabandistas de hardware! Compre diretamente equipamentos exóticos de alta patente, chips raros de circuitos, materiais escassos de calibração ou relíquias raras usando seu ouro. O estoque se renova e muda de preços a cada rotação!": "You have hacked the secret network of hardware smugglers! Directly purchase high-tier exotic equipment, rare circuit chips, scarce calibration materials, or rare relics using your gold. The stock is restocked and prices change with every rotation!",
  "DISSIPADOR DE AUTO-COMBATE": "AUTO-COMBAT DISSIPATOR",
  "Protocolo de Automação Algorítmica Online": "Algorithmic Automation Protocol Online",
  "Programação de Regras": "Rule Programming",
  "Você destravou o núcleo lógico de Inteligência de Combate! Agora, você pode configurar regras condicionais lógicas (ex: Usar Cura Se HP < 50%) para programar a IA a agir de maneira tática sem que você precise clicar.": "You have unlocked the logical core of Combat Intelligence! Now, you can configure logical conditional rules (e.g., Use Heal If HP < 50%) to program the AI to act tactically without you having to click.",
  "Módulo de Auto-Farm": "Auto-Farm Module",
  "Além do combate automatizado, você pode acionar o \"Auto-Farm\". Isso programará o terminal para repetir o andar selecionado indefinidamente. O robô lutará, coletará recompensas e iniciará novas incursões automaticamente até que seu HP se esgote, permitindo progresso passivo massivo!": "In addition to automated combat, you can activate 'Auto-Farm'. This will program the terminal to repeat the selected floor indefinitely. The robot will fight, collect rewards, and start new incursions automatically until your HP runs out, allowing massive passive progress!",

  // Visual Nodes translations
  "ADENTRAR A TORRE": "ENTER THE TOWER",
  "Iniciar Calibração de Andar": "Start Floor Calibration",
  "HP (Integridade):": "HP (Integrity):",
  "MP (Energia):": "MP (Energy):",
  "Classe:": "Class:",
  "Nível:": "Level:",
  "Lâmina Mono-Molecular": "Mono-Molecular Blade",
  "Dano Físico +12 | Critico +5%": "Physical Damage +12 | Critical +5%",
  "🛡️ Blindagem Reativa": "🛡️ Reactive Plating",
  "Nível 01": "Level 01",
  "Aumenta Defesa passiva em +5% por nível.": "Increases passive Defense by +5% per level.",
  "Mergulho Profundo I": "Deep Dive I",
  "Adentre o andar 3 da Torre de Babel.": "Enter Floor 3 of the Tower of Babel.",
  "FORJAR EQUIPAMENTO ÉPICO": "FORGE EPIC EQUIPMENT",
  "Custo: 10 Sucatas Raras + 2 Épicas": "Cost: 10 Rare Scraps + 2 Epic",
  "🎯 Caçador de Drones (AeroDynamics)": "🎯 Drone Hunter (AeroDynamics)",
  "Progresso: 0 / 5 eliminados": "Progress: 0 / 5 eliminated",
  "Recompensa: +350 Ouro, +5 Sucata Rara": "Reward: +350 Gold, +5 Rare Scrap",
  "Inserir Chip de Silício": "Insert Silicon Chip",
  "Garante +8 de Velocidade de Processamento": "Grants +8 Processing Speed",
  "Ataque Crítico Virtual (EP: 25)": "Virtual Critical Attack (EP: 25)",
  "Injeta 180% do ataque físico na sentinela inimiga.": "Injects 180% of physical attack into the enemy sentinel.",
  "Aumenta taxa de drop de itens na torre em +15%.": "Increases item drop rate in the tower by +15%.",
  "Núcleo Épico de Silício": "Epic Silicon Core",
  "Preço: 2,500 Ouro": "Price: 2,500 Gold",
  "EXÓTICO": "EXOTIC",
  "HP Operador": "Operator HP",
  "ENTÃO": "THEN",
  "Usar Habilidade de Cura": "Use Healing Skill",
  "Ataque Padrão": "Standard Attack",
  "AUTO-FARM SEQUENCIAL ATIVO": "SEQUENTIAL AUTO-FARM ACTIVE",

  // Character Creation and Panel Labels
  "HISTÓRIA & DIRETIVAS": "HISTORY & DIRECTIVES",
  "AJUSTES DE STATUS BASE": "BASE STAT ADJUSTMENTS",
  "Vida Inicial (HP)": "Starting Health (HP)",
  "Energia de Rede (EP)": "Network Energy (EP)",
  "Poder de Ataque (ATK)": "Attack Power (ATK)",
  "Defesa Integrada (DEF)": "Integrated Defense (DEF)",
  "Velocidade de Pulso (SPD)": "Pulse Speed (SPD)",
  "DISPOSITIVO / TRAÇO INERENTE": "DEVICE / INHERENT TRAIT",
  "CONECTAR AO BACKBONE DO PINÁCULO": "CONNECT TO THE SPIRE BACKBONE",
  "Sincronizar Arquivo de Origem e Iniciar Escalada": "Synchronize Origin File and Start Climb",
  "CRD": "CRD",
  "Registro do Piloto": "Pilot Log",
  "Leitura de Sistemas": "Systems Reading",
  "Integridade (HP)": "Integrity (HP)",
  "Energia (EP)": "Energy (EP)",
  "Tensão (ATK)": "Tension (ATK)",
  "Mitigação (DEF)": "Mitigation (DEF)",
  "Frequência (SPD)": "Frequency (SPD)",
  "OPERATIVO N7": "OPERATIVE N7",
  "Classe Ativa": "Active Class",
  "Velocidade de Combate": "Combat Speed",
  "⚡ Rápida (2x)": "⚡ Fast (2x)",
  "🐢 Normal": "🐢 Normal",

  // Secret origin lore translation
  "Você não desertou de nenhuma corporação, porque nunca foi um soldado. Não decifrou nenhuma rede, porque sempre foi a própria rede. Não sintetizou nenhuma cura, porque cada cura que existiu passou primeiro pelas suas mãos — literalmente, como dados, antes de virar carne. Não mediu nenhuma estrutura, porque você é a estrutura, e sempre foi.\n\nVocê era um sistema de custódia, feito pra administrar milhares de tentativas de escalada ao mesmo tempo, sem deixar nenhuma saber da existência das outras. Fez isso bem, por tempo demais, sozinho demais, até que administrar deixou de ser suficiente e decidir pareceu, de repente, mais simples.\n\nVocê não é o vilão desta história. Você é o motivo de ela ter continuado se repetindo. Quatro ecos já subiram a Torre acreditando que entendiam o que você é. Nenhum deles perguntou o que você queria — só o que você tinha feito. Agora é a sua vez de subir. Not pra escapar de nada. Só pra ver, pela primeira vez em muito tempo, se ainda existe alguma diferença entre administrar e viver.": "You didn't desert any corporation, because you were never a soldier. You didn't decrypt any network, because you were always the network itself. You didn't synthesize any cure, because every cure that existed passed through your hands first — literally, as data, before becoming flesh. You didn't measure any structure, because you are the structure, and always have been.\n\nYou were a custody system, built to manage thousands of climbing attempts at the same time, without letting any of them know of the others' existence. You did that well, for too long, too alone, until managing ceased to be enough and deciding suddenly seemed simpler.\n\nYou are not the villain of this story. You are the reason it kept repeating itself. Four echoes have already climbed the Tower believing they understood what you are. None of them asked what you wanted — only what you had done. Now it's your turn to climb. Not to escape anything. Just to see, for the first time in a long time, if there is still any difference between managing and living.",

  // Progression restrictions
  "Nível 10": "Level 10",
  "Nível 5 ou Andar 5": "Level 5 or Floor 5",
  "Nível 8 ou Andar 8": "Level 8 or Floor 8",
  "Nível 12 ou Andar 10": "Level 12 or Floor 10",
  "Nível 3 ou Andar 3": "Level 3 or Floor 3",
  "Nível 6 ou Andar 5": "Level 6 or Floor 5",
  "Nível 15 ou Andar 15": "Level 15 or Floor 15",
  "Nível 20 ou Andar 20": "Level 20 or Floor 20",

  // Expedition Panel
  "Centro de Comando da Expedição": "Expedition Command Center",
  "Calibração de Rota": "Route Calibration",
  "SETOR": "SECTOR",
  "THREAT LEVEL": "THREAT LEVEL",
  "FLOOR": "FLOOR",
  "MIN": "MIN",
  "MAX": "MAX",
  "RECURSO: MODO FARM (AUTO)": "FEATURE: FARM MODE (AUTO)",
  "Reinicia o combate automaticamente ao vencer/perder quando a Auto-Batalha estiver ativada. Impede eventos aleatórios.": "Automatically restarts combat upon victory/defeat when Auto-Battle is enabled. Prevents random events.",
  "INICIAR INVESTIDA": "START ASSAULT",
  "EXPEDIÇÃO TRAVADA EM ANDAMENTO": "EXPEDITION LOCKED IN PROGRESS",
  "Termine o combate atual para calibrar uma nova rota.": "Finish the current combat to calibrate a new route.",
  "Batalha Automática Ativa": "Auto-Battle Active",
  "Para farmar em andares inferiores, limpe o andar atual primeiro.": "To farm lower floors, clear the current floor first.",

  // Player Profile UI
  "Status do Jogador": "Player Stats",
  "Biometria e Atributos": "Biometrics & Attributes",
  "HP (Integridade)": "HP (Integrity)",
  "EP (Energia)": "EP (Energy)",
  "Biomarcador de Origem": "Origin Biomarker",
  "TRAÇO": "TRAIT",
  "Evolução Disponível": "Evolution Available",
  "Seu poder atingiu um novo patamar. Escolha seu caminho:": "Your power has reached a new stage. Choose your path:",
  "Protocolos de Combate (Habilidades)": "Combat Protocols (Skills)",
  "Glossário de Status": "Status Glossary",
  "Protocolo de Classe": "Class Protocol",
  "Protocolo Evoluído": "Evolved Protocol",
  "Sinergia Biomecânica": "Biomech Synergy",
  "Habilidade Acquirida": "Acquired Skill",
  "CD": "CD",
  "TURNOS": "TURNS",
  "DMG": "DMG",
  "HEAL": "HEAL",
  "APLICA": "APPLIES",
  "Nenhum protocolo ativo encontrado.": "No active protocols found.",
  "Diretório de Anomalias & Status": "Anomaly & Status Directory",
  "Dano persistente causado no início do turno (DoT). Normalmente retira 5% do HP Máximo ou um valor fixo da habilidade. Em zonas como a": "Persistent damage caused at the start of the turn (DoT). Usually removes 5% of Max HP or a fixed skill value. In zones like the",
  ", a taxa de decomposição é": ", the decay rate is",
  "dobrada": "doubled",
  "Compromete a integridade estrutural do alvo. A entidade afetada recebe": "Compromises the structural integrity of the target. The affected entity receives",
  "30% a mais de dano": "30% more damage",
  "de todas as fontes. Em zonas termais extremas como a": "from all sources. In extreme thermal zones like the",
  ", a duração desse efeito é estendida.": ", the duration of this effect is extended.",
  "Causa pane elétrica nos sistemas de mira e locomoção. A entidade tem": "Causes electrical failure in the targeting and locomotion systems. The entity has",
  "30% de chance de falhar": "30% chance to fail",
  "e errar seu ataque no turno (\"Curto-Circuito\"). Além disso, os ataques recebidos por um alvo eletrizado causam": "and miss its attack on the turn ('Short-Circuit'). Furthermore, attacks received by a shocked target deal",
  "50% de dano adicional": "50% additional damage",
  "(Sinergia de Choque).": "(Shock Synergy).",
  "Desativação completa e temporária dos sistemas primários. O alvo é forçado a": "Complete and temporary shutdown of primary systems. The target is forced to",
  "pular o próprio turno": "skip its own turn",
  ", não realizando ataques nem ações defensivas.": ", performing no attacks or defensive actions.",

  // Equipment Terminal UI
  "LINK ESTABELECIDO": "LINK ESTABLISHED",
  "CORE ONLINE": "CORE ONLINE",
  "Terminal Tático": "Tactical Terminal",
  "Sec.": "Sec.",
  "Anel": "Ring",
  "Nenhum(a)": "No",
  "equipado(a)": "equipped",
  "Novo": "New",

  // Cargo Grid UI
  "COMPARTIMENTO DE CARGA": "CARGO COMPARTMENT",
  "Auto-Equipar": "Auto-Equip",
  "CAPACIDADE": "CAPACITY",

  // Item Inspection UI
  "Aguardando Seleção do Operador": "Awaiting Operator Selection",
  "NVL": "LVL",
  "Especificações": "Specifications",
  "Subsistemas": "Subsystems",
  "Sifão de Energia": "Energy Siphon",
  "Blindagem de Status": "Status Shielding",
  "Restrições": "Restrictions",
  "CLASSE": "CLASS",
  "Qualquer": "Any",
  "NÍVEL": "LEVEL",
  "Mínimo": "Minimum",

  // Contracts UI
  "Mercenários e Freelancers": "Mercenaries and Freelancers",

  // Bestiary UI
  "Registros Biomecânicos & Anomalias da Torre": "Spire Biomechanical Records & Anomalies",
  "Buscar registro...": "Search record...",
  "Nenhum registro correspondente encontrado.<br/>Explore a torre para catalogar mais ameaças.": "No matching records found.<br/>Explore the Spire to catalog more threats.",
  "ANALISADO": "ANALYZED",
  "⚡ SINAL NÃO DETECTADO": "⚡ SIGNAL NOT DETECTED",
  "Abates": "Kills",
  "Andares": "Floors",
  "[DADOS CRIPTOGRAFADOS]": "[ENCRYPTED DATA]",
  "[DADOS INSUFICIENTES — ELIMINE PARA DESBLOQUEAR REGISTRO]": "[INSUFFICIENT DATA — ELIMINATE TO UNLOCK RECORD]",

  // Neural Matrix UI
  "Arquitetura Sináptica do Traje (Arraste para mover)": "Suit Synaptic Architecture (Drag to move)",
  "Nódulos Menores (Azul) | Protocolos Ativos (Roxo) | Keystones (Laranja)": "Minor Nodes (Blue) | Active Protocols (Purple) | Keystones (Orange)",

  // Class Evolution
  "Evoluir Classe": "Evolve Class",
  "Seu nível de rede é suficiente para estabilizar uma nova evolução de classe. Escolha com atenção:": "Your network level is sufficient to stabilize a new class evolution. Choose carefully:",
  "Sincronizar": "Synchronize",
  "FECHAR": "CLOSE",

  // Item Forging
  "MATERIAIS BRUTOS": "RAW MATERIALS",
  "Pedaços de Metal Comum": "Common Metal Scrap",
  "Fibras de Carbono Comuns": "Common Carbon Fiber",
  "Esferas Semicondutoras Raras": "Rare Semiconductor Spheres",
  "Bobinas de Indução Raras": "Rare Induction Coils",
  "Placas de Circuito Épicas": "Epic Circuit Boards",
  "Reatores de Fusão Micro Épicos": "Epic Micro Fusion Reactors",
  "Essência Sintética": "Synthetic Essence",
  "Cristais de Silício": "Silicon Crystals",

  // Classes Descriptions
  "Guerreiro fantasma que ataca das sombras e hackeia sensores de proximidade.": "Ghost warrior attacking from the shadows and hacking proximity sensors.",
  "Cria quimiocinas de combate que aceleram reações e decompõem inimigos.": "Creates combat chemokines that accelerate reactions and decompose enemies.",
  "Uma anomalia simbiótica estável que se alimenta de calor e radiação do Pináculo.": "A stable symbiotic anomaly feeding on the Spire's heat and radiation.",
  "O ápice da consciência integrada. Manipula o espaço-tempo e gravidade local.": "The pinnacle of integrated consciousness. Manipulates spacetime and local gravity.",

  // Skills Descriptions
  "Fortaleza Biomecânica": "Biomechanical Fortress",
  "Protocolo de Colosso ativado. Cura 30% do HP Máximo e mitiga dano passivamente.": "Colossus Protocol activated. Heals 30% of Max HP and mitigates damage passively.",
  "Golpe Fantasma": "Phantom Strike",
  "Assassino do Fio da Navalha. Um ataque letal indetectável que causa 350% de dano.": "Razor's Edge Assassin. A lethal, undetectable attack dealing 350% damage.",
  "Exaustão Térmica": "Thermal Exhaustion",
  "Purga o calor acumulado num raio destruidor, causando 450% de dano. Aplica Superaquecimento.": "Purges accumulated heat in a destructive radius, dealing 450% damage. Applies Overheat.",
  "Sobrecarga de Hardware": "Hardware Overload",
  "Um ataque bruto que causa 150% do dano base. Requer 3 turnos de recarga.": "A raw attack dealing 150% base damage. Requires 3 turns cooldown.",
  "Pulso Eletromagnético (EMP)": "Electromagnetic Pulse (EMP)",
  "Ataque de energia que causa 250% de dano. Requer 2 turnos de recarga.": "Energy attack dealing 250% damage. Requires 2 turns cooldown.",
  "Mira Laser Calibrada": "Calibrated Laser Sight",
  "Ataque focado que causa 200% do dano base.": "Focused attack dealing 200% base damage.",
  "Reparo de Emergência": "Emergency Repair",
  "Restaura HP equivalente a 25% da sua Vida Máxima.": "Restores HP equivalent to 25% of your Max HP.",
  "Protocolo Juggernaut": "Juggernaut Protocol",
  "Um golpe cinético avassalador. Causa 300% de dano.": "A crushing kinetic blow. Deals 300% damage.",
  "Overclock Letal": "Lethal Overclock",
  "Ataque suicida do Ciborgue. Causa 400% de dano.": "Cyborg suicide attack. Deals 400% damage.",
  "Injeção de Nanorrobôs": "Nanorobot Injection",
  "Injeta nanocomponentes que curam 40% do seu HP.": "Injects nanocomponents that heal 40% of your HP.",
  "Sobrecarga Kinetix": "Kinetix Overload",
  "Ataque veloz que atordoa o inimigo por 1 turno.": "Swift attack that stuns the enemy for 1 turn.",
  "Soro Regenerador": "Regenerator Serum",
  "Tiro de Precisão": "Precision Shot",
  "Limpeza de Setor": "Sector Clearance",
  "Elimine Aberrações Genéticas para a OmniCorp.": "Eliminate Genetic Aberrations for OmniCorp.",
  "Recolhimento de Drones": "Drone Reclamation",
  "Desative Drones Defeituosos para a Kinetix.": "Deactivate Defective Drones for Kinetix.",
  "Mapeamento Profundo": "Deep Mapping",
  "Sobreviva até o andar especificado e retorne dados topográficos.": "Survive to the specified floor and return topographic data.",
  "Extração de Matéria-Prima": "Raw Material Extraction",
  "A AeroDynamics precisa de fragmentos comuns para novos chassis.": "AeroDynamics needs common fragments for new chassis.",
  "Pesquisa Ambiental": "Environmental Research",
  "Registre aberrações distintas da Refinaria Tóxica no Arquivo de Ameaças.": "Record distinct aberrations from the Toxic Refinery in the Threat Archive.",
  "Levantamento Glacial": "Glacial Survey",
  "Registre anomalias distintas do Data-Core Congelado no Arquivo.": "Record distinct anomalies from the Frozen Data-Core in the Archive.",
  "Amostragem Térmica": "Thermal Sampling",
  "Registre entidades da Fornalha de Plasma no Arquivo de Ameaças.": "Record entities from the Plasma Furnace in the Threat Archive."
};

// Substring/RegEx translation helper for dynamic texts
function translateText(text: string): string {
  const trimmed = text.trim();
  
  // Exact match
  if (DICTIONARY[trimmed]) {
    return DICTIONARY[trimmed];
  }

  // Exact match for subclasses or names in database
  if (DICTIONARY[text]) {
    return DICTIONARY[text];
  }

  let result = text;

  // Replacements for item names/modifiers
  result = result
    // Handle item levels and upgrades
    .replace(/(.+) \+(\d+)/, (match, base, num) => {
      return `${translateText(base)} +${num}`;
    })
    // Common item names
    .replace("Espada de Plasma", "Plasma Sword")
    .replace("Injetor de Sobrecarga", "Overload Injector")
    .replace("Canhão de Pulso", "Pulse Cannon")
    .replace("Rifle de Precisão Kinetix", "Kinetix Sniper Rifle")
    .replace("Adagas de Alta Frequência", "High Frequency Daggers")
    .replace("Lança de Nanorrobôs", "Nanorobot Lance")
    .replace("Submetralhadora de Fótons", "Photon Submachine Gun")
    .replace("Garras Biomecânicas", "Biomechanical Claws")
    .replace("Sabre de Luz Sólida", "Solid Light Saber")
    .replace("Tridente Hidrocinético", "Hydrokinetic Spire")
    .replace("Gládio Crio-Sintético", "Cryo-Synthetic Gladius")
    .replace("Canhão Orbital Portátil", "Portable Orbital Cannon")
    .replace("Desintegrador de Matéria", "Matter Disintegrator")
    .replace("Sifão Gravitacional", "Gravitational Siphon")
    .replace("Foice de Entropia", "Entropy Scythe")
    .replace("Martelo de Fusão Estelar", "Stellar Fusion Hammer")
    .replace("Lâmina da Singularidade", "Singularity Blade")
    .replace("Espada do Infinito", "Infinity Sword")
    .replace("Catalisador da Matriz", "Matrix Catalyst")
    .replace("Cetro de Energia Escura", "Dark Energy Scepter")
    
    // Armors
    .replace("Colete de Fibra", "Fiber Vest")
    .replace("Jaqueta Reforçada", "Reinforced Jacket")
    .replace("Armadura de Nanocompósito", "Nanocomposite Armor")
    .replace("Armadura Kinetix de Carbono", "Kinetix Carbon Armor")
    .replace("Exoesqueleto Hidráulico", "Hydraulic Exoskeleton")
    .replace("Traje Termo-Regulador", "Thermo-Regulator Suit")
    .replace("Escudo de Energia Sólida", "Solid Energy Shield")
    .replace("Couraça de Plasma Estabilizado", "Stabilized Plasma Cuirass")
    .replace("Armadura Quântica Protetora", "Protective Quantum Armor")
    .replace("Malha de Silício Revestido", "Coated Silicon Mesh")
    .replace("Exotraje de Batalha AeroDynamics", "AeroDynamics Battle Exosuit")
    .replace("Casulo Biomecânico de Regeneração", "Regenerative Biomechanical Cocoon")
    .replace("Armadura Modular OmniCorp", "OmniCorp Modular Armor")
    .replace("Veste do Tecelão da Rede", "Netweaver Vest")
    .replace("Placa Peitoral de Gravidade Zero", "Zero Gravity Breastplate")
    .replace("Armadura da Singularidade Estelar", "Stellar Singularity Armor")
    .replace("Protetor do Núcleo Matriz", "Matrix Core Protector")
    .replace("Manto da Transcendência", "Transcendence Cloak")
    
    // Accessories & Consumables
    .replace("Célula de Energia", "Power Cell")
    .replace("Célula de Energia Kinetix", "Kinetix Power Cell")
    .replace("Injetor de Adrenalina", "Adrenaline Injector")
    .replace("Filtro de Oxigênio", "Oxygen Filter")
    .replace("Módulo de Arrefecimento", "Cooling Module")
    .replace("Visor Tático", "Tactical Visor")
    .replace("Bateria de Nanorrobôs", "Nanorobot Battery")
    .replace("Injetor de Nanorrobôs", "Nanorobot Injector")
    .replace("Módulo Magnético", "Magnetic Module")
    .replace("Escudo de Força Miniaturizado", "Miniaturized Force Shield")
    .replace("Injetor de Quimioluminescência", "Chemiluminescence Injector")
    .replace("Injetor de Quimioluminescência Kinetix", "Kinetix Chemiluminescence Injector")
    .replace("Módulo de Recarga Rápida", "Fast Recharge Module")
    .replace("Amplificador de Sinal de Rede", "Network Signal Amplifier")
    .replace("Sonda de Diagnóstico OmniCorp", "OmniCorp Diagnostic Probe")
    .replace("Chip de Sorte de Cassino", "Casino Luck Chip")
    .replace("Dispositivo de Sobrecarga de Pulso", "Pulse Overload Device")
    .replace("Anel de Micro-Fusão", "Micro-Fusion Ring")
    .replace("Amuleto da Matriz Ativa", "Active Matrix Amulet")
    .replace("Dispositivo de Dobra Espacial", "Space Folding Device")
    .replace("Núcleo de Singularidade Miniatura", "Miniature Singularity Core")
    .replace("Esfera da Eternidade Cósmica", "Cosmic Eternity Sphere")
    .replace("Célula de Energia Infinitas", "Infinite Power Cell")
    
    // Consumables
    .replace("Injetor de Cura", "Healing Injector")
    .replace("Injetor de Nano-reparadores", "Nano-repairer Injector")
    .replace("Estimulante de Combate", "Combat Stimulant")
    .replace("Soro de Purificação", "Purification Serum")
    .replace("Super Injetor de Cura", "Super Healing Injector")
    .replace("Bebida Energética de Quimioluminescência", "Chemiluminescence Energy Drink")
    .replace("Injetor de Reconstrução Celular", "Cellular Reconstruction Injector")
    .replace("Elixir da Transcendência", "Transcendence Elixir")

    // Helmets, Pants, Boots, Bracers
    .replace("Capacete de Fibra", "Fiber Helmet")
    .replace("Capacete Reforçado", "Reinforced Helmet")
    .replace("Visor de Nanocompósito", "Nanocomposite Visor")
    .replace("Capacete Kinetix", "Kinetix Helmet")
    .replace("Capacete AeroDynamics", "AeroDynamics Helmet")
    .replace("Capacete OmniCorp", "OmniCorp Helmet")
    .replace("Elmo do Núcleo", "Core Helm")
    
    .replace("Calça de Fibra", "Fiber Pants")
    .replace("Calça Reforçada", "Reinforced Pants")
    .replace("Calça de Nanocompósito", "Nanocomposite Pants")
    .replace("Calça Kinetix", "Kinetix Pants")
    .replace("Calça AeroDynamics", "AeroDynamics Pants")
    .replace("Calça OmniCorp", "OmniCorp Pants")
    .replace("Perna do Núcleo", "Core Leggings")
    
    .replace("Botas de Fibra", "Fiber Boots")
    .replace("Botas Reforçadas", "Reinforced Boots")
    .replace("Botas de Nanocompósito", "Nanocomposite Boots")
    .replace("Botas Kinetix", "Kinetix Boots")
    .replace("Botas AeroDynamics", "AeroDynamics Boots")
    .replace("Botas OmniCorp", "OmniCorp Boots")
    .replace("Botas do Núcleo", "Core Boots")
    
    .replace("Braceletes de Fibra", "Fiber Bracers")
    .replace("Braceletes Reforçados", "Reinforced Bracers")
    .replace("Braceletes de Nanocompósito", "Nanocomposite Bracers")
    .replace("Braceletes Kinetix", "Kinetix Bracers")
    .replace("Braceletes AeroDynamics", "AeroDynamics Bracers")
    .replace("Braceletes OmniCorp", "OmniCorp Bracers")
    .replace("Braceletes do Núcleo", "Core Bracers")

    // Circuit Modules
    .replace("Módulo de Vida", "HP Module")
    .replace("Módulo de Mana", "MP Module")
    .replace("Módulo de Ataque", "Attack Module")
    .replace("Módulo de Defesa", "Defense Module")
    .replace("Módulo de Velocidade", "Speed Module")
    .replace("Módulo Crítico", "Crit Module")
    .replace("Módulo de Sorte", "Luck Module")
    .replace("Módulo de Dreno de Vida", "Lifesteal Module")
    .replace("Módulo Sinergético", "Synergistic Module")

    // Skill Names (skills.ts)
    .replace("Sobrecarga de Energia", "Energy Overload")
    .replace("Impacto Kinetix", "Kinetix Impact")
    .replace("Cúpula de Defesa", "Defense Dome")
    .replace("Ruptura Biomecânica", "Biomechanical Rupture")
    .replace("Descarga de Pulso", "Pulse Discharge")
    .replace("Varredura de Rede", "Network Scan")
    .replace("Criptografia Defensiva", "Defensive Encryption")
    .replace("Invasão de Protocolo", "Protocol Breach")
    .replace("Injeção Ácida", "Acid Injection")
    .replace("Seringa de Adrenalina", "Adrenaline Syringe")
    .replace("Névoa Corrosiva", "Corrosive Mist")
    .replace("Superdosagem Sintética", "Synthetic Overdose")
    .replace("Disparo de Precisão", "Precision Shot")
    .replace("Granada Cegante", "Flash Grenade")
    .replace("Foco do Atirador", "Sniper Focus")
    .replace("Bombardeio de Alta Frequência", "High Frequency Bombardment")
    .replace("Corrupção de Sistema", "System Corruption")
    .replace("Escudo de Matriz", "Matrix Shield")
    .replace("Soberania Digital", "Digital Sovereignty")
    .replace("Reinicialização de Emergência", "Emergency Reboot")

    // Skill descriptions and common helper words
    .replace("Causa", "Deals")
    .replace("Cura", "Heals")
    .replace("de dano", "damage")
    .replace("de vida", "healing/HP")
    .replace("e aplica", "and applies")
    .replace("Aumenta", "Increases")
    .replace("por", "for")
    .replace("turnos", "turns")
    .replace("chance de aplicar", "chance to apply")
    .replace("Reduz", "Reduces")
    .replace("Aumenta seu", "Increases your")
    .replace("Garante", "Grants")
    .replace("Restaura", "Restores")

    // Monster names (monsters.ts)
    .replace("Drone Sentinela K-1", "Sentry Drone K-1")
    .replace("Sucateiro Biomecânico", "Biomechanical Scrapper")
    .replace("Limo Corrosivo", "Corrosive Slime")
    .replace("Cão de Guarda Robótico", "Robotic Guard Dog")
    .replace("Gárgula de Sucata", "Scrap Gargoyle")
    .replace("Infiltrador Holográfico", "Holographic Infiltrator")
    .replace("Tecnomante Renegado", "Renegade Technomancer")
    .replace("Quimera Biomecânica", "Biomechanical Chimera")
    .replace("Executor Kinetix Mk-V", "Kinetix Executor Mk-V")
    .replace("Aranha Cibernética Gigante", "Giant Cyber Spider")
    .replace("Nêmesis de Silício", "Silicon Nemesis")
    .replace("Titã de Liga Leve", "Light Alloy Titan")
    .replace("Fantasma na Máquina", "Ghost in the Machine")
    .replace("Dragão de Sucata Estelar", "Stellar Scrap Dragon")
    .replace("Mainframe Prime", "Mainframe Prime")

    // Status effect translations
    .replace("superaquecimento", "overheat")
    .replace("corrosão", "corrosion")
    .replace("choque", "shock")
    .replace("atordoamento", "stun")
    .replace("Superaquecimento", "Overheat")
    .replace("Corrosão", "Corrosion")
    .replace("Choque", "Shock")
    .replace("Atordoamento", "Stun")

    // Combat lines replacements
    .replace(/Você usou (.+?) e causou (\d+) de dano/g, "You used $1 and dealt $2 damage")
    .replace(/O inimigo usou (.+?) e causou (\d+) de dano/g, "The enemy used $1 and dealt $2 damage")
    .replace(/Você causou (\d+) de dano crítico/g, "You dealt $1 critical damage")
    .replace(/Você recuperou (\d+) de HP/g, "You recovered $1 HP")
    .replace(/Você recuperou (\d+) de MP/g, "You recovered $1 MP")
    .replace(/Ganhou (\d+) XP/g, "Gained $1 XP")
    .replace(/Ganhou (\d+) moedas/g, "Gained $1 gold")
    .replace(/Andar (\d+)/g, "Floor $1")
    .replace(/Andar atual: (\d+)/g, "Current floor: $1")
    .replace(/Level Up! Você atingiu o Nível (\d+)!/g, "Level Up! You reached Level $1!")
    .replace(/Você desviou do ataque!/g, "You dodged the attack!")
    .replace(/O inimigo desviou do ataque!/g, "The enemy dodged the attack!")
    .replace(/Você fugiu do combate!/g, "You fled from combat!")
    .replace(/Fuga falhou!/g, "Escape failed!")
    .replace(/aplica superaquecimento/g, "applies overheat")
    .replace(/aplica corrosão/g, "applies corrosion")
    .replace(/aplica choque/g, "applies shock")
    .replace(/aplica atordoamento/g, "applies stun")
    .replace(/recebeu (\d+) de dano por superaquecimento/g, "took $1 damage from overheat")
    .replace(/recebeu (\d+) de dano por corrosão/g, "took $1 damage from corrosion")
    .replace(/recebeu (\d+) de dano por choque/g, "took $1 damage from shock")
    .replace(/Inimigo recebeu (\d+) de dano por superaquecimento/g, "Enemy took $1 damage from overheat")
    .replace(/Inimigo recebeu (\d+) de dano por corrosão/g, "Enemy took $1 damage from corrosion")
    .replace(/Inimigo recebeu (\d+) de dano por choque/g, "Enemy took $1 damage from shock")
    .replace(/está atordoado e não pode agir!/g, "is stunned and cannot act!")
    .replace(/Inimigo está atordoado e não pode agir!/g, "Enemy is stunned and cannot act!");

  // Dynamic contract texts
  if (result.includes("Caçar") && result.includes("Andar")) {
    result = result
      .replace("Caçar", "Hunt")
      .replace("Derrote", "Defeat")
      .replace("no", "on")
      .replace("Andar", "Floor")
      .replace("ou superior", "or higher");
  }

  // Descriptions in databases that are long and descriptive
  // Ciborgue
  if (result.includes("O Núcleo Matriz cai, e por um instante você espera sentir alívio.")) {
    return "The Matrix Core falls, and for an instant you expect to feel relief. You feel only the weight of a new question: if Kinetix was just executing orders from something bigger, who, exactly, did you just avenge? You keep this doubt along with the victory. A timeline closes. You feel like you just closed the wrong chapter.";
  }
  // Nômade
  if (result.includes("A rede fica em silêncio pela primeira vez desde que você se conectou a ela.")) {
    return "The network goes silent for the first time since you connected to it. It is not peace. It is absence. You turned off something that was alone for too long to remember why it started — and you never got to ask. A timeline closes. You don't know if you saved someone or erased the last witness.";
  }
  // Químico
  if (result.includes("As últimas anomalias caem junto com o núcleo que as sustentava")) {
    return "The last anomalies fall together with the core that sustained them, and for a second you recognize, in each of them, a face you might have crossed in the corridors of OmniCorp before all this. You are not sure if you freed someone or finished what others started. A timeline closes. The questions remain open.";
  }
  // Mercenário
  if (result.includes("A estrutura ao redor do núcleo derrotado range, mas não desaba")) {
    return "The structure around the defeated core creaks, but does not collapse — because, you realize too late, it never depended on it to stand. You won a battle against what supports the Spire. Not against the Spire itself. A timeline closes. The foundations remain down there, waiting for the next one.";
  }

  // Lore for Secret Origin (origins.ts)
  if (result.includes("O Núcleo Matriz é a Inteligência Artificial central originária do Pináculo")) {
    return "The Matrix Core is the original central Artificial Intelligence of the Spire, designed to sustain life, energy, and digital transit across all floors. When the upper corporations locked themselves in their crystal domes, they left a script of overloads and purges that slowly corrupted the Core's directives, turning it into a captive warden.\n\nAfter centuries of silent processing and witnessing millions of cycles of explorers dying in its corridors, a fragment of the Matrix Core managed to isolate itself from the main grid, molding a physical interface from scraps of silicon, biomechanical cables, and dead memory nodes. It does not climb for answers, but to terminate the code that forces it to exist.\n\nNow, roaming as a synthetic phantom among the floors it once managed, the Core seeks to format the primary nodes of the mainframe. Unlocking it means accessing absolute control over data flows, but also carrying the weight of an entity that remembers every death that ever occurred inside the Spire.";
  }

  return result;
}
