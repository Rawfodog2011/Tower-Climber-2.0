const fs = require('fs');
let code = fs.readFileSync('src/hooks/useGameEffects.ts', 'utf8');

code = code.replace(/import \{ usePlayerStore \} from '\.\.\/store\/usePlayerStore';\n/, "import { usePlayerStore } from '../store/usePlayerStore';\nimport { useClassEvolution } from './useClassEvolution';\n");

// Replace the auto evolve logic
code = code.replace(/      if \(evols\.length === 1\) \{[\s\S]*?\} \/\/ evols\.length === 1\s*\n\s*\}/, 
`      if (evols.length === 1) {
        const newClass = evols[0];
        if (player.currentClassId !== newClass.id) {
          autoEvolveClass(newClass.id);
        }
      }
    }`);

// Also we need to get `autoEvolveClass` inside the hook. Let's find where we destruct usePlayerStore:
// `const { player, setPlayer } = usePlayerStore();`
code = code.replace(/  const \{ player, setPlayer \} = usePlayerStore\(\);\n/, 
`  const { player, setPlayer } = usePlayerStore();
  const { autoEvolveClass } = useClassEvolution();\n`);

// Clean up dependencies for the hook
code = code.replace(/, setActiveMemoryKey, setPlayer, setActiveEvolutionNarrative, triggerToast\]\);/, ", autoEvolveClass]);");

fs.writeFileSync('src/hooks/useGameEffects.ts', code);
