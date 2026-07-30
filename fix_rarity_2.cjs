const fs = require('fs');
let code = fs.readFileSync('src/components/uiUtils.tsx', 'utf8');

const newGetRarityStyle = `export const getRarityStyle = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'border-slate-500 text-slate-300 shadow-[0_0_8px_rgba(100,116,139,0.3)]';
    case 'rare': return 'border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]';
    case 'epic': return 'border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]';
    case 'legendary': return 'border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]';
    case 'mythic': return 'border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.7)]';
    default: return 'border-slate-600 text-slate-300';
  }
};`;

code = code.replace(/export const getRarityStyle = \([\s\S]*?\}\};/, newGetRarityStyle);

fs.writeFileSync('src/components/uiUtils.tsx', code);
