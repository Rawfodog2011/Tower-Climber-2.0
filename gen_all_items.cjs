const fs = require('fs');

const classes = [
  'tecno_aprendiz', 'mecatronico', 'eletromante', 'operador_drones', 'biotecnologo',
  'juggernaut_industrial', 'ciborgue_combate', 'arquiteto_sistemas', 'tecnomante', 
  'atirador_optico', 'fantasma_silicio', 'cirurgiao_mecanico', 'simbionte_sintetico'
];

const rarities = ['common', 'rare', 'epic'];
const slots = ['weapon', 'armor', 'helmet', 'pants', 'boots', 'bracers', 'accessory'];

const archetypes = {
  tecno_aprendiz: 'hybrid',
  mecatronico: 'tank',
  juggernaut_industrial: 'tank',
  ciborgue_combate: 'tank', 
  simbionte_sintetico: 'tank', 
  eletromante: 'mage',
  arquiteto_sistemas: 'mage',
  tecnomante: 'mage',
  operador_drones: 'rogue',
  atirador_optico: 'rogue',
  fantasma_silicio: 'rogue',
  biotecnologo: 'hybrid',
  cirurgiao_mecanico: 'hybrid',
  classless: 'hybrid'
};

const uniqueClassPrefix = {
  tecno_aprendiz: 'Iniciante',
  mecatronico: 'Engrenado',
  juggernaut_industrial: 'Massivo',
  ciborgue_combate: 'Letal',
  simbionte_sintetico: 'Mutante',
  eletromante: 'Voltaico',
  arquiteto_sistemas: 'Matricial',
  tecnomante: 'Necro-Sintético',
  operador_drones: 'Remoto',
  atirador_optico: 'Telescópico',
  fantasma_silicio: 'Furtivo',
  biotecnologo: 'Orgânico',
  cirurgiao_mecanico: 'Cirúrgico'
};

const slotNames = {
    weapon: ['Ferramenta', 'Lâmina', 'Rifle', 'Disparador', 'Canhão', 'Bastão', 'Chave'],
    armor: ['Macacão', 'Placa', 'Colete', 'Chassi', 'Blindagem'],
    helmet: ['Capacete', 'Visor', 'Máscara', 'Coroa', 'Interface'],
    pants: ['Calça', 'Perneira', 'Grevas', 'Protetor', 'Chassi Inferior'],
    boots: ['Bota', 'Propulsor', 'Pisante', 'Solado', 'Estabilizador'],
    bracers: ['Braçadeira', 'Luva', 'Manopla', 'Protetor de Pulso', 'Exo-Braço'],
    accessory: ['Bateria', 'Núcleo', 'Chip', 'Módulo', 'Sensor']
};

const rarityAdjectives = {
    common: ['Sucateado', 'Enferrujado', 'Padrão', 'Usado', 'Genérico'],
    rare: ['Otimizado', 'Reforçado', 'Militar', 'Avançado', 'Customizado'],
    epic: ['Quântico', 'Protótipo', 'Experimental', 'Sintético', 'Obsoleto e Letal']
};

function generateStats(slot, rarity, classId) {
    let statTotal = rarity === 'common' ? 15 : rarity === 'rare' ? 50 : 120;
    const value = rarity === 'common' ? 15 : rarity === 'rare' ? 150 : 500;
    
    let stats = {};
    const arch = archetypes[classId] || 'hybrid';
    
    if (slot === 'weapon') {
        if (arch === 'mage') {
            stats.atk = Math.floor(statTotal * 0.4);
            stats.mp = Math.floor(statTotal * 0.6);
        } else if (arch === 'rogue') {
            stats.atk = Math.floor(statTotal * 0.6);
            stats.spd = Math.floor(statTotal * 0.4);
        } else {
            stats.atk = statTotal;
        }
    } else if (slot === 'armor' || slot === 'pants' || slot === 'helmet') {
        if (arch === 'tank') {
            stats.def = Math.floor(statTotal * 0.7);
            stats.hp = Math.floor(statTotal * 0.3) * 5; 
            if(rarity !== 'common') stats.spd = -Math.floor(statTotal * 0.1);
        } else {
            stats.def = Math.floor(statTotal * 0.6);
            stats.hp = Math.floor(statTotal * 0.4) * 3;
        }
    } else if (slot === 'boots') {
        stats.spd = Math.floor(statTotal * 0.8);
        stats.def = Math.floor(statTotal * 0.2);
    } else if (slot === 'bracers') {
        stats.def = Math.floor(statTotal * 0.5);
        stats.atk = Math.floor(statTotal * 0.5);
    } else if (slot === 'accessory') {
        if (arch === 'mage') {
            stats.mp = Math.floor(statTotal * 0.7) * 2;
            stats.atk = Math.floor(statTotal * 0.3);
        } else if (arch === 'tank') {
            stats.hp = Math.floor(statTotal * 0.6) * 4;
            stats.def = Math.floor(statTotal * 0.4);
        } else {
            stats.hp = Math.floor(statTotal * 0.5) * 3;
            stats.mp = Math.floor(statTotal * 0.5) * 2;
        }
    }
    
    if (Object.keys(stats).length === 0) stats = { hp: statTotal * 2 };
    for(let k in stats) if(stats[k] === 0) delete stats[k];
    return { stats, value };
}

let dbString = `export const ITEMS_DATABASE: Record<string, Item> = {\n`;

slots.forEach(slot => {
    dbString += `  // --- ${slot.toUpperCase()} ---\n`;
    rarities.forEach(rarity => {
        // 3 classless items
        for(let i=1; i<=3; i++) {
            let baseName = slotNames[slot][i % slotNames[slot].length];
            let adj = rarityAdjectives[rarity][i % rarityAdjectives[rarity].length];
            let itemName = `${baseName} Universal ${adj}`;
            let id = `${slot}_${rarity}_classless_${i}`;
            
            let { stats, value } = generateStats(slot, rarity, 'classless');
            
            dbString += `  ${id}: {
    id: '${id}',
    name: '${itemName}',
    type: '${slot}',
    rarity: '${rarity}',
    description: 'Equipamento universal ${rarity}.',
    allowedClassIds: [],
    requiredLevel: ${rarity === 'common' ? 1 : rarity === 'rare' ? 10 : 40},
    statModifiers: ${JSON.stringify(stats).replace(/"([^"]+)":/g, '$1:')},
    value: ${value},
  },\n`;
        }
        
        // 1 item per class
        classes.forEach((cls, idx) => {
            let baseName = slotNames[slot][idx % slotNames[slot].length];
            let adj = rarityAdjectives[rarity][idx % rarityAdjectives[rarity].length];
            let clsPrefix = uniqueClassPrefix[cls];
            let itemName = `${baseName} ${clsPrefix} ${adj}`;
            let id = `${slot}_${rarity}_${cls}`;
            
            let { stats, value } = generateStats(slot, rarity, cls);
            
            dbString += `  ${id}: {
    id: '${id}',
    name: '${itemName}',
    type: '${slot}',
    rarity: '${rarity}',
    description: 'Hardware especializado para a classe ${cls}.',
    allowedClassIds: ['${cls}'],
    requiredLevel: ${rarity === 'common' ? 1 : rarity === 'rare' ? 10 : 40},
    statModifiers: ${JSON.stringify(stats).replace(/"([^"]+)":/g, '$1:')},
    value: ${value},
  },\n`;
        });
    });
});

dbString += `};\n`;

const original = fs.readFileSync('src/core/entities/items.ts', 'utf-8');
const startStr = "export const ITEMS_DATABASE: Record<string, Item> = {";
const endStr = "export function canClassEquipItem";

const startIdx = original.indexOf(startStr);
const endIdx = original.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    const finalContent = original.substring(0, startIdx) + dbString + original.substring(endIdx);
    fs.writeFileSync('src/core/entities/items.ts', finalContent);
    console.log("Patched all 336 items successfully!");
} else {
    console.log("Failed to find boundaries in items.ts");
}
