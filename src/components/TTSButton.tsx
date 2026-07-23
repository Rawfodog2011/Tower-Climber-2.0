import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { tts, TTSState } from '../core/engine/tts';
import { useTranslation } from '../core/engine/translation';

interface TTSButtonProps {
  text: string;
  id?: string;
  label?: string;
  variant?: 'cyan' | 'emerald' | 'purple' | 'red' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  autoPlay?: boolean;
}

export const TTSButton: React.FC<TTSButtonProps> = ({
  text,
  id,
  label,
  variant = 'cyan',
  size = 'md',
  className = '',
  autoPlay = false
}) => {
  const [ttsState, setTtsState] = useState<TTSState>(tts.getState());
  const { t, language } = useTranslation();
  const buttonId = id || `tts-${text.slice(0, 16).replace(/\s+/g, '-')}`;

  useEffect(() => {
    const unsubscribe = tts.subscribe((state) => {
      setTtsState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // AutoPlay effect on mount if enabled
  useEffect(() => {
    if (autoPlay && text && tts.isSupported()) {
      const timer = setTimeout(() => {
        tts.speak(text, buttonId, language);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, text, buttonId, language]);

  if (!tts.isSupported()) {
    return null;
  }

  const isCurrentSpeaking = ttsState.speaking && ttsState.speakingId === buttonId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentSpeaking) {
      tts.stop();
    } else {
      tts.speak(text, buttonId, language);
    }
  };

  // Color variants
  const colorStyles = {
    cyan: isCurrentSpeaking
      ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse'
      : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-900/40 hover:text-cyan-200',
    emerald: isCurrentSpeaking
      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.5)] animate-pulse'
      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-200',
    purple: isCurrentSpeaking
      ? 'bg-purple-950/90 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-pulse'
      : 'bg-purple-950/40 border-purple-500/40 text-purple-400 hover:border-purple-400 hover:bg-purple-900/40 hover:text-purple-200',
    red: isCurrentSpeaking
      ? 'bg-red-950/90 border-red-400 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
      : 'bg-red-950/40 border-red-500/40 text-red-400 hover:border-red-400 hover:bg-red-900/40 hover:text-red-200',
    slate: isCurrentSpeaking
      ? 'bg-slate-800 border-slate-300 text-slate-100 shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse'
      : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-1 text-[10px] gap-1.5 rounded',
    md: 'px-3 py-1.5 text-xs gap-2 rounded-md',
    lg: 'px-4 py-2 text-sm gap-2.5 rounded-lg'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center font-mono font-bold tracking-wider uppercase border transition-all duration-200 cursor-pointer select-none ${colorStyles[variant]} ${sizeStyles[size]} ${className}`}
      title={`${isCurrentSpeaking ? t("Parar Narração") : t("Ouvir Narração de História")}`}
    >
      {isCurrentSpeaking ? (
        <>
          <VolumeX className={`${iconSizes[size]} animate-spin`} />
          <span>{label || t("Parar Voice-over")}</span>
          <Music className={`${iconSizes[size]} text-purple-400 animate-pulse ml-0.5`} />
          <span className="flex items-center gap-0.5 ml-0.5">
            <span className="w-1 h-2 bg-current animate-bounce [animation-delay:0ms]"></span>
            <span className="w-1 h-3 bg-current animate-bounce [animation-delay:150ms]"></span>
            <span className="w-1 h-1.5 bg-current animate-bounce [animation-delay:300ms]"></span>
          </span>
        </>
      ) : (
        <>
          <Volume2 className={iconSizes[size]} />
          <span>{label || t("Ouvir História")}</span>
          <Music className={`${iconSizes[size]} opacity-60 ml-0.5`} />
        </>
      )}
    </button>
  );
};

