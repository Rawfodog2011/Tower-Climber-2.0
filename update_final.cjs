const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Update imports
if (!content.includes('Activity')) {
  content = content.replace("from 'lucide-react';", ", Activity, Flame, Crosshair as CrosshairIcon, Terminal } from 'lucide-react';");
}

// 1. Mission Terminal
const oldFloorSelect = `              {/* Floor Selection Panel */}
              <div className="system-panel overflow-hidden">
                <div className="system-panel-header px-4 py-3">
                  <span className="font-bold text-cyan-50 tracking-widest uppercase text-sm">Adentrar a Torre</span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-cyan-200/60 block mb-2 font-mono text-center">Nível do Andar Alvo</label>
                    <input 
                      type="range" 
                      min="1" 
                      max={player.highestFloorUnlocked} 
                      value={selectedFloor} 
                      onChange={(e) => setSelectedFloor(Number(e.target.value))}
                      className="w-full accent-cyan-500 hover:accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-mono text-cyan-200/40 mt-2">
                      <span>01</span>
                      <span className="text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] text-sm">ANDAR {selectedFloor.toString().padStart(2, '0')}</span>
                      <span>{player.highestFloorUnlocked.toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStartDive(selectedFloor)}
                    className="w-full bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-50 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                  >
                    Iniciar Mergulho
                  </button>
                </div>
              </div>`;

const newFloorSelect = `              {/* Floor Selection Panel */}
              <div className="system-panel overflow-hidden relative group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="system-panel-header px-4 py-3 border-b border-orange-500/30 bg-orange-950/20">
                  <span className="font-bold text-orange-400 tracking-widest uppercase text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Painel de Início de Expedição
                  </span>
                </div>
                <div className="p-5 space-y-6 relative z-10">
                  <div className="bg-slate-950/50 p-4 rounded border border-slate-800">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-3 font-mono text-center">Calibração de Rota</label>
                    <div className="flex justify-center mb-4">
                      <div className="text-center">
                        <span className="block text-[10px] font-mono text-orange-500/70 mb-1">THREAT LEVEL</span>
                        <span className="text-orange-400 font-bold font-mono drop-shadow-[0_0_8px_rgba(251,146,60,0.8)] text-2xl">
                          FLOOR {selectedFloor.toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max={player.highestFloorUnlocked} 
                      value={selectedFloor} 
                      onChange={(e) => setSelectedFloor(Number(e.target.value))}
                      className="w-full accent-orange-500 hover:accent-orange-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                      <span>MIN: 01</span>
                      <span>MAX: {player.highestFloorUnlocked.toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStartDive(selectedFloor)}
                    className="w-full bg-orange-600/20 hover:bg-orange-600/30 border-2 border-orange-500/50 text-orange-400 hover:text-orange-300 font-bold py-4 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_25px_rgba(251,146,60,0.4)] cursor-pointer animate-pulse active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Flame className="w-5 h-5" />
                    INICIAR MERGULHO
                  </button>
                </div>
              </div>`;

if (content.includes(oldFloorSelect)) {
  content = content.replace(oldFloorSelect, newFloorSelect);
}

// 2. Combat Tactics
const oldCombatTactics = `            {/* Painel de Ações Esquerdo */}
            <div className="system-panel flex flex-col w-full lg:w-1/3">
              <div className="system-panel-header px-4 py-3">
                <span className="font-bold text-cyan-50 tracking-widest uppercase text-sm">Comandos Táticos</span>
              </div>
              
              <div className="p-4 space-y-3 flex-1 flex flex-col">
                {combatState && combatState.isActive ? (
                  <>
                    <button 
                      onClick={() => handleCombatAction({ type: 'attack' })}
                      className="w-full bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-700/50 text-white font-bold py-3 px-4 rounded transition-all text-left flex justify-between items-center cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    >
                      <span className="uppercase tracking-widest">Ataque Básico</span>
                      <span className="text-cyan-400 text-xs font-mono">T-ATK</span>
                    </button>
                    
                    <div className="w-full h-px bg-cyan-900/50 my-2"></div>
                    
                    {player.learnedSkills.map(skillId => {
                      const skill = SKILLS_DATABASE[skillId];
                      const canUseClass = canClassUseSkill(player.currentClassId, skill);
                      const cd = combatState.cooldowns[skill.id] || 0;
                      const noMp = combatState.playerMp < skill.mpCost;
                      
                      return (
                        <button 
                          key={skill.id}
                          disabled={!canUseClass || cd > 0 || noMp}
                          onClick={() => handleCombatAction({ type: 'skill', skillId: skill.id })}
                          className={\`w-full text-left font-bold py-3 px-4 rounded transition-all flex justify-between items-center border \${
                            !canUseClass ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed' :
                            cd > 0 ? 'bg-orange-950/30 border-orange-900/50 text-orange-600/50 cursor-not-allowed' :
                            noMp ? 'bg-blue-950/30 border-blue-900/50 text-blue-600/50 cursor-not-allowed' :
                            'bg-indigo-950/50 hover:bg-indigo-900/60 border-indigo-500/50 text-indigo-200 cursor-pointer hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                          }\`}
                          title={!canUseClass ? \`Requer classe: \${CLASSES[skill.allowedClassId].name}\` : skill.description}
                        >
                          <div className="flex flex-col">
                            <span className="uppercase tracking-widest text-sm">{skill.name}</span>
                            <span className="text-[10px] font-mono font-normal mt-1 opacity-70">
                              {skill.type === 'damage' ? \`PWR: \${skill.power}\` : skill.type === 'heal' ? \`HEAL: \${skill.power}\` : 'BUFF'} | CD: {skill.cooldown}
                            </span>
                          </div>
                          {cd > 0 ? (
                            <span className="text-orange-500 text-xl font-bold font-mono">
                              {cd}
                            </span>
                          ) : (
                            <span className="text-indigo-400 text-xs font-mono font-bold">
                              {skill.mpCost} EP
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-cyan-200/30 font-mono text-sm uppercase tracking-widest">
                    Aguardando...
                  </div>
                )}
              </div>
            </div>`;

const newCombatTactics = `            {/* Painel de Ações Esquerdo */}
            <div className="system-panel flex flex-col w-full lg:w-1/3">
              <div className="system-panel-header px-4 py-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-cyan-50 tracking-widest uppercase text-sm">Módulos de Combate</span>
              </div>
              
              <div className="p-4 space-y-3 flex-1 flex flex-col">
                {combatState && combatState.isActive ? (
                  <>
                    <button 
                      onClick={() => handleCombatAction({ type: 'attack' })}
                      className="w-full bg-slate-900/80 hover:bg-cyan-950/60 border border-cyan-800/50 hover:border-cyan-500 text-white font-bold py-3 px-4 rounded transition-all text-left flex justify-between items-center cursor-pointer hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] active:scale-[0.98] group"
                    >
                      <div className="flex items-center gap-3">
                        <CrosshairIcon className="w-5 h-5 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
                        <span className="uppercase tracking-widest text-sm text-cyan-50">Ataque Básico</span>
                      </div>
                      <span className="text-cyan-500/50 text-[10px] font-mono border border-cyan-900/50 px-2 py-0.5 rounded">SYS.ATK</span>
                    </button>
                    
                    <div className="w-full h-px bg-cyan-900/30 my-2 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                    </div>
                    
                    {player.learnedSkills.map(skillId => {
                      const skill = SKILLS_DATABASE[skillId];
                      const canUseClass = canClassUseSkill(player.currentClassId, skill);
                      const cd = combatState.cooldowns[skill.id] || 0;
                      const noMp = combatState.playerMp < skill.mpCost;
                      
                      const isDesligado = cd > 0;
                      
                      return (
                        <button 
                          key={skill.id}
                          disabled={!canUseClass || isDesligado || noMp}
                          onClick={() => handleCombatAction({ type: 'skill', skillId: skill.id })}
                          className={\`w-full text-left font-bold py-3 px-4 rounded transition-all flex justify-between items-center border relative overflow-hidden active:scale-[0.98] \${
                            !canUseClass ? 'bg-slate-950/80 border-slate-800 text-slate-600 cursor-not-allowed' :
                            isDesligado ? 'bg-red-950/20 border-red-900/30 text-slate-500 cursor-not-allowed grayscale filter' :
                            noMp ? 'bg-slate-950/80 border-cyan-900/30 text-cyan-800/50 cursor-not-allowed' :
                            'bg-indigo-950/30 hover:bg-indigo-900/50 border-indigo-500/50 text-indigo-100 cursor-pointer hover:shadow-[inset_0_0_15px_rgba(99,102,241,0.2),0_0_15px_rgba(99,102,241,0.4)] group'
                          }\`}
                          title={!canUseClass ? \`Requer classe: \${CLASSES[skill.allowedClassId].name}\` : skill.description}
                        >
                          {isDesligado && (
                            <div className="absolute inset-0 bg-red-900/10 pointer-events-none"></div>
                          )}
                          
                          <div className="flex items-center gap-3 relative z-10">
                            <Zap className={\`w-5 h-5 \${isDesligado ? 'text-red-900/50' : 'text-indigo-400 group-hover:text-indigo-300'}\`} />
                            <div className="flex flex-col">
                              <span className="uppercase tracking-widest text-sm">{skill.name}</span>
                              <span className="text-[10px] font-mono font-normal mt-0.5 opacity-60 flex gap-2">
                                <span>{skill.type === 'damage' ? \`PWR:\${skill.power}\` : skill.type === 'heal' ? \`HEAL:\${skill.power}\` : 'BUFF'}</span>
                                <span className="opacity-50">|</span>
                                <span>CD:{skill.cooldown}</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="relative z-10">
                            {isDesligado ? (
                              <span className="text-red-500/80 text-2xl font-bold font-mono drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]">
                                {cd}
                              </span>
                            ) : (
                              <span className={\`text-[10px] font-mono font-bold px-2 py-1 rounded border \${noMp ? 'border-cyan-900/50 text-cyan-800/50' : 'border-indigo-500/30 bg-indigo-950/50 text-indigo-300'}\`}>
                                {skill.mpCost} EP
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-cyan-200/20 font-mono text-sm uppercase tracking-widest">
                    [ STANDBY ]
                  </div>
                )}
              </div>
            </div>`;

if (content.includes(oldCombatTactics)) {
  content = content.replace(oldCombatTactics, newCombatTactics);
}


// 3. Combat Log
const oldLog = `              {/* Registro de Combate (Logs) */}
              <div className="system-panel flex-1 flex flex-col min-h-[200px]">
                <div className="system-panel-header px-4 py-2">
                  <span className="font-bold text-cyan-50 tracking-widest uppercase text-[10px]">Terminal de Registro</span>
                </div>
                <div className="p-4 overflow-y-auto max-h-64 font-mono text-xs md:text-sm space-y-1 flex-1 custom-scrollbar">
                  {combatState && combatState.logs.map((log, i) => (
                    <div key={i} className={
                      log.includes('Vitória') ? 'text-emerald-400 font-bold text-shadow' : 
                      log.includes('derrotado') || log.includes('sucumbiu') ? 'text-red-400 font-bold text-shadow' : 
                      log.includes('LEVEL UP') ? 'text-yellow-400 font-bold uppercase text-shadow' :
                      log.includes('--- Turno') ? 'text-cyan-500 mt-3 block font-bold border-b border-cyan-900/50 pb-1 mb-1' :
                      log.includes('usou') ? 'text-indigo-300 font-medium' :
                      log.includes('Loot:') ? 'text-purple-300' :
                      'text-cyan-200/70'
                    }>
                      {log.includes('--- Turno') ? log : \`> \${log}\`}
                    </div>
                  ))}
                </div>
              </div>`;

const newLog = `              {/* Registro de Combate (Logs) */}
              <div className="system-panel flex-1 flex flex-col min-h-[200px]">
                <div className="system-panel-header px-4 py-2 flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-cyan-500/70" />
                  <span className="font-bold text-cyan-500/70 tracking-widest uppercase text-[10px]">Terminal de Registro</span>
                </div>
                <div className="p-4 overflow-y-auto max-h-64 font-mono text-[11px] leading-relaxed space-y-1.5 flex-1 custom-scrollbar">
                  {combatState && combatState.logs.map((log, i) => {
                    let logStyle = 'text-cyan-200/60';
                    let prefix = '';
                    
                    if (log.includes('Vitória')) {
                      logStyle = 'text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]';
                      prefix = '[WIN] ';
                    } else if (log.includes('derrotado') || log.includes('sucumbiu')) {
                      logStyle = 'text-red-400 font-bold drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]';
                      prefix = '[FATAL] ';
                    } else if (log.includes('LEVEL UP')) {
                      logStyle = 'text-amber-400 font-bold uppercase drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]';
                      prefix = '[SYS] ';
                    } else if (log.includes('--- Turno')) {
                      logStyle = 'text-cyan-500 mt-4 block font-bold border-b border-cyan-900/30 pb-1 mb-2 tracking-widest text-[10px] uppercase';
                    } else if (log.includes('usou')) {
                      logStyle = 'text-indigo-300';
                      prefix = '>> ';
                    } else if (log.includes('causou') || log.includes('dano')) {
                      logStyle = 'text-red-300/90';
                      prefix = '>> ';
                    } else if (log.includes('curou') || log.includes('recuperou')) {
                      logStyle = 'text-emerald-300/90';
                      prefix = '>> ';
                    } else if (log.includes('Loot:')) {
                      logStyle = 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.6)]';
                      prefix = '[LOOT] ';
                    } else {
                      prefix = '> ';
                    }
                    
                    return (
                      <div key={i} className={logStyle}>
                        {log.includes('--- Turno') ? log : <span className="opacity-70 mr-1 select-none">{prefix}</span>}
                        {log.includes('--- Turno') ? null : <span className="drop-shadow-[0_0_2px_rgba(34,211,238,0.2)]">{log}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>`;

if (content.includes(oldLog)) {
  content = content.replace(oldLog, newLog);
}

fs.writeFileSync('src/App.tsx', content);
console.log('Update Complete');
