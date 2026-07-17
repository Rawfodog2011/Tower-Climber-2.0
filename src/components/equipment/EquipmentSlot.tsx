import React from 'react';
import { Item, Player } from '../../types';

interface Props {
  slotId: keyof Player['equipment'];
  label: string;
  item?: Item;
  shape?: 'hexagon' | 'vertical' | 'square' | 'circle' | 'diamond' | 'double';
  onHover: (item: Item | undefined) => void;
  onClick: (slotId: keyof Player['equipment']) => void;
  getItemIcon: (type: string, className?: string) => React.ReactNode;
  getRarityStyle: (rarity: string) => string;
  getRarityGradient: (rarity: string) => string;
}

export const EquipmentSlot: React.FC<Props> = ({ 
  slotId, label, item, shape = 'square', onHover, onClick, 
  getItemIcon, getRarityStyle, getRarityGradient 
}) => {
  let clipPath = '';
  let sizeClass = 'w-16 h-16';

  switch (shape) {
    case 'hexagon':
      clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
      sizeClass = 'w-16 h-[4.5rem]';
      break;
    case 'vertical':
      clipPath = 'polygon(15% 0, 85% 0, 100% 10%, 100% 90%, 85% 100%, 15% 100%, 0 90%, 0 10%)';
      sizeClass = 'w-14 h-24';
      break;
    case 'circle':
      clipPath = 'circle(50% at 50% 50%)';
      break;
    case 'diamond':
      clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
      break;
    case 'double':
      clipPath = 'polygon(5% 0, 95% 0, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0 85%, 0 15%)';
      sizeClass = 'w-24 h-12';
      break;
    case 'square':
    default:
      clipPath = 'polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%)';
      break;
  }

  return (
    <div 
      className="relative flex flex-col items-center group z-20"
      onMouseEnter={() => onHover(item || undefined)}
      onMouseLeave={() => onHover(undefined)}
    >
      <span className="text-[10px] uppercase tracking-widest text-cyan-500/70 font-mono mb-1.5">{label}</span>
      <div 
        onClick={() => onClick(slotId)}
        className={`relative ${sizeClass} cursor-pointer transition-all duration-200 group-hover:scale-[1.05] group-hover:brightness-125
                    ${item ? getRarityStyle(item.rarity) : 'bg-slate-900/40 border border-cyan-900/40'} 
                    flex items-center justify-center shadow-lg`}
        style={{ clipPath }}
      >
        {item ? (
          <>
            <div className={`absolute inset-0 opacity-20 pointer-events-none ${getRarityGradient(item.rarity)}`} />
            <div className={`absolute inset-0 ${item.rarity === 'epic' || item.rarity === 'rare' ? 'animate-pulse opacity-30' : 'opacity-10'} bg-cyan-400`} />
            {getItemIcon(item.type, "w-8 h-8 text-slate-100 drop-shadow-md relative z-10")}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
             {getItemIcon(slotId, "w-6 h-6 text-cyan-900/60")}
          </div>
        )}
      </div>
    </div>
  );
};
