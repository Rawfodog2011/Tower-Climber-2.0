const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldInventory = `                  {/* Inventory Panel */}
                  <div className="system-panel overflow-hidden flex flex-col" style={{ height: '360px' }}>
                    <div className="system-panel-header px-4 py-3 flex justify-between items-center shrink-0">
                      <span className="font-bold text-cyan-50 tracking-widest uppercase text-sm">Inventário ({player.inventory.length})</span>
                      {inventoryMessage && (
                        <span className={\`text-xs px-2 py-0.5 rounded font-mono uppercase tracking-wider border \${inventoryMessage.type === 'error' ? 'bg-red-950/50 text-red-400 border-red-900' : 'bg-emerald-950/50 text-emerald-400 border-emerald-900'}\`}>
                          {inventoryMessage.text}
                        </span>
                      )}
                    </div>
                    <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                      {player.inventory.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-cyan-200/30 text-sm font-mono uppercase tracking-widest">Armazém Vazio</div>
                      ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {player.inventory.map((item, i) => (
                            <li key={i} className={\`flex justify-between items-center text-sm p-2 bg-slate-900/40 rounded border \${getRarityStyle(item.rarity)} hover:bg-slate-800/60 transition-colors\`}>
                              <div className="flex items-center gap-2 overflow-hidden mr-2">
                                <div className={\`w-6 h-6 rounded shrink-0 shadow-inner \${getRarityGradient(item.rarity)} border border-slate-900/50\`}></div>
                                <span className="truncate font-medium">{item.name}</span>
                              </div>
                              <button 
                                onClick={() => handleEquip(item)}
                                className="shrink-0 text-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] px-2 py-1 rounded border border-cyan-500/30 bg-cyan-950/50 text-xs uppercase font-bold tracking-wider transition-all cursor-pointer"
                              >
                                Equipar
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>`;

const newInventory = `                  {/* Inventory Panel */}
                  <div className="system-panel overflow-hidden flex flex-col" style={{ height: '360px' }}>
                    <div className="system-panel-header px-4 py-3 flex justify-between items-center shrink-0">
                      <span className="font-bold text-cyan-50 tracking-widest uppercase text-sm">Inventário ({player.inventory.length})</span>
                      {inventoryMessage && (
                        <span className={\`text-xs px-2 py-0.5 rounded font-mono uppercase tracking-wider border \${inventoryMessage.type === 'error' ? 'bg-red-950/50 text-red-400 border-red-900' : 'bg-emerald-950/50 text-emerald-400 border-emerald-900'}\`}>
                          {inventoryMessage.text}
                        </span>
                      )}
                    </div>
                    <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                      {player.inventory.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-cyan-200/30 text-sm font-mono uppercase tracking-widest border border-dashed border-cyan-900/30 rounded bg-slate-900/20">Armazém Vazio</div>
                      ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {player.inventory.map((item, i) => (
                            <li key={i} className={\`flex justify-between items-center text-sm p-2 rounded border \${getRarityStyle(item.rarity)} hover:brightness-125 transition-all group relative overflow-hidden\`}>
                              <div className="flex items-center gap-3 overflow-hidden mr-2 relative z-10">
                                <div className={\`w-10 h-10 rounded shrink-0 flex items-center justify-center \${getRarityGradient(item.rarity)}\`}>
                                  {getItemIcon(item.type, "w-5 h-5 text-slate-100 drop-shadow")}
                                </div>
                                <div className="flex flex-col">
                                  <span className="truncate font-bold tracking-wide">{item.name}</span>
                                  <span className="text-[10px] uppercase font-mono opacity-70">{item.type}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleEquip(item)}
                                className="shrink-0 bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 hover:bg-cyan-900 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] active:scale-95 px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer relative z-10"
                              >
                                EQUIPAR
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>`;

if (content.includes(oldInventory)) {
  content = content.replace(oldInventory, newInventory);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Replaced Inventory');
} else {
  console.log('Could not find oldInventory string');
}

const oldDismantle = `                  {/* Dismantle Inventory Panel */}
                  <div className="system-panel overflow-hidden flex flex-col" style={{ height: '240px' }}>
                    <div className="border-b border-amber-500/20 bg-amber-950/40 px-4 py-3 flex justify-between items-center shrink-0">
                      <span className="font-bold text-amber-400 tracking-widest uppercase text-sm">Desmanchar Itens ({player.inventory.length})</span>
                      {inventoryMessage && (
                        <span className={\`text-xs px-2 py-0.5 rounded font-mono uppercase tracking-wider border \${inventoryMessage.type === 'error' ? 'bg-red-950/50 text-red-400 border-red-900' : 'bg-emerald-950/50 text-emerald-400 border-emerald-900'}\`}>
                          {inventoryMessage.text}
                        </span>
                      )}
                    </div>
                    <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                      {player.inventory.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-cyan-200/30 text-sm font-mono uppercase tracking-widest">Armazém Vazio</div>
                      ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {player.inventory.map((item, i) => (
                            <li key={i} className={\`flex justify-between items-center text-sm p-2 bg-slate-900/40 rounded border \${getRarityStyle(item.rarity)} hover:bg-slate-800/60 transition-colors\`}>
                              <div className="flex items-center gap-2 overflow-hidden mr-2">
                                <div className={\`w-6 h-6 rounded shrink-0 shadow-inner \${getRarityGradient(item.rarity)} border border-slate-900/50\`}></div>
                                <span className="truncate font-medium">{item.name}</span>
                              </div>
                              <button 
                                onClick={() => handleDismantle(i)}
                                className="shrink-0 text-amber-400 hover:text-amber-300 hover:shadow-[0_0_10px_rgba(251,191,36,0.5)] px-2 py-1 rounded border border-amber-500/30 bg-amber-950/50 text-xs uppercase font-bold tracking-wider transition-all cursor-pointer"
                              >
                                Desmanchar
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>`;

const newDismantle = `                  {/* Dismantle Inventory Panel */}
                  <div className="system-panel overflow-hidden flex flex-col" style={{ height: '240px' }}>
                    <div className="system-panel-header px-4 py-3 flex justify-between items-center shrink-0">
                      <span className="font-bold text-amber-400 tracking-widest uppercase text-sm">Desmanchar Itens ({player.inventory.length})</span>
                      {inventoryMessage && (
                        <span className={\`text-xs px-2 py-0.5 rounded font-mono uppercase tracking-wider border \${inventoryMessage.type === 'error' ? 'bg-red-950/50 text-red-400 border-red-900' : 'bg-emerald-950/50 text-emerald-400 border-emerald-900'}\`}>
                          {inventoryMessage.text}
                        </span>
                      )}
                    </div>
                    <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                      {player.inventory.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-cyan-200/30 text-sm font-mono uppercase tracking-widest border border-dashed border-cyan-900/30 rounded bg-slate-900/20">Armazém Vazio</div>
                      ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {player.inventory.map((item, i) => (
                            <li key={i} className={\`flex justify-between items-center text-sm p-2 rounded border \${getRarityStyle(item.rarity)} hover:brightness-125 transition-all group relative overflow-hidden\`}>
                              <div className="flex items-center gap-3 overflow-hidden mr-2 relative z-10">
                                <div className={\`w-10 h-10 rounded shrink-0 flex items-center justify-center \${getRarityGradient(item.rarity)}\`}>
                                  {getItemIcon(item.type, "w-5 h-5 text-slate-100 drop-shadow")}
                                </div>
                                <div className="flex flex-col">
                                  <span className="truncate font-bold tracking-wide">{item.name}</span>
                                  <span className="text-[10px] uppercase font-mono opacity-70">{item.type}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleDismantle(i)}
                                className="shrink-0 bg-amber-950/80 text-amber-400 border border-amber-800/80 hover:bg-amber-900 hover:text-amber-200 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] active:scale-95 px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer relative z-10"
                              >
                                DESMANCHAR
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>`;

if (content.includes(oldDismantle)) {
  content = content.replace(oldDismantle, newDismantle);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Replaced Dismantle');
} else {
  console.log('Could not find oldDismantle string');
}
