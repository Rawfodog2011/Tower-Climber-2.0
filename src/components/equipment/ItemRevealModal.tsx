import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Item } from '../../types';
import { getRarityStyle, getItemIcon } from '../uiUtils';
import { useTranslation } from '../../core/engine/translation';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  item: Item | null;
  onClose: () => void;
  title?: string;
}

export const ItemRevealModal: React.FC<Props> = ({ item, onClose, title }) => {
  const { t } = useTranslation();
  if (!item) return null;

  const rarityColorClass = getRarityStyle(item.rarity);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, rotateX: 45 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative max-w-sm w-full bg-slate-900 border ${rarityColorClass} rounded-lg shadow-2xl p-6 flex flex-col items-center`}
        >
          {/* Shine effect */}
          <motion.div 
            initial={{ left: '-100%' }}
            animate={{ left: '200%' }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
          />

          <h2 className="text-xl font-bold mb-1 tracking-widest uppercase flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {title || t("Nova Descoberta")}
          </h2>
          <div className="text-xs font-mono opacity-70 mb-6 uppercase tracking-[0.2em]">{item.rarity}</div>

          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", damping: 12 }}
            className={`w-24 h-24 mb-6 rounded-full flex items-center justify-center border-4 ${rarityColorClass} bg-slate-950 shadow-[0_0_30px_currentColor]`}
          >
            {getItemIcon(item.type, "w-12 h-12")}
          </motion.div>

          <h3 className="text-2xl font-black mb-2 text-center text-slate-100">{item.name}</h3>
          
          <div className="flex gap-4 w-full justify-center mb-6 text-sm font-mono text-slate-300">
            {item.attack && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] opacity-50 uppercase">ATK</span>
                <span className="font-bold text-red-400">{item.attack}</span>
              </div>
            )}
            {item.defense && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] opacity-50 uppercase">DEF</span>
                <span className="font-bold text-blue-400">{item.defense}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-center italic text-slate-400 mb-6 line-clamp-3">
            "{item.lore}"
          </p>

          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-full font-mono text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
          >
            {t("Continuar")} <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
