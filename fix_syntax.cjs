const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

const oldStr = `                        AUTO-FARM ATIVO: REINICIANDO EM INSTANTES...
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
                    )}
                        </button>
                      )}`;

const newStr = `                        AUTO-FARM ATIVO: REINICIANDO EM INSTANTES...
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
                    )}`;

code = code.replace(oldStr, newStr);

fs.writeFileSync('src/pages/CombatScene.tsx', code);
