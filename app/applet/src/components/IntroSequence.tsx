import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const BOOT_LINES = [
  "TOWER CLIMBER OS v1.2.0 BIOS",
  "INITIALIZING BOOT SEQUENCE...",
  "LOADING KERNEL 0x000000FF",
  "MOUNTING VIRTUAL DRIVES...",
  "CHECKING HARDWARE INTEGRITY... [OK]",
  "BYPASSING OMNICORP SECURITY PROTOCOLS... [OK]",
  "ESTABLISHING CONNECTION TO THE SPIRE...",
  "ACCESS GRANTED."
];

export const IntroSequence: React.FC<Props> = ({ onComplete }) => {
  const [phase, setPhase] = useState<number>(0);
  const [bootLines, setBootLines] = useState<string[]>([]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  useEffect(() => {
    if (phase === 0) {
      let currentLine = 0;
      const interval = setInterval(() => {
        setBootLines(prev => [...prev, BOOT_LINES[currentLine]]);
        currentLine++;
        if (currentLine >= BOOT_LINES.length) {
          clearInterval(interval);
          setTimeout(() => setPhase(1), 1500);
        }
      }, 400);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 1) {
      setTimeout(() => setPhase(2), 5000); // Matrix rain duration
    }
  }, [phase]);

  // Matrix Rain Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (phase === 1 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const letters = "01010110010010101001TOWERCLIMBERAIOZ!@#$%*".split("");
      const fontSize = 16;
      const columns = canvas.width / fontSize;
      const drops: number[] = [];
      
      for (let x = 0; x < columns; x++) {
        drops[x] = 1;
      }
      
      const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#0F0";
        ctx.font = fontSize + "px monospace";
        
        for (let i = 0; i < drops.length; i++) {
          const text = letters[Math.floor(Math.random() * letters.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };
      
      const interval = setInterval(draw, 33);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="fixed inset-0 bg-black z-50 text-green-500 font-mono overflow-hidden">
      <style>{`
        @keyframes star-wars-scroll {
          0% { transform: rotateX(30deg) translateY(120%); opacity: 1; }
          90% { opacity: 1; }
          100% { transform: rotateX(30deg) translateY(-250%); opacity: 0; }
        }
        @keyframes tower-scroll {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
        .perspective-container {
          perspective: 800px;
        }
      `}</style>

      <button 
        onClick={onComplete} 
        className="absolute top-4 right-4 z-50 text-xs text-slate-500 hover:text-slate-300 border border-slate-700 px-3 py-1 rounded cursor-pointer uppercase tracking-widest bg-black/50 hover:bg-slate-900 transition-colors"
      >
        Pular [ESC]
      </button>

      {/* Phase 0: Boot Sequence */}
      {phase === 0 && (
        <div className="p-8 flex flex-col gap-2 text-sm md:text-base text-emerald-500 font-bold tracking-widest uppercase">
          {bootLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <div className="animate-pulse">_</div>
        </div>
      )}

      {/* Phase 1: Matrix Rain */}
      {phase === 1 && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* Phase 2: Tower and Star Wars Scroll */}
      {phase === 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden perspective-container">
          
          {/* Background: Ascending Tower */}
          <div className="absolute inset-0 flex justify-center items-end opacity-40 pointer-events-none">
            <svg viewBox="0 0 100 2000" preserveAspectRatio="none" className="w-1/2 md:w-1/4 h-[200vh] animate-[tower-scroll_30s_linear_infinite]">
              <defs>
                <linearGradient id="tower-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                  <stop offset="20%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#fff" stopOpacity="0.8" />
                  <stop offset="80%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect x="10" y="0" width="80" height="2000" fill="url(#tower-glow)" opacity="0.2" />
              {/* Vertical lines */}
              <line x1="20" y1="0" x2="20" y2="2000" stroke="#06b6d4" strokeWidth="0.5" opacity="0.7" />
              <line x1="80" y1="0" x2="80" y2="2000" stroke="#06b6d4" strokeWidth="0.5" opacity="0.7" />
              <line x1="50" y1="0" x2="50" y2="2000" stroke="#fff" strokeWidth="1" opacity="0.9" />
              {/* Horizontal beams */}
              {Array.from({ length: 100 }).map((_, i) => (
                <line key={i} x1="10" y1={i * 20} x2="90" y2={i * 20} stroke="#06b6d4" strokeWidth="0.8" opacity={Math.random() * 0.8 + 0.2} />
              ))}
              {/* Diagonals */}
              {Array.from({ length: 50 }).map((_, i) => (
                <path key={'d'+i} d={`M 20 ${i * 40} L 80 ${(i * 40) + 20} M 80 ${i * 40} L 20 ${(i * 40) + 20}`} stroke="#06b6d4" strokeWidth="0.3" opacity="0.5" />
              ))}
            </svg>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-10" />

          {/* Scrolling Text */}
          <div className="absolute inset-x-0 bottom-0 top-[20%] flex justify-center perspective-container overflow-hidden z-20">
            <div 
              className="w-full max-w-3xl text-cyan-400 font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-lg md:text-2xl text-center leading-relaxed origin-bottom px-4" 
              style={{ animation: 'star-wars-scroll 45s linear forwards' }}
            >
              <p className="mb-12">O Ano é 2342.</p>
              <p className="mb-12">A Terra foi consumida pela ambição corporativa.</p>
              <p className="mb-12">Da superfície devastada ergue-se o Pináculo:<br/>Uma megaestrutura quase infinita perfurando os céus.</p>
              <p className="mb-12 text-rose-400">As corporações caíram.</p>
              <p className="mb-12">Agora, o Pináculo é dominado por<br/>Inteligências Artificiais descontroladas e anomalias biomecânicas.</p>
              <p className="mb-12 text-amber-400">Você é um Tecno-Explorador, um pária buscando tecnologia, poder e respostas.</p>
              <p className="mb-12">Para sobreviver, você precisará evoluir.</p>
              <p className="mb-24 text-3xl font-black text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">A Escalada começa agora.</p>
            </div>
          </div>
          
          <button 
            onClick={onComplete} 
            className="absolute bottom-12 z-50 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500 px-8 py-3 rounded uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-pulse hover:animate-none font-bold"
          >
            Iniciar Conexão
          </button>
        </div>
      )}
    </div>
  );
};
