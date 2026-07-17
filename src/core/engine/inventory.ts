/**
 * engine/inventory.ts
 * Gerencia a lógica de equipar, desequipar e usar itens.
 */

import { Player, Item } from '../../types';
import { canClassEquipItem } from '../entities/items';

export interface EquipResult {
  success: boolean;
  message: string;
  updatedPlayer: Player;
}

/**
 * Tenta equipar um item do inventário.
 * Realiza validação de classe e lida com a troca caso o slot já esteja ocupado.
 */
export function equipItem(player: Player, item: Item, targetSlot?: keyof Player['equipment']): EquipResult {
  if (item.type === 'consumable') {
    return { success: false, message: 'Este item é consumível e não pode ser equipado.', updatedPlayer: player };
  }

  if (!canClassEquipItem(player.currentClassId, item)) {
    return { 
      success: false, 
      message: `Sua classe atual não tem proficiência para usar este item.`, 
      updatedPlayer: player 
    };
  }

  if (item.requiredLevel && player.level < item.requiredLevel) {
    return {
      success: false,
      message: `Nível insuficiente. Este item requer Nível ${item.requiredLevel}.`,
      updatedPlayer: player
    };
  }

  let slot = targetSlot;
  if (!slot) {
    if (item.type === 'accessory') {
      if (!player.equipment.accessory1) slot = 'accessory1';
      else if (!player.equipment.accessory2) slot = 'accessory2';
      else if (!player.equipment.accessory3) slot = 'accessory3';
      else slot = 'accessory1'; // overwrite first if all full
    } else {
      slot = item.type as keyof Player['equipment'];
    }
  }

  const currentEquipped = player.equipment[slot];
  
  const newInventory = [...player.inventory];
  const itemIndex = newInventory.findIndex(i => i.id === item.id);
  if (itemIndex > -1) {
    newInventory.splice(itemIndex, 1);
  }

  if (currentEquipped) {
    newInventory.push(currentEquipped);
  }

  const updatedPlayer: Player = {
    ...player,
    inventory: newInventory,
    equipment: {
      ...player.equipment,
      [slot]: item
    }
  };

  return {
    success: true,
    message: `${item.name} equipado com sucesso no slot ${slot.toUpperCase()}.`,
    updatedPlayer
  };
}

/**
 * Remove um item de um slot e o devolve ao inventário.
 */
export function unequipItem(player: Player, slot: keyof Player['equipment']): EquipResult {
  const currentEquipped = player.equipment[slot];
  
  if (!currentEquipped) {
    return { success: false, message: `Nenhum item equipado neste slot.`, updatedPlayer: player };
  }

  const newInventory = [...player.inventory, currentEquipped];
  const newEquipment = { ...player.equipment };
  delete newEquipment[slot];

  const updatedPlayer: Player = {
    ...player,
    inventory: newInventory,
    equipment: newEquipment
  };

  return {
    success: true,
    message: `${currentEquipped.name} devolvido ao inventário.`,
    updatedPlayer
  };
}

export function autoEquipAll(player: Player): EquipResult {
  let updatedPlayer = { ...player, equipment: { ...player.equipment }, inventory: [...player.inventory] };
  let changes = 0;

  const slots: (keyof Player['equipment'])[] = ['weapon', 'armor', 'helmet', 'pants', 'boots', 'bracers'];
  const accessorySlots: (keyof Player['equipment'])[] = ['accessory1', 'accessory2', 'accessory3'];

  function getItemScore(item: Item): number {
    if (!item.statModifiers) return 0;
    return Object.values(item.statModifiers).reduce((acc: number, val) => acc + (val || 0), 0) + (item.hardwareSlots ? item.hardwareSlots.length * 10 : 0);
  }

  // Iterate slots except accessories
  slots.forEach(slotKey => {
    // Determine target item type from slotKey
    const targetType = slotKey;
    
    // Find all valid items in inventory
    const validItems = updatedPlayer.inventory.filter(item => 
      item.type === targetType && 
      canClassEquipItem(updatedPlayer.currentClassId, item) && 
      (!item.requiredLevel || updatedPlayer.level >= item.requiredLevel)
    );

    if (validItems.length > 0) {
      // Find best item
      let bestItem = validItems.reduce((best, curr) => getItemScore(curr) > getItemScore(best) ? curr : best, validItems[0]);
      
      const currentEquipped = updatedPlayer.equipment[slotKey];
      
      if (!currentEquipped || getItemScore(bestItem) > getItemScore(currentEquipped)) {
        // Equip this item
        const itemIndex = updatedPlayer.inventory.findIndex(i => i.id === bestItem.id);
        updatedPlayer.inventory.splice(itemIndex, 1);
        
        if (currentEquipped) {
          updatedPlayer.inventory.push(currentEquipped);
        }
        
        updatedPlayer.equipment[slotKey] = bestItem;
        changes++;
      }
    }
  });

  // Handle accessories
  const validAccessories = updatedPlayer.inventory.filter(item => 
    item.type === 'accessory' && 
    canClassEquipItem(updatedPlayer.currentClassId, item) && 
    (!item.requiredLevel || updatedPlayer.level >= item.requiredLevel)
  ).sort((a, b) => getItemScore(b) - getItemScore(a));

  if (validAccessories.length > 0) {
    accessorySlots.forEach(slotKey => {
      const currentEquipped = updatedPlayer.equipment[slotKey];
      // If we still have valid accessories
      if (validAccessories.length > 0) {
        const candidate = validAccessories[0];
        if (!currentEquipped || getItemScore(candidate) > getItemScore(currentEquipped)) {
          validAccessories.shift(); // remove from candidates
          const itemIndex = updatedPlayer.inventory.findIndex(i => i.id === candidate.id);
          if(itemIndex !== -1) updatedPlayer.inventory.splice(itemIndex, 1);
          
          if (currentEquipped) {
            updatedPlayer.inventory.push(currentEquipped);
            // Re-sort in case the unequipped one is better than remaining validAccessories, 
            // but for simplicity we ignore adding it back to valid candidates in the same pass.
          }
          
          updatedPlayer.equipment[slotKey] = candidate;
          changes++;
        }
      }
    });
  }

  if (changes > 0) {
    return { success: true, message: `Foram equipados ${changes} itens automaticamente.`, updatedPlayer };
  } else {
    return { success: false, message: 'Nenhum equipamento melhor disponível.', updatedPlayer: player };
  }
}
