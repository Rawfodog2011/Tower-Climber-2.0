import React, { useMemo, useRef, useEffect, useState } from 'react';
import { NEURAL_MATRIX_DATABASE, MatrixNode } from '../core/entities/neuralMatrix';
import { useTranslation } from '../core/engine/translation';
import { usePlayerStore } from '../store/usePlayerStore';

export const NeuralMatrix: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();
  const nodes = Object.values(NEURAL_MATRIX_DATABASE);
  const { unlockedNodes = [], matrixPoints = 0 } = player;
  const { t } = useTranslation();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Camera state using refs for the animation loop
  const camera = useRef({ x: -200, y: -200, zoom: 1.0 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const hoveredNodeId = useRef<string | null>(null);
  const [hoveredNodeData, setHoveredNodeData] = useState<MatrixNode | null>(null);
  
  const tooltipRef = useRef<HTMLDivElement>(null);

  // LORE IMAGES CONFIG
  const loadedMural = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/lore/mural.jpg'; // O grande mural de fundo
    img.onload = () => {
      loadedMural.current = img;
    };
  }, []);

  


  // Compute unlockable nodes
  const unlockableNodes = useMemo(() => {
    const unlockable = new Set<string>();
    unlockedNodes.forEach(unlockedId => {
      const node = NEURAL_MATRIX_DATABASE[unlockedId];
      if (node) {
        node.connections.forEach(connId => {
          if (!unlockedNodes.includes(connId)) {
            unlockable.add(connId);
          }
        });
      }
    });
    if (unlockedNodes.length === 0) unlockable.add('core_start');
    return unlockable;
  }, [unlockedNodes]);
  


  
  const pentagonGroups = useMemo(() => {
    const groups: Record<string, { nodes: string[], unlockedCount: number, centerX: number, centerY: number, radius: number, isComplete: boolean, name: string, color: string }> = {};
    nodes.forEach(node => {
      const pid = node.pentagonId || 'central';
      if (!groups[pid]) {
        groups[pid] = { nodes: [], unlockedCount: 0, centerX: 0, centerY: 0, radius: 0, isComplete: false, name: pid, color: node.themeColor || '#ffffff' };
      }
      groups[pid].nodes.push(node.id);
      if (unlockedNodes.includes(node.id)) {
        groups[pid].unlockedCount++;
      }
    });

    for (const pid in groups) {
      const g = groups[pid];
      g.isComplete = g.unlockedCount === g.nodes.length;
      
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      g.nodes.forEach(nid => {
        const n = NEURAL_MATRIX_DATABASE[nid];
        if (n) {
          minX = Math.min(minX, n.x);
          maxX = Math.max(maxX, n.x);
          minY = Math.min(minY, n.y);
          maxY = Math.max(maxY, n.y);
        }
      });
      g.centerX = (minX + maxX) / 2;
      g.centerY = (minY + maxY) / 2;
      g.radius = Math.max(maxX - g.centerX, maxY - g.centerY) + 80;
    }
    return groups;
  }, [unlockedNodes]);

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // 1. Clear background
      ctx.clearRect(0, 0, width, height);

      // 2. Draw Grid (Optional, but looks good for cyberpunk/sci-fi)
      ctx.save();
      const gridSize = 40 * camera.current.zoom;
      const offsetX = camera.current.x % gridSize;
      const offsetY = camera.current.y % gridSize;
      ctx.strokeStyle = 'rgba(8, 47, 73, 0.4)'; // cyan-900/40
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = offsetX; x < width; x += gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, height);
      }
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.moveTo(0, y); ctx.lineTo(width, y);
      }
      ctx.stroke();
      ctx.restore();

      // Apply camera transforms
      ctx.save();
      ctx.translate(camera.current.x, camera.current.y);
      ctx.scale(camera.current.zoom, camera.current.zoom);

      
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

      const drawnLines = new Set<string>();



      // Layer 1: Inactive connections (dark)
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(30, 41, 59, 1)'; // slate-800
      
      drawnLines.clear();
      ctx.beginPath();
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const connNode = NEURAL_MATRIX_DATABASE[connId];
          if (connNode) {
            const lineId1 = `${node.id}-${connId}`;
            const lineId2 = `${connId}-${node.id}`;
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
            const lineId1 = `${node.id}-${connId}`;
            const lineId2 = `${connId}-${node.id}`;
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
               return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
           }
           ctx.restore();
        } else {
           ctx.fillStyle = isUnlocked ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)';
           ctx.font = `bold ${radius * 0.75}px monospace`;
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

      // Draw all inactive/unlockable nodes first
      nodes.forEach(node => {
        const isUnlocked = unlockedNodes.includes(node.id);
        if (!isUnlocked) {
           const isUnlockable = unlockableNodes.has(node.id);
           const isHovered = hoveredNodeId.current === node.id;
           drawNode(node, false, isUnlockable, isHovered);
        }
      });

      // Draw unlocked nodes on top
      nodes.forEach(node => {
        const isUnlocked = unlockedNodes.includes(node.id);
        if (isUnlocked) {
           const isHovered = hoveredNodeId.current === node.id;
           drawNode(node, true, false, isHovered);
        }
      });
      
      ctx.restore();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, unlockedNodes, unlockableNodes, matrixPoints, t]);

  // Window Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
        canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
        
        // Center initial camera conditionally if we wanted to
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Center on mount
  useEffect(() => {
     if (canvasRef.current) {
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        camera.current = { x: (w / 2), y: (h / 2), zoom: 1.0 };
     }
  }, []);

  const getEventCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const getWorldCoordinates = (screenX: number, screenY: number) => {
    return {
      x: (screenX - camera.current.x) / camera.current.zoom,
      y: (screenY - camera.current.y) / camera.current.zoom
    };
  };

  const findHoveredNode = (worldX: number, worldY: number) => {
    for (const node of nodes) {
      let radius = 12;
      if (node.type === 'active_skill' || node.type === 'notable') radius = 16;
      if (node.type === 'keystone') radius = 24;
      
      const dx = worldX - node.x;
      const dy = worldY - node.y;
      if (dx * dx + dy * dy <= radius * radius) {
        return node.id;
      }
    }
    return null;
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const { x, y } = getEventCoordinates(e);
    lastMouse.current = { x, y };
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
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
        tooltipRef.current.style.left = `${clientX + 15}px`;
        tooltipRef.current.style.top = `${clientY + 15}px`;
      } else if (tooltipRef.current && !hovered) {
        tooltipRef.current.style.display = 'none';
      }
    }
  };

  const handlePointerUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging.current) {
      isDragging.current = false;
    }
  };

  const attemptUnlockNode = (e: React.MouseEvent) => {
    const { x, y } = getEventCoordinates(e);
    const world = getWorldCoordinates(x, y);
    const clickedNodeId = findHoveredNode(world.x, world.y);
    
    if (clickedNodeId && matrixPoints > 0 && unlockableNodes.has(clickedNodeId) && !unlockedNodes.includes(clickedNodeId)) {
      setPlayer(prev => ({
        ...prev,
        matrixPoints: Math.max(0, (prev.matrixPoints || 0) - 1),
        unlockedNodes: [...(prev.unlockedNodes || []), clickedNodeId]
      }));
    }
  };

  // Attach non-passive wheel listener using ref to prevent whole page scrolling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const zoomSensitivity = 0.001;
      let delta = -e.deltaY * zoomSensitivity;
      
      const newZoom = Math.min(Math.max(0.2, camera.current.zoom + delta), 3.0);
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // World coordinates before zoom
      const worldX = (mouseX - camera.current.x) / camera.current.zoom;
      const worldY = (mouseY - camera.current.y) / camera.current.zoom;
      
      camera.current.zoom = newZoom;
      
      // Adjust camera so world coordinates stay under the mouse
      camera.current.x = mouseX - worldX * camera.current.zoom;
      camera.current.y = mouseY - worldY * camera.current.zoom;
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="flex flex-col min-h-[600px] h-[calc(100vh-12rem)] w-full bg-slate-950 rounded-lg overflow-hidden border border-cyan-900/30 shadow-[0_0_30px_rgba(8,47,73,0.5)] relative">
      <div className="absolute top-0 left-0 right-0 p-4 bg-slate-900/90 border-b border-cyan-900/50 flex justify-between items-center z-20 backdrop-blur-sm pointer-events-none">
        <div>
          <h2 className="text-cyan-400 font-bold uppercase tracking-widest text-lg drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            {t("Matriz Neural")} <span className="text-cyan-700 text-xs">({nodes.length} nodes)</span>
          </h2>
          <p className="text-cyan-200/50 text-xs font-mono">{t("Arquitetura Sináptica do Traje (Role para Zoom, Arraste para mover)")}</p>
        </div>
        <div className="bg-slate-950 px-4 py-2 rounded border border-cyan-800 pointer-events-auto">
          <span className="text-slate-400 uppercase text-xs tracking-widest mr-2">{t("Pontos Disponíveis")}:</span>
          <span className={`font-bold font-mono text-xl ${matrixPoints > 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-cyan-400'}`}>{matrixPoints}</span>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden bg-slate-950 select-none touch-none w-full h-full">
        <canvas
          ref={canvasRef}
          className="block w-full h-full cursor-crosshair active:cursor-grabbing"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onClick={attemptUnlockNode}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900/90 border-t border-cyan-900/50 text-xs text-cyan-200/70 font-mono text-center z-20 backdrop-blur-sm pointer-events-none">
        {t("Trilhas / Nódulos Menores (Azul) | Conectores / Notáveis (Roxo) | Controladores / Keystones (Laranja)")}
      </div>
      {hoveredNodeData && (
        <div 
          ref={tooltipRef}
          className="fixed pointer-events-none z-50 bg-slate-950/95 border border-cyan-500/50 p-3 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-sm min-w-[200px]"
          style={{ display: 'none' }}
        >
          <div className="flex flex-col gap-1">
            <h3 className={`font-bold text-sm uppercase tracking-wider ${
              unlockedNodes.includes(hoveredNodeData.id) ? 'text-cyan-100' : 
              unlockableNodes.has(hoveredNodeData.id) ? 'text-cyan-400' : 'text-slate-400'
            }`}>
              {t(hoveredNodeData.name)}
            </h3>
            <span className="text-[10px] text-slate-500 font-mono font-bold">[{hoveredNodeData.type.toUpperCase()}]</span>
            <p className="text-slate-300 text-xs mt-1 max-w-[200px] leading-tight">
              {t(hoveredNodeData.description)}
            </p>
            {hoveredNodeData.statBonus && (
              <div className="mt-2 text-emerald-400 font-mono text-xs font-bold bg-emerald-950/50 border border-emerald-900/50 p-1.5 rounded">
                {Object.entries(hoveredNodeData.statBonus).map(([k, v]) => `+${v} ${t(k.toUpperCase())}`).join(' ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};