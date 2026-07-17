const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldEquipment = `                  {/* Equipment Panel */}
                  <div className="system-panel overflow-hidden">
                    <div className="system-panel-header px-4 py-3">
                      <span className="font-bold text-cyan-50 tracking-widest uppercase text-sm">Equipamento Ativo</span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(['weapon', 'armor', 'accessory'] as const).map(slot => {
                        const item = player.equipment[slot];
                        return (
                          <div key={slot} className="bg-slate-900/60 p-3 rounded border border-cyan-900/50 flex flex-col justify-between group h-24">
                            <span className="text-cyan-200/50 text-[10px] font-mono uppercase tracking-widest mb-1">{slot}</span>
                            {item ? (
                              <div className="flex flex-col justify-between h-full">
                                <div className="flex items-center gap-2">
                                  <div className={\`w-6 h-6 rounded shrink-0 shadow-inner \${getRarityGradient(item.rarity)} border-2 border-slate-900/50\`}></div>
                                  <span className={\`text-sm font-semibold truncate \${getRarityStyle(item.rarity).split(' ')[0]}\`}>{item.name}</span>
                                </div>
                                <button 
                                  onClick={() => handleUnequip(slot)}
                                  className="text-[10px] uppercase font-bold text-red-400 hover:text-red-300 mt-2 self-start transition-colors cursor-pointer"
                                >
                                  [ Remover ]
                                </button>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <span className="text-cyan-200/20 text-sm font-mono italic">Vazio</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>`;

const newEquipment = `                  {/* Equipment Panel */}
                  <div className="system-panel overflow-hidden">
                    <div className="system-panel-header px-4 py-3">
                      <span className="font-bold text-cyan-50 tracking-widest uppercase text-sm">Equipamento Ativo</span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(['weapon', 'armor', 'accessory'] as const).map(slot => {
                        const item = player.equipment[slot];
                        const slotNames = { weapon: 'ARMA', armor: 'ARMADURA', accessory: 'ACESSÓRIO' };
                        return (
                          <div key={slot} className="bg-slate-950/40 p-3 rounded border border-cyan-900/30 flex flex-col justify-between group h-[104px]">
                            <div className="flex items-center gap-1 mb-2">
                              {getItemIcon(slot, "w-3 h-3 text-cyan-500/50")}
                              <span className="text-cyan-500/50 text-[10px] font-mono uppercase tracking-widest">{slotNames[slot]}</span>
                            </div>
                            {item ? (
                              <div className="flex flex-col justify-between h-full">
                                <div className="flex items-center gap-3">
                                  <div className={\`w-8 h-8 rounded shrink-0 flex items-center justify-center \${getRarityGradient(item.rarity)}\`}>
                                    {getItemIcon(item.type, "w-4 h-4 text-slate-100 drop-shadow")}
                                  </div>
                                  <span className={\`text-sm font-semibold truncate \${getRarityStyle(item.rarity).split(' ')[0]}\`}>{item.name}</span>
                                </div>
                                <button 
                                  onClick={() => handleUnequip(slot)}
                                  className="mt-2 self-start bg-red-950/80 text-red-400 border border-red-800/80 hover:bg-red-900 hover:text-red-200 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] active:scale-95 px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer"
                                >
                                  EJETAR
                                </button>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center border border-dashed border-cyan-900/30 rounded bg-slate-900/20">
                                <span className="text-cyan-200/20 text-[10px] font-mono uppercase tracking-widest">Nenhum</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>`;

if (content.includes(oldEquipment)) {
  content = content.replace(oldEquipment, newEquipment);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Replaced Equipment');
} else {
  console.log('Could not find oldEquipment string');
}
