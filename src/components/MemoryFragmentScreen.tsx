import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, BrainCircuit, Play, ArrowRight, Clock } from 'lucide-react';
import { getMemoryFragment } from '../core/entities/memories';
import { ORIGINS } from '../core/entities/origins';
import { Player } from '../types';
import { useTranslation } from '../core/engine/translation';
import { TTSButton } from './TTSButton';

interface Props {
  player: Player;
  memoryKey: string;
  onComplete: () => void;
}

export const MemoryFragmentScreen: React.FC<Props> = ({ player, memoryKey, onComplete }) => {
  const [displayedCoreText, setDisplayedCoreText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [autoAdvanceTime, setAutoAdvanceTime] = useState(15); // 15 seconds auto-advance
  const { t } = useTranslation();

  const [originId, classId] = memoryKey.split(':');
  const memory = getMemoryFragment(originId || 'ciborgue_foragido', classId || 'tecno_aprendiz');

  // Montagem do texto combinando originFrameText e coreEventText no momento da exibição
  const combinedStoryText = `${t(memory.originFrameText)}\n\n${t(memory.coreEventText)}`;

  // Typewriter effect for core text
  useEffect(() => {
    let index = 0;
    setIsTypingComplete(false);
    setDisplayedCoreText('');

    const interval = setInterval(() => {
      if (index <= combinedStoryText.length) {
        setDisplayedCoreText(combinedStoryText.slice(0, index));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 15); // Snappy, clean typing speed

    return () => clearInterval(interval);
  }, [combinedStoryText]);

  // Auto-advance timer
  useEffect(() => {
    if (autoAdvanceTime <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setAutoAdvanceTime(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoAdvanceTime, onComplete]);

  const handleSkipTyping = () => {
    if (!isTypingComplete) {
      setDisplayedCoreText(combinedStoryText);
      setIsTypingComplete(true);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-purple-400 font-mono z-50 flex flex-col items-center justify-center p-4 overflow-y-auto select-none">
      {/* Scanline & Vignette overlays matching CRT terminal aesthetic */}
      <div className="absolute inset-0 pointer-events-none crt-scanlines z-30" />
      <div className="absolute inset-0 pointer-events-none crt-vignette z-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none z-20" />

      <motion.div 
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 1.02 }}
         transition={{ duration: 0.5 }}
         className="max-w-2xl w-full bg-slate-950/95 border border-purple-500/30 rounded-lg p-6 md:p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)] relative z-10 space-y-6"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">{t("SYS.LINK // SEMENTE DE CONSCIÊNCIA DECRIPTADA")}</span>
          </div>
          <span className="text-[10px] text-purple-500/60 font-bold hidden sm:inline">{t("NÓ REVELADO")}: {memory.key}</span>
        </div>

        {/* Title */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-purple-200">
              {t(memory.title)}
            </h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-purple-500 to-transparent"></div>
          </div>
          <TTSButton
            text={`${t(memory.title)}. ${combinedStoryText}`}
            id={`memory-screen-${memory.key}`}
            variant="purple"
            size="sm"
            showDetails={true}
          />
        </div>

        {/* Step 1: Origin Frame (Metadata) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-purple-950/10 border border-purple-900/30 p-4 rounded text-xs text-purple-300 leading-relaxed font-mono relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <Terminal className="w-24 h-24 text-purple-400" />
          </div>
          <div className="text-purple-500 text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full inline-block animate-ping"></span>
            {t("DADOS HISTÓRICOS CRIPTOGRAFADOS RECONSTITUÍDOS")}
          </div>
          <p className="whitespace-pre-line text-purple-300/90 font-mono italic">
            {t(memory.originFrame)}
          </p>
        </motion.div>

        {/* Step 2: Core Text (Typewriter Output) */}
        <div className="bg-slate-900/40 border border-purple-950/40 p-5 rounded-md min-h-[160px] flex flex-col justify-between">
          <div className="text-sm text-slate-200 leading-relaxed font-sans text-justify space-y-3">
            <p className="whitespace-pre-wrap">
              {displayedCoreText}
              {!isTypingComplete && (
                <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5" />
              )}
            </p>
          </div>

          {/* Skip message or complete status */}
          <div className="mt-4 pt-4 border-t border-purple-900/10 flex items-center justify-between text-[10px] text-purple-500/60">
            <span>{t("VELOCIDADE DE DESCRIPTOGRAFIA: 15.4 KB/S")}</span>
            {!isTypingComplete ? (
              <span className="animate-pulse">{t("CLIQUE EM QUALQUER LUGAR OU NO BOTÃO PARA ACELERAR")}</span>
            ) : (
              <span className="text-purple-400 font-bold">{t("✓ INTEGRALIDADE NEURAL ESTABILIZADA")}</span>
            )}
          </div>
        </div>

        {/* Action Controls & Countdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-purple-500/80">
            <Clock className="w-3.5 h-3.5" />
            <span>{t("Retornando em")} <span className="text-purple-300 font-bold font-mono">{autoAdvanceTime}s</span></span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {!isTypingComplete && (
              <button
                onClick={handleSkipTyping}
                className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 border border-purple-500/20 text-purple-400 hover:text-purple-300 hover:border-purple-500/40 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer text-center"
              >
                {t("Pular Texto")}
              </button>
            )}
            <button
              onClick={onComplete}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-950 border border-purple-500 text-purple-200 hover:bg-purple-900 font-bold uppercase tracking-widest text-xs rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] text-center"
            >
              <span>{t("Continuar")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
