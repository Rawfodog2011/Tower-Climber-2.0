import React from 'react';
import { Player } from '../types';
import { AudioManager } from '../core/engine/audio';
import { useTranslation } from '../core/engine/translation';
import { saveGame } from '../core/engine/saveGame';

import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useExplorationStore } from '../store/useExplorationStore';
import { useExploration } from '../hooks/useExploration';
import { AssetDictionary } from '../core/assets';

export const EnvIntroScene: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();
  const { introSector, setIntroSector, introStep, setIntroStep, setScene } = useGameUIStore();
  const { pendingDiveParams, setPendingDiveParams } = useExplorationStore();
  const { proceedWithDive } = useExploration();

  const { t } = useTranslation();

  const Background = introSector?.hazard ? AssetDictionary.backgrounds[introSector.hazard] || AssetDictionary.backgrounds.none : AssetDictionary.backgrounds.none;

  return (
          <div className="flex flex-col items-center justify-center w-full min-h-screen relative overflow-hidden bg-slate-950 p-6">
            <div className="absolute inset-0 z-0 opacity-40">
              <Background />
            </div>
            
            <div className="relative z-10 w-full max-w-4xl bg-slate-950/80 backdrop-blur-sm border border-slate-900 shadow-2xl p-6 rounded-lg min-h-[550px] flex flex-col items-center justify-center">
            {introStep === 'danger' ? (
              <div 
                onClick={() => {
                  setIntroStep('details');
                  AudioManager.playSfx('ui.sector_reveal');
                }}
                className="flex flex-col items-center justify-center text-center cursor-pointer select-none space-y-6 w-full py-16 animate-pulse"
              >
                {/* Danger Stripes */}
                <div className="w-full flex flex-col space-y-2">
                  <div className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                  <div className="bg-red-950/30 border-y border-red-500/40 py-6 w-full flex items-center justify-center">
                    <span className="text-red-500 font-mono text-5xl md:text-7xl font-black uppercase tracking-[0.25em] drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                      {t("DANGER")}
                    </span>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                </div>
                
                <div className="flex items-center gap-2 text-red-400 font-mono text-sm uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  {t("AMBIENTE ANÔMALO DETECTADO")}
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                </div>
                
                <p className="text-slate-500 font-mono text-xs uppercase tracking-wider animate-bounce mt-4">
                  {t("Clique para pular transmissão >>")}
                </p>
              </div>
            ) : (
              <div className="w-full max-w-2xl flex flex-col items-center justify-center py-8 space-y-8 animate-fade-in">
                {/* Header with color theme */}
                <div className="text-center space-y-2">
                  <div className={`text-xs font-mono uppercase tracking-[0.3em] ${
                    introSector.colorTheme === 'green' ? 'text-green-400' : introSector.colorTheme === 'blue' ? 'text-blue-400' : 'text-orange-400'
                  }`}>
                    {t("SISTEMA DE MAPEAMENTO DE SETOR")}
                  </div>
                  
                  <h1 className={`text-3xl md:text-5xl font-black uppercase tracking-wider ${
                    introSector.colorTheme === 'green' ? 'text-green-300 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
                    introSector.colorTheme === 'blue' ? 'text-blue-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
                    'text-orange-300 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                  }`}>
                    {t(introSector.name)}
                  </h1>
                </div>

                {/* Main terminal dossier */}
                <div className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                  {/* Decorative corner lines */}
                  <div className={`absolute top-0 left-0 w-8 h-1 ${
                    introSector.colorTheme === 'green' ? 'bg-green-500' : introSector.colorTheme === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                  }`} />
                  <div className={`absolute top-0 left-0 w-1 h-8 ${
                    introSector.colorTheme === 'green' ? 'bg-green-500' : introSector.colorTheme === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                  }`} />
                  
                  {/* Narrative/Flavor text */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{t("RELATÓRIO DE RECONHECIMENTO")}</span>
                    <p className="text-slate-200 font-serif italic text-base leading-relaxed md:text-lg">
                      "{t(introSector.flavorText)}"
                    </p>
                  </div>
                  
                  {/* Separator */}
                  <div className="border-t border-slate-800" />
                  
                  {/* Environmental Hazard Alert Panel */}
                  <div className={`p-4 rounded border ${
                    introSector.colorTheme === 'green' ? 'bg-green-950/20 border-green-500/30' :
                    introSector.colorTheme === 'blue' ? 'bg-blue-950/20 border-blue-500/30' :
                    'bg-orange-950/20 border-orange-500/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-amber-500">⚠️</span>
                      <span className="text-amber-500 font-mono text-xs font-black uppercase tracking-widest">{t("ALERTA DE ANOMALIA AMBIENTAL")}</span>
                    </div>
                    <p className="text-slate-300 font-mono text-sm leading-relaxed">
                      {t(introSector.description)}
                    </p>
                  </div>
                </div>

                {/* Confirm Action Button */}
                <button
                  onClick={() => {
                    const nextVisited = [...(player.visitedSectors || []), introSector.hazard];
                    const nextPlayer = { ...player, visitedSectors: nextVisited };
                    setPlayer(nextPlayer);
                    saveGame(nextPlayer);
                    
                    setIntroSector(null);
                    if (pendingDiveParams) {
                      proceedWithDive(pendingDiveParams.floor, pendingDiveParams.forceCombat);
                      setPendingDiveParams(null);
                    } else {
                      setScene('hub');
                    }
                  }}
                  className={`w-full max-w-md py-4 px-8 rounded font-black uppercase tracking-[0.2em] text-sm cursor-pointer transition-all duration-300 border ${
                    introSector.colorTheme === 'green' ? 'bg-green-950/50 hover:bg-green-900/60 border-green-500/50 text-green-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]' :
                    introSector.colorTheme === 'blue' ? 'bg-blue-950/50 hover:bg-blue-900/60 border-blue-500/50 text-blue-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]' :
                    'bg-orange-950/50 hover:bg-orange-900/60 border-orange-500/50 text-orange-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                  }`}
                >
                  {t("INICIAR DIRETRIZES DE INCURSÃO")}
                </button>
              </div>
            )}
            </div>
          </div>
  );
};
