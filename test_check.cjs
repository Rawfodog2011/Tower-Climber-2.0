const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');
if(code.includes('M12 2c0 0-5 6.4-5 11.5')) console.log('Wait, NeuralMatrix.tsx doesnt need to contain paths.');
