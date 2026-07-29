const fs = require('fs');
let code = fs.readFileSync('src/store/usePlayerStore.ts', 'utf8');

const replacement = `  loadPlayer: () => {
    const saved = loadGame();
    if (saved) {
      if (!saved.visitedSectors) {
        saved.visitedSectors = [];
      }
      
      // Repair potentially corrupted highestFloorUnlocked (e.g. from string concatenation "1" + 1 = "11")
      if (typeof saved.highestFloorUnlocked === 'string') {
         const str = saved.highestFloorUnlocked;
         if (str === '11') saved.highestFloorUnlocked = 2;
         else if (str === '111') saved.highestFloorUnlocked = 3;
         else if (str === '1111') saved.highestFloorUnlocked = 4;
         else if (str === '21') saved.highestFloorUnlocked = 3;
         else if (str === '31') saved.highestFloorUnlocked = 4;
         else saved.highestFloorUnlocked = Number(str);
      }
      
      if (saved.highestFloorUnlocked > 1000 || saved.highestFloorUnlocked > saved.level * 5 + 10) {
         // Sanity check cap
         saved.highestFloorUnlocked = Math.min(saved.highestFloorUnlocked, saved.level * 5 + 5);
      }
      
      if (!saved.highestFloorUnlocked || isNaN(saved.highestFloorUnlocked) || saved.highestFloorUnlocked < 1) {
        saved.highestFloorUnlocked = 1;
      }
      saved.level = Number(saved.level) || 1;
      set({ player: saved });
    }
  }`;

code = code.replace(/  loadPlayer: \(\) => \{\n    const saved = loadGame\(\);\n    if \(saved\) \{[\s\S]*?set\(\{ player: saved \}\);\n    \}\n  \}/, replacement);
fs.writeFileSync('src/store/usePlayerStore.ts', code);
