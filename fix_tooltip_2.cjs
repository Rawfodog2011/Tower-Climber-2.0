const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

// Add state and ref for the tooltip
const stateHooks = `  const [hoveredNodeData, setHoveredNodeData] = useState<MatrixNode | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);`;

code = code.replace(`const hoveredNodeId = useRef<string | null>(null);`, `const hoveredNodeId = useRef<string | null>(null);\n${stateHooks}`);

// Update handlePointerMove
const handlePointerMoveOld = `  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getEventCoordinates(e);
    
    if (isDragging.current) {
      const dx = x - lastMouse.current.x;
      const dy = y - lastMouse.current.y;
      camera.current.x += dx;
      camera.current.y += dy;
      lastMouse.current = { x, y };
    } else {
      const world = getWorldCoordinates(x, y);
      const hovered = findHoveredNode(world.x, world.y);
      if (hoveredNodeId.current !== hovered) {
        hoveredNodeId.current = hovered;
      }
    }
  };`;

const handlePointerMoveNew = `  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getEventCoordinates(e);
    
    if (isDragging.current) {
      const dx = x - lastMouse.current.x;
      const dy = y - lastMouse.current.y;
      camera.current.x += dx;
      camera.current.y += dy;
      lastMouse.current = { x, y };
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
      }
    } else {
      const world = getWorldCoordinates(x, y);
      const hovered = findHoveredNode(world.x, world.y);
      if (hoveredNodeId.current !== hovered) {
        hoveredNodeId.current = hovered;
        setHoveredNodeData(hovered ? NEURAL_MATRIX_DATABASE[hovered] : null);
      }
      
      if (tooltipRef.current && hovered) {
        tooltipRef.current.style.display = 'block';
        let clientX, clientY;
        if ('touches' in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = (e as React.MouseEvent).clientX;
          clientY = (e as React.MouseEvent).clientY;
        }
        tooltipRef.current.style.left = \`\${clientX + 15}px\`;
        tooltipRef.current.style.top = \`\${clientY + 15}px\`;
      } else if (tooltipRef.current && !hovered) {
        tooltipRef.current.style.display = 'none';
      }
    }
  };`;

code = code.replace(handlePointerMoveOld, handlePointerMoveNew);

const tooltipHtml = `      {hoveredNodeData && (
        <div 
          ref={tooltipRef}
          className="fixed pointer-events-none z-50 bg-slate-950/95 border border-cyan-500/50 p-3 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-sm min-w-[200px]"
          style={{ display: 'none' }}
        >
          <div className="flex flex-col gap-1">
            <h3 className={\`font-bold text-sm uppercase tracking-wider \${
              unlockedNodes.includes(hoveredNodeData.id) ? 'text-cyan-100' : 
              unlockableNodes.has(hoveredNodeData.id) ? 'text-cyan-400' : 'text-slate-400'
            }\`}>
              {t(hoveredNodeData.name)}
            </h3>
            <span className="text-[10px] text-slate-500 font-mono font-bold">[{hoveredNodeData.type.toUpperCase()}]</span>
            <p className="text-slate-300 text-xs mt-1 max-w-[200px] leading-tight">
              {t(hoveredNodeData.description)}
            </p>
            {hoveredNodeData.statBonus && (
              <div className="mt-2 text-emerald-400 font-mono text-xs font-bold bg-emerald-950/50 border border-emerald-900/50 p-1.5 rounded">
                {Object.entries(hoveredNodeData.statBonus).map(([k, v]) => \`+\${v} \${t(k.toUpperCase())}\`).join(' ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};`;

code = code.replace(/    <\/div>\n  \);\n};\s*$/, tooltipHtml);

fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
console.log('Tooltip HTML added');
