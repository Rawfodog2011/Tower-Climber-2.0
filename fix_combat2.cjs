const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

const startIndex = code.indexOf('{(combatState.monster as any).skills.length > 0 && (');
if (startIndex !== -1) {
  const endIndex = code.indexOf(')}', startIndex + 500) + 2;
  const replacement = `<div className="mt-4">
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{t("Resumo de Atributos")}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-slate-900/30 px-3 py-2 rounded">
                          <span className="font-mono text-xs text-rose-400">{t("Ataque")} (ATK)</span>
                          <span className="text-xs font-bold text-rose-300">{combatState.monster.stats.atk}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/30 px-3 py-2 rounded">
                          <span className="font-mono text-xs text-emerald-400">{t("Defesa")} (DEF)</span>
                          <span className="text-xs font-bold text-emerald-300">{combatState.monster.stats.def}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/30 px-3 py-2 rounded">
                          <span className="font-mono text-xs text-yellow-400">{t("Velocidade")} (SPD)</span>
                          <span className="text-xs font-bold text-yellow-300">{combatState.monster.stats.spd}</span>
                        </div>
                      </div>
                    </div>`;
  
  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/pages/CombatScene.tsx', code);
}
