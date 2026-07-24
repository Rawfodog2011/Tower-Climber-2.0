const fs = require('fs');
let code = fs.readFileSync('src/pages/CombatScene.tsx', 'utf8');

code = code.replace(/const \{[\s\n]*combatState, combatEndMessage, combatSpeed, setCombatSpeed,[\s\n]*combatLogFilter, setCombatLogFilter, dmgPopups, attackerAnimating[\s\n]*\} = useCombatStore\(\);/,
`const {
    combatState, combatEndMessage, combatSpeed, setCombatSpeed,
    combatLogFilter, setCombatLogFilter, dmgPopups, attackerAnimating, isAnimating
  } = useCombatStore();`);

code = code.replace(/<button\s+onClick=\{\(\) => handleCombatAction\(\{ type: 'attack' \}\)\}\s+disabled=\{!combatState \? true : false\}\s+className="w-full flex/g,
`<button
                  onClick={() => handleCombatAction({ type: 'attack' })}
                  disabled={!combatState || isAnimating}
                  className="w-full flex`);

code = code.replace(/<button\s+onClick=\{\(\) => handleCombatAction\(\{ type: 'flee' \}\)\}\s+disabled=\{!combatState \? true : false\}\s+className="w-full flex/g,
`<button
                  onClick={() => handleCombatAction({ type: 'flee' })}
                  disabled={!combatState || isAnimating}
                  className="w-full flex`);

// Wait, the regex might fail. I'll just replace `disabled={!combatState ? true : false}` or similar.
