const fs = require('fs');

const classes = ['tecno_aprendiz', 'mecatronico', 'eletromante', 'operador_drones', 'juggernaut_industrial'];
const rarities = ['common', 'rare', 'epic'];
const slots = ['weapon', 'armor', 'helmet', 'pants', 'boots', 'bracers', 'accessory'];

// To give nice stats based on rarity and slot
function generateStats(slot, rarity, classId) {
    let statTotal = rarity === 'common' ? 10 : rarity === 'rare' ? 35 : 80;
    const value = rarity === 'common' ? 15 : rarity === 'rare' ? 150 : 500;
    
    let stats = {};
    
    // Distribute stats based on slot and classId
    if (slot === 'weapon') {
        if (classId === 'eletromante') {
            stats.atk = Math.floor(statTotal * 0.4);
            stats.mp = Math.floor(statTotal * 0.6);
        } else if (classId === 'operador_drones') {
            stats.atk = Math.floor(statTotal * 0.6);
            stats.spd = Math.floor(statTotal * 0.4);
        } else {
            stats.atk = statTotal;
        }
    } else if (slot === 'armor' || slot === 'pants' || slot === 'helmet') {
        if (classId === 'mecatronico' || classId === 'juggernaut_industrial') {
            stats.def = Math.floor(statTotal * 0.7);
            stats.hp = Math.floor(statTotal * 0.3) * 5; // HP is scaled differently sometimes, but let's keep it simple
            if(rarity !== 'common') stats.spd = -Math.floor(statTotal * 0.1);
        } else {
            stats.def = Math.floor(statTotal * 0.6);
            stats.hp = Math.floor(statTotal * 0.4) * 2;
        }
    } else if (slot === 'boots') {
        stats.spd = Math.floor(statTotal * 0.8);
        stats.def = Math.floor(statTotal * 0.2);
    } else if (slot === 'bracers') {
        stats.def = Math.floor(statTotal * 0.5);
        stats.atk = Math.floor(statTotal * 0.5);
    } else if (slot === 'accessory') {
        stats.hp = Math.floor(statTotal * 0.5) * 3;
        stats.mp = Math.floor(statTotal * 0.5) * 2;
    }
    
    // Fallback for empty
    if (Object.keys(stats).length === 0) stats = { hp: statTotal * 2 };
    
    // Ensure no zeroes
    for(let k in stats) if(stats[k] === 0) delete stats[k];

    return { stats, value };
}

const slotNames = {
    weapon: { base: ['Ferramenta', 'Lâmina', 'Rifle', 'Disparador', 'Canhão', 'Bastão', 'Chave'], classPrefix: { tecno_aprendiz: 'de Manutenção', mecatronico: 'Pesado', eletromante: 'de Plasma', operador_drones: 'de Precisão', juggernaut_industrial: 'Sísmico' } },
    armor: { base: ['Macacão', 'Placa', 'Colete', 'Chassi', 'Blindagem'], classPrefix: { tecno_aprendiz: 'Simples', mecatronico: 'Reforçado', eletromante: 'Isolante', operador_drones: 'Tático', juggernaut_industrial: 'Impenetrável' } },
    helmet: { base: ['Capacete', 'Visor', 'Máscara', 'Coroa', 'Interface'], classPrefix: { tecno_aprendiz: 'de Operário', mecatronico: 'Soldado', eletromante: 'Neural', operador_drones: 'HUD', juggernaut_industrial: 'Titan' } },
    pants: { base: ['Calça', 'Perneira', 'Grevas', 'Protetor', 'Chassi Inferior'], classPrefix: { tecno_aprendiz: 'Utilitária', mecatronico: 'Hidráulica', eletromante: 'Antiestática', operador_drones: 'Ágil', juggernaut_industrial: 'Massiva' } },
    boots: { base: ['Bota', 'Propulsor', 'Pisante', 'Solado', 'Estabilizador'], classPrefix: { tecno_aprendiz: 'de Borracha', mecatronico: 'Magnético', eletromante: 'Aterrador', operador_drones: 'Anti-Grav', juggernaut_industrial: 'de Ancoragem' } },
    bracers: { base: ['Braçadeira', 'Luva', 'Manopla', 'Protetor de Pulso', 'Exo-Braço'], classPrefix: { tecno_aprendiz: 'Térmica', mecatronico: 'Cinética', eletromante: 'Condutora', operador_drones: 'Biométrica', juggernaut_industrial: 'Esmagadora' } },
    accessory: { base: ['Bateria', 'Núcleo', 'Chip', 'Módulo', 'Sensor'], classPrefix: { tecno_aprendiz: 'de Backup', mecatronico: 'de Sobrecarga', eletromante: 'de Fissão', operador_drones: 'Radar', juggernaut_industrial: 'Reator' } }
};

const rarityAdjectives = {
    common: ['Sucateado', 'Enferrujado', 'Padrão', 'Usado', 'Genérico'],
    rare: ['Otimizado', 'Reforçado', 'Militar', 'Avançado', 'Customizado'],
    epic: ['Quântico', 'Protótipo', 'Experimental', 'Sintético', 'Obsoleto e Letal']
};

let dbString = `export const ITEMS_DATABASE: Record<string, Item> = {\n`;

let idCounter = 1;

slots.forEach(slot => {
    dbString += `  // --- ${slot.toUpperCase()} ---\n`;
    rarities.forEach(rarity => {
        // 3 classless items
        for(let i=1; i<=3; i++) {
            let baseName = slotNames[slot].base[i % slotNames[slot].base.length];
            let adj = rarityAdjectives[rarity][i % rarityAdjectives[rarity].length];
            let itemName = `${baseName} ${adj}`;
            let id = `${slot}_${rarity}_classless_${i}`;
            
            let { stats, value } = generateStats(slot, rarity, 'classless');
            
            dbString += `  ${id}: {
    id: '${id}',
    name: '${itemName}',
    type: '${slot}',
    rarity: '${rarity}',
    description: 'Equipamento universal ${rarity}.',
    allowedClassIds: [],
    statModifiers: ${JSON.stringify(stats).replace(/"([^"]+)":/g, '$1:')},
    value: ${value},
  },\n`;
        }
        
        // 1 item per class
        classes.forEach((cls, idx) => {
            let baseName = slotNames[slot].base[idx % slotNames[slot].base.length];
            let adj = rarityAdjectives[rarity][idx % rarityAdjectives[rarity].length];
            let clsPrefix = slotNames[slot].classPrefix[cls];
            let itemName = `${baseName} ${clsPrefix} ${adj}`;
            let id = `${slot}_${rarity}_${cls}`;
            
            let { stats, value } = generateStats(slot, rarity, cls);
            
            dbString += `  ${id}: {
    id: '${id}',
    name: '${itemName}',
    type: '${slot}',
    rarity: '${rarity}',
    description: 'Hardware especializado para ${cls}.',
    allowedClassIds: ['${cls}'],
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
    console.log("Patched 168 items successfully!");
} else {
    console.log("Failed to find boundaries in items.ts");
}
