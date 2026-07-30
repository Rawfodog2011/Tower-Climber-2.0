const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

const startTarget = `      // Layer 1: Inactive connections (dark)`;
const endTarget = `      // Draw all inactive/unlockable nodes first`;

const newRenderCode = `      // Layer 1: Inactive connections (dark)
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(30, 41, 59, 1)'; // slate-800
      
      const drawnLines = new Set<string>();
      ctx.beginPath();
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const connNode = NEURAL_MATRIX_DATABASE[connId];
          if (connNode) {
            const lineId1 = \`\${node.id}-\${connId}\`;
            const lineId2 = \`\${connId}-\${node.id}\`;
            if (!drawnLines.has(lineId1) && !drawnLines.has(lineId2)) {
              drawnLines.add(lineId1);
              const isNodeUnlocked = unlockedNodes.includes(node.id);
              const isConnUnlocked = unlockedNodes.includes(connId);
              if (!(isNodeUnlocked && isConnUnlocked)) {
                 ctx.moveTo(node.x, node.y);
                 ctx.lineTo(connNode.x, connNode.y);
              }
            }
          }
        });
      });
      ctx.stroke();

      // Layer 2: Active connections (Neon/Glowing)
      drawnLines.clear();
      ctx.lineWidth = 3;
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const connNode = NEURAL_MATRIX_DATABASE[connId];
          if (connNode) {
            const lineId1 = \`\${node.id}-\${connId}\`;
            const lineId2 = \`\${connId}-\${node.id}\`;
            if (!drawnLines.has(lineId1) && !drawnLines.has(lineId2)) {
              drawnLines.add(lineId1);
              const isNodeUnlocked = unlockedNodes.includes(node.id);
              const isConnUnlocked = unlockedNodes.includes(connId);
              if (isNodeUnlocked && isConnUnlocked) {
                 let color = node.themeColor || '#06b6d4';
                 if (node.clusterId && connNode.clusterId && node.clusterId !== connNode.clusterId) {
                   color = '#06b6d4'; // cross-cluster lines fall back to cyan
                 }
                 ctx.strokeStyle = color;
                 ctx.shadowColor = color;
                 ctx.shadowBlur = 12;
                 ctx.beginPath();
                 ctx.moveTo(node.x, node.y);
                 ctx.lineTo(connNode.x, connNode.y);
                 ctx.stroke();
              }
            }
          }
        });
      });
      ctx.shadowBlur = 0; // reset

      // Helper function to draw a single node
      const drawNode = (node: MatrixNode, isUnlocked: boolean, isUnlockable: boolean, isHovered: boolean) => {
        let radius = 12; // minor
        if (node.type === 'active_skill' || node.type === 'notable') radius = 16;
        if (node.type === 'keystone') radius = 24;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

        const nodeColor = node.themeColor || '#06b6d4';

        // Helper to add alpha to hex color for stroke
        const hexToRgba = (hex: string, alpha: number) => {
           if(hex.startsWith('#') && hex.length === 7) {
               const r = parseInt(hex.slice(1, 3), 16);
               const g = parseInt(hex.slice(3, 5), 16);
               const b = parseInt(hex.slice(5, 7), 16);
               return \`rgba(\${r}, \${g}, \${b}, \${alpha})\`;
           }
           return hex; // fallback
        };

        if (isUnlocked) {
          // Layer 4: Purchased
          ctx.fillStyle = 'rgba(2, 6, 23, 0.9)'; // slate-950/90
          ctx.strokeStyle = nodeColor;
          ctx.shadowColor = nodeColor;
          ctx.shadowBlur = 15;
          ctx.lineWidth = 2;
        } else if (isUnlockable) {
          // Layer 3.5: Unlockable
          ctx.fillStyle = 'rgba(15, 23, 42, 1)'; // slate-900
          ctx.strokeStyle = hexToRgba(nodeColor, 0.5);
          ctx.shadowBlur = 0;
          
          if (isHovered && matrixPoints > 0) {
            ctx.strokeStyle = nodeColor;
            ctx.shadowColor = nodeColor;
            ctx.shadowBlur = 15;
            const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
            ctx.lineWidth = 2 + pulse * 2;
          } else {
            ctx.lineWidth = 2;
          }
        } else {
          // Layer 3: Inactive
          ctx.fillStyle = 'rgba(15, 23, 42, 1)'; // slate-900
          ctx.strokeStyle = 'rgba(51, 65, 85, 1)'; // slate-700
          ctx.shadowBlur = 0;
          ctx.lineWidth = 2;
        }

        ctx.fill();
        ctx.stroke();

        // Draw Icon or Initials
        if (node.iconSvgPath) {
           ctx.save();
           ctx.translate(node.x, node.y);
           const scaleFactor = (radius * 1.3) / 24; 
           ctx.scale(scaleFactor, scaleFactor);
           ctx.translate(-12, -12); // move center to 0,0 based on 24x24 viewBox
           
           if (isUnlocked) {
               ctx.fillStyle = nodeColor;
               ctx.shadowBlur = 10;
               ctx.shadowColor = nodeColor;
               ctx.fill(new Path2D(node.iconSvgPath));
           } else {
               ctx.fillStyle = isUnlockable ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)';
               ctx.shadowBlur = 0;
               ctx.fill(new Path2D(node.iconSvgPath));
           }
           ctx.restore();
        } else {
           ctx.fillStyle = isUnlocked ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)';
           ctx.font = \`bold \${radius * 0.75}px monospace\`;
           ctx.textAlign = 'center';
           ctx.textBaseline = 'middle';
           const initials = node.name.substring(0, 2).toUpperCase();
           ctx.fillText(initials, node.x, node.y);
        }

        // Hover external ring
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      };

      // Draw all inactive/unlockable nodes first`;

const startIdx = code.indexOf(startTarget);
const endIdx = code.indexOf(endTarget);
if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + newRenderCode + code.substring(endIdx + endTarget.length);
    fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
    console.log('Fixed render logic');
} else {
    console.log('Could not find start/end targets');
}
