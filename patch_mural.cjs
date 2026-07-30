const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

const imageSetupOld = `
  // LORE IMAGES CONFIG
  const loreImageUrls: Record<string, string> = {
    'central': '/lore/central.png',
    'outer_assault': '/lore/assault.png',
    'outer_defense': '/lore/defense.png',
    'outer_speed': '/lore/speed.png',
    'outer_economy': '/lore/economy.png',
    'outer_dot': '/lore/dot.png',
  };
  const loadedImages = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    Object.entries(loreImageUrls).forEach(([pid, url]) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedImages.current[pid] = img;
      };
    });
  }, []);
`;

const imageSetupNew = `
  // LORE IMAGES CONFIG
  const loadedMural = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/lore/mural.jpg'; // O grande mural de fundo
    img.onload = () => {
      loadedMural.current = img;
    };
  }, []);
`;
code = code.replace(imageSetupOld.trim(), imageSetupNew.trim());

// We need to find the drawing block
const drawBlockOld = `
          // Render Image if loaded
          const img = loadedImages.current[pid];
          if (img) {
             ctx.globalAlpha = 0.3; // low contrast
             const size = g.radius * 2.2;
             ctx.drawImage(img, -size/2, -size/2, size, size);
          } else {
            // Fallback Geometric art
`;
// Actually, let's just replace the whole Layer 0 block
const layer0Start = '// Lore Backgrounds (Layer 0)';
const layer0End = 'const drawnLines = new Set<string>();';

const layer0New = `
      // Lore Backgrounds (Layer 0) - Mural Reveal
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

          // Render Image if loaded (Clipping the Mural)
          const img = loadedMural.current;
          if (img) {
             ctx.rotate(-slowRot); // desfazer a rotação para o mural ficar fixo
             ctx.translate(-g.centerX, -g.centerY); // voltar para a origem da câmera
             
             ctx.beginPath();
             // Faz a máscara circular no local do pentágono
             ctx.arc(g.centerX, g.centerY, g.radius * 1.5, 0, Math.PI * 2);
             ctx.clip();
             
             ctx.globalAlpha = 0.4;
             // Desenha o mural centralizado na coordenada 0,0 do mundo (núcleo central)
             // Assumindo que a imagem seja 2000x2000 e o centro do mural seja no 0,0 do mundo
             const muralSize = 3000;
             ctx.drawImage(img, -muralSize/2, -muralSize/2, muralSize, muralSize);
             
             ctx.translate(g.centerX, g.centerY); // voltar pra desenhar os contornos
             ctx.rotate(slowRot);
          } else {
            // Fallback Geometric art
            ctx.beginPath();
            ctx.arc(0, 0, g.radius * 0.9, 0, Math.PI * 2);
            ctx.strokeStyle = g.color;
            ctx.globalAlpha = 0.15;
            ctx.lineWidth = 4;
            ctx.stroke();
            
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
  
            ctx.beginPath();
            for(let i=0; i<points; i++) {
               const a1 = (i * Math.PI * 2) / points;
               const px1 = Math.cos(a1) * g.radius * 0.8;
               const py1 = Math.sin(a1) * g.radius * 0.8;
               for(let j=i+2; j<points; j++) {
                  if (i===0 && j===points-1) continue; 
                  const a2 = (j * Math.PI * 2) / points;
                  const px2 = Math.cos(a2) * g.radius * 0.8;
                  const py2 = Math.sin(a2) * g.radius * 0.8;
                  ctx.moveTo(px1, py1);
                  ctx.lineTo(px2, py2);
               }
            }
            ctx.globalAlpha = 0.1;
            ctx.stroke();
  
            ctx.beginPath();
            ctx.arc(0, 0, g.radius * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = g.color;
            ctx.globalAlpha = 0.05;
            ctx.fill();
          }

          ctx.restore();
        }
      }

      `;

const startIdx = code.indexOf(layer0Start);
const endIdx = code.indexOf(layer0End);

code = code.slice(0, startIdx) + layer0New.trim() + '\n\n      ' + code.slice(endIdx);
fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
