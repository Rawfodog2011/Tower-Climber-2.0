import { generateNeuralSkeleton } from './neuralMatrixGenerator';

import { Stats } from '../../types';

export type MatrixNodeType = 'minor' | 'active_skill' | 'notable' | 'keystone';

export interface MatrixNode {
  id: string;
  type: MatrixNodeType;
  name: string;
  description: string;
  statBonus?: Partial<Stats>;
  mechanicModifiers?: string[]; // E.g., ['sobrecarga_materia', 'overclock_termodinamico']
  skillId?: string;
  clusterId?: string;
  themeColor?: string;
  iconSvgPath?: string;
  connections: string[]; // IDs of connected nodes
  x: number; // visual coordinates
  y: number;
}

export const NEURAL_MATRIX_DATABASE = generateNeuralSkeleton();

export interface MatrixPower {
  bonusStats: Partial<Stats>;
  activeMechanics: string[];
}

export function calculateMatrixPower(unlockedNodeIds: string[], allNodes: Record<string, MatrixNode> = NEURAL_MATRIX_DATABASE): MatrixPower {
  const result: MatrixPower = {
    bonusStats: { hp: 0, mp: 0, atk: 0, def: 0, spd: 0 },
    activeMechanics: []
  };

  for (const nodeId of unlockedNodeIds) {
    const node = allNodes[nodeId];
    if (node) {
      if (node.statBonus) {
        if (node.statBonus.hp) result.bonusStats.hp! += node.statBonus.hp;
        if (node.statBonus.mp) result.bonusStats.mp! += node.statBonus.mp;
        if (node.statBonus.atk) result.bonusStats.atk! += node.statBonus.atk;
        if (node.statBonus.def) result.bonusStats.def! += node.statBonus.def;
        if (node.statBonus.spd) result.bonusStats.spd! += node.statBonus.spd;
      }
      if (node.mechanicModifiers) {
        result.activeMechanics.push(...node.mechanicModifiers);
      }
    }
  }

  return result;
}
