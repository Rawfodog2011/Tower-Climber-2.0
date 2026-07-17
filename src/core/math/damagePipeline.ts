export interface DamagePipelineArgs {
  baseAtk: number;
  baseDef: number;
  flatModifiers?: number; // e.g. items, relics (flat)
  additivePercentModifiers?: number[]; // e.g. Overheat (+0.3), Set Bonuses (+0.1), Anomaly (-0.5)
  multiplicativeIndependentModifiers?: number[]; // e.g. Crit (1.5), Shock Crit (1.5)
}

/**
 * Pipeline de cálculo de dano explícita.
 * Aplica as seguintes etapas na ordem correta:
 * a) Dano base (ATK - DEF, mínimo 1)
 * b) Modificadores flat
 * c) Multiplicadores percentuais somados (1 + sum(%))
 * d) Multiplicadores independentes multiplicados sequencialmente
 */
export function calculateDamage(args: DamagePipelineArgs): number {
  // a) Dano base (mínimo 1)
  let damage = Math.max(1, args.baseAtk - args.baseDef);

  // b) Modificadores flat
  if (args.flatModifiers) {
    damage = Math.max(1, damage + args.flatModifiers);
  }

  // c) Multiplicadores percentuais somados entre si
  let additiveMultiplier = 1;
  if (args.additivePercentModifiers && args.additivePercentModifiers.length > 0) {
    const sum = args.additivePercentModifiers.reduce((acc, val) => acc + val, 0);
    additiveMultiplier = Math.max(0, 1 + sum); // Não deixa zerar completamente ou ficar negativo
  }
  damage = damage * additiveMultiplier;

  // d) Multiplicadores multiplicativos independentes
  if (args.multiplicativeIndependentModifiers && args.multiplicativeIndependentModifiers.length > 0) {
    const mult = args.multiplicativeIndependentModifiers.reduce((acc, val) => acc * val, 1);
    damage = damage * mult;
  }

  return Math.max(1, Math.floor(damage)); // Sempre pelo menos 1 de dano, e arredondado para baixo
}
