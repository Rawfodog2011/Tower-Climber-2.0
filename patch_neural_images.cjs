const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

// 1. Add Lore Data and State
const stateInjection = `
  const tooltipRef = useRef<HTMLDivElement>(null);

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

  const isMatrixFullyUnlocked = Object.values(pentagonGroups).length === 6 && Object.values(pentagonGroups).every(g => g.isComplete);
`;

code = code.replace('const tooltipRef = useRef<HTMLDivElement>(null);', stateInjection);

// 2. Modify the drawing logic for Layer 0
const drawInjection = `
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

          // Render Image if loaded
          const img = loadedImages.current[pid];
          if (img) {
             ctx.globalAlpha = 0.3; // low contrast
             const size = g.radius * 2.2;
             ctx.drawImage(img, -size/2, -size/2, size, size);
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

      const drawnLines = new Set<string>();
`;

// we need to replace the old Lore Backgrounds block
const oldBlockStart = '// Lore Backgrounds (Layer 0)';
const oldBlockEnd = 'const drawnLines = new Set<string>();';
const startIdx = code.indexOf(oldBlockStart);
const endIdx = code.indexOf(oldBlockEnd) + oldBlockEnd.length;

code = code.slice(0, startIdx) + drawInjection.trim() + '\n' + code.slice(endIdx);

// 3. Add Final Lore Overlay UI
const uiInjection = `
      {/* FINAL LORE REVEAL */}
      {isMatrixFullyUnlocked && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center animate-in fade-in duration-1000">
           <div className="bg-slate-950/90 border-2 border-red-500/50 p-8 max-w-2xl text-center rounded-xl backdrop-blur-md shadow-[0_0_50px_rgba(239,68,68,0.2)]">
             <h2 className="text-3xl text-red-500 font-bold mb-4 tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(239,68,68,0.5)' }}>
                Protocolo Omega Concluído
             </h2>
             <p className="text-slate-300 text-lg leading-relaxed mb-6">
                "A Arquiteta desperta. O Traje Neural não era uma armadura, era uma câmara de contenção para um Deus Máquina fraturado. Ao restaurar a Matriz Neural, você não alcançou o ápice humano... Você entregou as chaves."
             </p>
             <p className="text-slate-500 italic">
                - Registro de Sistema Corrompido
             </p>
           </div>
        </div>
      )}

      {/* Control Panel (Bottom Left) */}
`;

code = code.replace('{/* Control Panel (Bottom Left) */}', uiInjection);

fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
