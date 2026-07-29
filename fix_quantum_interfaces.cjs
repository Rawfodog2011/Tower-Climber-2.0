const fs = require('fs');
let code = fs.readFileSync('src/components/QuantumPrestigePanel.tsx', 'utf8');

const insertions = `
export interface QuantumUpgradeDef {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
}

export const QUANTUM_UPGRADES: QuantumUpgradeDef[] = [
  {
    id: 'hp_boost',
    name: 'Vitalidade Quântica',
    description: 'Aumenta permanentemente o HP base em +50 por nível.',
    icon: Heart,
    baseCost: 1,
    costMultiplier: 1.5,
    maxLevel: 10
  },
  {
    id: 'atk_boost',
    name: 'Sobrecarga de Dano',
    description: 'Aumenta permanentemente o ATK base em +5 por nível.',
    icon: Zap,
    baseCost: 1,
    costMultiplier: 1.5,
    maxLevel: 10
  },
  {
    id: 'gold_boost',
    name: 'Algoritmo de Riqueza',
    description: 'Aumenta o ganho de Ouro em +10% por nível.',
    icon: Coins,
    baseCost: 2,
    costMultiplier: 2.0,
    maxLevel: 5
  },
  {
    id: 'xp_boost',
    name: 'Aprendizado Acelerado',
    description: 'Aumenta o ganho de XP em +10% por nível.',
    icon: Star,
    baseCost: 2,
    costMultiplier: 2.0,
    maxLevel: 5
  }
];

export const QuantumPrestigePanel: React.FC = () => {`;

code = code.replace(/export const QuantumPrestigePanel: React\.FC = \(\) => \{/, insertions);

fs.writeFileSync('src/components/QuantumPrestigePanel.tsx', code);
