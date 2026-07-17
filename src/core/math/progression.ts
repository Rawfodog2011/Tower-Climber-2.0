/**
 * math/progression.ts
 * Contém a lógica de progressão do jogo, incluindo a curva de experiência.
 */

/**
 * Calcula a quantidade de XP necessária para avançar do nível atual (currentLevel) para o próximo.
 * 
 * Fórmula base: XP_Requisitado = floor(BaseXP * (Nível)^Exponente)
 * - BaseXP: 50. Define o ponto de partida.
 * - Exponente: 1.8. Cria uma curva exponencial suave. O começo é rápido, 
 *   mas os níveis mais altos requerem consideravelmente mais grind, incentivando 
 *   a exploração de andares mais altos da torre para melhor XP.
 * 
 * @param level O nível atual do jogador
 * @returns A quantidade total de XP necessária para o PRÓXIMO nível.
 */
export function getXpRequiredForNextLevel(level: number): number {
  const baseXP = 40; // Reduzido para suavizar a curva inicial
  const exponent = 1.8;
  return Math.floor(baseXP * Math.pow(level, exponent));
}

/**
 * Calcula o XP total acumulado necessário para atingir um nível específico, partindo do nível 1.
 */
export function getTotalXpForLevel(targetLevel: number): number {
  let totalXp = 0;
  for (let i = 1; i < targetLevel; i++) {
    totalXp += getXpRequiredForNextLevel(i);
  }
  return totalXp;
}
