import React from 'react';
import { motion } from 'motion/react';
import { Item, Player } from '../../types';
import { Sparkles, ArrowUp } from 'lucide-react';
import { useTranslation } from '../../core/engine/translation';

interface Props {
  inventory: Item[];
  onHover: (item: Item | undefined) => void;
  onClick: (item: Item) => void;
  canEquip: (item: Item) => boolean;
  getItemIcon: (type: string, className?: string) => React.ReactNode;
  getRarityStyle: (rarity: string) => string;
  getRarityGradient: (rarity: string) => string;
  inventoryMessage?: { type: 'error'|'success', text: string } | null;
  handleAutoEquip?: () => void;
  player?: Player;
}

export const CargoGrid: React.FC<Props> = ({
  inventory, onHover, onClick, canEquip,
  getItemIcon, getRarityStyle, getRarityGradient, inventoryMessage, handleAutoEquip, player
}) => {
  const TOTAL_SLOTS = 72; // 12 columns x 6 rows
  const gridCells = Array.from({ length: TOTAL_SLOTS }, (_, i) => inventory[i] || null);
  const { t } = useTranslation();

  const checkHasUpgrade = (): boolean => {
    if (!player || !player.inventory) return false;

    const RARITY_ORDER: Record<string, number> = {
      common: 1,
      rare: 2,
      epic: 3,
      legendary: 4,
      mythic: 5
    };

    return player.inventory.some(item => {
      // Skip consumables, circuit modules, etc.
      if (item.type === 'consumable' || item.type === 'circuit_module') {
        return false;
      }

      // Check class proficiency using canEquip prop (evaluates class compatibility)
      if (!canEquip(item)) return false;

      // Check level requirement
      if (item.requiredLevel && player.level < item.requiredLevel) return false;

      // For regular slots:
      if (item.type !== 'accessory') {
        const equipped = player.equipment[item.type as keyof Player['equipment']];
        if (!equipped) {
          return true; // Slot is empty, any compatible item is an upgrade!
        }
        const itemRarityVal = RARITY_ORDER[item.rarity] || 0;
        const equippedRarityVal = RARITY_ORDER[equipped.rarity] || 0;
        const itemLevelVal = item.level || 1;
        const equippedLevelVal = equipped.level || 1;

        return itemLevelVal > equippedLevelVal || itemRarityVal > equippedRarityVal;
      }

      // For accessories:
      if (item.type === 'accessory') {
        const acc1 = player.equipment.accessory1;
        const acc2 = player.equipment.accessory2;
        const acc3 = player.equipment.accessory3;

        if (!acc1 || !acc2 || !acc3) {
          return true; // At least one accessory slot is empty
        }

        const itemRarityVal = RARITY_ORDER[item.rarity] || 0;
        const itemLevelVal = item.level || 1;

        // Check if it is better than any of the equipped accessories
        return [acc1, acc2, acc3].some(acc => {
          const accRarityVal = RARITY_ORDER[acc.rarity] || 0;
          const accLevelVal = acc.level || 1;
          return itemLevelVal > accLevelVal || itemRarityVal > accRarityVal;
        });
      }

      return false;
    });
  };

  const hasUpgrade = checkHasUpgrade();

  return (
    <div className="w-full mt-6 flex flex-col border border-slate-700/50 bg-[#060b13] relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
      {/* Decorative Frame */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-900/50 to-transparent" />
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-900/50 to-transparent" />

      {/* Header */}
      <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-900/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-500 animate-pulse" />
          <span className="font-mono text-cyan-100 font-bold tracking-[0.2em] text-xs">{t("COMPARTIMENTO DE CARGA")}</span>
        </div>
        <div className="flex items-center gap-4">
          {inventoryMessage && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-widest ${
              inventoryMessage.type === 'error' ? 'text-red-400 border-red-900/50 bg-red-950/30' : 'text-emerald-400 border-emerald-900/50 bg-emerald-950/30'
            }`}>
              {t(inventoryMessage.text)}
            </span>
          )}
          
          {handleAutoEquip && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAutoEquip}
              className={`px-3 py-1 text-[10px] font-mono tracking-widest uppercase transition-colors duration-300 rounded border flex items-center gap-1.5 ${
                hasUpgrade 
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-[pulse_2.2s_infinite]'
                  : 'bg-cyan-950/50 border-cyan-800 text-cyan-300'
              }`}
            >
              {hasUpgrade && <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />}
              <span>{t("Auto-Equipar")}</span>
              {hasUpgrade && <ArrowUp className="w-3 h-3 text-emerald-400 animate-bounce" />}
            </motion.button>
          )}
          <span className="font-mono text-cyan-600 text-[10px] tracking-widest">
            {t("CAPACIDADE")}: {inventory.length} / {TOTAL_SLOTS}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 relative">
        {/* Background Grid Lines for empty feeling */}
        <div className="absolute inset-4 grid grid-cols-12 gap-2 pointer-events-none opacity-20">
            {Array.from({length: TOTAL_SLOTS}).map((_,i) => (
                <div key={`bg-${i}`} className="aspect-square border border-slate-800 rounded-sm" />
            ))}
        </div>

        <div className="grid grid-cols-12 gap-2 relative z-10">
          {gridCells.map((item, idx) => {
            if (!item) {
              return (
                <div key={idx} className="aspect-square rounded-sm bg-slate-900/20 border border-slate-800/50 flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                   {/* Empty Slot */}
                   <div className="w-1 h-1 bg-slate-800 rounded-full" />
                </div>
              );
            }

            const isEquipable = canEquip(item);

            return (
              <motion.div 
                key={idx}
                whileHover={isEquipable ? { scale: 1.15, zIndex: 30, filter: 'brightness(1.3)' } : { filter: 'grayscale(0%)', opacity: 1 }}
                whileTap={isEquipable ? { scale: 0.9 } : {}}
                onMouseEnter={() => onHover(item)}
                onMouseLeave={() => onHover(undefined)}
                onClick={() => onClick(item)}
                className={`relative aspect-square rounded-sm border flex items-center justify-center transition-colors duration-150 shadow-md ${
                  isEquipable 
                    ? `cursor-pointer ${getRarityStyle(item.rarity)}` 
                    : 'opacity-40 cursor-not-allowed border-slate-800 bg-slate-900 grayscale'
                }`}
              >
                <div className={`w-full h-full absolute inset-0 opacity-20 pointer-events-none ${getRarityGradient(item.rarity)}`} />
                {getItemIcon(item.type, "w-6 h-6 text-slate-200 drop-shadow-lg relative z-10")}
                
                {item.rarity === 'legendary' && (
                  <div className="absolute top-0.5 right-0.5 text-amber-300 z-20 animate-pulse pointer-events-none">
                    <Sparkles className="w-3 h-3 drop-shadow-[0_0_6px_rgba(245,158,11,1)]" />
                  </div>
                )}
                {item.rarity === 'mythic' && (
                  <div className="absolute top-0.5 right-0.5 text-rose-300 z-20 animate-bounce pointer-events-none">
                    <Sparkles className="w-3.5 h-3.5 drop-shadow-[0_0_10px_rgba(244,63,94,1)] text-rose-400" />
                  </div>
                )}

                {item.level && (
                  <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-white z-10">
                    {t("L")}{item.level}
                  </span>
                )}
                {/* Tech corner accent */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-500/50 opacity-50 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
