const fs = require('fs');
let code = fs.readFileSync('src/components/MainMenu.tsx', 'utf8');

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
const ptFlagNewRegex = /\{\/\* Brazil \/ Portugal Flag \*\/\}[\s\S]*?<\/button>/;

const enFlagOld = `{/* USA / UK Flag */}
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
                    {/* Diagonal division: top-left US, bottom-right UK */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#b22234] from-50% to-[#012169] to-50%" />
                    {/* USA details in top-left */}
                    <div className="absolute top-[4px] left-[4px] w-[12px] h-[10px] bg-[#3c3b6e]">
                      <div className="absolute top-[2px] left-[2px] w-[2px] h-[2px] bg-white rounded-full" />
                      <div className="absolute top-[5px] left-[6px] w-[2px] h-[2px] bg-white rounded-full" />
                    </div>
                    {/* UK details in bottom-right */}
                    <div className="absolute bottom-[3px] right-[3px] w-[14px] h-[14px] border-t-2 border-l-2 border-white">
                      <div className="absolute inset-0 border-t-2 border-l-2 border-[#c8102e]" />
                    </div>
                  </button>`;
const enFlagNewRegex = /\{\/\* USA \/ UK Flag \*\/\}[\s\S]*?<\/button>/;

code = code.replace(ptFlagNewRegex, ptFlagOld);
code = code.replace(enFlagNewRegex, enFlagOld);
code = code.replace("import { HybridFlag } from './HybridFlag';\n", "");

fs.writeFileSync('src/components/MainMenu.tsx', code);
