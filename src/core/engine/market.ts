import { random } from './rng';
import { Player, MarketState, MarketItem, Rarity, Item } from '../../types';
import { getRandomItemByRarityAndClass } from '../entities/items';
import { RELICS_DATABASE } from '../entities/relics';

const MATERIAL_BASE_PRICE = {
  common: 100,
  rare: 500,
  epic: 2000
};

const EQUIP_BASE_PRICE = {
  common: 150,
  rare: 750,
  epic: 3000
};

export function generateMarketItems(player: Player): MarketItem[] {
  const items: MarketItem[] = [];
  
  // Equipments (3 slots)
  for(let i=0; i<3; i++) {
    const rarityRand = random();
    let rarity: Rarity = 'common';
    if (rarityRand > 0.9) rarity = 'epic';
    else if (rarityRand > 0.6) rarity = 'rare';

    const item = getRandomItemByRarityAndClass(rarity, player.currentClassId);
    if (item) {
      // Dynamic price fluctuation (80% to 150%)
      const fluctuation = 0.8 + (random() * 0.7);
      const price = Math.floor(EQUIP_BASE_PRICE[rarity] * fluctuation);
      
      items.push({
        id: `equip_${i}_${Date.now()}`,
        type: 'equipment',
        itemData: item,
        price,
        purchased: false
      });
    }
  }

  // Materials (2 slots)
  for(let i=0; i<2; i++) {
    const rarityRand = random();
    let rarity: Rarity = 'common';
    let qty = 1;
    if (rarityRand > 0.85) rarity = 'epic';
    else if (rarityRand > 0.5) rarity = 'rare';

    if (rarity === 'common') qty = Math.floor(random() * 3) + 2; // 2-4
    if (rarity === 'rare') qty = Math.floor(random() * 2) + 1; // 1-2

    const fluctuation = 0.8 + (random() * 0.7);
    const price = Math.floor((MATERIAL_BASE_PRICE[rarity] * qty) * fluctuation);

    items.push({
      id: `mat_${i}_${Date.now()}`,
      type: 'material',
      materialType: rarity,
      quantity: qty,
      price,
      purchased: false
    });
  }

  // Relic (1 slot)
  const relicKeys = Object.keys(RELICS_DATABASE);
  const randomRelicId = relicKeys[Math.floor(random() * relicKeys.length)];
  const fluctuation = 0.8 + (random() * 0.7);
  const baseRelicPrice = 2500;
  
  items.push({
    id: `relic_${Date.now()}`,
    type: 'relic',
    relicId: randomRelicId,
    price: Math.floor(baseRelicPrice * fluctuation),
    purchased: false
  });

  return items;
}

export function getInitialMarketState(player: Player): MarketState {
  return {
    items: generateMarketItems(player),
    rerollCost: 100
  };
}

export function rerollMarket(player: Player): { success: boolean, message: string, updatedPlayer: Player } {
  const state = player.marketState || getInitialMarketState(player);
  
  if (player.gold < state.rerollCost) {
    return { success: false, message: 'Ouro insuficiente para recarregar o mercado.', updatedPlayer: player };
  }

  const updatedPlayer = {
    ...player,
    gold: player.gold - state.rerollCost,
    runStats: {
      ...player.runStats,
      goldSpent: player.runStats.goldSpent + state.rerollCost
    },
    marketState: {
      items: generateMarketItems(player),
      rerollCost: Math.floor(state.rerollCost * 1.5) // Incremental sink
    }
  };

  return { success: true, message: 'Mercado recarregado.', updatedPlayer };
}

export function buyMarketItem(player: Player, itemId: string): { success: boolean, message: string, updatedPlayer: Player } {
  if (!player.marketState) return { success: false, message: 'Mercado indisponível', updatedPlayer: player };
  
  const itemIndex = player.marketState.items.findIndex(i => i.id === itemId);
  if (itemIndex === -1) return { success: false, message: 'Item não encontrado', updatedPlayer: player };
  
  const marketItem = player.marketState.items[itemIndex];
  if (marketItem.purchased) return { success: false, message: 'Item já comprado', updatedPlayer: player };
  if (player.gold < marketItem.price) return { success: false, message: 'Ouro insuficiente', updatedPlayer: player };

  const updatedPlayer = {
    ...player,
    gold: player.gold - marketItem.price,
    runStats: {
      ...player.runStats,
      goldSpent: player.runStats.goldSpent + marketItem.price
    },
    inventory: [...player.inventory],
    materials: { ...player.materials },
    relics: { ...player.relics },
    marketState: {
      ...player.marketState,
      items: [...player.marketState.items]
    }
  };

  // Process purchase based on type
  if (marketItem.type === 'equipment' && marketItem.itemData) {
    updatedPlayer.inventory.push(marketItem.itemData);
  } else if (marketItem.type === 'material' && marketItem.materialType && marketItem.quantity) {
    updatedPlayer.materials[marketItem.materialType] += marketItem.quantity;
  } else if (marketItem.type === 'relic' && marketItem.relicId) {
    const currentLvl = updatedPlayer.relics[marketItem.relicId] || 0;
    const relicDef = RELICS_DATABASE[marketItem.relicId];
    if (currentLvl >= relicDef.maxLevel) {
       return { success: false, message: 'Relíquia já no nível máximo!', updatedPlayer: player };
    }
    updatedPlayer.relics[marketItem.relicId] = currentLvl + 1;
  }

  // Mark as purchased
  updatedPlayer.marketState.items[itemIndex] = { ...marketItem, purchased: true };

  return { success: true, message: 'Compra efetuada com sucesso!', updatedPlayer };
}
