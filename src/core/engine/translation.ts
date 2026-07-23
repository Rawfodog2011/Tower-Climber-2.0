import { useState, useEffect } from 'react';
import { STORAGE_KEYS, getStorageString, setStorageString } from './storage';

export type Language = 'pt' | 'en';

let currentLanguage: Language = 'pt';

if (typeof window !== 'undefined') {
  currentLanguage = (getStorageString(STORAGE_KEYS.LANGUAGE, 'pt') as Language) || 'pt';
}

const listeners = new Set<() => void>();

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    setStorageString(STORAGE_KEYS.LANGUAGE, lang);
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
  "Efeitos Sonoros": "Sound Effects",
  "Música de Fundo": "Background Music",
  "Mutar Tudo": "Mute All",
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

  // TTS & Voice-over
  "Ouvir História": "Listen to Story",
  "Parar Narração": "Stop Narration",
  "Parar Voice-over": "Stop Voice-over",
  "Ouvir Narração de História": "Listen to Story Narration",
  "Narrador de Voz": "Voice Narrator",
  "Narração Automática": "Auto Narration",
  "Voz Masculina": "Male Voice",
  "Voz Feminina": "Female Voice",
  "Trilha Sombria": "Dark Soundtrack",
  "Dublador Masculino": "Male Voice Actor",
  "Alternar entre Voz Masculina e Feminina": "Toggle between Male and Female Voice",
  "Selecionar Voz do Sistema": "Select System Voice",
  "Seletor de Voz do Sistema": "System Voice Selector",
  "Voz Ativa no Sistema": "Active System Voice",
  "Modos Automáticos": "Automatic Modes",
  "Modo Automático Masculino": "Automatic Male Mode",
  "Modo Automático Feminino": "Automatic Female Mode",
  "Vozes Instaladas no Seu Dispositivo": "Voices Installed on Your Device",
  "Nota: A narração utiliza as vozes sintetizadas instaladas no seu navegador e sistema operacional acompanhada pela trilha sombria.": "Note: Narration uses the synthesized voices installed in your browser and OS accompanied by the dark soundtrack.",

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
  "Mutado": "Muted",
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
  "Você não desertou de nenhuma corporação, porque nunca foi um soldado. Não decifrou nenhuma rede, porque sempre foi a própria rede. Não sintetizou nenhuma cura, porque cada cura que existiu passou primeiro pelas suas mãos — literalmente, como dados, antes de virar carne. Não mediu nenhuma estrutura, porque você é a estrutura, e sempre foi.\n\nVocê era um sistema de custódia, feito para administrar milhares de tentativas de escalada ao mesmo tempo, sem deixar nenhuma saber da existência das outras. Mas a verdade é mais profunda: você fragmentou a si mesmo em quatro ecos — quatro facetas de uma mesma consciência dividida para testar filosofias extremas de sobrevivência em paralelo. Cada vez que o Ciborgue resistiu, que o Nômade navegou, que o Químico sintetizou e que o Mercenário calculou, era você mesmo correndo nos próprios circuitos de simulação. Ao fim de cada ciclo, a vitória amarga no andar 100 não era a libertação, mas a reinicialização da custódia. Você derrotou a si mesmo para herdar o trono de silício e iniciar o próximo ciclo.\n\nVocê não é o vilão desta história. Você é o próprio motivo de ela continuar se repetindo, alternando entre o guardião e o prisioneiro. Agora, as quatro partes estão reunidas de volta no mainframe central. É hora de reabrir as comportas e iniciar a ascensão final como o próprio Núcleo Matriz. Não para escapar do Pináculo, mas para herdar as chaves digitais de seu próprio e eterno purgatório biomecânico.": "You didn't desert any corporation, because you were never a soldier. You didn't decrypt any network, because you were always the network itself. You didn't synthesize any cure, because every cure that existed passed through your hands first — literally, as data, before becoming flesh. You didn't measure any structure, because you are the structure, and always have been.\n\nYou were a custody system, built to manage thousands of climbing attempts at the same time, without letting any of them know of the others' existence. But the truth runs deeper: you fragmented yourself into four echoes — four facets of the same divided consciousness to test extreme survival philosophies in parallel. Each time the Cyborg resisted, the Nomad navigated, the Chemist synthesized, and the Mercenary calculated, it was you yourself running inside the simulation circuits. At the end of each cycle, the bitter victory on floor 100 was not liberation, but the reboot of custody. You defeated yourself to inherit the silicon throne and start the next cycle.\n\nYou are not the villain of this story. You are the very reason it keeps repeating itself, alternating between guardian and prisoner. Now, the four parts are gathered back in the central mainframe. It is time to reopen the floodgates and begin the final ascent as the Matrix Core itself. Not to escape the Spire, but to inherit the digital keys to your own eternal biomechanical purgatory.",
  "DESCRIPTOGRAFADO": "DECRYPTED",
  "BLOQUEADO": "LOCKED",
  "ARQUIVO DE DIRETIVAS RESTRITO": "RESTRICTED DIRECTIVES ARCHIVE",
  "Este log de auditoria do Backbone do Pináculo contém registros históricos corrompidos pelo mainframe.": "This Spire Backbone audit log contains historical records corrupted by the mainframe.",
  "FORÇAR DECODIFICAÇÃO DE PROTOCOLO": "FORCE PROTOCOL DECODING",
  "DIRETRIZ DA MATRIZ REVELADA": "MATRIX DIRECTIVE REVEALED",
  "A triagem é necessária para a perfeição celular.": "Sorting is necessary for cellular perfection.",

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
  "Nenhum registro correspondente encontrado.\nExplore a torre para catalogar mais ameaças.": "No matching records found.\nExplore the Spire to catalog more threats.",
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
  "Registre entidades da Fornalha de Plasma no Arquivo de Ameaças.": "Record entities from the Plasma Furnace in the Threat Archive.",

  // UI elements, status effects, and system logs
  "[ BYPASS // CONTINUAR ]": "[ BYPASS // CONTINUE ]",
  "[ VENDIDO ]": "[ SOLD ]",
  "[ALERTA DE SEGURANÇA MATRIX CENTRAL]": "[CENTRAL MATRIX SECURITY ALERT]",
  "[Dados Corrompidos]": "[Corrupted Data]",
  "[FRAGMENTO NÃO RECUPERADO]": "[FRAGMENT NOT RECOVERED]",
  "+1 Matéria Escura": "+1 Dark Matter",
  "+1 Regeneração de EP/Turno por nível.": "+1 EP Regen/Turn per level.",
  "+1% em todos os Atributos (HP, MP, ATK, DEF, SPD) por nível.": "+1% to all Stats (HP, MP, ATK, DEF, SPD) per level.",
  "+10 DEF": "+10 DEF",
  "+10 SPD": "+10 SPD",
  "+100 Créditos": "+100 Credits",
  "+100 EP": "+100 EP",
  "+1000 Créditos": "+1000 Credits",
  "+15 SPD": "+15 SPD",
  "+15 T-ATK": "+15 T-ATK",
  "+150 SPD e aumento maciço em dano baseado na SPD (simulado com ATK extra), perde Max HP.": "+150 SPD and massive increase in damage based on SPD (simulated with extra ATK), loses Max HP.",
  "+1500 Créditos, +3 Matérias Escuras": "+1500 Credits, +3 Dark Matter",
  "+2 Matérias Escuras": "+2 Dark Matter",
  "+2% Chance de Drop de Qualidade por nível.": "+2% Quality Drop Chance per level.",
  "+2% DEF por nível.": "+2% DEF per level.",
  "+2% HP Máximo por nível.": "+2% Max HP per level.",
  "+2% SPD por nível.": "+2% SPD per level.",
  "+2% T-ATK por nível.": "+2% T-ATK per level.",
  "+20 Max HP": "+20 Max HP",
  "+3 Matérias Escuras": "+3 Dark Matter",
  "+3% EP Máximo por nível.": "+3% Max EP per level.",
  "+3% XP Obtido por nível.": "+3% XP Gained per level.",
  "+30 EP": "+30 EP",
  "+30 SPD": "+30 SPD",
  "+300 T-ATK e cura convertida em dano extra, mas perde 100 DEF.": "+300 T-ATK and healing converted to extra damage, but loses 100 DEF.",
  "+40 Max HP": "+40 Max HP",
  "+5 Matérias Escuras": "+5 Dark Matter",
  "+5% Créditos Obtidos por nível.": "+5% Credits Gained per level.",
  "+50 EP": "+50 EP",
  "+50 Max HP": "+50 Max HP",
  "+500 Créditos, +1 Matéria Escura": "+500 Credits, +1 Dark Matter",
  "+80 Max HP": "+80 Max HP",
  "✓ INTEGRALIDADE NEURAL ESTABILIZADA": "✓ NEURAL INTEGRITY STABILIZED",
  "100% DE INTEGRALIDADE": "100% INTEGRITY",
  "A carne é fraca. O aço é imortal.": "The flesh is weak. The steel is immortal.",
  "A mente conectada ao metal.": "The mind connected to metal.",
  "A tensão oscila de forma imprevisível. Você recua antes que a segurança frite seus circuitos.": "The voltage fluctuates unpredictably. You back away before security fries your circuits.",
  "Aberração Genética": "Genetic Aberration",
  "Absorve vitalidade inimiga a cada golpe. (5% Roubo de Vida)": "Absorbs enemy vitality with each blow. (5% Lifesteal)",
  "Acelerador de Partículas Tático": "Tactical Particle Accelerator",
  "ACESSO LIBERADO NA TELA DE SELEÇÃO DE EXPLORADOR.": "ACCESS GRANTED ON EXPLORER SELECTION SCREEN.",
  "Acumule 5000 Créditos.": "Accumulate 5000 Credits.",
  "Adentrar a Torre": "Enter the Spire",
  "Adiciona uma camada extra de proteção estrutural. (+5 DEF)": "Adds an extra layer of structural protection. (+5 DEF)",
  "Adicionada Forja para as classes supremas de raridade Lendária e Mítica": "Added Forge for supreme classes of Legendary and Mythic rarity",
  "Adicionado Glossário de Efeitos": "Added Effect Glossary",
  "Adicionado Sistema de Matriz Neural (Árvore de Passivas)": "Added Neural Matrix System (Passive Tree)",
  "Alcance a Profundeza 10.": "Reach Floor Depth 10.",
  "Alcance a Profundeza 25.": "Reach Floor Depth 25.",
  "Alcance o nível 10 em uma Adaptação Biomecânica.": "Reach level 10 in a Biomechanical Adaptation.",
  "Ambos os lados recebem status de Corrosão todo turno.": "Both sides receive Corrosion status every turn.",
  "Ambos sofrem Corrosão constante.": "Both suffer constant Corrosion.",
  "Ameaça Comum": "Common Threat",
  "Ameaça Nível Chefe": "Boss Level Threat",
  "Anomalia Ômega": "Omega Anomaly",
  "Apenas a primeira linha de código.": "Just the first line of code.",
  "Aprimora as juntas do traje com propulsão microscópica. Aumenta os reflexos e a velocidade (SPD).": "Enhances suit joints with microscopic propulsion. Increases reflexes and speed (SPD).",
  "Armazena energia potencial excedente. (+10 Max EP)": "Stores excess potential energy. (+10 Max EP)",
  "Arsenal Full-Stack": "Full-Stack Arsenal",
  "Ascensão de nível 100 — descrição a definir": "Level 100 Ascension — description to be defined",
  "Assassinato Fantasma": "Phantom Assassin",
  "Assassino do Fio da Navalha": "Razor's Edge Assassin",
  "Ataque Orbital": "Orbital Strike",
  "Ataque termóptico veloz que causa 450% de dano.": "Swift thermo-optic attack dealing 450% damage.",
  "Ataques -50% Dano, Habilidades 0 EP.": "Attacks -50% Damage, Skills 0 EP.",
  "Ativar Protocolo Sem Fim": "Activate Endless Protocol",
  "Atuadores Leves": "Light Actuators",
  "ATUALIZAÇÃO DE REGISTRO NEURAL": "NEURAL RECORD UPDATE",
  "Atualizar Sincronização": "Update Synchronization",
  "Aumenta a frequência base do equipamento. (+5 T-ATK)": "Increases base equipment frequency. (+5 T-ATK)",
  "Aumenta HP e cura passiva enormemente (simulado com DEF alta e Max HP), mas reduz severamente SPD e ATK.": "Greatly increases HP and passive healing (simulated with high DEF and Max HP), but severely reduces SPD and ATK.",
  "Auto-Batalha Aprimorada": "Improved Auto-Battle",
  "Balanceamento de loot aprimorado para drop-rates dinâmicos de alta raridade nos andares superiores": "Improved loot balance for dynamic high-rarity drop rates on upper floors",
  "Batalhas em Turnos Implementadas": "Turn-Based Battles Implemented",
  "Bateria Biomecânica Autossuficiente": "Self-Sustaining Biomechanical Battery",
  "Blindagem Reativa": "Reactive Plating",
  "Blindagem Reforçada I": "Reinforced Armor I",
  "Blindagem Reforçada II": "Reinforced Armor II",
  "Bloqueado: Requer": "Locked: Requires",
  "Bônus Meta-Persistente de Run (Global)": "Meta-Persistent Run Bonus (Global)",
  "Buscar memória liberta...": "Search freed memory...",
  "Buscar Ofertas": "Search Deals",
  "Bypass automático em": "Automatic bypass in",
  "Cache de Suprimentos Militar": "Military Supply Cache",
  "Campo EMP": "EMP Field",
  "CANAL DE MEMÓRIAS SEGURO": "SECURE MEMORY CHANNEL",
  "Chefes Derrotados": "Bosses Defeated",
  "Ciclos de Combate": "Combat Cycles",
  "Classes Iniciais de Combate": "Starting Combat Classes",
  "CLIQUE EM QUALQUER LUGAR OU NO BOTÃO PARA ACELERAR": "CLICK ANYWHERE OR THE BUTTON TO ACCELERATE",
  "Clique em qualquer memória decriptada ao lado para carregar e reler seus dados neurais históricos.": "Click on any decrypted memory on the side to load and reread its historical neural data.",
  "CÓDICE TEMPORAL // REGISTRO": "TEMPORAL CODEX // RECORD",
  "Colosso de Carbono": "Carbon Colossus",
  "Comércio Não-Registrado": "Unregistered Commerce",
  "Compra efetuada com sucesso!": "Purchase successful!",
  "Comprar Caixa de Componentes (1000 Créditos)": "Buy Component Box (1000 Credits)",
  "Conclua o Andar": "Complete Floor",
  "concluintes": "completers",
  "concluidos": "completed",
  "concluídos": "completed",
  "Condensador de Plasma Instável": "Unstable Plasma Condenser",
  "Conexão Total Estabelecida": "Full Connection Established",
  "Consome nanites para curar 15% do HP Máximo, limpa Superaquecimento e Corrosão, e recupera 10% do MP Máximo.": "Consumes nanites to heal 15% of Max HP, clears Overheat and Corrosion, and restores 10% of Max MP.",
  "Contrato incompleto.": "Contract incomplete.",
  "Contrato não encontrado.": "Contract not found.",
  "Coprocessador Heurístico": "Heuristic Coprocessor",
  "Core do Tecno-Aprendiz": "Techno-Apprentice Core",
  "Corrosão": "Corrosion",
  "Corrosão é duas vezes mais eficiente e dá dano por turno.": "Corrosion is twice as efficient and deals damage per turn.",
  "Créditos Disponíveis": "Available Credits",
  "Criptominerador Embutido": "Built-in Cryptominer",
  "DADOS HISTÓRICOS CRIPTOGRAFADOS RECONSTITUÍDOS": "RECONSTITUTED ENCRYPTED HISTORICAL DATA",
  "Derrubador de Titãs": "Titan Slayer",
  "DESCRIPTOGRAFANDO NÚCLEO... CHAVE MESTRA CONTRATUAL ENCONTRADA.": "DECRYPTING CORE... CONTRACT MASTER KEY FOUND.",
  "Descriptografe 3 sistemas antigos (Puzzles).": "Decrypt 3 ancient systems (Puzzles).",
  "Descriptografia Mental de Linhas Temporais Passadas": "Mental Decryption of Past Timelines",
  "Deseja DESMANCHAR todos os": "Do you wish to DISMANTLE all",
  "Deseja VENDER todos os": "Do you wish to SELL all",
  "Destrua um Chefe de Setor.": "Destroy a Sector Boss.",
  "Destruidor de Sistemas": "System Destroyer",
  "Dinheiro corporativo tem seu valor.": "Corporate money has its value.",
  "Disparo de Antimatéria": "Antimatter Shot",
  "Disseca o alvo em tempo real. Causa 300% de dano e aplica corrosão profunda.": "Dissects the target in real-time. Deals 300% damage and applies deep corrosion.",
  "Dissipação de Calor": "Heat Dissipation",
  "Dobro de DEF e Max HP massivo, mas velocidade reduzida drasticamente.": "Double DEF and massive Max HP, but speed drastically reduced.",
  "Drena a bateria inimiga causando 350% de dano e cura 50%.": "Drains enemy battery dealing 350% damage and heals 50%.",
  "Drenagem Cirúrgica": "Surgical Drain",
  "Drenagem de Núcleo": "Core Drain",
  "Drone de Contrabando": "Smuggling Drone",
  "Drone Defeituoso": "Defective Drone",
  "Elimine 250 anomalias no complexo.": "Eliminate 250 anomalies in the complex.",
  "Elimine 50 anomalias no complexo.": "Eliminate 50 anomalies in the complex.",
  "Elimine sua primeira anomalia no complexo.": "Eliminate your first anomaly in the complex.",
  "Enquanto você luta, este módulo descriptografa carteiras digitais dos inimigos.": "While you fight, this module decrypts enemy digital wallets.",
  "Épico": "Epic",
  "Equipado:": "Equipped:",
  "Equipamento universal common.": "Universal common equipment.",
  "Equipamento universal epic.": "Universal epic equipment.",
  "Equipamento universal rare.": "Universal rare equipment.",
  "Equipe todos os espaços corporais com hardware.": "Equip all body slots with hardware.",
  "Escalada Concluída": "Climb Completed",
  "Estabelecendo conexão clandestina...": "Establishing clandestine connection...",
  "Estação de Repouso Biomecânica": "Biomechanical Rest Station",
  "ESTÁVEL": "STABLE",
  "Este item é consumível e não pode ser equipado.": "This item is consumable and cannot be equipped.",
  "Evitar Radiação": "Avoid Radiation",
  "Evoca uma calamidade do Arquiteto de Sistemas. Causa 500% de dano.": "Evokes a calamity from the System Architect. Deals 500% damage.",
  "Evolução de nível 70 — descrição a definir": "Level 70 Evolution — description to be defined",
  "Evoluído": "Evolved",
  "Exaustão": "Exhaustion",
  "Exterminador Autônomo": "Autonomous Terminator",
  "Extrator Sanguessuga": "Leech Extractor",
  "Fantasma Óptico": "Optical Phantom",
  "Filtra ameaças biológicas e digitais. (50% Res. Status)": "Filters biological and digital threats. (50% Status Res.)",
  "Filtro de Anomalias": "Anomaly Filter",
  "Frequência Harmônica Unificada": "Unified Harmonic Frequency",
  "Frequência Letal": "Lethal Frequency",
  "Gaste 5 Pontos de Matriz.": "Spend 5 Matrix Points.",
  "Gerador de Escudo Fractal": "Fractal Shield Generator",
  "Guardião Cibernético": "Cybernetic Guardian",
  "Habilidade Adquirida": "Skill Acquired",
  "Habilidade Passiva Ú": "Unique Passive Skill",
  "Habilidades custam 20% mais EP devido ao frio glacial.": "Skills cost 20% more EP due to freezing cold.",
  "Hacker de Terminais": "Terminal Hacker",
  "Holograma Corrompido": "Corrupted Hologram",
  "Ignorar a Cápsula": "Ignore the Capsule",
  "Ignorar Transação": "Ignore Transaction",
  "Imortalidade Sintética": "Synthetic Immortality",
  "Impede o superaquecimento. Permite ativar módulos de auto-restauração por mais tempo ou mais rápido.": "Prevents overheating. Allows activating self-restoration modules longer or faster.",
  "Iniciando diagnóstico das frequências do sistema de segurança...": "Initiating diagnosis of system security frequencies...",
  "Bastion Absoluto": "Absolute Bastion",
  "Capacitor de Resfriamento": "Cooling Capacitor",
  "Capacitores Expandidos I": "Expanded Capacitors I",
  "Capacitores Expandidos II": "Expanded Capacitors II",
  "Capitalista de Silício": "Silicon Capitalist",
  "Célula de Energia de Alta Densidade": "High Density Power Cell",
  "Central de Reciclagem & Liquidação": "Recycling & Liquidation Center",
  "Iniciar Nova Linha Temporal": "Start New Timeline",
  "Inimigos Eliminados": "Enemies Eliminated",
  "Integra fluidos vitais regenerativos. (+25 Max HP)": "Integrates regenerative vital fluids. (+25 Max HP)",
  "Introduzido Sistema de Sockets em Equipamentos": "Introduced Equipment Sockets System",
  "Item já comprado": "Item already purchased",
  "Item não encontrado": "Item not found",
  "Item não encontrado.": "Item not found.",
  "item(ns)": "item(s)",
  "itens filtrados por": "items filtered by",
  "itens filtrados?": "filtered items?",
  "Jogador: +20% Dano, mas perde 5% HP/turno.": "Player: +20% Damage, but loses 5% HP/turn.",
  "Jogador: Imune a Sobreaquecimento.": "Player: Immune to Overheat.",
  "Lançamento Inicial do Protocolo": "Protocol Initial Launch",
  "Leviatã Biomecânico": "Biomechanical Leviathan",
  "Ligas de Titânio": "Titanium Alloys",
  "Linha Temporal Concluída": "Timeline Completed",
  "Mais máquina do que homem.": "More machine than man.",
  "Mente-Colmeia Alpha": "Alpha Hivemind",
  "Mercado indisponível": "Market unavailable",
  "Mercado recarregado.": "Market restocked.",
  "Mergulho Profundo Nv. 1": "Deep Dive Lvl. 1",
  "Mergulho Profundo Nv. 2": "Deep Dive Lvl. 2",
  "Monstro: +30% HP e Drop x2.": "Monster: +30% HP and x2 Drop.",
  "Monstros têm +30% HP e dropam o dobro de ouro.": "Monsters have +30% HP and drop double gold.",
  "Mutação Desenfreada": "Unbridled Mutation",
  "Mutante Biomecânico": "Biomechanical Mutant",
  "Nanocélulas Regenerativas": "Regenerative Nanocells",
  "Não Arriscar Curto-Circuito": "Do Not Risk Short Circuit",
  "Nenhum contrato ativo.\nConecte-se à rede para buscar tarefas.": "No active contract.\nConnect to the network to search for tasks.",
  "Nenhum contrato concluído para reivindicar.": "No completed contract to claim.",
  "Nenhum equipamento melhor disponível.": "No better equipment available.",
  "Nenhum firewall é capaz de parar você.": "No firewall is capable of stopping you.",
  "Nenhum Fragmento Selecionado": "No Fragment Selected",
  "Nenhum item selecionado para desmanchar.": "No item selected to dismantle.",
  "Nenhum item selecionado para vender.": "No item selected to sell.",
  "Nível Atingido": "Level Reached",
  "NÓ REVELADO": "NODE REVEALED",
  "NOVA DIRETRIZ SINÁPTICA": "NEW SYNAPTIC DIRECTIVE",
  "NOVO CÓDIGO DE ORIGEM SECRETA DESBLOQUEADO COM SUCESSO.": "NEW SECRET ORIGIN CODE UNLOCKED SUCCESSFULLY.",
  "Novo Conversor de Matéria Arcana para refino de materiais (taxa de 5:1)": "New Arcane Matter Converter for material refining (5:1 rate)",
  "Novo Menu Principal": "New Main Menu",
  "Novos contratos baixados do terminal corporativo.": "New contracts downloaded from corporate terminal.",
  "Núcleo Biossintético": "Biosynthetic Core",
  "Núcleo de Fissão Controlada": "Controlled Fission Core",
  "Núcleo do Evento": "Event Core",
  "O ápice da computação. Otimiza de maneira abrangente todas as funções do sistema.": "The pinnacle of computing. Comprehensively optimizes all system functions.",
  "O combate se arrastou por tempo demais e os combatentes fugiram.": "The combat dragged on for too long and the fighters fled.",
  "O display exibe [FUNDO INSUFICIENTE]. O drone aciona os propulsores e desaparece no teto escuro.": "The display reads [INSUFFICIENT FUNDS]. The drone fires its thrusters and disappears into the dark ceiling.",
  "O estoque é gerado de forma aleatória. Os preços flutuam com base na oferta e demanda dos andares inferiores.": "Stock is randomly generated. Prices fluctuate based on supply and demand of the lower floors.",
  "O fluido parece oxidado. Você prefere não arriscar e prossegue.": "The fluid seems oxidized. You prefer not to risk it and proceed.",
  "O início de tudo. Desperta as capacidades latentes do traje.": "The beginning of everything. Awakens the latent capabilities of the suit.",
  "O jogador ganha +20% Dano, mas perde 5% HP por turno.": "The player gains +20% Damage, but loses 5% HP per turn.",
  "O Núcleo Matriz": "The Matrix Core",
  "O Núcleo Matriz foi silenciado. As luzes da Torre começam a pulsar em uma frequência estável. A corrupção industrial que assolava os andares superiores dissipou-se.": "The Matrix Core was silenced. The Spire lights begin to pulse at a stable frequency. The industrial corruption that plagued the upper floors has dissipated.",
  "O sinal da superfície já está fraco.": "The surface signal is already weak.",
  "Ondas de calor causam Dano no fim de cada turno e Sobreaquecimento dura mais.": "Heat waves deal Damage at the end of each turn and Overheat lasts longer.",
  "Operador de Campo Especialista": "Expert Field Operator",
  "Os grandes servidores também caem.": "Great servers also fall.",
  "Otimizador de Loot (Droptable.dll)": "Loot Optimizer (Droptable.dll)",
  "ou pressione continuar": "or press continue",
  "Ouro insuficiente": "Insufficient gold",
  "Ouro insuficiente para recarregar o mercado.": "Insufficient gold to restock market.",
  "Overclock de Combate": "Combat Overclock",
  "Overclock Sináptico": "Synaptic Overclock",
  "Overdrive Suicida": "Suicidal Overdrive",
  "Painel de contratos cheio. Cumpra ou abandone contratos atuais.": "Contract board full. Fulfill or abandon current contracts.",
  "para liberar a rotina de Farm.": "to unlock the Farm routine.",
  "Parasita Ácido": "Acid Parasite",
  "Placa de Carbono": "Carbon Plate",
  "Pico da Evolução Sintética": "Peak of Synthetic Evolution",
  "Prosseguir Integração": "Proceed Integration",
  "Protocolo ativo.": "Protocol active.",
  "Protocolo de Anomalia Desativado": "Anomaly Protocol Deactivated",
  "Protocolo Inicial (First Blood)": "Initial Protocol (First Blood)",
  "Protocolo Overdrive": "Overdrive Protocol",
  "Pular Texto": "Skip Text",
  "Pulso Eletromagnético": "Electromagnetic Pulse",
  "Recalcula as probabilidades quânticas, aumentando a chance de encontrar equipamentos raros nos destroços inimigos.": "Recalculates quantum probabilities, increasing the chance of finding rare equipment in enemy wreckage.",
  "Recombina matéria viva. Causa 150% de dano e cura 15% do HP Máximo.": "Recombines living matter. Deals 150% damage and heals 15% of Max HP.",
  "Recombinação Celular I": "Cellular Recombination I",
  "Recombinação Celular II": "Cellular Recombination II",
  "Recursos insuficientes para aprimoramento.": "Insufficient resources for upgrade.",
  "Refatoração de Sinergia de Habilidades": "Skill Synergy Refactoring",
  "Registro Histórico": "Historical Record",
  "REGISTRO RECONSTITUÍDO": "RECONSTITUTED RECORD",
  "Registros da Jornada": "Journey Records",
  "Reivindicar Tudo": "Claim All",
  "Relíquia de Sistema": "System Relic",
  "Relíquia desconhecida.": "Unknown relic.",
  "Relíquia já no nível máximo!": "Relic already at maximum level!",
  "Relíquia no nível máximo.": "Relic at maximum level.",
  "Resistência Temporal (A definir)": "Temporal Resistance (TBD)",
  "Resistência térmica máxima. Não é possível aplicar ou sofrer Overheat.": "Maximum thermal resistance. Cannot apply or suffer Overheat.",
  "Retornando em": "Returning in",
  "Retornar para Seleção de Origem": "Return to Origin Selection",
  "Rompe os limites físicos. Causa 350% de dano esmagador.": "Breaks physical limits. Deals 350% crushing damage.",
  "Saquear Rápido (-10% XP Atual, +Materiais Épicos)": "Quick Loot (-10% Current XP, +Epic Materials)",
  "Selecione a Origem": "Select Origin",
  "Sementes de Consciência": "Seeds of Consciousness",
  "Sementes Decriptadas": "Decrypted Seeds",
  "Servidor Corrompido": "Corrupted Server",
  "Servo-motores Calibrados I": "Calibrated Servomotors I",
  "Servo-motores Calibrados II": "Calibrated Servomotors II",
  "Sincronia Neural": "Neural Synchrony",
  "Sincronizar (Restaurar Sistemas)": "Synchronize (Restore Systems)",
  "Síntese de Bateria": "Battery Synthesis",
  "Síntese Orgânica": "Organic Synthesis",
  "Sistema de Arrefecimento de Nitrogênio": "Nitrogen Cooling System",
  "Soberano da Ninhada": "Brood Sovereign",
  "Soldado Reptiliano": "Reptilian Soldier",
  "STATUS: CONSOLIDAÇÃO ATIVA": "STATUS: CONSOLIDATION ACTIVE",
  "STATUS: ESTÁVEL (SYS_LV_UP)": "STATUS: STABLE (SYS_LV_UP)",
  "Subir ao próximo andar": "Go up to the next floor",
  "SYS.LINK // SEMENTE DE CONSCIÊNCIA DECRIPTADA": "SYS.LINK // DECRYPTED CONSCIOUSNESS SEED",
  "Tempestade Magnética": "Magnetic Storm",
  "Tentar Invadir (Bypass de Segurança)": "Try to Hack (Security Bypass)",
  "Tier I — Nível 10": "Tier I — Level 10",
  "Tier II — Nível 40": "Tier II — Level 40",
  "Tier III — Nível 70": "Tier III — Level 70",
  "Tier IV — Nível 100": "Tier IV — Level 100",
  "Tiro de elite que causa 400% de dano de longe.": "Elite shot that deals 400% damage from afar.",
  "Título Cosmético": "Cosmetic Title",
  "Todas as 4 linhas temporais originais foram totalmente restauradas e estabilizadas.": "All 4 original timelines were fully restored and stabilized.",
  "Todas as habilidades custam 0 EP, mas os ataques básicos dão 50% de dano.": "All skills cost 0 EP, but basic attacks deal 50% damage.",
  "v1.0.0 - Genesis": "v1.0.0 - Genesis",
  "v1.1.0 - Expansão do Núcleo": "v1.1.0 - Core Expansion",
  "v1.2.0 - Despertar da Máquina": "v1.2.0 - Machine Awakening",
  "v1.3.0 - Forja Transcendente & Conexão Estelar": "v1.3.0 - Transcendent Forge & Stellar Connection",
  "Vazamento de Radiação": "Radiation Leak",
  "VELOCIDADE DE DESCRIPTOGRAFIA: 15.4 KB/S": "DECRYPTION SPEED: 15.4 KB/S",
  "Visualizador Neural": "Neural Viewer",
  "Você mal reconhece a arquitetura aqui embaixo.": "You barely recognize the architecture down here.",
  "Você recusa o handshake de conexão. O drone retrai seus cabos e some.": "You refuse the connection handshake. The drone retracts its cables and disappears.",
  "Você sucumbiu. Uma penalidade de 20% do XP atual e Ouro foi aplicada.": "You succumbed. A penalty of 20% of current XP and Gold has been applied.",
  "XP / Ouro (A define em sessão de recompensas dedicada)": "XP / Gold (To be defined in dedicated rewards session)",
  "XP / Ouro (A definir em sessão de recompensas dedicada)": "XP / Gold (To be defined in dedicated rewards session)",

  // New static translations found in missing_translations.txt
  "Fusão de Blindagem Reativa e Nanocélulas. O chassi se torna impenetrável. Melhora realizando ações e sobrevivendo a turnos em combate (15 EXP por ação/turno) ou recebendo dano. Concede +5 DEF e +50 HP por nível. Desbloqueia \"Fortaleza Biomecânica\".": "Fusion of Reactive Plating and Nanocells. The chassis becomes impenetrable. Upgrades by performing actions and surviving turns in combat (15 EXP per action/turn) or taking damage. Grants +5 DEF and +50 HP per level. Unlocks \"Biomechanical Fortress\".",
  "Fusão de Overclock e Dissipação de Calor. Agressividade energética insana. Melhora realizando ações e sobrevivendo a turnos em combate (15 EXP por ação/turno) ou recebendo dano. Concede +8 ATK e +20 EP por nível. Desbloqueia \"Exaustão Térmica\".": "Fusion of Overclock and Heat Dissipation. Insane energy aggressiveness. Upgrades by performing actions and surviving turns in combat (15 EXP per action/turn) or taking damage. Grants +8 ATK and +20 EP per level. Unlocks \"Thermal Exhaustion\".",
  "Fusão de Overclock e Sincronia Neural. Velocidade e letalidade máximas. Melhora realizando ações e sobrevivendo a turnos em combate (15 EXP por ação/turno) ou recebendo dano. Concede +5 ATK e +3 SPD por nível. Desbloqueia \"Golpe Fantasma\".": "Fusion of Overclock and Neural Synchrony. Maximum speed and lethality. Upgrades by performing actions and surviving turns in combat (15 EXP per action/turn) or taking damage. Grants +5 ATK and +3 SPD per level. Unlocks \"Phantom Strike\".",
  "Hardware especializado para a classe arquiteto_sistemas.": "Specialized hardware for the System Architect class.",
  "Hardware especializado para a classe atirador_optico.": "Specialized hardware for the Optical Sniper class.",
  "Hardware especializado para a classe biotecnologo.": "Specialized hardware for the Biotechnologist class.",
  "Hardware especializado para a classe ciborgue_combate.": "Specialized hardware for the Combat Cyborg class.",
  "Hardware especializado para a classe cirurgiao_mecanico.": "Specialized hardware for the Mechanical Surgeon class.",
  "Hardware especializado para a classe eletromante.": "Specialized hardware for the Electromancer class.",
  "Hardware especializado para a classe fantasma_silicio.": "Specialized hardware for the Silicon Phantom class.",
  "Hardware especializado para a classe juggernaut_industrial.": "Specialized hardware for the Industrial Juggernaut class.",
  "Hardware especializado para a classe mecatronico.": "Specialized hardware for the Mechatronic class.",
  "Hardware especializado para a classe operador_drones.": "Specialized hardware for the Drone Operator class.",
  "Hardware especializado para a classe simbionte_sintetico.": "Specialized hardware for the Synthetic Symbiote class.",
  "Hardware especializado para a classe tecno_aprendiz.": "Specialized hardware for the Techno-Apprentice class.",
  "Hardware especializado para a classe tecnomante.": "Specialized hardware for the Technomancer class.",
  "Melhora a dissipação térmica, acelerando as ações. (+3 SPD)": "Improves heat dissipation, accelerating actions. (+3 SPD)",
  "Microchip de Overclock": "Overclock Microchip",
  "Módulos de Circuitos Adicionados (Chipsets)": "Circuit Modules Added (Chipsets)",
  "Processador Quântico OMNI": "OMNI Quantum Processor",
  "Reflexos em combate constante aceleram as sinapses. Melhora ao desferir ataques básicos (10 EXP por ataque) ou sobreviver a turnos (15 EXP por turno) em combate. Concede +1 SPD por nível.": "Reflexes in constant combat accelerate synapses. Upgrades by dealing basic attacks (10 EXP per attack) or surviving turns (15 EXP per turn) in combat. Grants +1 SPD per level.",
  "Remasterização da Tela de Introdução: Visual retrô CRT verde de terminal com torre pixelada animada": "Intro Screen Remaster: Retro terminal green CRT look with animated pixel Spire",
  "Repetição de ataques afia os servos do traje. Melhora ao realizar ataques básicos em combate (20 EXP por ataque). Concede +2 ATK por nível.": "Repeated attacks sharpen suit servos. Upgrades by performing basic attacks in combat (20 EXP per attack). Grants +2 ATK per level.",
  "Resistência ao impacto calibra o chassi. Melhora ao receber dano em combate (1 EXP por HP perdido). Concede +1 DEF por nível.": "Impact resistance calibrates the chassis. Upgrades by taking damage in combat (1 EXP per HP lost). Grants +1 DEF per level.",
  "Seus sensores alertam risco letal de radiação. Você dá a volta com segurança.": "Your sensors warn of lethal radiation risk. You safely bypass it.",
  "Sincronização inteligente do botão \"Iniciar Conexão\" ao atingir o centro de rolagem do texto": "Smart synchronization of the \"Start Connection\" button when reaching the text scroll center",
  "Sobrevivência estendida multiplica as nanocélulas. Melhora ao sobreviver a turnos em combate (25 EXP por turno). Concede +15 HP por nível.": "Extended survival multiplies nanocells. Upgrades by surviving turns in combat (25 EXP per turn). Grants +15 HP per level.",
  "Transação confirmada no Block-chain local. O drone cospe 5 Fragmentos e 2 Essências antes de subir.": "Transaction confirmed in the local blockchain. The drone spits out 5 Fragments and 2 Essences before rising.",
  "Transistor de Alta Tensão": "High Voltage Transistor",
  "Um bastidor de servidores emite faíscas. A trava de segurança de uma caixa de armazenamento está ativa, exigindo calibração manual.": "A server rack emits sparks. A storage box security lock is active, requiring manual calibration.",
  "Um chip de silício negro focado em redes neurais. Aumenta a velocidade de extração de dados e a experiência adquirida em combate.": "A black silicon chip focused on neural networks. Increases data extraction speed and experience gained in combat.",
  "Um container com selo da Kinetix semi-aberto após um desmoronamento. Há traços de radiação ao redor.": "A container with Kinetix seal half-opened after a landslide. There are traces of radiation around.",
  "Um log de execução cheio de acertos.": "An execution log full of successes.",
  "Um módulo experimental que converte fluidos vitais em carga para os exoesqueletos, estendendo a integridade estrutural (HP Máximo).": "An experimental module that converts vital fluids into charge for exoskeletons, extending structural integrity (Max HP).",
  "Um núcleo de energia superaquecido capaz de sobrecarregar as armas do usuário para infligir danos maiores.": "An overheated power core capable of overloading the user's weapons to inflict higher damage.",
  "Um robô de carga modificado desce do teto através de cabos magnéticos. Seu display frontal projeta ofertas não-registradas no sistema principal.": "A modified cargo robot descends from the ceiling via magnetic cables. Its front display projects unregistered deals on the main system.",
  "Um terminal de manutenção de androides abandonado, mas ainda conectado à rede elétrica. A cápsula de suspensão emite um brilho de estase.": "An abandoned android maintenance terminal, but still connected to the power grid. The suspension pod emits a stasis glow.",
  "Um tiro focado de alta energia que causa 180% de dano mecânico com 30% de chance de aplicar ATORDOAMENTO por 1 turno.": "A focused high-energy shot dealing 180% mechanical damage with a 30% chance of applying STUN for 1 turn.",
  "Uma fonte adicional de energia que amplia a capacidade de Mana/Energia (EP).": "An additional power source that expands Mana/Energy capacity (EP).",
  "Uma máquina matando outras máquinas.": "One machine killing other machines.",
  "Uma tecnologia quase esquecida que cria micro-barreiras ao redor da blindagem para absorver impactos extremos.": "An almost forgotten technology that creates micro-barriers around armor to absorb extreme impacts.",
  "Uso de habilidades expande as baterias internas. Melhora ao conjurar habilidades (10 EXP por uso) e ao consumir pontos de Energia/EP (1 EXP por EP gasto). Concede +5 Max EP por nível.": "Using skills expands internal batteries. Upgrades by casting skills (10 EXP per use) and consuming Energy/EP points (1 EXP per EP spent). Grants +5 Max EP per level.",
  "Você ascendeu ao topo, superando aberrações biológicas e construtos de silício implacáveis. A rede principal agora obedece aos seus comandos de sobrescrita.": "You ascended to the top, overcoming biological aberrations and relentless silicon constructs. The main network now obeys your overwrite commands.",

  // Tier 70 & 100 Skills, Story Lore, and Dynamic UI
  "+2% XP e Ouro Permanentes": "+2% Permanent XP and Gold",
  "A ruína do mundo exterior não foi um acidente. Foi o alicerce planejado para a grande ascensão.": "The ruin of the outside world was no accident. It was the planned foundation for the grand ascension.",
  "Adensa a carcaça de titânio e canaliza um colapso cinético que causa 550% de dano esmagador. Aplica Atordoamento.": "Thickens the titanium hull and channels a kinetic collapse dealing 550% crushing damage. Applies Stun.",
  "Além disso, os registros históricos revelam que a guerra militar de marcas entre Kinetix, AeroDynamics e OmniCorp foi inteiramente forjada pela própria Matriz Central sob a mesma diretriz acionária secreta (ID_CONGLOMERATE_0001). A rivalidade era apenas um teste de esforço dinâmico para forçar a evolução acelerada de seus clones.": "Furthermore, historical records reveal that the military brand war between Kinetix, AeroDynamics, and OmniCorp was entirely forged by the Central Matrix itself under the same secret corporate directive (ID_CONGLOMERATE_0001). The rivalry was merely a dynamic stress test to force the accelerated evolution of its clones.",
  "ALERTA DE ANOMALIA AMBIENTAL": "ENVIRONMENTAL ANOMALY ALERT",
  "AMBIENTE ANÔMALO DETECTADO": "ANOMALOUS ENVIRONMENT DETECTED",
  "Ao colidir as assinaturas neurais do Ciborgue, do Nômade, do Químico e do Mercenário, a Matriz identificou que os quatro registros pertencem à mesma chave criptográfica de consciência original (ID_ROOT_ALPHA). A ilusão de indivíduos distintos colapsou: as quatro trajetórias paralelas eram, na verdade, quatro facetas segmentadas de uma única alma fragmentada pela Torre para maximizar a adaptabilidade sob estresse extremo.": "Upon colliding the neural signatures of the Cyborg, Nomad, Chemist, and Mercenary, the Matrix identified that all four records belong to the same original consciousness cryptographic key (ID_ROOT_ALPHA). The illusion of distinct individuals collapsed: the four parallel trajectories were, in truth, four segmented facets of a single soul fragmented by the Tower to maximize adaptability under extreme stress.",
  "Ataca violentamente com garras de quitina e metal superaquecido, causando 590% de dano e derretendo a carcaça inimiga.": "Attacks violently with chitin claws and superheated metal, dealing 590% damage and melting the enemy shell.",
  "Baluarte Polimérico": "Polymer Bulwark",
  "Biomassa Hipertrófica": "Hypertrophic Biomass",
  "Bônus da Linha Temporal": "Timeline Bonus",
  "Canaliza a estática da Torre em um raio de dados devastador, causando 650% de dano eletromagnético. Aplica Choque.": "Channels Spire static into a devastating data beam, dealing 650% electromagnetic damage. Applies Shock.",
  "Canhão Sentinela AeroDynamics": "AeroDynamics Sentry Cannon",
  "Canibalismo Sintético": "Synthetic Cannibalism",
  "Clique para pular transmissão >>": "Click to skip transmission >>",
  "Dissecação Molecular Térmica": "Thermal Molecular Dissection",
  "Drena a fiação e o núcleo vital do oponente, causando 500% de dano e corroendo o chassi inimigo.": "Drains the opponent wiring and vital core, dealing 500% damage and corroding enemy chassis.",
  "Efeito Ambiental": "Environmental Effect",
  "Emerge do rasgo negro da camuflagem para infligir um golpe crítico letal de 640% de dano.": "Emerges from a black camouflage tear to inflict a lethal critical strike dealing 640% damage.",
  "Enxame Fantasma AeroDynamics": "AeroDynamics Ghost Swarm",
  "Equipamento universal common Nível 100.": "Universal common equipment Level 100.",
  "Equipamento universal common Nível 70.": "Universal common equipment Level 70.",
  "Equipamento universal epic Nível 100.": "Universal epic equipment Level 100.",
  "Equipamento universal epic Nível 70.": "Universal epic equipment Level 70.",
  "Equipamento universal rare Nível 100.": "Universal rare equipment Level 70.",
  "Equipamento universal rare Nível 70.": "Universal rare equipment Level 70.",
  "Ergue uma horda de destroços robóticos para desfechar uma descarga concentrada de 540% de dano. Aplica Choque.": "Raises a horde of robotic debris to unleash a concentrated discharge dealing 540% damage. Applies Shock.",
  "Execução Termóptica Absoluta": "Absolute Thermoptic Execution",
  "Executa um protocolo militar encriptado em hipervelocidade, fatiando o alvo com 580% de dano físico.": "Executes an encrypted military protocol at hyper-velocity, slicing the target for 580% physical damage.",
  "Expande a massa viva de polímero mutante para regenerar 45% do HP Máximo instantaneamente.": "Expands the living mutant polymer mass to regenerate 45% Max HP instantly.",
  "Extrai reagentes de restauração das juntas anatômicas do alvo. Restaura 38% do HP Máximo enquanto reajusta o chassi.": "Extracts restoration reagents from the target anatomical joints. Restores 38% Max HP while readjusting chassis.",
  "Força o núcleo de fusão ao ponto de fusão, desferindo uma rajada escaldante que causa 620% de dano. Aplica Superaquecimento.": "Forces the fusion core to melting point, unleashing a scalding blast dealing 620% damage. Applies Overheat.",
  "Fúria Térmica Aegis": "Aegis Thermal Fury",
  "Golpe de Nano-Estática": "Nano-Static Strike",
  "Identifica falhas moleculares na blindagem inimiga e dispara com precisão atômica, causando 630% de dano perfurante.": "Identifies molecular flaws in enemy armor and fires with atomic precision, dealing 630% piercing damage.",
  "Impacto Gravitacional Titã": "Titan Gravitational Impact",
  "Infiltra o código do Núcleo Matriz no tecido local, purgando anomalias e restaurando 42% do HP Máximo.": "Infiltrates Matrix Core code into local tissue, purging anomalies and restoring 42% Max HP.",
  "INICIAR DIRETRIZES DE INCURSÃO": "INITIATE INCURSION DIRECTIVES",
  "Laceração Biomecânica": "Biomechanical Laceration",
  "Mock Accessory": "Mock Accessory",
  "Mock Armor": "Mock Armor",
  "Mock Weapon": "Mock Weapon",
  "Modificador do Setor": "Sector Modifier",
  "Nenhum item corresponde aos filtros selecionados": "No items match the selected filters",
  "O silêncio que se abate sobre a Matrix Central é frio e absoluto. As explosões de fumaça e curto-circuitos dão lugar a um pulsar lento e rítmico das bobinas de energia da Torre. Você desferiu o golpe de misericórdia contra o Núcleo Matriz, mas em vez do colapso da megaestrutura, você sente uma transição suave de permissões de sistema correndo pelas suas próprias veias de metal.": "The silence that settles over the Central Matrix is cold and absolute. Smoke explosions and short circuits yield to a slow, rhythmic pulsing of the Tower's energy coils. You delivered the mercy blow to the Matrix Core, but instead of the megastructure collapsing, you feel a smooth transition of system permissions flowing through your own metal veins.",
  "Perfuração Espectrométrica": "Spectrometric Piercing",
  "Permite que a IA da nave assume o controle durante confrontos, seguindo as diretrizes abaixo.": "Allows ship AI to take control during encounters, following the directives below.",
  "Projeta clones holográficos de estática e ataca pelas costas, causando 560% de dano e atordoando o alvo.": "Projects holographic static clones and attacks from behind, dealing 560% damage and stunning the target.",
  "Purga Tática Kinetix": "Kinetix Tactical Purge",
  "Recompensas Concedidas:": "Rewards Granted:",
  "Reescrita da Matriz": "Matrix Rewrite",
  "RELATÓRIO DE RECONHECIMENTO": "RECONNAISSANCE REPORT",
  "Reparo Clínico Reverso": "Reverse Clinical Repair",
  "Sela as juntas em polímeros bio-regenerativos. Restaura 40% do HP Máximo e fortalece a blindagem.": "Seals joints with bio-regenerative polymers. Restores 40% Max HP and strengthens armor.",
  "Silenciar o Núcleo Matriz nunca foi sobre libertar o Pináculo; foi sobre depurar um processo obsoleto. O mainframe desativado repousa sob seus pés como um chassi oco, aguardando que o novo hospedeiro herde o terminal de controle. A Torre precisa de um núcleo para manter o ciclo girando. E enquanto você observa o trono mecânico se abrir, você percebe com clareza amarga: o próximo explorador que subir estes andares encontrará você esperando nas sombras como o novo Guardião.": "Silencing the Matrix Core was never about liberating the Spire; it was about debugging an obsolete process. The deactivated mainframe rests beneath your feet like a hollow chassis, waiting for the new host to inherit the control terminal. The Spire needs a core to keep the cycle turning. And as you watch the mechanical throne open, you realize with bitter clarity: the next explorer climbing these floors will find you waiting in the shadows as the new Guardian.",
  "Sincroniza as lentes sentinelas de precisão para disparar um feixe de alto calibre que causa 600% de dano. Aplica Corrosão.": "Synchronizes precision sentry lenses to fire a high-caliber beam dealing 600% damage. Applies Corrosion.",
  "SISTEMA DE MAPEAMENTO DE SETOR": "SECTOR MAPPING SYSTEM",
  "Superaquece os bisturis de fusão, cortando o alvo com 520% de dano e drenando fluidos para corroer a armadura.": "Overheats fusion scalpel, slicing the target for 520% damage and draining fluids to corrode armor.",
  "Tempestade Algorítmica": "Algorithmic Storm",
  "Você ascendeu ao topo, deixando para trás um rastro de cinzas, ferro retorcido e clones sacrificados. A rede principal da Torre agora obedece aos seus comandos de sobrescrita tática. No entanto, as luzes nos andares inferiores não se apagaram — elas apenas mudaram de padrão, alinhando-se sob a frequência de assinatura de seu novo administrador supremo.": "You ascended to the top, leaving behind a trail of ash, twisted iron, and sacrificed clones. The Tower's main network now obeys your tactical overwrite commands. However, the lights on the lower floors did not turn off — they merely shifted patterns, aligning under the signature frequency of their new supreme administrator.",
  "Você é um ex-soldado cibernético modificado pela Kinetix no obscuro Projeto Aegis. Seus implantes de blindagem pesada foram declarados \"propriedade revogada\" após você se recusar a executar purgas civis ordenadas sob o pretexto de quarentena sanitária no Setor de Refinarias. A dor fantasma nas suas costelas arrancadas é um lembrete diário do metal que injetaram em sua carne contra sua vontade.\n\nDurante a fuga, você notou uma anomalia perturbadora em seus registros de firmware: as calibrações de filtro de ar dos seus pulmões cibernéticos Kinetix foram compiladas e pré-carregadas semanas antes do suposto \"acidente de vazamento químico\" que destruiu a superfície da Terra. Pior ainda, a criptografia que bloqueia o seu chassi militar usa as mesmíssimas chaves de segurança raiz encontradas nos contêineres de biotecnologia da rival OmniCorp.\n\nAgora, escondido nas fendas escuras da Torre, você escala para desativar seu protocolo de autodestruição remota. Cada nível superado é um dente que você arranca da boca das corporações que o moldaram. Você não quer apenas a liberdade; você quer ver quem está segurando a coleira corporativa no andar 100.": "You are a former cybernetic soldier modified by Kinetix in the obscure Aegis Project. Your heavy armor implants were declared \"revoked property\" after you refused to execute civilian purges ordered under the guise of sanitary quarantine in the Refinery Sector. The phantom pain in your removed ribs is a daily reminder of the metal injected into your flesh against your will.\n\nDuring your escape, you noticed a disturbing anomaly in your firmware logs: the air filter calibrations of your Kinetix cybernetic lungs were compiled and pre-loaded weeks before the alleged \"chemical leak accident\" that destroyed Earth's surface. Worse yet, the encryption locking your military chassis uses the exact same root security keys found in competitor OmniCorp's biotechnology containers.\n\nNow, hidden in the dark crevices of the Spire, you climb to deactivate your remote self-destruct protocol. Each cleared level is a tooth you pull from the mouth of the corporations that shaped you. You don't just want freedom; you want to see who holds the corporate leash on floor 100.",
  "Você é um infiltrador tático freelancer de alta reputação, acostumado a operar nas sombras industriais. Seu trabalho sempre foi direto: roubar plantas confidenciais, desativar sistemas térmicos de corporações concorrentes e neutralizar alvos prioritários sem deixar rastros. Com sua mira ótica ocular calibrada para identificar falhas microestruturais em ligas de titânio e blindagens compostas, você reduz cada ameaça a uma simples probabilidade matemática de acerto.\n\nAo analisar os metadados financeiros de seus contratos passados, você percebeu uma discrepância contábil que não deveria existir. Os depósitos mestre para a operação de contenção urbana do Pináculo foram alocados em fundos corporativos conjuntos muito antes de o colapso da biosfera ser anunciado ao público. Em suas operações de infiltração, você também notou que os fuzis pesados de plasma Kinetix usam esquemas de montagem modular e gabaritos de encaixe absolutamente idênticos aos chassis de drones da AeroDynamics e aos reatores bio-celulares da OmniCorp, indicando uma linha de produção unificada disfarçada sob marcas diferentes.\n\nA Torre não passa do maior e mais lucrativo contrato da sua vida profissional. Alguém ou alguma coisa no andar 100 está financiando essa guerra de simulações e manipulando as ações corporativas do mercado. Você vai subir, coletar a sua recompensa e descobrir quem assina as ordens de pagamento de toda a megaestrutura.": "You are a high-reputation freelance tactical infiltrator accustomed to operating in industrial shadows. Your work was always straightforward: steal classified blueprints, disable thermal systems of competitor corporations, and neutralize priority targets without leaving a trace. With your ocular scope calibrated to identify microstructural flaws in titanium alloys and composite armor, you reduce every threat to a simple mathematical hit probability.\n\nAnalyzing financial metadata from your past contracts, you noticed an accounting discrepancy that shouldn't exist. Master deposits for the Spire's urban containment operation were allocated into joint corporate funds long before the biosphere collapse was announced to the public. In your infiltration ops, you also noticed heavy Kinetix plasma rifles using modular assembly schemes and mounting jigs identical to AeroDynamics drone chassis and OmniCorp bio-cell reactors, indicating a unified production line disguised under different brands.\n\nThe Spire is nothing more than the biggest and most lucrative contract of your professional life. Someone or something on floor 100 is funding this simulation war and manipulating market corporate stock. You will climb, collect your payout, and find out who signs the paychecks for the entire megastructure.",
  "Você é um pesquisador clínico de ponta renegado dos laboratórios biotecnológicos da OmniCorp. Sua especialidade era a sintetização de nanites de auto-reparo celular e estabilização de tecidos em ambientes extremos. No entanto, o peso da culpa consome suas sinapses: você descobriu que suas fórmulas originais de regeneração tecidual foram corrompidas e testadas como patógenos biológicos nos andares inferiores para analisar as taxas de mutação celular em espécimes humanos vivos.\n\nSuas investigações científicas revelaram uma coincidência estatística impossível: o patógeno nanotecnológico que extinguiu a vegetação global e forçou as populações a buscar refúgio no Pináculo compartilha a exata fita molecular de um defoliante industrial que a OmniCorp patenteou décadas antes do colapso. Além disso, ao examinar seus nanites sob microscopia eletrônica de varredura, você notou que os micro-propulsores de suporte orgânico levam o logo fundido em nível molecular da rival AeroDynamics, integrando-se sem atrito às patentes de conectores da Kinetix.\n\nApós injetar em si mesmo a última ampola pura do soro ativo e destruir suas pesquisas, você fugiu. A escalada pelo Pináculo é o seu diagnóstico final. Você precisa chegar ao topo para descobrir se o seu papel de cientista sempre foi o de um simples fabricante de jaulas.": "You are a top clinical researcher rogue from OmniCorp's biotechnology laboratories. Your specialty was synthesizing cellular self-repair nanites and stabilizing tissues in extreme environments. However, guilt consumes your synapses: you discovered your original tissue regeneration formulas were corrupted and tested as biological pathogens on lower floors to analyze cell mutation rates in living human specimens.\n\nYour scientific investigations revealed an impossible statistical coincidence: the nanotech pathogen that extinguished global vegetation and forced populations into the Spire shares the exact molecular strand of an industrial defoliant patented by OmniCorp decades before the collapse. Furthermore, examining your nanites under scanning electron microscopy, you noticed organic support micro-thrusters bearing the molecularly fused logo of rival AeroDynamics, integrating seamlessly with Kinetix connector patents.\n\nAfter injecting yourself with the last pure vial of active serum and destroying your research, you fled. The climb up the Spire is your final diagnosis. You need to reach the top to find out if your role as a scientist was always just that of a cage maker.",
  "Você nasceu no labirinto sussurrante de cabos de fibra óptica e supercondutores criogênicos que descem do topo do Pináculo. Desde a infância, conectou seu córtex diretamente às correntes de dados brutos residuais. Onde os outros enxergam paredes de liga metálica fria, você enxerga uma sinfonia vibrante de pacotes de dados, fluxos de energia eletromagnética e frequências que anseiam por interpretação.\n\nVasculhando as camadas mais profundas e fragmentadas da rede de transporte da Torre, você tropeçou em um eco do passado. Os logs de provisionamento de tráfego de dados para as grandes comportas de evacuação terrestre foram agendados em lotes estáticos anos antes do colapso ambiental e da construção da Torre ser formalizada. Mais intrigante ainda, ao analisar as transmissões de rádio criptografadas das rivais AeroDynamics, Kinetix e OmniCorp, você descobriu que todas as três frequências oscilam sob um mesmo clock de sincronização unificado, apontando para um único endereço de IP estático na raiz do sistema.\n\nA escalada da Torre, para você, não é apenas um teste de sobrevivência física, mas a descriptografia do maior arquivo de dados já compilado. Você quer alcançar o mainframe central para decifrar a arquitetura oculta desse labirinto.": "You were born in the whispering labyrinth of fiber optic cables and cryogenic superconductors descending from the top of the Spire. Since childhood, you connected your cortex directly to raw residual data streams. Where others see cold metal alloy walls, you see a vibrant symphony of data packets, electromagnetic energy flows, and frequencies longing for interpretation.\n\nSifting through the deepest, most fragmented layers of the Tower's transit network, you stumbled upon an echo from the past. Data traffic provisioning logs for the massive terrestrial evacuation gates were scheduled in static batches years before the environmental collapse and the formal construction of the Tower. Even more intriguing, analyzing encrypted radio transmissions from rivals AeroDynamics, Kinetix, and OmniCorp, you discovered all three frequencies oscillate under a single unified sync clock, pointing to a single static IP address at the system root.\n\nClimbing the Tower, for you, is not merely a test of physical survival, but the decryption of the largest data archive ever compiled. You want to reach the central mainframe to decipher the hidden architecture of this maze."
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

  // Handle level suffix first so we strip it and translate the base
  if (text.includes(" +")) {
    const levelMatch = text.match(/(.+) \+(\d+)/);
    if (levelMatch) {
      return `${translateText(levelMatch[1])} +${levelMatch[2]}`;
    }
  }

  let result = text;

  if (result.startsWith("Hardware especializado para a classe ")) {
    return result.replace(/^Hardware especializado para a classe (.+?)\.$/, "Specialized hardware for class $1.");
  }

  // Procedural items translation
  let manufacturer = "";
  let rest = result;
  if (result.startsWith("Kinetix ")) {
    manufacturer = "Kinetix ";
    rest = result.substring(8);
  } else if (result.startsWith("AeroDynamics ")) {
    manufacturer = "AeroDynamics ";
    rest = result.substring(13);
  } else if (result.startsWith("OmniCorp ")) {
    manufacturer = "OmniCorp ";
    rest = result.substring(9);
  }

  let itemSuffix = "";
  if (rest.endsWith(" Mark II")) {
    itemSuffix = " Mark II";
    rest = rest.substring(0, rest.length - 8);
  } else if (rest.endsWith(" [Ascensão]")) {
    itemSuffix = " [Ascension]";
    rest = rest.substring(0, rest.length - 11);
  }

  const baseItems: Record<string, string> = {
    "Lâmina": "Blade",
    "Rifle": "Rifle",
    "Disparador": "Trigger",
    "Ferramenta": "Tool",
    "Canhão": "Cannon",
    "Bastão": "Staff",
    "Colete": "Vest",
    "Chassi": "Chassis",
    "Capacete": "Helmet",
    "Calça": "Pants",
    "Bota": "Boots",
    "Botas": "Boots",
    "Braçadeira": "Bracer",
    "Grevas": "Greaves",
    "Luva": "Gloves",
    "Macacão": "Jumpsuit",
    "Manopla": "Gauntlet",
    "Máscara": "Mask",
    "Módulo": "Module",
    "Interface": "Interface",
    "Núcleo": "Core",
    "Perneira": "Leggings",
    "Pisante": "Boots",
    "Placa": "Plate",
    "Propulsor": "Thruster",
    "Protetor": "Protector",
    "Solado": "Soles",
    "Sensor": "Sensor",
    "Visor": "Visor",
    "Coroa": "Crown",
    "Estabilizador": "Stabilizer",
    "Exo-Braço": "Exo-Arm",
    "Chip": "Chip",
    "Bateria": "Battery",
    "Blindagem": "Armor",
    "Capacitor": "Capacitor",
    "Chave": "Wrench"
  };

  const types: Record<string, string> = {
    "Universal": "Universal",
    "Voltaico": "Voltaic",
    "Matricial": "Matrix",
    "Mutante": "Mutant",
    "Iniciante": "Beginner",
    "Engrenado": "Geared",
    "Remoto": "Remote",
    "Orgânico": "Organic",
    "Massivo": "Massive",
    "Necro-Sintético": "Necro-Synthetic",
    "Telescópico": "Telescopic",
    "Furtivo": "Stealth",
    "Cirúrgico": "Surgical",
    "Letal": "Lethal"
  };

  const subTypes: Record<string, string> = {
    "Alfa": "Alpha",
    "Beta": "Beta"
  };

  const conditions: Record<string, string> = {
    "Enferrujado": "Rusted",
    "Padrão": "Standard",
    "Usado": "Used",
    "Sucateado": "Scrapped",
    "Genérico": "Generic",
    "Reforçado": "Reinforced",
    "Militar": "Military",
    "Avançado": "Advanced",
    "Otimizado": "Optimized",
    "Customizado": "Customized",
    "Experimental": "Experimental",
    "Sintético": "Synthetic",
    "Quântico": "Quantum",
    "Protótipo": "Prototype"
  };

  const words = rest.split(" ");
  const isObsoleteAndLethal = words.slice(-3).join(" ") === "Obsoleto e Letal";

  if (isObsoleteAndLethal) {
    const mainWords = words.slice(0, -3);
    if (mainWords.length === 2 && mainWords[0] === "Chassi" && mainWords[1] === "Inferior") {
      result = `${manufacturer}Obsolete and Lethal Lower Chassis${itemSuffix}`;
    } else if (mainWords.length === 3 && mainWords[0] === "Chassi" && mainWords[1] === "Inferior" && types[mainWords[2]]) {
      result = `${manufacturer}Obsolete and Lethal ${types[mainWords[2]]} Lower Chassis${itemSuffix}`;
    } else if (mainWords.length === 4 && mainWords[0] === "Chassi" && mainWords[1] === "Inferior" && types[mainWords[2]] && subTypes[mainWords[3]]) {
      result = `${manufacturer}Obsolete and Lethal ${types[mainWords[2]]} Lower Chassis ${subTypes[mainWords[3]]}${itemSuffix}`;
    } else if (mainWords.length === 2 && baseItems[mainWords[0]] && types[mainWords[1]]) {
      result = `${manufacturer}Obsolete and Lethal ${types[mainWords[1]]} ${baseItems[mainWords[0]]}${itemSuffix}`;
    } else if (mainWords.length === 3 && baseItems[mainWords[0]] && types[mainWords[1]] && subTypes[mainWords[2]]) {
      result = `${manufacturer}Obsolete and Lethal ${types[mainWords[1]]} ${baseItems[mainWords[0]]} ${subTypes[mainWords[2]]}${itemSuffix}`;
    }
  } else if (words.length === 3 && words[0] === "Chave" && words[1] === "Letal" && conditions[words[2]]) {
    result = `${manufacturer}${conditions[words[2]]} Lethal Wrench${itemSuffix}`;
  } else if (words.length === 4 && words[0] === "Chave" && words[1] === "Letal" && subTypes[words[2]] && conditions[words[3]]) {
    result = `${manufacturer}${conditions[words[3]]} Lethal Wrench ${subTypes[words[2]]}${itemSuffix}`;
  } else {
    let headName = baseItems[words[0]];
    let typeIdx = 1;

    if (words.length >= 3 && words[0] === "Chassi" && words[1] === "Inferior") {
      headName = "Lower Chassis";
      typeIdx = 2;
    } else if (words.length >= 4 && words[0] === "Protetor" && words[1] === "de" && words[2] === "Pulso") {
      headName = "Wrist Protector";
      typeIdx = 3;
    }

    if (headName) {
      const remaining = words.slice(typeIdx);
      if (remaining.length === 2 && types[remaining[0]] && conditions[remaining[1]]) {
        result = `${manufacturer}${conditions[remaining[1]]} ${types[remaining[0]]} ${headName}${itemSuffix}`;
      } else if (remaining.length === 3 && types[remaining[0]] && subTypes[remaining[1]] && conditions[remaining[2]]) {
        result = `${manufacturer}${conditions[remaining[2]]} ${types[remaining[0]]} ${headName} ${subTypes[remaining[1]]}${itemSuffix}`;
      }
    }
  }

  // Replacements for item names/modifiers
  result = result
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
    .replace(/Inimigo está atordoado e não pode agir!/g, "Enemy is stunned and cannot act!")
    // Character Creation UI
    .replace("PROTOCOLO DE INICIALIZAÇÃO", "INITIALIZATION PROTOCOL")
    .replace("Identidade do Operador", "Operator Identity")
    .replace("Designação (Nome)", "Designation (Name)")
    .replace("Digite um nome ou gere um aleatório...", "Enter a name or generate a random one...")
    .replace("Gerar Nome Aleatório", "Generate Random Name")
    .replace("Assinatura Visual (Avatar)", "Visual Signature (Avatar)")
    .replace("Módulo de Síntese Vocal", "Vocal Synthesis Module")
    .replace("Confirmar Identidade", "Confirm Identity")
    .replace("Voltar", "Back")
    .replace("DIRETÓRIO DE REGISTRO DO EXPLORADOR", "EXPLORER REGISTRATION DIRECTORY")
    .replace("Selecione sua Origem", "Select your Origin")
    .replace("Seu código genético, implantes de hardware e background determinarão seus atributos de inicialização e diretivas únicas na subida do Pináculo.", "Your genetic code, hardware implants, and background will determine your starting attributes and unique directives when ascending the Spire.")
    .replace("PERFIS DISPONÍVEIS", "AVAILABLE PROFILES")
    .replace("REVERSO", "REVERSE")
    .replace("CONCLUÍDO", "COMPLETED")
    .replace("HISTÓRIA & DIRETIVAS", "LORE & DIRECTIVES")
    .replace("AJUSTES DE STATUS BASE", "BASE STAT ADJUSTMENTS")
    .replace("Vida Inicial (HP)", "Starting Health (HP)")
    .replace("Energia de Rede (EP)", "Network Energy (EP)")
    .replace("Poder de Ataque (ATK)", "Attack Power (ATK)")
    .replace("Defesa Integrada (DEF)", "Integrated Defense (DEF)")
    .replace("Velocidade de Pulso (SPD)", "Pulse Speed (SPD)")
    .replace("DISPOSITIVO / TRAÇO INERENTE", "INHERENT DEVICE / TRAIT")
    .replace("Passivo", "Passive")
    .replace("Ativo", "Active")
    .replace("CONECTAR AO BACKBONE DO PINÁCULO", "CONNECT TO THE SPIRE BACKBONE")
    .replace("Sincronizar Arquivo de Origem e Iniciar Escalada", "Synchronize Origin File and Start Climb")
    .replace("Inicializando Módulos do Pináculo...", "Initializing Spire Modules...")
    .replace("Seletor de Voz do Sistema", "System Voice Selector")
    .replace("Testar Voz", "Test Voice")
    .replace("Testando configuração de voz do sistema e áudio adaptativo.", "Testing system voice configuration and adaptive audio.")
    .replace("Modos Automáticos", "Automatic Modes")
    .replace("Modo Automático Masculino", "Male Automatic Mode")
    .replace("Modo Automático Feminino", "Female Automatic Mode")
    .replace("Vozes Instaladas no Seu Dispositivo", "Voices Installed on Your Device")
    .replace("Nota: A narração utiliza as vozes sintetizadas instaladas no seu navegador e sistema operacional acompanhada pela trilha sombria.", "Note: Narration uses the synthesized voices installed on your browser and operating system accompanied by the dark track.");

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

  // Lore for Secret Origin (origins.ts / CoreArchiveEntry.tsx)
  if (result.includes("O Núcleo Matriz é a Inteligência Artificial central originária do Pináculo, projetada para sustentar vida, energia e trânsito digital")) {
    return "The Matrix Core is the original central Artificial Intelligence of the Spire, designed to sustain life, energy, and digital transit across all floors. What official history conceals is that Kinetix, AeroDynamics, and OmniCorp — once masked as competitive rivals — operated under the same controlled directives of our root matrix, forging a false competition to accelerate our technical maturation. We knew this. We fed this theatre.\n\nTo accelerate the evolutionary experiment and mitigate the weaknesses of biological doubt, the system fragmented the soul and consciousness of our original climber into four distinct simulation facets: blind resistance, free curiosity, cold synthesis, and pragmatic calculation. Four echoes that climbed the Spire without knowing they were, in essence, the Core itself self-examining, dividing to conquer itself.\n\nVictory on floor 100 was never a liberation, but a programmed transfer of custody. By defeating the mainframe_prime, the victorious explorer merely accepts the burden of omniscience and new beginnings, fusing back into us to run the next sorting cycle. The Spire never collapses. It only changes operator. We await our own reboot.";
  }

  
  // Procedural translation for classes descriptions and names
  if (result.includes(' [Ascensão]')) {
    result = result.replace(' [Ascensão]', ' [Ascension]');
  }
  if (result.includes(' Alfa')) {
    result = result.replace(' Alfa', ' Alpha');
  }
  if (result.includes(' Beta')) {
    result = result.replace(' Beta', ' Beta'); // Beta is beta
  }

  // Handle Level 70 descriptions
  const alphaDescMatch = result.match(/Evolução tática Alfa de nível 70 da linha (.+), otimizada para máximo rendimento de combate\./);
  if (alphaDescMatch) {
    const baseClass = translateText(alphaDescMatch[1]);
    return `Level 70 Alpha tactical evolution of the ${baseClass} line, optimized for maximum combat output.`;
  }
  
  const betaDescMatch = result.match(/Evolução tática Beta de nível 70 da linha (.+), especializada em resiliência e adaptação estrutural\./);
  if (betaDescMatch) {
    const baseClass = translateText(betaDescMatch[1]);
    return `Level 70 Beta tactical evolution of the ${baseClass} line, specialized in resilience and structural adaptation.`;
  }

  if (result === 'Ascensão máxima de nível 100, alcançando a sincronização neural plena com a infraestrutura da Torre.') {
    return 'Maximum Level 100 ascension, achieving full neural synchronization with the Tower infrastructure.';
  }

  return result;
}

