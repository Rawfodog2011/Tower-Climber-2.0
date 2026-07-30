const fs = require('fs');
let code = fs.readFileSync('src/hooks/useGameEffects.ts', 'utf8');

const targetSave = `  useEffect(() => {
    if (player.level > 1 || player.gold > 0 || player.currentXp > 0 || player.inventory.length > 0) {
      saveGame(player);
    }
  }, [player]);`;

const replacementSave = `  useEffect(() => {
    if (scene === 'main_menu' || scene === 'intro' || scene === 'character_creation' || scene === 'loading' || scene === 'env_intro') {
      return; // Evita salvar por cima ao carregar o jogo
    }
    if (player.level > 1 || player.gold > 0 || player.currentXp > 0 || player.inventory.length > 0) {
      saveGame(player);
    }
  }, [player, scene]);`;

if (code.includes(targetSave)) {
  code = code.replace(targetSave, replacementSave);
  fs.writeFileSync('src/hooks/useGameEffects.ts', code);
  console.log('Fixed auto save in useGameEffects.ts');
} else {
  console.log('Target save block not found in useGameEffects.ts');
}
