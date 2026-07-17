import React, { useMemo, useState, useRef, MouseEvent } from 'react';
import { Player } from '../types';
import { NEURAL_MATRIX_DATABASE, MatrixNode } from '../core/entities/neuralMatrix';
import { useTranslation } from '../core/engine/translation';

interface NeuralMatrixProps {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
}

export const NeuralMatrix: React.FC<NeuralMatrixProps> = ({ player, setPlayer }) => {
  const nodes = Object.values(NEURAL_MATRIX_DATABASE);
  const { unlockedNodes = [], matrixPoints = 0 } = player;
  const { t } = useTranslation();

  // Pan state
  const [pan, setPan] = useState({ x: -600, y: -600 }); // initial offset to center on 1000, 1000
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute unlockable nodes (adjacent to any unlocked node)
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
    nodes.forEach(node => {
      if (!unlockedNodes.includes(node.id)) {
        if (node.connections.some(connId => unlockedNodes.includes(connId))) {
          unlockable.add(node.id);
        }
      }
    });
    return unlockable;
  }, [unlockedNodes, nodes]);

  const handleUnlockNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (matrixPoints > 0 && unlockableNodes.has(nodeId) && !unlockedNodes.includes(nodeId)) {
      setPlayer(prev => ({
        ...prev,
        matrixPoints: (prev.matrixPoints || 0) - 1,
        unlockedNodes: [...(prev.unlockedNodes || []), nodeId]
      }));
    }
  };

  const getLines = () => {
    const lines: React.ReactElement[] = [];
    const drawn = new Set<string>();

    nodes.forEach(node => {
      node.connections.forEach(connId => {
        const connNode = NEURAL_MATRIX_DATABASE[connId];
        if (connNode) {
          const lineId1 = `${node.id}-${connId}`;
          const lineId2 = `${connId}-${node.id}`;
          if (!drawn.has(lineId1) && !drawn.has(lineId2)) {
            drawn.add(lineId1);
            const isUnlocked = unlockedNodes.includes(node.id) && unlockedNodes.includes(connId);
            const isUnlockable = (unlockedNodes.includes(node.id) && unlockableNodes.has(connId)) || (unlockedNodes.includes(connId) && unlockableNodes.has(node.id));

            let strokeColor = 'rgba(30, 41, 59, 1)'; // slate-800
            if (isUnlocked) strokeColor = 'rgba(6, 182, 212, 0.8)'; // cyan-500
            else if (isUnlockable) strokeColor = 'rgba(14, 116, 144, 0.5)'; // cyan-700

            lines.push(
              <line
                key={lineId1}
                x1={node.x}
                y1={node.y}
                x2={connNode.x}
                y2={connNode.y}
                stroke={strokeColor}
                strokeWidth={isUnlocked ? 4 : 2}
                className={isUnlockable ? "animate-pulse" : ""}
              />
            );
          }
        }
      });
    });
    return lines;
  };

  const getNodeStyle = (node: MatrixNode) => {
    const isUnlocked = unlockedNodes.includes(node.id);
    const isUnlockable = unlockableNodes.has(node.id);

    let bgClass = "bg-slate-900 border-slate-700 text-slate-500";
    let pulseClass = "";
    let cursorClass = "cursor-not-allowed";

    if (isUnlocked) {
      if (node.type === 'keystone') bgClass = "bg-amber-900/80 border-amber-500 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
      else if (node.type === 'active_skill') bgClass = "bg-purple-900/80 border-purple-500 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.5)]";
      else bgClass = "bg-cyan-900/80 border-cyan-500 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.4)]";
    } else if (isUnlockable) {
      cursorClass = matrixPoints > 0 ? "cursor-pointer hover:scale-110 hover:border-cyan-400" : "cursor-not-allowed";
      pulseClass = "animate-pulse";
      if (node.type === 'keystone') bgClass = "bg-amber-950 border-amber-700/50 text-amber-500/50";
      else if (node.type === 'active_skill') bgClass = "bg-purple-950 border-purple-700/50 text-purple-500/50";
      else bgClass = "bg-cyan-950 border-cyan-700/50 text-cyan-500/50";
    }

    return { bgClass, pulseClass, cursorClass, isUnlocked, isUnlockable };
  };

  // Drag handlers
  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg overflow-hidden border border-cyan-900/30">
      <div className="p-4 bg-slate-900/80 border-b border-cyan-900/50 flex justify-between items-center z-20 shadow-md">
        <div>
          <h2 className="text-cyan-400 font-bold uppercase tracking-widest text-lg">{t("Matriz Neural")}</h2>
          <p className="text-cyan-200/50 text-xs font-mono">{t("Arquitetura Sináptica do Traje (Arraste para mover)")}</p>
        </div>
        <div className="bg-slate-950 px-4 py-2 rounded border border-cyan-800">
          <span className="text-slate-400 uppercase text-xs tracking-widest mr-2">{t("Pontos Disponíveis")}:</span>
          <span className="text-cyan-400 font-bold font-mono text-xl">{matrixPoints}</span>
        </div>
      </div>
      
      <div 
        className="flex-1 relative overflow-hidden bg-slate-950 bg-[linear-gradient(to_right,#082f49_1px,transparent_1px),linear-gradient(to_bottom,#082f49_1px,transparent_1px)] bg-[size:40px_40px] select-none cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        ref={containerRef}
      >
        <div 
          className="absolute top-0 left-0 w-[2400px] h-[2400px]"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {getLines()}
          </svg>

          {nodes.map(node => {
            const { bgClass, pulseClass, cursorClass, isUnlocked, isUnlockable } = getNodeStyle(node);
            const size = node.type === 'keystone' ? 'w-12 h-12' : node.type === 'active_skill' ? 'w-10 h-10' : 'w-8 h-8';
            const offset = node.type === 'keystone' ? 24 : node.type === 'active_skill' ? 20 : 16;
            
            const initials = node.name.substring(0, 2).toUpperCase();

            return (
              <div
                key={node.id}
                className="absolute flex flex-col items-center justify-center"
                style={{ left: node.x - offset, top: node.y - offset }}
              >
                {/* Visual Node */}
                <div
                  title={t(node.description)}
                  className={`${size} rounded-full border-2 ${bgClass} ${pulseClass} ${cursorClass} flex items-center justify-center transition-all duration-300 z-10`}
                  onClick={(e) => handleUnlockNode(node.id, e)}
                >
                  <span className="text-[10px] font-bold opacity-30">{initials}</span>
                </div>
                
                {/* Label (positioned outside) */}
                <div className="absolute top-full mt-1 text-center z-20 pointer-events-none w-32 -ml-16 left-1/2">
                  <span className={`block text-[10px] uppercase font-bold leading-tight drop-shadow-md ${isUnlocked ? 'text-cyan-100' : isUnlockable ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {t(node.name)}
                  </span>
                  {(isUnlocked || isUnlockable) && node.statBonus && (
                    <span className="block text-[9px] text-emerald-400/80 font-mono">
                      {Object.entries(node.statBonus).map(([k, v]) => `+${v} ${t(k.toUpperCase())}`).join(' ')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-3 bg-slate-900/80 border-t border-cyan-900/50 text-xs text-cyan-200/70 font-mono text-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {t("Nódulos Menores (Azul) | Protocolos Ativos (Roxo) | Keystones (Laranja)")}
      </div>
    </div>
  );
};
