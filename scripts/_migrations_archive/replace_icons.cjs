const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add imports
if (!content.includes('lucide-react')) {
  content = content.replace("import React,", "import { Sword, Shield, Cpu, Zap, Crosshair } from 'lucide-react';\nimport React,");
}

// Modify getRarityStyle and getRarityGradient
content = content.replace(
  /const getRarityStyle = \([^)]+\) => {[\s\S]*?};/,
  `const getRarityStyle = (rarity: 'common' | 'rare' | 'epic') => {
    switch(rarity) {
      case 'common': return 'text-slate-300 border-slate-600 bg-slate-950/40 shadow-[inset_0_0_10px_rgba(100,116,139,0.1)]';
      case 'rare': return 'text-cyan-400 border-cyan-500 bg-cyan-950/20 shadow-[inset_0_0_15px_rgba(34,211,238,0.15),0_0_8px_rgba(34,211,238,0.2)]';
      case 'epic': return 'text-purple-400 border-purple-500 bg-purple-950/20 shadow-[inset_0_0_20px_rgba(192,132,252,0.25),0_0_12px_rgba(192,132,252,0.4)]';
      default: return 'text-slate-300 bg-slate-950/40';
    }
  };`
);

content = content.replace(
  /const getRarityGradient = \([^)]+\) => {[\s\S]*?};/,
  `const getRarityGradient = (rarity: 'common' | 'rare' | 'epic') => {
    switch(rarity) {
      case 'common': return 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-500';
      case 'rare': return 'bg-gradient-to-br from-cyan-600 to-blue-900 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]';
      case 'epic': return 'bg-gradient-to-br from-purple-500 to-indigo-900 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.7)]';
      default: return 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-500';
    }
  };

  const getItemIcon = (type: string, className = "w-4 h-4") => {
    switch(type) {
      case 'weapon': return <Sword className={className} />;
      case 'armor': return <Shield className={className} />;
      case 'accessory': return <Cpu className={className} />;
      default: return <Zap className={className} />;
    }
  };`
);

fs.writeFileSync('src/App.tsx', content);
