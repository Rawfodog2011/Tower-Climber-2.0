const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /\{\/\* Registro de Combate \(Logs\) \*\/\}[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\) : scene === 'event')/;

const match = content.match(regex);
if (match) {
  const newLog = `{/* Registro de Combate (Logs) */}
              <div className="system-panel flex-1 flex flex-col min-h-[200px]">
                <div className="system-panel-header px-4 py-2 flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-cyan-500/70" />
                  <span className="font-bold text-cyan-500/70 tracking-widest uppercase text-[10px]">Terminal de Registro</span>
                </div>
                <div ref={logContainerRef} className="p-4 overflow-y-auto max-h-64 font-mono text-[11px] leading-relaxed space-y-1.5 flex-1 custom-scrollbar">
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
              </div>
            </div>`;
  content = content.replace(regex, newLog);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Replaced successfully');
} else {
  console.log('Regex did not match');
}
