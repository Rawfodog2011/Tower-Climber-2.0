import React, { useState } from 'react';
import { Settings, X, LogOut, Volume2, VolumeX } from 'lucide-react';
import { useTranslation, Language } from '../core/engine/translation';
import { useAudio } from '../core/engine/useAudio';
import { SystemVoiceSelector } from './SystemVoiceSelector';
import { SaveManager } from './SaveManager';
import { useGameUIStore } from '../store/useGameUIStore';

interface HubSettingsModalProps {
  onClose: () => void;
}

export const HubSettingsModal: React.FC<HubSettingsModalProps> = ({ onClose }) => {
  const { t, language: currentLanguage, setLanguage: onLanguageChange } = useTranslation();
  const { setScene } = useGameUIStore();
  const { sfxVolume, setSfxVolume, musicVolume, setMusicVolume, muted, setMuted, init: initAudio, playSfx } = useAudio();
  const glitchProgress = 0;

  const handleInteraction = (action: () => void) => {
    action();
    playSfx('ui.click');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-cyan-900/50 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col shadow-[0_0_30px_rgba(34,211,238,0.15)] relative">
        <div className="sticky top-0 bg-slate-900/90 backdrop-blur p-4 border-b border-cyan-900/50 flex justify-between items-center z-10">
          <h2 className="text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <Settings className="w-5 h-5" /> {t("Configurações")}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-cyan-400 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4 text-sm text-slate-300">
             {/* Language selection */}
             <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex justify-between items-center">
               <span>{t("Idioma / Language")}</span>
               <div className="flex gap-4">
                 {/* Brazil / Portugal Flag */}
                 <button
                   type="button"
                   onClick={() => handleInteraction(() => onLanguageChange('pt'))}
                   className={`relative w-14 h-9 rounded overflow-hidden border transition-all cursor-pointer flex-shrink-0 group hover:scale-105 active:scale-95 ${
                     currentLanguage === 'pt' 
                       ? 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] ring-1 ring-cyan-400'
                       : 'border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-90'
                   }`}
                   title="Português (BR/PT)"
                 >
                   <div className="absolute inset-0 bg-gradient-to-br from-[#009b3a] from-50% to-[#ff0000] to-50%" />
                   <div className="absolute top-[5px] left-[5px] w-[14px] h-[10px] bg-[#fedd00]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                     <div className="absolute top-[2px] left-[3px] w-[4px] h-[4px] bg-[#002776] rounded-full" />
                   </div>
                   <div className="absolute bottom-[4px] right-[5px] w-[10px] h-[10px] bg-[#006600] rounded-full border border-[#ffcc00] flex items-center justify-center">
                     <div className="w-[4px] h-[4px] bg-[#ff0000] rounded-full" />
                   </div>
                 </button>

                 {/* USA / UK Flag */}
                 <button
                   type="button"
                   onClick={() => handleInteraction(() => onLanguageChange('en'))}
                   className={`relative w-14 h-9 rounded overflow-hidden border transition-all cursor-pointer flex-shrink-0 group hover:scale-105 active:scale-95 ${
                     currentLanguage === 'en' 
                       ? 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] ring-1 ring-cyan-400'
                       : 'border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-90'
                   }`}
                   title="English (US/UK)"
                 >
                   <div className="absolute inset-0 bg-gradient-to-br from-[#b22234] from-50% to-[#012169] to-50%" />
                   <div className="absolute top-[4px] left-[4px] w-[12px] h-[10px] bg-[#3c3b6e]">
                     <div className="absolute top-[2px] left-[2px] w-[2px] h-[2px] bg-white rounded-full" />
                     <div className="absolute top-[5px] left-[6px] w-[2px] h-[2px] bg-white rounded-full" />
                   </div>
                   <div className="absolute bottom-[3px] right-[3px] w-[14px] h-[14px] border-t-2 border-l-2 border-white">
                     <div className="absolute inset-0 border-t-2 border-l-2 border-[#c8102e]" />
                   </div>
                 </button>
               </div>
             </div>

             <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                  className="w-full sm:w-48 h-1 rounded-lg appearance-none cursor-pointer accent-cyan-400 bg-slate-800"
                />
              </div>

              <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                  className="w-full sm:w-48 h-1 rounded-lg appearance-none cursor-pointer accent-cyan-400 bg-slate-800"
                />
              </div>

              <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex justify-between items-center">
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
                      ? 'bg-cyan-950/40 border-cyan-800 text-cyan-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
                <SystemVoiceSelector />
              </div>
          </div>
          
          <SaveManager glitchProgress={glitchProgress} />

          <button
            onClick={() => {
              handleInteraction(() => {
                setScene('main_menu');
              });
            }}
            className="mt-4 border font-bold py-3 px-6 rounded uppercase tracking-widest transition-all bg-red-950/40 hover:bg-red-900/60 border-red-800/60 hover:border-red-500 text-red-300 hover:text-rose-100 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
          >
            <LogOut className="w-5 h-5" /> {t("Voltar ao Menu Principal")}
          </button>
        </div>
      </div>
    </div>
  );
};
