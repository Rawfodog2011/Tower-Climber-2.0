const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

const regex = /\{player\.isFarmActive && player\.isAutoBattleActive && \([\s\S]*?\}\)/g;
code = code.replace(regex, `{player.isFarmActive && player.isAutoBattleActive && (
                      <div className="text-xs w-full font-mono text-cyan-400 animate-pulse bg-cyan-950/20 border border-cyan-500/30 px-4 py-2 rounded flex items-center gap-2 mb-2">
                        <Cpu className="w-4 h-4 animate-spin-slow text-cyan-400" />
                        AUTO-FARM ATIVO: REINICIANDO EM INSTANTES...
                      </div>
                    )}
                    {player.isFarmActive && (
                      <button 
                        onClick={() => {
                          usePlayerStore.getState().setPlayer(p => ({ ...p, isFarmActive: false }));
                        }}
                        className="w-full bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-50 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer mb-2"
                      >
                        {t("Parar Auto-Farm")}
                      </button>
                    )}`);

fs.writeFileSync('src/pages/CombatScene.tsx', code);
