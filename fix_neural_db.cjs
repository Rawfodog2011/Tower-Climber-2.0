const fs = require('fs');
let code = fs.readFileSync('src/core/entities/neuralMatrix.ts', 'utf8');

const importStatement = `import { generateNeuralSkeleton } from './neuralMatrixGenerator';\n\n`;

const startIndex = code.indexOf('export const NEURAL_MATRIX_DATABASE');
if (startIndex !== -1) {
    code = code.substring(0, startIndex);
    code = importStatement + code + `export const NEURAL_MATRIX_DATABASE = generateNeuralSkeleton();\n`;
    fs.writeFileSync('src/core/entities/neuralMatrix.ts', code);
    console.log('Fixed neural matrix db');
}
