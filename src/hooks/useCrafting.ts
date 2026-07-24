import { useCallback } from 'react';
import { Item } from '../types';
import { craftItem, convertMaterials } from '../core/engine/crafting';
import { upgradeRelic } from '../core/entities/relics';
import { AudioManager } from '../core/engine/audio';
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useToast } from '../hooks/useToast';

export const useCrafting = () => {
  const { player, setPlayer } = usePlayerStore();
  const { setInventoryMessage } = useGameUIStore();
  const { triggerToast } = useToast();

  const handleCraft = useCallback((rarity: import('../types').Rarity) => {
    const result = craftItem(player, rarity);
    if (result.success) {
      AudioManager.playSfx('event.craft_success', { rarity });
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage]);

  const handleConvertMaterials = useCallback((direction: 'common_to_rare' | 'rare_to_epic', quantity: number = 1) => {
    const result = convertMaterials(player, direction, quantity);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3500);
  }, [player, setPlayer, setInventoryMessage]);

  const handleUpgradeRelic = useCallback((relicId: string) => {
    const result = upgradeRelic(player, relicId);
    if (result.success) {
      AudioManager.playSfx('event.relic_upgrade');
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage]);

  const handleSocketModule = useCallback((
    moduleItem: import('../types').Item,
    invIndex: number,
    selectedEquipment: { item: import('../types').Item; source: string; index: number },
    socketIndex: number
  ) => {
    const { source, index, item } = selectedEquipment;
    
    const updatedItem = { ...item };
    updatedItem.hardwareSlots = [...(item.hardwareSlots || [])];
    const oldModule = updatedItem.hardwareSlots[socketIndex];
    updatedItem.hardwareSlots[socketIndex] = moduleItem;
    
    setPlayer(p => {
      const nextPlayer = { ...p, inventory: [...p.inventory] };
      nextPlayer.inventory.splice(invIndex, 1);
      if (oldModule) {
        nextPlayer.inventory.push(oldModule);
      }
      
      if (source === 'inventory') {
        nextPlayer.inventory[index] = updatedItem;
      } else {
        nextPlayer.equipment = { ...p.equipment, [source]: updatedItem };
      }
      
      return nextPlayer;
    });
    triggerToast(`Módulo instalado com sucesso!`);
    return updatedItem;
  }, [setPlayer, triggerToast]);

  const handleMergeChips = useCallback((baseItem: import('../types').Item) => {
    const identicals = player.inventory.filter(i => i.id === baseItem.id && i.level === baseItem.level);
    if (identicals.length < 3) {
      triggerToast("São necessários 3 módulos idênticos do mesmo nível para a fusão.");
      return;
    }
    
    const mergeCost = 50 * (baseItem.level || 1);
    if (player.gold < mergeCost) {
      triggerToast(`Ouro insuficiente para a fusão (${mergeCost}G necessários).`);
      return;
    }
    
    setPlayer(p => {
      const nextPlayer = { ...p, inventory: [...p.inventory] };
      nextPlayer.gold -= mergeCost;
      
      let removed = 0;
      for (let i = nextPlayer.inventory.length - 1; i >= 0; i--) {
        if (nextPlayer.inventory[i].id === baseItem.id && nextPlayer.inventory[i].level === baseItem.level && removed < 3) {
          nextPlayer.inventory.splice(i, 1);
          removed++;
        }
      }
      
      const nextLevel = (baseItem.level || 1) + 1;
      const upgradedItem = { ...baseItem, level: nextLevel, name: `${baseItem.name}` };
      
      if (upgradedItem.statModifiers) {
        upgradedItem.statModifiers = { ...upgradedItem.statModifiers };
        Object.entries(upgradedItem.statModifiers).forEach(([key, val]) => {
          upgradedItem.statModifiers![key as keyof import('../types').Stats] = Math.floor(val * 1.5);
        });
      }
      if (upgradedItem.passiveEffects) {
        upgradedItem.passiveEffects = { ...upgradedItem.passiveEffects };
        if (upgradedItem.passiveEffects.lifesteal) {
          upgradedItem.passiveEffects.lifesteal = Number((upgradedItem.passiveEffects.lifesteal * 1.5).toFixed(3));
        }
        if (upgradedItem.passiveEffects.statusResistance) {
          upgradedItem.passiveEffects.statusResistance = Number((upgradedItem.passiveEffects.statusResistance * 1.2).toFixed(2));
        }
      }
      
      nextPlayer.inventory.push(upgradedItem);
      return nextPlayer;
    });
    triggerToast(`Fusão concluída! ${baseItem.name} evoluiu para Nv. ${(baseItem.level || 1) + 1}.`);
  }, [player, setPlayer, triggerToast]);

  const handleUnsocketModule = useCallback((
    socketIndex: number,
    selectedEquipment: { item: import('../types').Item; source: string; index: number }
  ) => {
    const { source, index, item } = selectedEquipment;
    
    const updatedItem = { ...item };
    if (!updatedItem.hardwareSlots || !updatedItem.hardwareSlots[socketIndex]) return;
    
    const oldModule = updatedItem.hardwareSlots[socketIndex];
    updatedItem.hardwareSlots = [...updatedItem.hardwareSlots];
    updatedItem.hardwareSlots[socketIndex] = null;
    
    setPlayer(p => {
      const nextPlayer = { ...p, inventory: [...p.inventory, oldModule] };
      if (source === 'inventory') {
        nextPlayer.inventory[index] = updatedItem;
      } else {
        nextPlayer.equipment = { ...p.equipment, [source]: updatedItem };
      }
      return nextPlayer;
    });
    triggerToast(`Módulo removido com sucesso!`);
    return updatedItem;
  }, [setPlayer, triggerToast]);

  return {
    handleCraft,
    handleConvertMaterials,
    handleUpgradeRelic,
    handleSocketModule,
    handleMergeChips,
    handleUnsocketModule
  };
};
