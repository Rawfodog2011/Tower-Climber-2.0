import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { useTranslation } from '../core/engine/translation';

interface Props {
  onComplete: () => void;
  isContinue?: boolean;
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

export const IntroSequence: React.FC<Props> = ({ onComplete, isContinue }) => {
  const [phase, setPhase] = useState<number>(0);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [showStartButton, setShowStartButton] = useState<boolean>(false);
  const [isRepeatIntro, setIsRepeatIntro] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const countStr = localStorage.getItem('intro_seen_count') || '0';
    const count = parseInt(countStr, 10);
    if (count > 0 || isContinue) {
      setIsRepeatIntro(true);
    }
  }, [isContinue]);

  const handleComplete = () => {
    const countStr = localStorage.getItem('intro_seen_count') || '0';
    const count = parseInt(countStr, 10);
    localStorage.setItem('intro_seen_count', (count + 1).toString());
    onComplete();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleComplete();
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

  useEffect(() => {
    if (phase === 2) {
      if (isRepeatIntro) {
        // Auto-complete after zoom ends
        const timer = setTimeout(() => {
          handleComplete();
        }, 7600); // slightly after zoom hits scale 32 and fades to black
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setShowStartButton(true);
        }, 32000); // 32 seconds: "A Escalada começa agora" reaches the center of the screen
        return () => clearTimeout(timer);
      }
    } else {
      setShowStartButton(false);
    }
  }, [phase, isRepeatIntro]);

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
          0% { transform: rotateX(25deg) translateY(100%); opacity: 0; }
          2% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: rotateX(25deg) translateY(-220%); opacity: 0; }
        }
        @keyframes crt-flicker {
          0% { opacity: 0.96; }
          50% { opacity: 1; }
          100% { opacity: 0.97; }
        }
        @keyframes fade-in-button {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoom-into-door {
          0% { transform: scale(1); opacity: 0.15; }
          15% { transform: scale(1.05); opacity: 0.85; }
          90% { transform: scale(32); opacity: 1; }
          100% { transform: scale(32); opacity: 0; }
        }
        @keyframes fade-out-hud {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          75% { opacity: 1; }
          95% { opacity: 0; transform: translate(-50%, -50%) scale(1.05); }
          100% { opacity: 0; }
        }
        .zoom-tower-animation {
          transform-origin: 50% 93.75%;
          animation: zoom-into-door 7.5s cubic-bezier(0.7, 0, 0.3, 1) forwards;
        }
        .hud-telemetry-animation {
          animation: fade-out-hud 7.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .crt-bg {
          background: radial-gradient(circle, #021a08 0%, #000000 100%);
        }
        .crt-scanlines {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%);
          background-size: 100% 4px;
        }
        .crt-vignette {
          background: radial-gradient(circle, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.85) 100%);
        }
        .crt-flicker {
          animation: crt-flicker 0.15s infinite;
        }
        .perspective-container {
          perspective: 800px;
        }
        .star-wars-text {
          animation: star-wars-scroll 45s linear forwards;
        }
        .animate-fade-in-button {
          animation: fade-in-button 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {isContinue ? (
        <button 
          onClick={handleComplete} 
          className="absolute bottom-8 right-8 z-50 text-sm font-bold text-cyan-400 hover:text-cyan-200 border border-cyan-700 px-6 py-2 rounded cursor-pointer uppercase tracking-widest bg-cyan-950/50 hover:bg-cyan-900 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
        >
          {t("Pular Introdução")} {'>'}
        </button>
      ) : (
        <button 
          onClick={handleComplete} 
          className="absolute top-4 right-4 z-50 text-xs text-slate-500 hover:text-slate-300 border border-slate-700 px-3 py-1 rounded cursor-pointer uppercase tracking-widest bg-black/50 hover:bg-slate-900 transition-colors"
        >
          {t("Pular [ESC]")}
        </button>
      )}

      {/* Phase 0: Boot Sequence */}
      {phase === 0 && (
        <div className="p-8 flex flex-col gap-2 text-sm md:text-base text-emerald-500 font-bold tracking-widest uppercase">
          {bootLines.map((line, i) => (
            <div key={i}>{t(line)}</div>
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
        <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden crt-bg crt-flicker">
          
          {/* Background: Pixelated Green CRT Tower */}
          <div className={`absolute inset-0 flex justify-center items-center pointer-events-none z-10 ${isRepeatIntro ? '' : 'opacity-30'}`}>
            <svg viewBox="0 0 200 400" className={`w-[240px] md:w-[360px] h-[480px] md:h-[720px] text-emerald-500 ${isRepeatIntro ? 'zoom-tower-animation' : ''}`}>
              {/* Antenna Signals */}
              <rect x="98" y="10" width="4" height="25" fill="currentColor" />
              <rect x="94" y="5" width="12" height="4" fill="currentColor" />
              <rect x="90" y="0" width="20" height="4" fill="currentColor" opacity="0.5" />
              
              {/* Signal waves left & right (pixelated style) */}
              <rect x="78" y="15" width="8" height="4" fill="currentColor" opacity="0.3" />
              <rect x="114" y="15" width="8" height="4" fill="currentColor" opacity="0.3" />
              <rect x="70" y="5" width="8" height="4" fill="currentColor" opacity="0.15" />
              <rect x="122" y="5" width="8" height="4" fill="currentColor" opacity="0.15" />

              {/* Tower Top */}
              <rect x="92" y="35" width="16" height="30" fill="currentColor" />
              <rect x="96" y="45" width="2" height="4" fill="#000" />
              <rect x="102" y="45" width="2" height="4" fill="#000" />
              <rect x="96" y="55" width="2" height="4" fill="#000" />
              <rect x="102" y="55" width="2" height="4" fill="#000" />

              {/* Tower Section 2 */}
              <rect x="84" y="65" width="32" height="50" fill="currentColor" />
              <rect x="88" y="75" width="4" height="8" fill="#000" />
              <rect x="96" y="75" width="4" height="8" fill="#000" />
              <rect x="104" y="75" width="4" height="8" fill="#000" />
              <rect x="112" y="75" width="4" height="8" fill="#000" />
              <rect x="88" y="95" width="4" height="8" fill="#000" />
              <rect x="96" y="95" width="4" height="8" fill="#000" />
              <rect x="104" y="95" width="4" height="8" fill="#000" />
              <rect x="112" y="95" width="4" height="8" fill="#000" />

              {/* Tower Section 3 (Cross Bracing) */}
              <rect x="72" y="115" width="56" height="80" fill="currentColor" />
              <line x1="72" y1="115" x2="128" y2="195" stroke="#000" strokeWidth="4" />
              <line x1="128" y1="115" x2="72" y2="195" stroke="#000" strokeWidth="4" />
              <rect x="92" y="145" width="16" height="20" fill="#000" />

              {/* Tower Section 4 */}
              <rect x="56" y="195" width="88" height="110" fill="currentColor" />
              {/* Grid of pixelated windows */}
              {Array.from({ length: 4 }).map((_, r) => (
                <React.Fragment key={r}>
                  {Array.from({ length: 5 }).map((_, c) => (
                    <rect 
                      key={c} 
                      x={64 + c * 15} 
                      y={205 + r * 24} 
                      width="8" 
                      height="12" 
                      fill="#000" 
                    />
                  ))}
                </React.Fragment>
              ))}

              {/* Tower Base */}
              <rect x="32" y="305" width="136" height="95" fill="currentColor" />
              <rect x="42" y="320" width="116" height="15" fill="#000" />
              <rect x="84" y="350" width="32" height="50" fill="#000" />
            </svg>
          </div>

          {/* Sibling Scanline & Vignette Overlays for 100% Reliable Rendering */}
          <div className="absolute inset-0 pointer-events-none crt-scanlines z-30" />
          <div className="absolute inset-0 pointer-events-none crt-vignette z-40" />

          {/* Dynamic soft background shadows */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 pointer-events-none z-20" />

          {/* Scrolling Text */}
          {!isRepeatIntro && (
            <div className="absolute inset-x-0 bottom-0 top-[20%] flex justify-center perspective-container overflow-hidden z-25">
              <div 
                className="w-full max-w-3xl text-emerald-400 font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-lg md:text-2xl text-center leading-relaxed origin-bottom px-4 star-wars-text" 
              >
                <p className="mb-12">{t("O Ano é 2342.")}</p>
                <p className="mb-12">{t("A Terra foi consumida pela ambição corporativa.")}</p>
                <p className="mb-12">{t("Da superfície devastada ergue-se o Pináculo:\nUma megaestrutura quase infinita perfurando os skies.")}</p>
                <p className="mb-12 text-emerald-200 font-extrabold">{t("As corporações não caíram. Elas subiram.")}</p>
                <p className="mb-12">{t("Abandonaram a superfície devastada para reinar dentro do Pináculo.")}</p>
                <p className="mb-12">{t("O controle foi perdido. As divisões inferiores foram tomadas por<br/>Inteligências Artificiais descontroladas e anomalias biomecânicas.")}</p>
                <p className="mb-12 text-emerald-300">{t("Você é um Tecno-Explorador, um pária buscando tecnologia, poder e respostas.")}</p>
                <p className="mb-12">{t("Para sobreviver, você precisará evoluir.")}</p>
                <p className="mb-24 text-3xl font-black text-emerald-200 drop-shadow-[0_0_15px_rgba(52,211,238,0.8)]">{t("A Escalada começa agora.")}</p>
              </div>
            </div>
          )}

          {isRepeatIntro && (
            <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-30 select-none hud-telemetry-animation px-4">
              <div className="font-mono text-emerald-400 text-sm md:text-base tracking-[0.3em] uppercase mb-3 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                {t("CONEXÃO RE-ESTABELECIDA")}
              </div>
              <div className="font-mono text-emerald-500/80 text-xs tracking-[0.2em] uppercase mb-1">
                {t("SINAL DO EXPLORADOR DETECTADO")}
              </div>
              <div className="font-mono text-emerald-500/60 text-[10px] tracking-[0.15em] uppercase font-bold animate-pulse">
                {t("Iniciando Aproximação Neural...")}
              </div>
            </div>
          )}
          
          {!isRepeatIntro && showStartButton && (
            <button 
              onClick={handleComplete} 
              className="absolute bottom-12 z-50 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500 px-8 py-3 rounded uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(52,211,238,0.4)] animate-fade-in-button hover:shadow-[0_0_30px_rgba(52,211,238,0.6)] font-bold font-mono text-sm"
            >
              {t("Iniciar Conexão")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
