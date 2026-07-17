const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// I need to find where I injected the end of Painel de Ações Esquerdo, and add the missing Arena Central div
const searchStr = `                    <button 
                      onClick={handleReturnToHub}
                      className="w-full bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-50 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                    >
                      Voltar ao Hub
                    </button>
                  </div>
                )}
              </div>
            </div>`;

const replaceStr = `                    <button 
                      onClick={handleReturnToHub}
                      className="w-full bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-50 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                    >
                      Voltar ao Hub
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Arena Central & Logs */}
            <div className="flex flex-col w-full lg:w-2/3 space-y-4">`;

if (content.includes(searchStr)) {
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Fixed missing div!');
} else {
  console.log('Could not find searchStr!');
}
