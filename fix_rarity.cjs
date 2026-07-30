const fs = require('fs');
let code = fs.readFileSync('src/components/uiUtils.tsx', 'utf8');

code = code.replace(/case 'comum': return 'border-slate-500 text-slate-300 shadow-\\[0_0_8px_rgba\\(100,116,139,0\\.3\\)\\]';/g, "case 'common': return 'border-slate-500 text-slate-300 shadow-[0_0_8px_rgba(100,116,139,0.3)]';");
code = code.replace(/case 'incomum': return 'border-emerald-500 text-emerald-300 shadow-\\[0_0_8px_rgba\\(16,185,129,0\\.3\\)\\]';\n\s*/g, "");
code = code.replace(/case 'raro': return 'border-cyan-500 text-cyan-300 shadow-\\[0_0_10px_rgba\\(6,182,212,0\\.4\\)\\]';/g, "case 'rare': return 'border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]';");
code = code.replace(/case 'epico': return 'border-purple-500 text-purple-300 shadow-\\[0_0_12px_rgba\\(168,85,247,0\\.5\\)\\]';/g, "case 'epic': return 'border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]';");
code = code.replace(/case 'lendario': return 'border-amber-500 text-amber-300 shadow-\\[0_0_15px_rgba\\(245,158,11,0\\.6\\)\\]';/g, "case 'legendary': return 'border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]';");
code = code.replace(/case 'mitico': return 'border-red-500 text-red-300 shadow-\\[0_0_20px_rgba\\(239,68,68,0\\.7\\)\\]';/g, "case 'mythic': return 'border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.7)]';");

code = code.replace(/case 'comum': return 'from-slate-600 to-slate-800';/g, "case 'common': return 'from-slate-600 to-slate-800';");
code = code.replace(/case 'incomum': return 'from-emerald-600 to-emerald-800';\n\s*/g, "");
code = code.replace(/case 'raro': return 'from-cyan-600 to-cyan-800';/g, "case 'rare': return 'from-cyan-600 to-cyan-800';");
code = code.replace(/case 'epico': return 'from-purple-600 to-purple-800';/g, "case 'epic': return 'from-purple-600 to-purple-800';");
code = code.replace(/case 'lendario': return 'from-amber-600 to-amber-800';/g, "case 'legendary': return 'from-amber-600 to-amber-800';");
code = code.replace(/case 'mitico': return 'from-red-600 to-red-800';/g, "case 'mythic': return 'from-red-600 to-red-800';");

fs.writeFileSync('src/components/uiUtils.tsx', code);
