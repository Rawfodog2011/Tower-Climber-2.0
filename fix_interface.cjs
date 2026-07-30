const fs = require('fs');
let code = fs.readFileSync('src/core/entities/neuralMatrix.ts', 'utf8');

const interfaceOld = `  description: string;
  statBonus?: Partial<Stats>;
  mechanicModifiers?: string[]; // E.g., ['sobrecarga_materia', 'overclock_termodinamico']
  skillId?: string;
  connections: string[]; // IDs of connected nodes
  x: number; // visual coordinates
  y: number;
}`;

const interfaceNew = `  description: string;
  statBonus?: Partial<Stats>;
  mechanicModifiers?: string[]; // E.g., ['sobrecarga_materia', 'overclock_termodinamico']
  skillId?: string;
  clusterId?: string;
  themeColor?: string;
  iconSvgPath?: string;
  connections: string[]; // IDs of connected nodes
  x: number; // visual coordinates
  y: number;
}`;

code = code.replace(interfaceOld, interfaceNew);
fs.writeFileSync('src/core/entities/neuralMatrix.ts', code);
console.log('Fixed interface');
