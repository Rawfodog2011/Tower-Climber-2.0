import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Zap, Activity } from 'lucide-react';
import { useTranslation } from '../core/engine/translation';

interface Props {
  classId: string;
  className: string;
  narrativeText: string;
  onClose: () => void;
}

export const ClassEvolutionModal: React.FC<Props> = ({ classId, className, narrativeText, onClose }) => {
  const [typedText, setTypedText] = useState('');
  const [countdown, setCountdown] = useState(12);
  const { t } = useTranslation();

  // Progressive typing effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(prev => prev + t(narrativeText).charAt(index));
      index++;
      if (index >= t(narrativeText).length) {
        clearInterval(interval);
      }
    }, 15); // Fast, snappy typing

    return () => clearInterval(interval);
  }, [narrativeText, t]);

  // Auto-close countdown
  useEffect(() => {
    if (countdown <= 0) {
      onClose();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 font-mono">
      <style>{`
        @keyframes crt-flicker {
          0% { opacity: 0.96; }
          50% { opacity: 1; }
          100% { opacity: 0.97; }
        }
        .crt-bg {
          background: radial-gradient(circle, #021a0c 0%, #000000 100%);
        }
        .crt-scanlines {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%);
          background-size: 100% 4px;
        }
        .crt-vignette {
          background: radial-gradient(circle, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.9) 100%);
        }
        .crt-flicker {
          animation: crt-flicker 0.15s infinite;
        }
        .glitch-border {
          box-shadow: 0 0 15px rgba(52, 211, 153, 0.3), inset 0 0 15px rgba(52, 211, 153, 0.1);
        }
      `}</style>

      {/* CRT Monitor container */}
      <div className="relative w-full max-w-2xl border-2 border-emerald-500/50 rounded-xl overflow-hidden glitch-border bg-black">
        {/* CRT Overlay elements */}
        <div className="absolute inset-0 crt-bg pointer-events-none z-0"></div>
        <div className="absolute inset-0 crt-scanlines pointer-events-none z-10"></div>
        <div className="absolute inset-0 crt-vignette pointer-events-none z-10"></div>
        <div className="absolute inset-0 crt-flicker pointer-events-none z-10 opacity-30"></div>

        {/* Content Panel */}
        <div className="relative z-20 p-6 md:p-8 flex flex-col justify-between h-full min-h-[380px]">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-emerald-500/30 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase">
                {t("ATUALIZAÇÃO DE REGISTRO NEURAL")}
              </span>
            </div>
            <div className="text-[10px] text-emerald-500/60 font-mono tracking-widest">
              {t("STATUS: ESTÁVEL (SYS_LV_UP)")}
            </div>
          </div>

          {/* Central Body */}
          <div className="flex-1 flex flex-col justify-start space-y-4 font-mono">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30">
                <Cpu className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-500/50 block tracking-widest uppercase">
                  {t("NOVA DIRETRIZ SINÁPTICA")}
                </span>
                <span className="text-lg font-black text-emerald-300 uppercase tracking-widest">
                  {t(className)}
                </span>
              </div>
            </div>

            {/* Console output */}
            <div className="bg-emerald-950/10 border border-emerald-500/20 rounded p-4 h-48 overflow-y-auto custom-scrollbar relative">
              <div className="absolute top-2 right-2 text-[8px] text-emerald-500/30 tracking-widest select-none">
                SYS.EXE // EXEC
              </div>
              <p className="text-emerald-400 text-sm leading-relaxed whitespace-pre-line font-medium tracking-wide">
                {typedText}
                <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse"></span>
              </p>
            </div>
          </div>

          {/* Footer controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-emerald-500/20 pt-6 mt-6">
            <span className="text-[10px] text-emerald-500/60 uppercase tracking-widest text-center md:text-left">
              {t("Bypass automático em")} <span className="text-emerald-400 font-bold">{countdown}s</span> {t("ou pressione continuar")}
            </span>
            <button
              onClick={onClose}
              className="w-full md:w-auto px-6 py-2 bg-emerald-950/50 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold uppercase tracking-widest rounded transition-all cursor-pointer text-xs hover:shadow-[0_0_15px_rgba(52,211,153,0.4)] text-center"
            >
              {t("[ BYPASS // CONTINUAR ]")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
