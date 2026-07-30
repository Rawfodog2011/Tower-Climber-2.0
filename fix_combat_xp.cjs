const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

if (!code.includes('getXpRequiredForNextLevel')) {
  code = code.replace(
    "import { calculatePlayerStats } from '../core/entities/player';",
    "import { calculatePlayerStats } from '../core/entities/player';\nimport { getXpRequiredForNextLevel } from '../core/math/progression';"
  );
}

const reqXpSnippet = `  const { t } = useTranslation();

  const requiredXp = getXpRequiredForNextLevel(player.level);
  const xpPercent = player.level >= 100 ? 100 : Math.min(100, (player.currentXp / requiredXp) * 100);
`;
code = code.replace("  const { t } = useTranslation();", reqXpSnippet);

const targetLevelUI = `<div className="absolute top-2 left-2 text-cyan-500/50 font-mono text-[10px] tracking-widest">{player.name}</div>
                <div className="absolute top-2 right-2 text-yellow-500 font-mono text-xs font-bold tracking-widest">Nv. {player.level}</div>`;
code = code.replace(`<div className="absolute top-2 left-2 text-cyan-500/50 font-mono text-[10px] tracking-widest">{player.name}</div>`, targetLevelUI);

const targetXpUI = `                    <div className="flex justify-between text-xs font-bold font-mono mt-1">
                      <span className="text-slate-400">Escudo</span>
                      <span className="text-slate-100">{Math.floor((combatState.playerShield) || 0)}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded border border-slate-700 overflow-hidden">
                      <div className="bg-slate-400 h-full transition-all duration-300" style={{ width: \`\${Math.min(100, ((combatState.playerShield) || 0 / (pStatsMemo.hp * 0.5)) * 100)}%\` }}></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold font-mono mt-1">
                      <span className="text-yellow-500/80">XP</span>
                      <span className="text-yellow-100/80">{player.level >= 100 ? 'MÁX' : \`\${Math.floor(player.currentXp)} / \${requiredXp}\`}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded border border-slate-700 overflow-hidden">
                      <div className="bg-yellow-500/80 h-full transition-all duration-300" style={{ width: \`\${xpPercent}%\` }}></div>
                    </div>`;
                    
code = code.replace(/<div className="flex justify-between text-xs font-bold font-mono mt-1">\s*<span className="text-slate-400">Escudo<\/span>\s*<span className="text-slate-100">\{Math\.floor\(\(combatState\.playerShield\) \|\| 0\)\}<\/span>\s*<\/div>\s*<div className="w-full bg-slate-900 h-1\.5 rounded border border-slate-700 overflow-hidden">\s*<div className="bg-slate-400 h-full transition-all duration-300" style=\{\{ width: `\$\{Math\.min\(100, \(\(combatState\.playerShield\) \|\| 0 \/ \(pStatsMemo\.hp \* 0\.5\)\) \* 100\)\}%` \}\}><\/div>\s*<\/div>/g, targetXpUI);

fs.writeFileSync('src/pages/CombatScene.tsx', code);
