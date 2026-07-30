const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

// initial offset
const initialPan = `const [pan, setPan] = useState({ x: -600, y: -600 }); // initial offset to center on 1000, 1000`;
const newInitialPan = `const [pan, setPan] = useState({ x: -800, y: -800 }); // initial offset to center on 1000, 1000`;

if (code.includes(initialPan)) {
    code = code.replace(initialPan, newInitialPan);
    fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
    console.log('Fixed initial pan');
}
