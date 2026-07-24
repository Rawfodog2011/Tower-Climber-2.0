import React from 'react';
import { Item } from '../types';
import { Shield, Zap, Crosshair, Hexagon, Circle, Cpu, Database } from 'lucide-react';

export const getRarityStyle = (rarity: string) => {
  switch (rarity) {
    case 'comum': return 'border-slate-500 text-slate-300 shadow-[0_0_8px_rgba(100,116,139,0.3)]';
    case 'incomum': return 'border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
    case 'raro': return 'border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]';
    case 'epico': return 'border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]';
    case 'lendario': return 'border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]';
    case 'mitico': return 'border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.7)]';
    default: return 'border-slate-600 text-slate-300';
  }
};

export const getRarityGradient = (rarity: string) => {
  switch (rarity) {
    case 'comum': return 'from-slate-600 to-slate-800';
    case 'incomum': return 'from-emerald-600 to-emerald-800';
    case 'raro': return 'from-cyan-600 to-cyan-800';
    case 'epico': return 'from-purple-600 to-purple-800';
    case 'lendario': return 'from-amber-600 to-amber-800';
    case 'mitico': return 'from-red-600 to-red-800';
    default: return 'from-slate-600 to-slate-800';
  }
};

export const getItemIcon = (type: string, className?: string) => {
  const cn = className || "w-4 h-4";
  switch (type) {
    case 'weapon': return <Crosshair className={cn} />;
    case 'armor': return <Shield className={cn} />;
    case 'helmet': return <Circle className={cn} />;
    case 'pants': return <Zap className={cn} />;
    case 'boots': return <Zap className={cn} />;
    case 'bracers': return <Hexagon className={cn} />;
    case 'accessory': return <Cpu className={cn} />;
    case 'material': return <Database className={cn} />;
    default: return <Shield className={cn} />;
  }
};

export const renderManufacturerBadge = (item: Item) => {
  if (!item.manufacturer) return null;
  return (
    <span className="text-[10px] font-mono uppercase bg-slate-900 px-1 py-0.5 rounded text-slate-400 border border-slate-700">
      {item.manufacturer}
    </span>
  );
};
