import React from 'react';
import { Item } from '../types';
import { AssetDictionary } from '../core/assets';

export const getRarityStyle = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'border-slate-500 text-slate-300 shadow-[0_0_8px_rgba(100,116,139,0.3)]';
    case 'rare': return 'border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]';
    case 'epic': return 'border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]';
    case 'legendary': return 'border-amber-400 text-amber-200 shadow-[0_0_22px_rgba(245,158,11,0.8)] border-2 animate-pulse';
    case 'mythic': return 'border-rose-400 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.9)] border-2 animate-pulse ring-1 ring-rose-400/80';
    default: return 'border-slate-600 text-slate-300';
  }
};

export const getRarityGradient = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'from-slate-600 to-slate-800';
    case 'rare': return 'from-cyan-600 to-cyan-800';
    case 'epic': return 'from-purple-600 to-purple-800';
    case 'legendary': return 'from-amber-500 via-amber-700 to-amber-950';
    case 'mythic': return 'from-rose-500 via-purple-900 to-slate-950';
    default: return 'from-slate-600 to-slate-800';
  }
};

export const getItemIcon = (type: string, className?: string) => {
  const cn = className || "w-4 h-4";
  const Icon = AssetDictionary.icons[type as keyof typeof AssetDictionary.icons] || AssetDictionary.icons.material;
  return (
    <div className={`${cn} flex items-center justify-center`}>
      <Icon />
    </div>
  );
};

export const renderManufacturerBadge = (item: Item) => {
  if (!item.manufacturer) return null;
  return (
    <span className="text-[10px] font-mono uppercase bg-slate-900 px-1 py-0.5 rounded text-slate-400 border border-slate-700">
      {item.manufacturer}
    </span>
  );
};
