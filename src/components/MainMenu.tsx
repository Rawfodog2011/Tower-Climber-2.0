import { useGameUIStore } from '../store/useGameUIStore';
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Settings, FileText, RotateCcw, Cpu, Power, Volume2, VolumeX, Bot, Ghost, UserRound, Crosshair, Fingerprint, Eye, Hexagon } from 'lucide-react';
import { useTranslation, Language } from '../core/engine/translation';
import { useAudio } from '../core/engine/useAudio';
import { SystemVoiceSelector } from './SystemVoiceSelector';
import { SaveManager } from './SaveManager';

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

const getAvatarIcon = (id?: string, isGlitch?: boolean) => {
  const cn = `w-4 h-4 ${isGlitch ? 'text-red-400' : 'text-cyan-400'}`;
  switch (id) {
    case 'bot': return <Bot className={cn} />;
    case 'ghost': return <Ghost className={cn} />;
    case 'crosshair': return <Crosshair className={cn} />;
    case 'fingerprint': return <Fingerprint className={cn} />;
    case 'eye': return <Eye className={cn} />;
    case 'hexagon': return <Hexagon className={cn} />;
    case 'cpu': return <Cpu className={cn} />;
    default: return <UserRound className={cn} />;
  }
};

const GlitchFooter: React.FC<GlitchFooterProps> = ({ 
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





export const MainMenu: React.FC = () => {
  const { savedPlayerPreview, setScene, setIsContinueRun } = useGameUIStore();
  const hasSaveFile = !!savedPlayerPreview;
  const onContinue = () => {
    setIsContinueRun(true);
    setScene('intro');
  };
  
  const onNewGame = () => {
    setScene('character_creation');
  };
  
  const { t, language: currentLanguage, setLanguage: onLanguageChange } = useTranslation();

  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [activeScreen, setActiveScreen] = useState<'main' | 'settings' | 'changelog'>('main');
  
  const { 
    init: initAudio, 
    playSfx, 
    sfxVolume, 
    musicVolume, 
    muted, 
    setSfxVolume, 
    setMusicVolume, 
    setMuted 
  } = useAudio();

  const handleInteraction = async (callback: () => void, sfxId?: string, sfxOptions?: { volume?: number; pitch?: number; damageMultiplier?: number; rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' }) => {
    await initAudio();
    if (sfxId) {
      playSfx(sfxId, sfxOptions);
    }
    callback();
  };

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

      // Play a randomized glitch boot beep
      if (Math.random() < 0.15) {
        playSfx('ui.boot_beep', { 
          volume: 0.15, 
          pitch: 200 + Math.random() * 800 
        });
      }

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
              <>
                {savedPlayerPreview && (
                  <div className={`system-panel p-3 mb-2 animate-in fade-in duration-500 flex flex-col gap-2 font-mono text-sm border ${
                    glitchProgress >= 1.0 ? 'border-red-500/30 bg-red-950/20 text-red-200' : 'border-cyan-500/30 bg-cyan-950/20 text-cyan-100'
                  }`}>
                    <div className={`flex items-center gap-2 border-b pb-2 mb-1 ${glitchProgress >= 1.0 ? 'border-red-500/20' : 'border-cyan-500/20'}`}>
                      {getAvatarIcon(savedPlayerPreview.avatar, glitchProgress >= 1.0)}
                      <div className="flex flex-col">
                        {savedPlayerPreview.name && (
                          <span className="uppercase tracking-widest text-xs font-bold text-left leading-tight text-cyan-300">
                            {savedPlayerPreview.name}
                          </span>
                        )}
                        <span className="uppercase tracking-widest text-[10px] opacity-80 text-left leading-tight">
                          {savedPlayerPreview.className} {savedPlayerPreview.originName ? `(${savedPlayerPreview.originName})` : ''}
                        </span>
                      </div>
                      <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold ${glitchProgress >= 1.0 ? 'bg-red-900/40' : 'bg-cyan-900/40'}`}>
                        LVL {savedPlayerPreview.level}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs opacity-80">
                      <span>{t('Andar mais alto')}: {savedPlayerPreview.highestFloorUnlocked}</span>
                      <span className="text-amber-400/90 font-bold">{savedPlayerPreview.gold} CRD</span>
                    </div>
                    <div className="text-[10px] opacity-50 uppercase tracking-widest text-right">
                      {(savedPlayerPreview.totalPlaytimeSeconds || 0) < 60 
                        ? t("Menos de 1 minuto") 
                        : `${Math.floor((savedPlayerPreview.totalPlaytimeSeconds || 0) / 3600).toString().padStart(2, '0')}h ${Math.floor(((savedPlayerPreview.totalPlaytimeSeconds || 0) % 3600) / 60).toString().padStart(2, '0')}m`
                      }
                    </div>
                  </div>
                )}
                <button
                  onClick={() => handleInteraction(onContinue, 'ui.click')}
                  className={`w-full font-bold py-4 px-6 rounded uppercase tracking-widest transition-all flex items-center justify-center gap-3 group ${
                    glitchProgress >= 1.0
                      ? 'bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 hover:border-red-500 text-rose-100 hover:shadow-[0_0_20px_rgba(239,68,68,0.45)]'
                      : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-100 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                  }`}
                >
                  <Play className={`w-5 h-5 transition-colors ${glitchProgress >= 1.0 ? 'group-hover:text-red-300 text-red-400' : 'group-hover:text-cyan-300 text-cyan-400'}`} /> {t("Continuar Ciclo")}
                </button>
              </>
            )}

            {!showConfirmNew ? (
              <button
                onClick={() => handleInteraction(handleNewGame, 'ui.click')}
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
                  <button onClick={() => handleInteraction(confirmNewGame, 'ui.click')} className="flex-1 bg-red-900/50 hover:bg-red-800 border border-red-500 text-red-100 py-2 rounded text-xs uppercase tracking-widest transition-colors">{t("Sim, Formatar")}</button>
                  <button onClick={() => handleInteraction(() => setShowConfirmNew(false), 'ui.click')} className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 py-2 rounded text-xs uppercase tracking-widest transition-colors">{t("Cancelar")}</button>
                </div>
              </div>
            )}

            <div className={`h-px w-full ${glitchProgress >= 1.0 ? 'bg-red-900/40' : 'bg-slate-800/50'} my-2`} />

            <button
              onClick={() => handleInteraction(() => setActiveScreen('settings'), 'ui.click')}
              className={`w-full border font-bold py-3 px-6 rounded uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                glitchProgress >= 1.0
                  ? 'bg-slate-950/60 hover:bg-slate-900 border-red-950 hover:border-red-800 text-red-400 hover:text-red-200 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : 'bg-slate-900/50 hover:bg-slate-800 border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" /> {t("Configurações")}
            </button>

            <button
              onClick={() => handleInteraction(() => setActiveScreen('changelog'), 'ui.click')}
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
                    onClick={() => handleInteraction(() => onLanguageChange('pt'), 'ui.click')}
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
                    onClick={() => handleInteraction(() => onLanguageChange('en'), 'ui.click')}
                    className={`relative w-14 h-9 rounded overflow-hidden border transition-all cursor-pointer flex-shrink-0 group hover:scale-105 active:scale-95 ${
                      currentLanguage === 'en' 
                        ? (glitchProgress >= 1.0 ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] ring-1 ring-red-500' : 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] ring-1 ring-cyan-400')
                        : 'border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-90'
                    }`}
                    title="English (US/UK)"
                  >
                    {/* Diagonal division: top-left US, bottom-right UK */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#b22234] from-50% to-[#012169] to-50%" />
                    {/* USA details in top-left */}
                    <div className="absolute top-[4px] left-[4px] w-[12px] h-[10px] bg-[#3c3b6e]">
                      <div className="absolute top-[2px] left-[2px] w-[2px] h-[2px] bg-white rounded-full" />
                      <div className="absolute top-[5px] left-[6px] w-[2px] h-[2px] bg-white rounded-full" />
                    </div>
                    {/* UK details in bottom-right */}
                    <div className="absolute bottom-[3px] right-[3px] w-[14px] h-[14px] border-t-2 border-l-2 border-white">
                      <div className="absolute inset-0 border-t-2 border-l-2 border-[#c8102e]" />
                    </div>
                  </button>
                 </div>
               </div>

               <div className={`bg-slate-900/50 p-4 rounded border ${glitchProgress >= 1.0 ? 'border-red-900/50' : 'border-slate-800'} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-500`}>
                  <div className="flex flex-col">
                    <span className="font-bold tracking-wider">{t("Efeitos Sonoros")}</span>
                    <span className="text-xs text-slate-500 font-mono">{Math.round(sfxVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={sfxVolume}
                    onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                    onMouseUp={async () => {
                      await initAudio();
                      playSfx('ui.click');
                    }}
                    onTouchEnd={async () => {
                      await initAudio();
                      playSfx('ui.click');
                    }}
                    className={`w-full sm:w-48 h-1 rounded-lg appearance-none cursor-pointer accent-cyan-400 bg-slate-800 ${glitchProgress >= 1.0 ? 'accent-red-500 bg-slate-900' : ''}`}
                  />
                </div>

                <div className={`bg-slate-900/50 p-4 rounded border ${glitchProgress >= 1.0 ? 'border-red-900/50' : 'border-slate-800'} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-500`}>
                  <div className="flex flex-col">
                    <span className="font-bold tracking-wider">{t("Música de Fundo")}</span>
                    <span className="text-xs text-slate-500 font-mono">{Math.round(musicVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className={`w-full sm:w-48 h-1 rounded-lg appearance-none cursor-pointer accent-cyan-400 bg-slate-800 ${glitchProgress >= 1.0 ? 'accent-red-500 bg-slate-900' : ''}`}
                  />
                </div>

                <div className={`bg-slate-900/50 p-4 rounded border ${glitchProgress >= 1.0 ? 'border-red-900/50' : 'border-slate-800'} flex justify-between items-center transition-colors duration-500`}>
                  <div className="flex flex-col">
                    <span className="font-bold tracking-wider">{t("Mutar Tudo")}</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {muted ? t("Mutado") : t("Ativo")}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      await initAudio();
                      setMuted(!muted);
                      if (muted) {
                        playSfx('ui.click');
                      }
                    }}
                    className={`p-2 rounded border transition-all ${
                      muted
                        ? (glitchProgress >= 1.0 ? 'bg-red-950/40 border-red-800 text-red-400' : 'bg-cyan-950/40 border-cyan-800 text-cyan-400')
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                <div className={`bg-slate-900/50 p-4 rounded border ${glitchProgress >= 1.0 ? 'border-red-900/50' : 'border-slate-800'} transition-colors duration-500`}>
                  <SystemVoiceSelector />
                </div>
                
                <SaveManager glitchProgress={glitchProgress} />
             </div>

            <button
              onClick={() => handleInteraction(() => setActiveScreen('main'), 'ui.click')}
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
              onClick={() => handleInteraction(() => setActiveScreen('main'), 'ui.click')}
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
        startGlitch={() => handleInteraction(startGlitch, 'ui.click')}
      />
    </div>
  );
};
