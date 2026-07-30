const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

const targetOld = `      const drawnLines = new Set<string>();
      // Layer 1: Inactive connections (dark)
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(30, 41, 59, 1)'; // slate-800
      
      drawnLines.clear();
      ctx.beginPath();`;

if (code.includes('drawnLines.clear();')) {
   // Already fixed.
} else {
   code = code.replace(`      const drawnLines = new Set<string>();\n      ctx.beginPath();`, `      drawnLines.clear();\n      ctx.beginPath();`);
   fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
}
