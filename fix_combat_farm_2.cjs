const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

const regex2 = /<div className="w-full text-center mt-3 text-\[9px\] font-mono text-cyan-500\/40 uppercase tracking-widest border-t border-cyan-900\/30 pt-2">/g;
code = code.replace(regex2, `{player.isFarmActive && (
                      <button 
                        onClick={() => {
                          usePlayerStore.getState().setPlayer(p => ({ ...p, isFarmActive: false }));
                        }}
                        className="w-full bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 font-bold py-2 mt-4 rounded uppercase tracking-widest transition-all cursor-pointer text-xs"
                      >
                        {t("Parar Auto-Farm")}
                      </button>
                    )}
                    <div className="w-full text-center mt-3 text-[9px] font-mono text-cyan-500/40 uppercase tracking-widest border-t border-cyan-900/30 pt-2">`);

fs.writeFileSync('src/pages/CombatScene.tsx', code);
