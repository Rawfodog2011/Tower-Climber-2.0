const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

const strokeOld = `           if (isUnlocked) {
               ctx.fillStyle = nodeColor;
               ctx.shadowBlur = 10;
               ctx.shadowColor = nodeColor;
               ctx.fill(new Path2D(node.iconSvgPath));
           } else {
               ctx.fillStyle = isUnlockable ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)';
               ctx.shadowBlur = 0;
               ctx.fill(new Path2D(node.iconSvgPath));
           }`;

const strokeNew = `           if (isUnlocked) {
               ctx.strokeStyle = nodeColor;
               ctx.lineWidth = 2 / scaleFactor;
               ctx.lineCap = 'round';
               ctx.lineJoin = 'round';
               ctx.shadowBlur = 10;
               ctx.shadowColor = nodeColor;
               ctx.stroke(new Path2D(node.iconSvgPath));
           } else {
               ctx.strokeStyle = isUnlockable ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)';
               ctx.lineWidth = 2 / scaleFactor;
               ctx.lineCap = 'round';
               ctx.lineJoin = 'round';
               ctx.shadowBlur = 0;
               ctx.stroke(new Path2D(node.iconSvgPath));
           }`;

code = code.replace(strokeOld, strokeNew);
fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
console.log('Fixed stroke');
