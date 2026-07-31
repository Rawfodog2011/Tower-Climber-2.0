/**
 * Portrait path utilities for combat scene.
 * Resolves local image paths for character and monster portraits.
 */

/**
 * Get the local portrait path for a character origin.
 * Returns the expected path under /public/characters/
 */
export function getCharacterPortrait(originId: string | undefined): string {
  if (!originId) return '';
  return `/characters/${originId}.png`;
}

/**
 * Get the local portrait path for a monster.
 * For regular monsters, uses the template ID (without floor suffix).
 * For bosses, uses a simplified ID pattern.
 */
export function getMonsterPortrait(monsterId: string | undefined): string {
  if (!monsterId) return '';
  return `/monsters/${monsterId}.png`;
}

/**
 * Get monster template ID from full monster ID.
 * Strips the floor suffix for template matching.
 * e.g., "parasita_acido_f15" -> "parasita_acido"
 *       "boss_floor_20" -> "boss_floor_20"
 *       "mainframe_prime" -> "mainframe_prime"
 */
export function getMonsterTemplateId(monsterId: string): string {
  if (monsterId.startsWith('boss_') || monsterId === 'mainframe_prime') {
    return monsterId;
  }
  const match = monsterId.match(/^(.+)_f\d+$/);
  return match ? match[1] : monsterId;
}
