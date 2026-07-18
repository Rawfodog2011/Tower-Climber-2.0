import { Player, Item, Rarity } from '../../types';
import { getRandomItemByRarityAndClass } from '../entities/items';

export const GOLD_VALUES: Record<Rarity, number> = {
  common: 5,
  rare: 20,
  epic: 100,
  legendary: 500,
  mythic: 2000
};

export const CRAFTING_COSTS = {
  common: { materials: 3, gold: 50, materialType: 'common' as const },
  rare: { materials: 3, gold: 200, materialType: 'rare' as const },
  epic: { materials: 3, gold: 1000, materialType: 'epic' as const },
  legendary: { materials: 6, gold: 5000, materialType: 'epic' as const },
  mythic: { materials: 12, gold: 15000, materialType: 'epic' as const },
};

export const MATERIAL_NAMES = {
  common: 'Fragmento Comum',
  rare: 'Essência Rara',
  epic: 'Núcleo Épico'
};

export function dismantleItem(player: Player, inventoryIndex: number): { success: boolean, message: string, updatedPlayer: Player } {
  const item = player.inventory[inventoryIndex];
  if (!item) return { success: false, message: 'Item não encontrado.', updatedPlayer: player };

  const updatedPlayer = { 
    ...player, 
    inventory: [...player.inventory], 
    materials: { ...player.materials } 
  };
  
  updatedPlayer.inventory.splice(inventoryIndex, 1);

  const MAX_FRAGMENTS = 300;
  // If the item has legendary or mythic rarity, dismantle it into Epic core for now
  const matKey = (item.rarity === 'legendary' || item.rarity === 'mythic') ? 'epic' : item.rarity;
  const matName = (item.rarity === 'legendary' || item.rarity === 'mythic') ? MATERIAL_NAMES.epic : MATERIAL_NAMES[item.rarity];
  
  let message = `Desmanchado! +1 ${matName}`;
  
  if (updatedPlayer.materials[matKey] >= MAX_FRAGMENTS) {
     const goldEarned = item.value || GOLD_VALUES[item.rarity] || 5;
     updatedPlayer.gold += goldEarned;
     message = `Desmanchado! Limite de ${matName} alcançado (+ ${goldEarned}G compensação)`;
  } else {
     updatedPlayer.materials[matKey] += 1;
  }

  return {
    success: true,
    message,
    updatedPlayer
  };
}

export function craftItem(player: Player, rarity: Rarity): { success: boolean, message: string, updatedPlayer: Player } {
  const cost = CRAFTING_COSTS[rarity];
  const matType = cost.materialType;
  
  if (player.materials[matType] < cost.materials) {
    return { success: false, message: `Faltam ${MATERIAL_NAMES[matType]}s.`, updatedPlayer: player };
  }
  if (player.gold < cost.gold) {
    return { success: false, message: `Ouro insuficiente.`, updatedPlayer: player };
  }

  const newItem = getRandomItemByRarityAndClass(rarity, player.currentClassId);
  if (!newItem) {
    return { success: false, message: `Nenhum item disponível para sua classe nesta raridade.`, updatedPlayer: player };
  }

  const updatedPlayer = { 
    ...player, 
    gold: player.gold - cost.gold,
    materials: { ...player.materials, [matType]: player.materials[matType] - cost.materials },
    inventory: [...player.inventory, newItem]
  };

  return {
    success: true,
    message: `Forja concluída: ${newItem.name}!`,
    updatedPlayer
  };
}

export function convertMaterials(player: Player, direction: 'common_to_rare' | 'rare_to_epic', quantity: number = 1): { success: boolean, message: string, updatedPlayer: Player } {
  const CONVERSION_RATE = 5; // 5 common -> 1 rare, 5 rare -> 1 epic
  const baseGoldCost = direction === 'common_to_rare' ? 100 : 500;
  const goldCost = baseGoldCost * quantity;

  if (player.gold < goldCost) {
    return { success: false, message: `Ouro insuficiente (${goldCost} CRD necessários).`, updatedPlayer: player };
  }

  const updatedPlayer = {
    ...player,
    materials: { ...player.materials }
  };

  if (direction === 'common_to_rare') {
    const neededMaterials = CONVERSION_RATE * quantity;
    if (player.materials.common < neededMaterials) {
      return { success: false, message: `Fragmentos Comuns insuficientes (mínimo ${neededMaterials}).`, updatedPlayer: player };
    }
    updatedPlayer.materials.common -= neededMaterials;
    updatedPlayer.materials.rare += quantity;
    updatedPlayer.gold -= goldCost;
    return {
      success: true,
      message: `Conversão realizada! ${neededMaterials} Fragmentos Comuns convertidos em ${quantity} Essência(s) Rara(s) por ${goldCost} CRD.`,
      updatedPlayer
    };
  } else {
    const neededMaterials = CONVERSION_RATE * quantity;
    if (player.materials.rare < neededMaterials) {
      return { success: false, message: `Essências Raras insuficientes (mínimo ${neededMaterials}).`, updatedPlayer: player };
    }
    updatedPlayer.materials.rare -= neededMaterials;
    updatedPlayer.materials.epic += quantity;
    updatedPlayer.gold -= goldCost;
    return {
      success: true,
      message: `Conversão realizada! ${neededMaterials} Essências Raras convertidas em ${quantity} Núcleo(s) Épico(s) por ${goldCost} CRD.`,
      updatedPlayer
    };
  }
}

export function sellItem(player: Player, inventoryIndex: number): { success: boolean, message: string, updatedPlayer: Player } {
  const item = player.inventory[inventoryIndex];
  if (!item) return { success: false, message: 'Item não encontrado.', updatedPlayer: player };

  const updatedPlayer = { 
    ...player, 
    inventory: [...player.inventory] 
  };
  
  updatedPlayer.inventory.splice(inventoryIndex, 1);

  const goldEarned = item.value || GOLD_VALUES[item.rarity] || 5;
  updatedPlayer.gold += goldEarned;

  return {
    success: true,
    message: `Vendido! ${item.name} por +${goldEarned} CRD!`,
    updatedPlayer
  };
}

export function dismantleItemsBatch(player: Player, itemsToDismantle: Item[]): { success: boolean, message: string, updatedPlayer: Player } {
  if (itemsToDismantle.length === 0) {
    return { success: false, message: 'Nenhum item selecionado para desmanchar.', updatedPlayer: player };
  }

  const updatedPlayer = {
    ...player,
    inventory: [...player.inventory],
    materials: { ...player.materials }
  };

  const MAX_FRAGMENTS = 300;
  
  const matsAdded: Record<string, number> = { common: 0, rare: 0, epic: 0 };
  let extraGoldEarned = 0;

  for (const item of itemsToDismantle) {
    const matKey = (item.rarity === 'legendary' || item.rarity === 'mythic') ? 'epic' : item.rarity;
    
    if (updatedPlayer.materials[matKey] >= MAX_FRAGMENTS) {
      const goldEarned = item.value || GOLD_VALUES[item.rarity] || 5;
      updatedPlayer.gold += goldEarned;
      extraGoldEarned += goldEarned;
    } else {
      updatedPlayer.materials[matKey] += 1;
      matsAdded[matKey] = (matsAdded[matKey] || 0) + 1;
    }
  }

  // Remove os itens do inventário por referência exata para garantir integridade
  updatedPlayer.inventory = updatedPlayer.inventory.filter(invItem => {
    const shouldRemove = itemsToDismantle.includes(invItem);
    return !shouldRemove;
  });

  const parts: string[] = [];
  if (matsAdded.common > 0) parts.push(`+${matsAdded.common} Fragmento(s)`);
  if (matsAdded.rare > 0) parts.push(`+${matsAdded.rare} Essência(s)`);
  if (matsAdded.epic > 0) parts.push(`+${matsAdded.epic} Núcleo(s)`);
  if (extraGoldEarned > 0) parts.push(`+${extraGoldEarned} CRD (compensação)`);

  const message = parts.length > 0 
    ? `Desmanchado(s) ${itemsToDismantle.length} item(ns): ${parts.join(', ')}`
    : `Desmanchado(s) ${itemsToDismantle.length} item(ns).`;

  return {
    success: true,
    message,
    updatedPlayer
  };
}

export function sellItemsBatch(player: Player, itemsToSell: Item[]): { success: boolean, message: string, updatedPlayer: Player } {
  if (itemsToSell.length === 0) {
    return { success: false, message: 'Nenhum item selecionado para vender.', updatedPlayer: player };
  }

  const updatedPlayer = {
    ...player,
    inventory: [...player.inventory]
  };

  let totalGoldEarned = 0;

  for (const item of itemsToSell) {
    const goldEarned = item.value || GOLD_VALUES[item.rarity] || 5;
    updatedPlayer.gold += goldEarned;
    totalGoldEarned += goldEarned;
  }

  // Remove os itens do inventário por referência exata
  updatedPlayer.inventory = updatedPlayer.inventory.filter(invItem => {
    const shouldRemove = itemsToSell.includes(invItem);
    return !shouldRemove;
  });

  return {
    success: true,
    message: `Vendido(s) ${itemsToSell.length} item(ns) por +${totalGoldEarned} CRD!`,
    updatedPlayer
  };
}
