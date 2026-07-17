const fs = require('fs');
let content = fs.readFileSync('src/core/entities/player.ts', 'utf-8');

content += `
/**
 * Regra do GDD: Penalidade de Morte.
 * O jogador perde 20% do XP atual (não perde nível) e 20% do Ouro atual.
 */
export function applyDeathPenalty(player: Player): Player {
  const newXp = Math.floor(player.currentXp * 0.8);
  const newGold = Math.floor(player.gold * 0.8);

  return {
    ...player,
    currentXp: newXp,
    gold: newGold
  };
}

/**
 * Adiciona XP ao jogador e verifica se ele subiu de nível.
 * Caso ganhe muito XP, lida com múltiplos level ups.
 * Aplica bônus de relíquias.
 */
export function addXpAndLevelUp(player: Player, xpAmount: number): Player {
  let { currentXp, level } = player;
  
  // Bônus do Medalhão do Caçador
  const xpMultiplier = 1 + ((player.relics?.medalhao_cacador || 0) * 0.03);
  const finalXp = Math.floor(xpAmount * xpMultiplier);
  
  currentXp += finalXp;
  
  let required = getXpRequiredForNextLevel(level);
  while (currentXp >= required) {
    currentXp -= required; // Consome o XP necessário para o nível
    level++;
    required = getXpRequiredForNextLevel(level);
  }
  
  return {
    ...player,
    currentXp,
    level
  };
}
`;

fs.writeFileSync('src/core/entities/player.ts', content);
