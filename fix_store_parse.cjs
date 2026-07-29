const fs = require('fs');
let code = fs.readFileSync('src/store/usePlayerStore.ts', 'utf8');

const replacement = `  loadPlayer: () => {
    const saved = loadGame();
    if (saved) {
      if (!saved.visitedSectors) {
        saved.visitedSectors = [];
      }
      if (saved.highestFloorUnlocked) {
        saved.highestFloorUnlocked = Number(saved.highestFloorUnlocked);
      }
      if (!saved.highestFloorUnlocked || isNaN(saved.highestFloorUnlocked) || saved.highestFloorUnlocked < 1) {
        saved.highestFloorUnlocked = 1;
      }
      saved.level = Number(saved.level) || 1;
      set({ player: saved });
    }
  }`;
code = code.replace(/  loadPlayer: \(\) => \{\n    const saved = loadGame\(\);\n    if \(saved\) \{\n      if \(\!saved\.visitedSectors\) \{\n        saved\.visitedSectors = \[\];\n      \}\n      if \(\!saved\.highestFloorUnlocked \|\| isNaN\(saved\.highestFloorUnlocked\) \|\| saved\.highestFloorUnlocked < 1\) \{\n        saved\.highestFloorUnlocked = 1;\n      \}\n      set\(\{ player: saved \}\);\n    \}\n  \}/, replacement);
fs.writeFileSync('src/store/usePlayerStore.ts', code);
