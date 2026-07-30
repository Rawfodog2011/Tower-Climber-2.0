import React, { useEffect, useRef } from 'react';

export interface DamagePopupItem {
  id: number;
  target: 'player' | 'monster';
  amount: number | string;
  type: 'damage' | 'heal' | 'crit' | 'miss' | 'block' | 'dodge';
}

interface DamagePopupsCanvasProps {
  dmgPopups: DamagePopupItem[];
}

interface ActiveParticle {
  id: number;
  target: 'player' | 'monster';
  text: string;
  type: 'damage' | 'heal' | 'crit' | 'miss' | 'block' | 'dodge';
  xRatio: number;
  yOffset: number;
  opacity: number;
}

export const DamagePopupsCanvas: React.FC<DamagePopupsCanvasProps> = ({ dmgPopups }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<ActiveParticle[]>([]);
  const processedIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    dmgPopups.forEach(p => {
      if (!processedIdsRef.current.has(p.id)) {
        processedIdsRef.current.add(p.id);

        let prefix = '';
        if (p.type === 'heal') prefix = '+';
        else if (p.type === 'damage' || p.type === 'crit') prefix = '-';

        const text = `${prefix}${p.amount}`;
        const randomXOffset = (Math.random() - 0.5) * 0.08;
        const xRatio = (p.target === 'player' ? 0.25 : 0.75) + randomXOffset;

        particlesRef.current.push({
          id: p.id,
          target: p.target,
          text,
          type: p.type,
          xRatio,
          yOffset: 0,
          opacity: 1.0,
        });
      }
    });

    if (processedIdsRef.current.size > 200) {
      const activeIds = new Set(dmgPopups.map(p => p.id));
      processedIdsRef.current = activeIds;
    }
  }, [dmgPopups]);

  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const particles = particlesRef.current;
      const nextParticles: ActiveParticle[] = [];

      particles.forEach(p => {
        p.yOffset -= 1.2;
        p.opacity -= 0.022;

        if (p.opacity > 0) {
          nextParticles.push(p);

          const x = rect.width * p.xRatio;
          const baseY = rect.height * 0.35;
          const y = baseY + p.yOffset;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);

          const fontSize = p.type === 'crit' ? 24 : 18;
          ctx.font = `900 ${fontSize}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          let fillColor = '#ef4444';
          if (p.type === 'heal') fillColor = '#34d399';
          else if (p.type === 'crit') fillColor = '#facc15';
          else if (p.type === 'miss') fillColor = '#94a3b8';
          else if (p.type === 'block' || p.type === 'dodge') fillColor = '#38bdf8';

          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.strokeText(p.text, x, y);

          if (p.type === 'crit') {
            ctx.shadowColor = 'rgba(250, 204, 21, 0.8)';
            ctx.shadowBlur = 10;
          } else if (p.type === 'heal') {
            ctx.shadowColor = 'rgba(52, 211, 153, 0.8)';
            ctx.shadowBlur = 8;
          } else if (p.type === 'damage') {
            ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
            ctx.shadowBlur = 8;
          }

          ctx.fillStyle = fillColor;
          ctx.fillText(p.text, x, y);

          ctx.restore();
        }
      });

      particlesRef.current = nextParticles;
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
