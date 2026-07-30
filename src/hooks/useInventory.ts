import { useCallback } from 'react';
import { Item } from '../types';
import { autoEquipAll, equipItem, unequipItem } from '../core/engine/inventory';
import { dismantleItem, sellItem, dismantleItemsBatch, sellItemsBatch } from '../core/engine/crafting';
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useAudio } from '../core/engine/useAudio';

export const useInventory = () => {
  const { player, setPlayer } = usePlayerStore();
  const { setInventoryMessage } = useGameUIStore();
  const { playSfx } = useAudio();

  const handleAutoEquip = useCallback(() => {
    const result = autoEquipAll(player);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
      playSfx('ui.equip_item');
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
      playSfx('ui.error');
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage, playSfx]);

  const handleEquip = useCallback((item: Item) => {
    const result = equipItem(player, item);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
      playSfx('ui.equip_item');
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
      playSfx('ui.error');
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage, playSfx]);

  const handleUnequip = useCallback((slot: keyof typeof player.equipment) => {
    const result = unequipItem(player, slot);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
      playSfx('ui.panel_close');
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage, playSfx]);

  const handleDismantle = useCallback((index: number) => {
    const result = dismantleItem(player, index);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
      playSfx('event.craft_success', { rarity: 'common' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
      playSfx('ui.error');
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage, playSfx]);

  const handleSell = useCallback((index: number) => {
    const result = sellItem(player, index);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
      playSfx('ui.buy_item');
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
      playSfx('ui.error');
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage, playSfx]);

  const handleDismantleBatch = useCallback((items: Item[]) => {
    const result = dismantleItemsBatch(player, items);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
      playSfx('event.craft_success', { rarity: 'rare' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
      playSfx('ui.error');
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage, playSfx]);

  const handleSellBatch = useCallback((items: Item[]) => {
    const result = sellItemsBatch(player, items);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
      playSfx('ui.buy_item');
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
      playSfx('ui.error');
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage, playSfx]);

  return {
    handleAutoEquip,
    handleEquip,
    handleUnequip,
    handleDismantle,
    handleSell,
    handleDismantleBatch,
    handleSellBatch
  };
};
