import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Settings, FileText, RotateCcw, Power } from 'lucide-react';
import { useTranslation, Language } from '../core/engine/translation';

interface GlitchFooterProps {
  t: (text: string) => string;
  isGlitchTriggered: boolean;
  displayText: string;
  footerJitter: { x: number; y: number };
  footerColorClass: string;
  footerClonesOpacity: number;
  footerClips: { cyan: string; red: string };
  startGlitch: () => void;
}

export const GlitchFooter: React.FC<GlitchFooterProps> = ({ 
  t,
  isGlitchTriggered,
  displayText,
  footerJitter,
  footerColorClass,
  footerClonesOpacity,
  footerClips,
  startGlitch
}) => {
  const textPart1 = t("Tower Climber v1.3.0 por Pedro Vieira Bertoni // Estado:");
  const textPart2 = t("Operacional?");

  return (
    <div className="absolute bottom-4 left-0 w-full text-center text-[10px] font-mono tracking-widest flex items-center justify-center select-none">
      <div 
        className="relative px-4 py-2 transition-all duration-100"
        style={{ transform: `translate(${footerJitter.x}px, ${footerJitter.y}px)` }}
      >
        {/* Chromatic Aberration Clones */}
        {isGlitchTriggered && footerClonesOpacity > 0 && (
          <>
            <span 
              className="absolute left-4 text-cyan-500 pointer-events-none font-bold"
              style={{ 
                opacity: footerClonesOpacity,
                transform: `translate(${-footerJitter.x - 2.5}px, ${-footerJitter.y - 1}px)`,
                clipPath: footerClips.cyan,
                textShadow: '0 0 4px rgba(6,182,212,0.6)'
              }}
            >
              {displayText}
            </span>
            <span 
              className="absolute left-4 text-red-500 pointer-events-none font-bold"
              style={{ 
                opacity: footerClonesOpacity,
                transform: `translate(${footerJitter.x + 2.5}px, ${footerJitter.y + 1}px)`,
                clipPath: footerClips.red,
                textShadow: '0 0 4px rgba(239,68,68,0.6)'
              }}
            >
              {displayText}
            </span>
          </>
        )}

        {/* Primary display text */}
        {isGlitchTriggered ? (
          <span className={`${footerColorClass} transition-colors duration-75`}>
            {displayText}
          </span>
        ) : (
          <span className="text-slate-600">
            {textPart1}{' '}
            <span 
              onClick={startGlitch}
              className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors duration-200 underline decoration-dotted underline-offset-2 hover:shadow-[0_0_8px_rgba(34,211,238,0.3)] px-1 rounded bg-slate-950/20"
            >
              {textPart2}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

interface Props {
  hasSaveFile: boolean;
  onContinue: () => void;
  onNewGame: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const MainMenu: React.FC<Props> = ({ 
  hasSaveFile, 
  onContinue, 
  onNewGame,
  currentLanguage,
  onLanguageChange
}) => {
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [activeScreen, setActiveScreen] = useState<'main' | 'settings' | 'changelog'>('main');
  const { t } = useTranslation();

  // Unified Glitch / Horror system states
  const [isGlitchTriggered, setIsGlitchTriggered] = useState(false);
  const [glitchProgress, setGlitchProgress] = useState(0); // 0.0 to 1.0
  const [footerText, setFooterText] = useState('');
  const [footerColorClass, setFooterColorClass] = useState('text-slate-600');
  const [footerJitter, setFooterJitter] = useState({ x: 0, y: 0 });
  const [footerClonesOpacity, setFooterClonesOpacity] = useState(0);
  const [footerClips, setFooterClips] = useState({ cyan: 'none', red: 'none' });

  // Main menu visual background/panel shakes and flash overlays
  const [bgJitter, setBgJitter] = useState({ x: 0, y: 0 });
  const [panelJitter, setPanelJitter] = useState({ x: 0, y: 0 });
  const [bgFlash, setBgFlash] = useState<string | null>(null); // 'white', 'red', 'darkred', null
  const [scrambleTitle, setScrambleTitle] = useState('Tower Climber');
  const [scrambleSubtitle, setScrambleSubtitle] = useState('Boot Sequence Initialized');

  const glitchRequestRef = useRef<number | null>(null);
  const glitchStartTimeRef = useRef<number | null>(null);

  const textPart1 = t("Tower Climber v1.3.0 por Pedro Vieira Bertoni // Estado:");
  const textPart2 = t("Operacional?");
  const fullTextA = `${textPart1} ${textPart2}`;
  const fullTextB = t("Erro: Observador Externo Detectado");

  const origTitle = "Tower Climber";
  const origSubtitle = t("Boot Sequence Initialized");
  const targetSubtitle = t("SISTEMA CORROMPIDO // OBSERVADOR DETECTADO");

  // Sync translated state before trigger or on finalize
  useEffect(() => {
    if (!isGlitchTriggered) {
      setFooterText(fullTextA);
      setScrambleTitle(origTitle);
      setScrambleSubtitle(origSubtitle);
    } else if (glitchProgress >= 1.0) {
      setFooterText(fullTextB);
      setScrambleTitle("TOWER CLIMBER");
      setScrambleSubtitle(targetSubtitle);
    }
  }, [fullTextA, fullTextB, origSubtitle, targetSubtitle, isGlitchTriggered, glitchProgress]);

  const handleNewGame = () => {
    if (hasSaveFile) {
      setShowConfirmNew(true);
    } else {
      onNewGame();
    }
  };

  const confirmNewGame = () => {
    setShowConfirmNew(false);
    onNewGame();
  };

  const startGlitch = () => {
    if (isGlitchTriggered) return;
    setIsGlitchTriggered(true);
    animateGlitch();
  };

  const animateGlitch = () => {
    const duration = 2000; // 2 seconds of systemic decay
    glitchStartTimeRef.current = performance.now();

    const updateFrame = (time: number) => {
      if (!glitchStartTimeRef.current) return;
      const elapsed = time - glitchStartTimeRef.current;
      const progress = Math.min(elapsed / duration, 1.0); // t: 0.0 to 1.0
      setGlitchProgress(progress);

      const horrorGlyphs = [
        'Ø', '†', '⎋', '⌁', '☠', '⛥', '☣', '☤', '⚙', '⚡', '⚠', '0', '1', 
        '█', '▒', '░', '▰', '▱', 'ψ', '⛧', '⛯', '☢', '☣', '✕', '▲', '▼', '◆', '⌧', '⎔'
      ];

      // --- Footer Text Scramble ---
      const L_A = fullTextA.length;
      const L_B = fullTextB.length;
      const currentLength = Math.round(L_A + (L_B - L_A) * progress);
      const chars: string[] = [];
      for (let i = 0; i < currentLength; i++) {
        const charA = fullTextA[i] || ' ';
        const charB = fullTextB[i] || ' ';
        let char = '';

        if (progress >= 0.9) {
          const stabilizationProgress = (progress - 0.9) / 0.1;
          const thresholdIdx = currentLength * stabilizationProgress;
          if (i <= thresholdIdx) char = charB;
          else char = Math.random() < 0.4 ? horrorGlyphs[Math.floor(Math.random() * horrorGlyphs.length)] : charB;
        } else if (progress > 0.75) {
          const mutationChance = (1.0 - progress) * 4;
          if (Math.random() < mutationChance) {
            char = Math.random() < 0.6 ? horrorGlyphs[Math.floor(Math.random() * horrorGlyphs.length)] : charB;
          } else {
            char = charB;
          }
        } else if (progress < 0.2) {
          const flickerChance = progress * 0.7;
          if (Math.random() < flickerChance) {
            char = horrorGlyphs[Math.floor(Math.random() * horrorGlyphs.length)];
          } else {
            char = charA;
          }
        } else {
          const rand = Math.random();
          if (rand < 0.75) {
            char = horrorGlyphs[Math.floor(Math.random() * horrorGlyphs.length)];
          } else if (rand < 0.88) {
            char = charA;
          } else {
            char = charB;
          }
        }
        chars.push(char);
      }
      setFooterText(chars.join(''));

      // --- Title Scramble ---
      if (progress < 0.2) {
        setScrambleTitle(origTitle);
      } else if (progress >= 0.8) {
        setScrambleTitle("TOWER CLIMBER");
      } else {
        const titleChars = origTitle.split('').map(c => {
          if (c === ' ') return ' ';
          return Math.random() < 0.25 ? horrorGlyphs[Math.floor(Math.random() * horrorGlyphs.length)] : c;
        });
        setScrambleTitle(titleChars.join(''));
      }

      // --- Subtitle Scramble ---
      if (progress < 0.15) {
        setScrambleSubtitle(origSubtitle);
      } else if (progress >= 0.85) {
        setScrambleSubtitle(targetSubtitle);
      } else {
        const subLength = Math.round(origSubtitle.length + (targetSubtitle.length - origSubtitle.length) * progress);
        const subChars: string[] = [];
        for (let i = 0; i < subLength; i++) {
          const charA = origSubtitle[i] || ' ';
          const charB = targetSubtitle[i] || ' ';
          let char = '';
          const rand = Math.random();
          if (rand < 0.6) char = horrorGlyphs[Math.floor(Math.random() * horrorGlyphs.length)];
          else if (rand < 0.8) char = charA;
          else char = charB;
          subChars.push(char);
        }
        setScrambleSubtitle(subChars.join(''));
      }

      // --- DOM/Visual Shaking & Flashes ---
      if (progress < 1.0) {
        const jitterRange = progress < 0.2 ? 1.5 : progress > 0.85 ? 3 : 6;
        const fjX = (Math.random() - 0.5) * jitterRange;
        const fjY = (Math.random() - 0.5) * jitterRange;
        setFooterJitter({ x: fjX, y: fjY });

        const bgRange = progress < 0.2 ? 1 : progress > 0.85 ? 2 : 5;
        setBgJitter({
          x: (Math.random() - 0.5) * bgRange,
          y: (Math.random() - 0.5) * bgRange
        });

        const panelRange = progress < 0.2 ? 2 : progress > 0.85 ? 3 : 8;
        setPanelJitter({
          x: (Math.random() - 0.5) * panelRange,
          y: (Math.random() - 0.5) * panelRange
        });

        // Background Color Flashes (simulating screen breaking)
        const randFlash = Math.random();
        if (progress > 0.2 && progress < 0.85) {
          if (randFlash < 0.08) setBgFlash('white');
          else if (randFlash < 0.22) setBgFlash('red');
          else if (randFlash < 0.35) setBgFlash('darkred');
          else setBgFlash(null);
        } else {
          setBgFlash(null);
        }

        // Footer Color Class
        const randColor = Math.random();
        if (progress < 0.2) {
          if (randColor < 0.08) setFooterColorClass('text-white font-bold');
          else if (randColor < 0.12) setFooterColorClass('text-green-400');
          else setFooterColorClass('text-slate-600');
        } else if (progress > 0.8) {
          if (randColor < 0.1) setFooterColorClass('text-white font-bold');
          else setFooterColorClass('text-red-600 font-bold');
        } else {
          if (randColor < 0.25) setFooterColorClass('text-red-500 font-bold');
          else if (randColor < 0.45) setFooterColorClass('text-green-400 font-bold');
          else if (randColor < 0.6) setFooterColorClass('text-white font-bold');
          else setFooterColorClass('text-slate-700 font-mono');
        }

        // Chromatic aberration clones
        setFooterClonesOpacity(Math.random() < 0.35 ? 0.3 : Math.random() < 0.85 ? 0.75 : 0.95);

        const getClip = () => {
          const tClip = Math.floor(Math.random() * 80);
          const bClip = Math.floor(Math.random() * (100 - tClip)) + tClip;
          return `polygon(0% ${tClip}%, 100% ${tClip}%, 100% ${bClip}%, 0% ${bClip}%)`;
        };
        setFooterClips({ cyan: getClip(), red: getClip() });

        glitchRequestRef.current = requestAnimationFrame(updateFrame);
      } else {
        // --- FINAL CONVERGENCE ---
        setFooterText(fullTextB);
        setScrambleTitle("TOWER CLIMBER");
        setScrambleSubtitle(targetSubtitle);
        setGlitchProgress(1.0);

        setFooterJitter({ x: 0, y: 0 });
        setBgJitter({ x: 0, y: 0 });
        setPanelJitter({ x: 0, y: 0 });
        setBgFlash(null);

        setFooterColorClass('text-red-500 font-bold tracking-widest animate-pulse');
        setFooterClonesOpacity(0);
        setFooterClips({ cyan: 'none', red: 'none' });

        if (glitchRequestRef.current) {
          cancelAnimationFrame(glitchRequestRef.current);
        }
      }
    };

    glitchRequestRef.current = requestAnimationFrame(updateFrame);
  };

  useEffect(() => {
    return () => {
      if (glitchRequestRef.current) {
        cancelAnimationFrame(glitchRequestRef.current);
      }
    };
  }, []);

  // Compute dynamic background grid parameters
  const getGridColor = () => {
    if (glitchProgress >= 1.0) return '#ef4444'; // Solid Red
    if (glitchProgress === 0) return '#06b6d4'; // Solid Cyan
    return Math.random() < glitchProgress ? '#ef4444' : '#06b6d4'; // Flicker
  };

  const getGridOpacity = () => {
    if (glitchProgress >= 1.0) return 0.25;
    if (glitchProgress === 0) return 0.2;
    return 0.15 + Math.random() * 0.35; // Violent flickering
  };

  const gridColor = getGridColor();
  const gridOpacity = getGridOpacity();

  return (
    <div 
      className={`min-h-screen ${glitchProgress >= 1.0 ? 'bg-black text-red-100' : 'bg-slate-950 text-cyan-50'} font-mono p-4 flex flex-col relative overflow-hidden items-center justify-center transition-colors duration-1000`}
      style={{ transform: `translate(${bgJitter.x}px, ${bgJitter.y}px)` }}
    >
      {/* Background Grid (flickers cyan / red, stabilizes into blood red) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-75" 
        style={{ 
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, 
          backgroundSize: '40px 40px', 
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          opacity: gridOpacity
        }}
      />

      {/* Menacing dark red radial pulse glow (fades in permanently after conversion) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle at center, rgba(153, 27, 27, 0.25) 0%, transparent 75%)',
          opacity: glitchProgress >= 1.0 ? 1 : 0
        }}
      />

      {/* Dark gradient overlay */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-colors duration-1000 ${glitchProgress >= 1.0 ? 'bg-black/40' : 'bg-slate-950/0'}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/50 to-slate-950 z-0 pointer-events-none" />

      {/* Screen Damage Color Flash Overlay */}
      {bgFlash && (
        <div 
          className={`absolute inset-0 z-40 pointer-events-none ${
            bgFlash === 'white' ? 'bg-white/10' :
            bgFlash === 'red' ? 'bg-red-600/25' :
            bgFlash === 'darkred' ? 'bg-red-950/50' : ''
          }`}
        />
      )}

      {/* Card window "system-panel" (vibrates, border mutates from cyan to crimson) */}
      <div 
        className="z-10 w-full max-w-2xl system-panel p-8 relative flex flex-col items-center transition-all duration-300"
        style={{
          transform: `translate(${panelJitter.x}px, ${panelJitter.y}px)`,
          '--panel-glow-rgb': glitchProgress >= 1.0 ? '239, 68, 68' : (glitchProgress > 0 && Math.random() < glitchProgress) ? '239, 68, 68' : '6, 182, 212',
          boxShadow: glitchProgress >= 1.0 
            ? 'inset 0 0 35px rgba(239, 68, 68, 0.4), 0 0 25px rgba(239, 68, 68, 0.15)' 
            : undefined
        } as React.CSSProperties}
      >
        {/* Title & Status */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Terminal className={`w-12 h-12 transition-colors duration-500 ${glitchProgress >= 1.0 ? 'text-red-500' : 'text-cyan-400'}`} />
          <div className="flex flex-col">
            <h1 
              className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                glitchProgress >= 1.0 ? 'from-red-500 to-orange-600' : 'from-cyan-400 to-blue-500'
              } tracking-tighter uppercase transition-all duration-1000`} 
              style={{ filter: glitchProgress >= 1.0 ? 'drop-shadow(0 0 10px rgba(239,68,68,0.4))' : 'drop-shadow(0 0 10px rgba(34,211,238,0.3))' }}
            >
              {scrambleTitle}
            </h1>
            <span className={`transition-colors duration-500 ${
              glitchProgress >= 1.0 ? 'text-red-500/70' : 'text-cyan-500/60'
            } text-xs tracking-[0.3em] uppercase`}>
              {scrambleSubtitle}
            </span>
          </div>
        </div>

        {activeScreen === 'main' && (
          <div className="w-full max-w-md flex flex-col gap-4">
            {hasSaveFile && (
              <button
                onClick={onContinue}
                className={`w-full font-bold py-4 px-6 rounded uppercase tracking-widest transition-all flex items-center justify-center gap-3 group ${
                  glitchProgress >= 1.0
                    ? 'bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 hover:border-red-500 text-rose-100 hover:shadow-[0_0_20px_rgba(239,68,68,0.45)]'
                    : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-100 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                }`}
              >
                <Play className={`w-5 h-5 transition-colors ${glitchProgress >= 1.0 ? 'group-hover:text-red-300 text-red-400' : 'group-hover:text-cyan-300'}`} /> {t("Continuar Ciclo")}
              </button>
            )}

            {!showConfirmNew ? (
              <button
                onClick={handleNewGame}
                className={`w-full font-bold py-4 px-6 rounded uppercase tracking-widest transition-all flex items-center justify-center gap-3 group ${
                  glitchProgress >= 1.0
                    ? `bg-slate-950/80 hover:bg-slate-900 border ${hasSaveFile ? 'border-red-900/50 text-red-300 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]' : 'border-red-500/50 text-rose-100 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]'}`
                    : `bg-slate-900/80 hover:bg-slate-800 border ${hasSaveFile ? 'border-slate-700/50 text-slate-300 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-cyan-500/50 text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'}`
                }`}
              >
                <Power className={`w-5 h-5 transition-colors ${
                  glitchProgress >= 1.0
                    ? (hasSaveFile ? 'group-hover:text-red-300 text-red-500' : 'text-red-400')
                    : (hasSaveFile ? 'group-hover:text-cyan-300 text-cyan-400' : 'text-cyan-400')
                }`} /> {hasSaveFile ? t("Reiniciar Sistema (Novo Jogo)") : t("Iniciar Sistema")}
              </button>
            ) : (
              <div className={`w-full bg-red-950/30 border ${glitchProgress >= 1.0 ? 'border-red-800' : 'border-red-900/50'} p-4 rounded text-center flex flex-col gap-4`}>
                <p className="text-red-400 text-sm">{t("AVISO: Isso apagará seu progresso atual irreversivelmente. Tem certeza?")}</p>
                <div className="flex gap-2">
                  <button onClick={confirmNewGame} className="flex-1 bg-red-900/50 hover:bg-red-800 border border-red-500 text-red-100 py-2 rounded text-xs uppercase tracking-widest transition-colors">{t("Sim, Formatar")}</button>
                  <button onClick={() => setShowConfirmNew(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 py-2 rounded text-xs uppercase tracking-widest transition-colors">{t("Cancelar")}</button>
                </div>
              </div>
            )}

            <div className={`h-px w-full ${glitchProgress >= 1.0 ? 'bg-red-900/40' : 'bg-slate-800/50'} my-2`} />

            <button
              onClick={() => setActiveScreen('settings')}
              className={`w-full border font-bold py-3 px-6 rounded uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                glitchProgress >= 1.0
                  ? 'bg-slate-950/60 hover:bg-slate-900 border-red-950 hover:border-red-800 text-red-400 hover:text-red-200 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : 'bg-slate-900/50 hover:bg-slate-800 border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" /> {t("Configurações")}
            </button>

            <button
              onClick={() => setActiveScreen('changelog')}
              className={`w-full border font-bold py-3 px-6 rounded uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                glitchProgress >= 1.0
                  ? 'bg-slate-950/60 hover:bg-slate-900 border-red-950 hover:border-red-800 text-red-400 hover:text-red-200 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : 'bg-slate-900/50 hover:bg-slate-800 border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" /> Changelog
            </button>
          </div>
        )}

        {activeScreen === 'settings' && (
          <div className="w-full flex flex-col gap-6">
            <h2 className={`transition-colors duration-500 ${glitchProgress >= 1.0 ? 'text-red-500' : 'text-cyan-400'} uppercase tracking-widest font-bold border-b ${glitchProgress >= 1.0 ? 'border-red-900/50' : 'border-cyan-900/50'} pb-2 flex items-center gap-2`}>
              <Settings className="w-5 h-5" /> {t("Configurações")}
            </h2>
            
            <div className="flex flex-col gap-4 text-sm text-slate-300">
               {/* Language selection with custom diagonal flags */}
               <div className={`bg-slate-900/50 p-4 rounded border ${glitchProgress >= 1.0 ? 'border-red-900/50' : 'border-slate-800'} flex justify-between items-center transition-colors duration-500`}>
                 <span>{t("Idioma / Language")}</span>
                 <div className="flex gap-4">
                   {/* Brazil / Portugal Flag */}
                   <button
                     type="button"
                     onClick={() => onLanguageChange('pt')}
                     className={`relative w-14 h-9 rounded overflow-hidden border transition-all cursor-pointer flex-shrink-0 group hover:scale-105 active:scale-95 ${
                       currentLanguage === 'pt' 
                         ? (glitchProgress >= 1.0 ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] ring-1 ring-red-500' : 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] ring-1 ring-cyan-400')
                         : 'border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-90'
                     }`}
                     title="Português (BR/PT)"
                   >
                     {/* Diagonal division: top-left BR, bottom-right PT */}
                     <div className="absolute inset-0 bg-gradient-to-br from-[#009b3a] from-50% to-[#ff0000] to-50%" />
                     {/* Brazil details in top-left */}
                     <div className="absolute top-[5px] left-[5px] w-[14px] h-[10px] bg-[#fedd00]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                       <div className="absolute top-[2px] left-[3px] w-[4px] h-[4px] bg-[#002776] rounded-full" />
                     </div>
                     {/* Portugal details in bottom-right (green circle on red) */}
                     <div className="absolute bottom-[4px] right-[5px] w-[10px] h-[10px] bg-[#006600] rounded-full border border-[#ffcc00] flex items-center justify-center">
                       <div className="w-[4px] h-[4px] bg-[#ff0000] rounded-full" />
                     </div>
                   </button>

                   {/* USA / UK Flag */}
                   <button
                     type="button"
                     onClick={() => onLanguageChange('en')}
                     className={`relative w-14 h-9 rounded overflow-hidden border transition-all cursor-pointer flex-shrink-0 group hover:scale-105 active:scale-95 ${
                       currentLanguage === 'en' 
                         ? (glitchProgress >= 1.0 ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] ring-1 ring-red-500' : 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] ring-1 ring-cyan-400')
                         : 'border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-90'
                     }`}
                     title="English (US/UK)"
                   >
                     {/* USA half: top-left side */}
                     <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}>
                       {/* USA background: Red and white stripes */}
                       <div className="absolute inset-0 bg-slate-100 flex flex-col justify-between py-0.5">
                         <div className="h-[1.5px] bg-red-600 w-full" />
                         <div className="h-[1.5px] bg-red-600 w-full" />
                         <div className="h-[1.5px] bg-red-600 w-full" />
                         <div className="h-[1.5px] bg-red-600 w-full" />
                       </div>
                       {/* Blue canton with a white dot */}
                       <div className="absolute top-0 left-0 w-5 h-3 bg-blue-800 flex items-center justify-center">
                         <div className="w-1 h-1 bg-white rounded-full" />
                       </div>
                     </div>
                     {/* UK half: bottom-right side */}
                     <div className="absolute inset-0" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}>
                       {/* UK background: blue with Union Jack lines */}
                       <div className="absolute inset-0 bg-[#00247d]">
                         {/* White diagonal */}
                         <div className="absolute top-0 left-0 w-full h-full border-t-[2px] border-b-[2px] border-white transform rotate-[33deg] origin-center" />
                         {/* Red diagonal */}
                         <div className="absolute top-0 left-0 w-full h-full border-t-[0.8px] border-b-[0.8px] border-[#cf142b] transform rotate-[33deg] origin-center" />
                         {/* White cross */}
                         <div className="absolute inset-y-0 left-[24px] w-[5px] bg-white" />
                         <div className="absolute inset-x-0 top-[14px] h-[5px] bg-white" />
                         {/* Red cross */}
                         <div className="absolute inset-y-0 left-[25.5px] w-[2px] bg-[#cf142b]" />
                         <div className="absolute inset-x-0 top-[15.5px] h-[2px] bg-[#cf142b]" />
                       </div>
                     </div>
                   </button>
                 </div>
               </div>

               <div className={`bg-slate-900/50 p-4 rounded border ${glitchProgress >= 1.0 ? 'border-red-900/20' : 'border-slate-800'} flex justify-between items-center opacity-50`}>
                 <span>{t("Efeitos Sonoros (Em Breve)")}</span>
                 <div className="w-12 h-6 bg-slate-800 rounded-full"></div>
               </div>
               <div className={`bg-slate-900/50 p-4 rounded border ${glitchProgress >= 1.0 ? 'border-red-900/20' : 'border-slate-800'} flex justify-between items-center opacity-50`}>
                 <span>{t("Música de Fundo (Em Breve)")}</span>
                 <div className="w-12 h-6 bg-slate-800 rounded-full"></div>
               </div>
            </div>

            <button
              onClick={() => setActiveScreen('main')}
              className={`mt-4 border font-bold py-2 px-6 rounded uppercase tracking-widest transition-all ${
                glitchProgress >= 1.0
                  ? 'bg-red-950/40 hover:bg-red-900/60 border-red-800 text-rose-100 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
              }`}
            >
              {t("Voltar")}
            </button>
          </div>
        )}

        {activeScreen === 'changelog' && (
          <div className="w-full flex flex-col gap-6">
            <h2 className={`transition-colors duration-500 ${glitchProgress >= 1.0 ? 'text-red-500' : 'text-cyan-400'} uppercase tracking-widest font-bold border-b ${glitchProgress >= 1.0 ? 'border-red-900/50' : 'border-cyan-900/50'} pb-2 flex items-center gap-2`}>
              <FileText className="w-5 h-5" /> Patch Notes // Changelog
            </h2>
            
            <div className="flex flex-col gap-4 h-64 overflow-y-auto custom-scrollbar text-sm text-slate-300 pr-2">
               <div className={`border-l-2 ${glitchProgress >= 1.0 ? 'border-red-600/50' : 'border-emerald-500'} pl-4 pb-4 transition-colors duration-500`}>
                 <h3 className={`${glitchProgress >= 1.0 ? 'text-red-400' : 'text-emerald-400'} font-bold mb-1`}>{t("v1.3.0 - Forja Transcendente & Conexão Estelar")}</h3>
                 <ul className={`list-disc list-inside space-y-1 ${glitchProgress >= 1.0 ? 'text-slate-400/80' : 'text-slate-400'}`}>
                    <li>{t("Adicionada Forja para as classes supremas de raridade Lendária e Mítica")}</li>
                    <li>{t("Novo Conversor de Matéria Arcana para refino de materiais (taxa de 5:1)")}</li>
                    <li>{t("Remasterização da Tela de Introdução: Visual retrô CRT verde de terminal com torre pixelada animada")}</li>
                    <li>{t("Sincronização inteligente do botão \"Iniciar Conexão\" ao atingir o centro de rolagem do texto")}</li>
                    <li>{t("Balanceamento de loot aprimorado para drop-rates dinâmicos de alta raridade nos andares superiores")}</li>
                 </ul>
               </div>
               <div className={`border-l-2 ${glitchProgress >= 1.0 ? 'border-red-800/40' : 'border-cyan-500'} pl-4 pb-4 transition-colors duration-500 opacity-80`}>
                 <h3 className={`${glitchProgress >= 1.0 ? 'text-red-500/80' : 'text-cyan-300'} font-bold mb-1`}>{t("v1.2.0 - Despertar da Máquina")}</h3>
                 <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>{t("Adicionado Sistema de Matriz Neural (Árvore de Passivas)")}</li>
                    <li>{t("Novo Menu Principal")}</li>
                    <li>{t("Refatoração de Sinergia de Habilidades")}</li>
                    <li>{t("Adicionado Glossário de Efeitos")}</li>
                 </ul>
               </div>
               <div className="border-l-2 border-slate-700 pl-4 pb-4 opacity-60">
                 <h3 className="text-slate-300 font-bold mb-1">{t("v1.1.0 - Expansão do Núcleo")}</h3>
                 <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>{t("Introduzido Sistema de Sockets em Equipamentos")}</li>
                    <li>{t("Módulos de Circuitos Adicionados (Chipsets)")}</li>
                    <li>{t("Auto-Batalha Aprimorada")}</li>
                 </ul>
               </div>
               <div className="border-l-2 border-slate-700 pl-4 opacity-40">
                 <h3 className="text-slate-300 font-bold mb-1">{t("v1.0.0 - Genesis")}</h3>
                 <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>{t("Lançamento Inicial do Protocolo")}</li>
                    <li>{t("Batalhas em Turnos Implementadas")}</li>
                    <li>{t("Classes Iniciais de Combate")}</li>
                 </ul>
               </div>
            </div>

            <button
              onClick={() => setActiveScreen('main')}
              className={`mt-4 border font-bold py-2 px-6 rounded uppercase tracking-widest transition-all ${
                glitchProgress >= 1.0
                  ? 'bg-red-950/40 hover:bg-red-900/60 border-red-800 text-rose-100 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
              }`}
            >
              {t("Voltar")}
            </button>
          </div>
        )}
      </div>
      
      <GlitchFooter 
        t={t}
        isGlitchTriggered={isGlitchTriggered}
        displayText={footerText}
        footerJitter={footerJitter}
        footerColorClass={footerColorClass}
        footerClonesOpacity={footerClonesOpacity}
        footerClips={footerClips}
        startGlitch={startGlitch}
      />
    </div>
  );
};
