const fs = require('fs');
let code = fs.readFileSync('src/components/MainMenu.tsx', 'utf8');

if (!code.includes('HybridFlag')) {
  code = code.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { HybridFlag } from './HybridFlag';");
  
  const ptFlagOld = `{/* Brazil / Portugal Flag */}
                   <button
                     type="button"
                     onClick={() => handleInteraction(() => onLanguageChange('pt'), 'ui.click')}
                     className={\`relative w-14 h-9 rounded overflow-hidden border transition-all cursor-pointer flex-shrink-0 group hover:scale-105 active:scale-95 \${
                       currentLanguage === 'pt' 
                         ? (glitchProgress >= 1.0 ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] ring-1 ring-red-500' : 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] ring-1 ring-cyan-400')
                         : 'border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-90'
                     }\`}
                     title="Português (BR/PT)"
                   >
                     {/* Diagonal division: top-left BR, bottom-right PT */}
                     <div className="absolute inset-0 bg-gradient-to-br from-[#009b3a] from-50% to-[#ff0000] to-50%" />
                     {/* Brazil details in top-left */}
                     <div className="absolute top-[5px] left-[5px] w-[14px] h-[10px] bg-[#fedd00]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                       <div className="absolute top-[2px] left-[3px] w-[4px] h-[4px] bg-[#002776] rounded-full" />
                     </div>
                     {/* Portugal details in bottom-right (green circle on red) */}
                     <div className="absolute bottom-[4px] right-[5px] w-[10px] h-[10px] bg-[#006600] rounded-full border border-[#ffcc00] flex items-center justify-center">
                       <div className="w-[4px] h-[4px] bg-[#ff0000] rounded-full" />
                     </div>
                   </button>`;

  const ptFlagNew = `{/* Brazil / Portugal Flag */}
                   <button
                     type="button"
                     onClick={() => handleInteraction(() => onLanguageChange('pt'), 'ui.click')}
                     className={\`relative w-14 h-9 rounded overflow-hidden border transition-all cursor-pointer flex-shrink-0 group hover:scale-105 active:scale-95 \${
                       currentLanguage === 'pt' 
                         ? (glitchProgress >= 1.0 ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] ring-1 ring-red-500' : 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] ring-1 ring-cyan-400')
                         : 'border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-90'
                     }\`}
                     title="Português (BR/PT)"
                   >
                     <HybridFlag primaryCountry="PT" secondaryCountry="BR" />
                   </button>`;

  const enFlagOldRegex = /\{\/\* USA \/ UK Flag \*\/\}[\s\S]*?<\/button>/;

  const enFlagNew = `{/* USA / UK Flag */}
                   <button
                     type="button"
                     onClick={() => handleInteraction(() => onLanguageChange('en'), 'ui.click')}
                     className={\`relative w-14 h-9 rounded overflow-hidden border transition-all cursor-pointer flex-shrink-0 group hover:scale-105 active:scale-95 \${
                       currentLanguage === 'en' 
                         ? (glitchProgress >= 1.0 ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] ring-1 ring-red-500' : 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] ring-1 ring-cyan-400')
                         : 'border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-90'
                     }\`}
                     title="English (US/UK)"
                   >
                     <HybridFlag primaryCountry="GB" secondaryCountry="US" />
                   </button>`;

  code = code.replace(ptFlagOld, ptFlagNew);
  code = code.replace(enFlagOldRegex, enFlagNew);

  fs.writeFileSync('src/components/MainMenu.tsx', code);
}
