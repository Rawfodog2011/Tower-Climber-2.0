import { useCallback } from 'react';
import { Item } from '../types';
import { autoEquipAll, equipItem, unequipItem } from '../core/engine/inventory';
import { dismantleItem, sellItem, dismantleItemsBatch, sellItemsBatch } from '../core/engine/crafting';
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';

export const useInventory = () => {
  const { player, setPlayer } = usePlayerStore();
  const { setInventoryMessage } = useGameUIStore();

  const handleAutoEquip = useCallback(() => {
    const result = autoEquipAll(player);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage]);

  const handleEquip = useCallback((item: Item) => {
    const result = equipItem(player, item);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage]);

  const handleUnequip = useCallback((slot: keyof typeof player.equipment) => {
    const result = unequipItem(player, slot);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage]);

  const handleDismantle = useCallback((index: number) => {
    const result = dismantleItem(player, index);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage]);

  const handleSell = useCallback((index: number) => {
    const result = sellItem(player, index);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage]);

  const handleDismantleBatch = useCallback((items: Item[]) => {
    const result = dismantleItemsBatch(player, items);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage]);

  const handleSellBatch = useCallback((items: Item[]) => {
    const result = sellItemsBatch(player, items);
    if (result.success) {
      setPlayer(result.updatedPlayer);
      setInventoryMessage({ text: result.message, type: 'success' });
    } else {
      setInventoryMessage({ text: result.message, type: 'error' });
    }
    setTimeout(() => setInventoryMessage(null), 3000);
  }, [player, setPlayer, setInventoryMessage]);

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
