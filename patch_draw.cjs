const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

const injection = `
      // Lore Backgrounds (Layer 0)
      for (const pid in pentagonGroups) {
        const g = pentagonGroups[pid];
        if (g.isComplete) {
          ctx.save();
          ctx.translate(g.centerX, g.centerY);
          
          ctx.shadowColor = g.color;
          ctx.shadowBlur = 40;
          
          const time = Date.now() / 4000;
          const slowRot = time * (pid === 'central' ? 0.5 : -0.5);
          ctx.rotate(slowRot);

          // Draw an outer ring
          ctx.beginPath();
          ctx.arc(0, 0, g.radius * 0.9, 0, Math.PI * 2);
          ctx.strokeStyle = g.color;
          ctx.globalAlpha = 0.15;
          ctx.lineWidth = 4;
          ctx.stroke();
          
          // Draw inner polygon (5 points for outer pentagons since they have 5 branches, wait they also have the bridge so they are somewhat circular)
          ctx.beginPath();
          const points = pid === 'central' ? 5 : 5;
          for(let i=0; i<=points; i++) {
             const a = (i * Math.PI * 2) / points;
             const px = Math.cos(a) * g.radius * 0.8;
             const py = Math.sin(a) * g.radius * 0.8;
             if (i === 0) ctx.moveTo(px, py);
             else ctx.lineTo(px, py);
          }
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.2;
          ctx.stroke();

          // Connect every point to every other point for a neural web look
          ctx.beginPath();
          for(let i=0; i<points; i++) {
             const a1 = (i * Math.PI * 2) / points;
             const px1 = Math.cos(a1) * g.radius * 0.8;
             const py1 = Math.sin(a1) * g.radius * 0.8;
             for(let j=i+2; j<points; j++) {
                if (i===0 && j===points-1) continue; // skip outer edge
                const a2 = (j * Math.PI * 2) / points;
                const px2 = Math.cos(a2) * g.radius * 0.8;
                const py2 = Math.sin(a2) * g.radius * 0.8;
                ctx.moveTo(px1, py1);
                ctx.lineTo(px2, py2);
             }
          }
          ctx.globalAlpha = 0.1;
          ctx.stroke();

          // Fill core
          ctx.beginPath();
          ctx.arc(0, 0, g.radius * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = g.color;
          ctx.globalAlpha = 0.05;
          ctx.fill();

          ctx.restore();
        }
      }

      const drawnLines = new Set<string>();
`;

code = code.replace('const drawnLines = new Set<string>();', injection);
fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
