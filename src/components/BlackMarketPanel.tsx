import React, { useState, useEffect } from 'react';
import { Player, MarketItem } from '../types';
import { getInitialMarketState, rerollMarket, buyMarketItem } from '../core/engine/market';
import { ShoppingCart, RefreshCw, Box, Zap, Shield } from 'lucide-react';
import { RELICS_DATABASE } from '../core/entities/relics';
import { MATERIAL_NAMES } from '../core/engine/crafting';
import { useTranslation } from '../core/engine/translation';
import { useAudio } from '../core/engine/useAudio';

import { usePlayerStore } from '../store/usePlayerStore';

export const BlackMarketPanel: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const { t } = useTranslation();
  const { playSfx } = useAudio();

  // Initialize market if not present
  useEffect(() => {
    if (!player.marketState) {
      setPlayer({ ...player, marketState: getInitialMarketState(player) });
    }
  }, []);

  const market = player.marketState;
  if (!market) return <div className="text-cyan-400 animate-pulse">{t("Estabelecendo conexão clandestina...")}</div>;

  const handleBuy = (itemId: string) => {
    const res = buyMarketItem(player, itemId);
    if (res.success) {
      playSfx('ui.buy_item');
      setPlayer(res.updatedPlayer);
      setMessage({ text: t(res.message), type: 'success' });
    } else {
      playSfx('ui.error');
      setMessage({ text: t(res.message), type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleReroll = () => {
    const res = rerollMarket(player);
    if (res.success) {
      playSfx('ui.transaction');
      setPlayer(res.updatedPlayer);
      setMessage({ text: t(res.message), type: 'success' });
    } else {
      playSfx('ui.error');
      setMessage({ text: t(res.message), type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const renderItem = (item: MarketItem) => {
    if (item.purchased) {
      return (
        <div key={item.id} className="system-panel p-4 opacity-50 flex items-center justify-center min-h-[120px]">
          <span className="text-red-400 font-mono uppercase tracking-widest">{t("[ VENDIDO ]")}</span>
        </div>
      );
    }

    let icon = <Box className="w-8 h-8 text-slate-400" />;
    let title = t('Desconhecido');
    let subtitle = '';
    let rarityColor = 'text-slate-400';

    if (item.type === 'equipment' && item.itemData) {
      icon = <Shield className="w-8 h-8 text-cyan-400" />;
      title = t(item.itemData.name);
      subtitle = `${t("Eqp.")} ${t(item.itemData.manufacturer || 'Generico')}`;
      if (item.itemData.rarity === 'rare') rarityColor = 'text-blue-400';
      if (item.itemData.rarity === 'epic') rarityColor = 'text-purple-400';
    } else if (item.type === 'material' && item.materialType) {
      icon = <Zap className="w-8 h-8 text-orange-400" />;
      title = `${item.quantity}x ${t(MATERIAL_NAMES[item.materialType])}`;
      subtitle = t('Material de Forja');
      if (item.materialType === 'rare') rarityColor = 'text-blue-400';
      if (item.materialType === 'epic') rarityColor = 'text-purple-400';
    } else if (item.type === 'relic' && item.relicId) {
      icon = <Box className="w-8 h-8 text-amber-400" />;
      const relic = RELICS_DATABASE[item.relicId];
      title = t(relic.name);
      subtitle = t('Relíquia de Sistema');
      rarityColor = 'text-amber-400';
    }

    return (
      <div key={item.id} className="system-panel p-4 flex flex-col justify-between hover:border-cyan-500/50 transition-colors group">
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-2 bg-slate-900/80 rounded border border-slate-700 group-hover:border-cyan-500/30`}>
            {icon}
          </div>
          <div>
            <div className={`font-bold text-sm ${rarityColor}`}>{title}</div>
            <div className="text-xs text-slate-500 font-mono">{subtitle}</div>
          </div>
        </div>
        
        <button
          onClick={() => handleBuy(item.id)}
          disabled={player.gold < item.price}
          className={`w-full py-2 px-3 rounded flex items-center justify-between text-xs font-mono uppercase tracking-widest transition-all ${
            player.gold >= item.price 
              ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/50 hover:border-emerald-400/80 cursor-pointer font-bold'
              : 'bg-slate-900/50 text-slate-600 border border-slate-800 cursor-not-allowed'
          }`}
        >
          <span>{t("Adquirir")}</span>
          <span className="flex items-center gap-1 font-bold">
            <span className={player.gold >= item.price ? 'text-yellow-400' : 'text-slate-600'}>$</span>
            {item.price}
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-red-500" />
            {t("Rede Clandestina")}
          </h2>
          <p className="text-red-200/60 font-mono text-sm uppercase tracking-wider">{t("Comércio Não-Registrado")}</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-slate-400 text-xs font-mono mb-1">{t("Créditos Disponíveis")}</div>
          <div className="text-xl font-bold text-yellow-400">${player.gold}</div>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded border text-sm font-mono ${message.type === 'success' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50' : 'bg-red-900/30 text-red-400 border-red-500/50'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {market.items.map(renderItem)}
      </div>

      <div className="mt-8 border-t border-slate-800 pt-6 flex justify-between items-center">
        <div className="text-sm text-slate-500 font-mono max-w-md">
          {t("O estoque é gerado de forma aleatória. Os preços flutuam com base na oferta e demanda dos andares inferiores.")}
        </div>
        <button
          onClick={handleReroll}
          disabled={player.gold < market.rerollCost}
          className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${
            player.gold >= market.rerollCost
              ? 'bg-blue-900/30 text-blue-400 border border-blue-500/50 hover:bg-blue-800/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
              : 'bg-slate-900/50 text-slate-600 border border-slate-800 cursor-not-allowed'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${player.gold >= market.rerollCost ? 'animate-spin-slow' : ''}`} />
          {t("Atualizar Sincronização")} (${market.rerollCost})
        </button>
      </div>
      
      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
