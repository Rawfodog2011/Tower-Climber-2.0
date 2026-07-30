const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

// We need to remove the tooltip rendering from canvas and add HTML tooltip.

// 1. Remove tooltip from canvas
const canvasTooltipStart = `// Draw Tooltip (Z-Index highest)`;
const canvasTooltipEnd = `ctx.restore();\n      animationFrameId = requestAnimationFrame(draw);`;

const startIndex = code.indexOf(canvasTooltipStart);
const endIndex = code.indexOf(`ctx.restore();`, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + code.substring(endIndex);
}

fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
console.log('Tooltip canvas code removed');
