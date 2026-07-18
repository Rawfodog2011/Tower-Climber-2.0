const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldForge = `                  {/* Forge Panels */}
                  <div className="system-panel overflow-hidden">
                    <div className="border-b border-amber-500/20 bg-amber-950/40 px-4 py-3">
                      <span className="font-bold text-amber-400 tracking-widest uppercase text-sm">Criação de Itens (Classe: {CLASSES[player.currentClassId].name})</span>
                    </div>
                    <div className="p-4 space-y-4">
                      
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1 bg-slate-900/60 p-3 rounded border border-gray-600 flex justify-between items-center">
                          <span className="text-gray-400 text-xs uppercase tracking-widest">Fragmentos</span>
                          <span className="text-white font-bold font-mono">{player.materials.common}</span>
                        </div>
                        <div className="flex-1 bg-slate-900/60 p-3 rounded border border-cyan-600 flex justify-between items-center shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                          <span className="text-cyan-400 text-xs uppercase tracking-widest">Essências</span>
                          <span className="text-white font-bold font-mono">{player.materials.rare}</span>
                        </div>
                        <div className="flex-1 bg-slate-900/60 p-3 rounded border border-purple-600 flex justify-between items-center shadow-[0_0_10px_rgba(192,132,252,0.1)]">
                          <span className="text-purple-400 text-xs uppercase tracking-widest">Núcleos</span>
                          <span className="text-white font-bold font-mono">{player.materials.epic}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(['common', 'rare', 'epic'] as const).map(rarity => {
                          const cost = CRAFTING_COSTS[rarity];
                          const canCraft = player.materials[rarity] >= cost.materials && player.gold >= cost.gold;
                          const rarityStyle = getRarityStyle(rarity);
                          const bg = rarity === 'epic' ? 'bg-purple-950/30' : rarity === 'rare' ? 'bg-cyan-950/30' : 'bg-gray-900/50';
                          const hover = rarity === 'epic' ? 'hover:shadow-[0_0_15px_rgba(192,132,252,0.4)]' : rarity === 'rare' ? 'hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'hover:shadow-[0_0_15px_rgba(156,163,175,0.4)]';

                          return (
                            <button
                              key={rarity}
                              onClick={() => handleCraft(rarity)}
                              disabled={!canCraft}
                              className={\`flex flex-col items-center justify-center p-4 rounded border \${rarityStyle} \${bg} \${canCraft ? hover + ' cursor-pointer' : 'opacity-50 cursor-not-allowed'}\`}
                            >
                              <span className="font-bold uppercase tracking-widest text-sm mb-2">Forjar {rarity === 'common' ? 'Comum' : rarity === 'rare' ? 'Raro' : 'Épico'}</span>
                              <div className="text-[10px] font-mono text-cyan-200/70 space-y-1">
                                <div>- {cost.materials} {MATERIAL_NAMES[rarity]}</div>
                                <div>- {cost.gold} G</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>`;

const newForge = `                  {/* Forge Panels */}
                  <div className="system-panel overflow-hidden">
                    <div className="system-panel-header px-4 py-3">
                      <span className="font-bold text-amber-400 tracking-widest uppercase text-sm">Criação de Itens (Classe: {CLASSES[player.currentClassId].name})</span>
                    </div>
                    <div className="p-4 space-y-4">
                      
                      <div className="flex gap-3 mb-4">
                        <div className="flex-1 bg-slate-950/40 p-2 rounded border border-slate-600 flex flex-col justify-between items-center shadow-[inset_0_0_10px_rgba(100,116,139,0.1)]">
                          <span className="text-slate-400 text-[10px] font-mono uppercase tracking-widest mb-1">Fragmentos</span>
                          <span className="text-slate-100 font-bold">{player.materials.common}</span>
                        </div>
                        <div className="flex-1 bg-cyan-950/20 p-2 rounded border border-cyan-500 flex flex-col justify-between items-center shadow-[inset_0_0_15px_rgba(34,211,238,0.15)]">
                          <span className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-1">Essências</span>
                          <span className="text-cyan-100 font-bold">{player.materials.rare}</span>
                        </div>
                        <div className="flex-1 bg-purple-950/20 p-2 rounded border border-purple-500 flex flex-col justify-between items-center shadow-[inset_0_0_20px_rgba(192,132,252,0.25)]">
                          <span className="text-purple-400 text-[10px] font-mono uppercase tracking-widest mb-1">Núcleos</span>
                          <span className="text-purple-100 font-bold">{player.materials.epic}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {(['common', 'rare', 'epic'] as const).map(rarity => {
                          const cost = CRAFTING_COSTS[rarity];
                          const canCraft = player.materials[rarity] >= cost.materials && player.gold >= cost.gold;
                          const rarityStyle = getRarityStyle(rarity);

                          return (
                            <button
                              key={rarity}
                              onClick={() => handleCraft(rarity)}
                              disabled={!canCraft}
                              className={\`flex flex-col items-center justify-center p-4 rounded border transition-all relative overflow-hidden \${rarityStyle} \${canCraft ? 'cursor-pointer active:scale-95 hover:brightness-125' : 'opacity-50 cursor-not-allowed'}\`}
                            >
                              <span className="font-bold uppercase tracking-widest text-sm mb-2 relative z-10">FORJAR {rarity === 'common' ? 'COMUM' : rarity === 'rare' ? 'RARO' : 'ÉPICO'}</span>
                              <div className="text-[10px] font-mono opacity-80 space-y-1 relative z-10 text-center">
                                <div>- {cost.materials} {MATERIAL_NAMES[rarity]}</div>
                                <div>- {cost.gold} CRD</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>`;

if (content.includes(oldForge)) {
  content = content.replace(oldForge, newForge);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Replaced Forge');
} else {
  console.log('Could not find oldForge string');
}
