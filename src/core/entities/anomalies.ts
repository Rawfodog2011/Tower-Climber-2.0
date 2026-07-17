import { random } from '../engine/rng';
import { CombatAnomaly } from '../../types';

export const ANOMALIES_DATABASE: CombatAnomaly[] = [
  { id: 'overdrive', name: 'Protocolo Overdrive', description: 'O jogador ganha +20% Dano, mas perde 5% HP por turno.', type: 'player_buff' },
  { id: 'magnetic_storm', name: 'Tempestade Magnética', description: 'Monstros têm +30% HP e dropam o dobro de ouro.', type: 'monster_buff' },
  { id: 'emp_field', name: 'Campo EMP', description: 'Todas as habilidades custam 0 EP, mas os ataques básicos dão 50% de dano.', type: 'hazard' },
  { id: 'radiation_leak', name: 'Vazamento de Radiação', description: 'Ambos os lados recebem status de Corrosão todo turno.', type: 'hazard' },
  { id: 'hyper_cooling', name: 'Hiper-Resfriamento', description: 'Resistência térmica máxima. Não é possível aplicar ou sofrer Overheat.', type: 'player_buff' }
];

export function getRandomAnomaly(): CombatAnomaly | null {
  if (random() > 0.4) return null; // 40% chance of anomaly
  return ANOMALIES_DATABASE[Math.floor(random() * ANOMALIES_DATABASE.length)];
}
