const fs = require('fs');

let neuralMatrixTs = fs.readFileSync('src/core/entities/neuralMatrix.ts', 'utf8');
if (!neuralMatrixTs.includes("'notable'")) {
    neuralMatrixTs = neuralMatrixTs.replace("export type MatrixNodeType = 'minor' | 'active_skill' | 'keystone';", "export type MatrixNodeType = 'minor' | 'active_skill' | 'notable' | 'keystone';");
    fs.writeFileSync('src/core/entities/neuralMatrix.ts', neuralMatrixTs);
    console.log('Updated neuralMatrix.ts types');
}
