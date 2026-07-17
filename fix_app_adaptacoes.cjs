const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `              {hubTab === 'auto' && (`;
const adaptationsContent = `              {hubTab === 'adaptacoes' && (
                <div className="system-panel overflow-hidden mb-4">
                  <div className="border-b border-blue-500/20 bg-blue-950/40 px-4 py-3 flex items-center gap-2">
                    <Fingerprint className="text-blue-400 w-4 h-4" />
                    <span className="font-bold text-blue-400 tracking-widest uppercase text-sm">Protocolos de Adaptação Biomecânica</span>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-xs text-blue-200/70 font-mono mb-4">
                      Seu traje evolui passivamente com a repetição de ações em combate.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.values(ADAPTATIONS_DATABASE).map(def => {
                        const state = player.adaptations?.[def.id] || { level: 0, exp: 0 };
                        const reqExp = def.expFormula(state.level);
                        const progress = state.level === def.maxLevel ? 100 : (state.exp / reqExp) * 100;
                        
                        return (
                          <div key={def.id} className="bg-slate-900/50 border border-blue-500/20 p-4 relative overflow-hidden flex flex-col group hover:border-blue-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-blue-200 text-sm tracking-widest uppercase">{def.name}</h4>
                              <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-2 py-1">Nv. {state.level}/{def.maxLevel}</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-4 flex-grow">{def.description}</p>
                            
                            <div className="mt-auto">
                              <div className="flex justify-between text-[10px] text-blue-300/70 font-mono mb-1">
                                <span>Proficiência</span>
                                <span>{state.level === def.maxLevel ? 'MAX' : \`\${Math.floor(state.exp)} / \${reqExp}\`}</span>
                              </div>
                              <div className="w-full bg-slate-950 border border-blue-900 h-2">
                                <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: \`\${progress}%\` }}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {hubTab === 'auto' && (`;

content = content.replace(target, adaptationsContent);

// Let's add Fingerprint icon import if missing
if (!content.includes('Fingerprint')) {
  content = content.replace("import {", "import { Fingerprint,");
}

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx adaptations added');
