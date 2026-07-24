const fs = require('fs');
let code = fs.readFileSync('src/hooks/useGameEffects.ts', 'utf8');

// I will remove the entire useEffect that starts with: `if (!combatState) { prevPlayerHpRef... }`
code = code.replace(/useEffect\(\(\) => \{\n\s*if \(\!combatState\) \{\n\s*prevPlayerHpRef\.current = null;[\s\S]*?prevPlayerHpRef\.current = currentPHp;\n\s*prevMonsterHpRef\.current = currentMHp;\n\s*\}, \[combatState, combatSpeed, setEnrageFlash, setAttackerAnimating, setDmgPopups\]\);\n/, '');

fs.writeFileSync('src/hooks/useGameEffects.ts', code);
