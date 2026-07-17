const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /const \[hubTab, setHubTab\] = useState<'personagem' \| 'inventario' \| 'reliquias' \| 'conquistas' \| 'auto' \| 'adaptacoes'>\('personagem'\);/;
const replacement = "const [hubTab, setHubTab] = useState<'geral' | 'forja' | 'reliquias' | 'conquistas' | 'auto' | 'adaptacoes'>('geral');";

content = content.replace(regex, replacement);

const autoTabBtn = `                <button 
                  onClick={() => setHubTab('auto')} 
                  className={\`px-4 py-2 uppercase tracking-widest font-bold text-sm transition-colors cursor-pointer \${hubTab === 'auto' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-cyan-200/50 hover:text-emerald-200'}\`}
                >
                  Módulos Auto
                </button>`;
const newTabBtns = autoTabBtn + `
                <button 
                  onClick={() => setHubTab('adaptacoes')} 
                  className={\`px-4 py-2 uppercase tracking-widest font-bold text-sm transition-colors cursor-pointer \${hubTab === 'adaptacoes' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-cyan-200/50 hover:text-blue-200'}\`}
                >
                  Adaptações
                </button>`;

content = content.replace(autoTabBtn, newTabBtns);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx tabs fixed');
