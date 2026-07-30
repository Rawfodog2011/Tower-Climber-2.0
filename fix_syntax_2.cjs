const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

const targetStr = `                      </button>
                    )}
                      <button 
                        onClick={() => handleStartDive(selectedFloor, true)}`;

const fixStr = `                      </button>
                    )}
                    <div className="flex flex-col gap-3 w-full">
                      {combatEndMessage?.isVictory && (
                        <button 
                          onClick={() => {
                            const nextF = selectedFloor + 1;
                            setSelectedFloor(nextF);
                            handleStartDive(nextF, false);
                          }}
                          className="w-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-50 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
                        >
                          Avançar (Andar {selectedFloor + 1})
                        </button>
                      )}
                      <button 
                        onClick={() => handleStartDive(selectedFloor, true)}`;

code = code.replace(targetStr, fixStr);
fs.writeFileSync('src/pages/CombatScene.tsx', code);
