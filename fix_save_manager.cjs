const fs = require('fs');
let code = fs.readFileSync('src/components/SaveManager.tsx', 'utf8');

const target1 = `import { useToastStore } from '../store/useToastStore';`;
const replacement1 = `import { useToastStore } from '../store/useToastStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { migrateSave } from '../core/engine/migrations';`;

const target2 = `        if (parsed.save !== undefined) {
          if (parsed.save) setStorageItem(STORAGE_KEYS.SAVE, parsed.save);
          if (parsed.codex) setStorageItem(STORAGE_KEYS.TIMELINE_CODEX, parsed.codex);
          if (parsed.memory) setStorageItem(STORAGE_KEYS.MEMORY_ARCHIVE, parsed.memory);
        } else {
          // Backward compatibility if they upload just the player object
          setStorageItem(STORAGE_KEYS.SAVE, parsed);
        }`;

const replacement2 = `        if (parsed.save !== undefined) {
          if (parsed.save) {
            setStorageItem(STORAGE_KEYS.SAVE, parsed.save);
            const migrated = migrateSave(parsed.save);
            if (migrated) usePlayerStore.getState().setPlayer(migrated);
          }
          if (parsed.codex) setStorageItem(STORAGE_KEYS.TIMELINE_CODEX, parsed.codex);
          if (parsed.memory) setStorageItem(STORAGE_KEYS.MEMORY_ARCHIVE, parsed.memory);
        } else {
          // Backward compatibility if they upload just the player object
          setStorageItem(STORAGE_KEYS.SAVE, parsed);
          const migrated = migrateSave(parsed);
          if (migrated) usePlayerStore.getState().setPlayer(migrated);
        }`;

if (code.includes(target1) && code.includes(target2)) {
  code = code.replace(target1, replacement1);
  code = code.replace(target2, replacement2);
  fs.writeFileSync('src/components/SaveManager.tsx', code);
  console.log('Fixed SaveManager.tsx to update memory immediately');
} else {
  console.log('Targets not found in SaveManager.tsx');
}
