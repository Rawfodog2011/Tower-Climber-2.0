const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

const oldCenter = `camera.current = { x: (w / 2) - 1000, y: (h / 2) - 1000, zoom: 1.0 };`;
const newCenter = `camera.current = { x: (w / 2), y: (h / 2), zoom: 1.0 };`;

code = code.replace(oldCenter, newCenter);

fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
console.log('Fixed camera centering');
