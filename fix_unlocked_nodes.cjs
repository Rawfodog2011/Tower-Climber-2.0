const fs = require('fs');
let code = fs.readFileSync('src/core/engine/migrations.ts', 'utf8');

const target = `if (!player.unlockedNodes) player.unlockedNodes = ['core_start'];`;

const replacement = `if (!player.unlockedNodes || player.unlockedNodes.length === 0) player.unlockedNodes = ['core_start'];`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/core/engine/migrations.ts', code);
  console.log('Fixed unlockedNodes fallback');
} else {
  console.log('Target not found in migrations.ts');
}
