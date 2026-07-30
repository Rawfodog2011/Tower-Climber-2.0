const fs = require('fs');

// 1. Fix useGameEffects.ts
let effectCode = fs.readFileSync('src/hooks/useGameEffects.ts', 'utf8');
effectCode = effectCode.replace(
  "handleReturnToHub();",
  "handleStartDive(selectedFloor, true);"
);
fs.writeFileSync('src/hooks/useGameEffects.ts', effectCode);

// 2. Fix CombatScene.tsx
let combatCode = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

const autoFarmDiv = `{player.isFarmActive && player.isAutoBattleActive && (
                      <div className="text-xs w-full font-mono text-cyan-400 animate-pulse bg-cyan-950/20 border border-cyan-500/30 px-4 py-2 rounded flex items-center gap-2">
                        <Cpu className="w-4 h-4 animate-spin-slow text-cyan-400" />
                        AUTO-FARM ATIVO: REINICIANDO EM INSTANTES...
                      </div>
                    )}`;

const stopFarmBtn = `{player.isFarmActive && (
                      <button 
                        onClick={() => {
                          usePlayerStore.getState().setPlayer(p => ({ ...p, isFarmActive: false }));
                        }}
                        className="w-full bg-red-950 hover:bg-red-900 border border-red-500 text-red-50 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer mt-2"
                      >
                        Desativar Farm
                      </button>
                    )}`;

const replaceWith = `${autoFarmDiv}\n${stopFarmBtn}`;

// We need to properly import usePlayerStore if it's not already, but wait, CombatScene already uses usePlayerStore? 
// Let's check: "const { player } = usePlayerStore();" is at the top of CombatScene.tsx, but setPlayer might not be destructured.
// We can use the already imported \`usePlayerStore\`.
