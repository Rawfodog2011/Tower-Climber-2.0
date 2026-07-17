import React from 'react';
import { Player } from '../types';
import { Activity, Flame, Crosshair, Cpu } from 'lucide-react';
import { useTranslation } from '../core/engine/translation';

interface Props {
  player: Player;
  selectedFloor: number;
  setSelectedFloor: (floor: number) => void;
  handleStartDive: (floor: number) => void;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
}

// Helper to get Sector info
function getSectorForFloor(floor: number) {
  const idx = Math.floor((floor - 1) / 10) % 3;
  if (idx === 0) return { name: 'Refinaria Tóxica', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', rgb: '34, 197, 94', icon: Activity };
  if (idx === 1) return { name: 'Data-Core Congelado', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', rgb: '59, 130, 246', icon: Activity };
  return { name: 'Fornalha de Plasma', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', rgb: '239, 68, 68', icon: Flame };
}

export const ExpeditionPanel: React.FC<Props> = ({ player, selectedFloor, setSelectedFloor, handleStartDive, setPlayer }) => {
  const sector = getSectorForFloor(selectedFloor);
  const SectorIcon = sector.icon;
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] max-w-4xl mx-auto animate-fade-in">
      
      {/* Floor Selection Panel */}
      <div className="system-panel overflow-hidden relative group w-full lg:w-2/3 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        <div className="tech-panel-header px-6 py-4 border-b border-orange-500/30 bg-orange-950/20">
          <span className="font-bold text-orange-400 tracking-widest uppercase text-base flex items-center gap-2">
            <Crosshair className="w-5 h-5" />
            {t("Centro de Comando da Expedição")}
          </span>
        </div>
        
        <div className="p-8 space-y-6 relative z-10">
          
          <div className="bg-slate-950/70 p-6 rounded-xl border border-slate-800 relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-10 -mt-10 ${sector.bg}`} />
              
             <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-6 font-mono text-center">
                {t("Calibração de Rota")}
             </label>
             
             <div className="flex justify-center mb-8">
                <div className="text-center space-y-2">
                  <span className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
                    <SectorIcon className={`w-4 h-4 ${sector.color}`} /> 
                    {t("SETOR")}: <span className={`${sector.color} font-bold`}>{t(sector.name)}</span>
                  </span>
                  
                  <div className="py-2">
                    <span className="block text-xs font-mono text-orange-500/70 mb-1">{t("THREAT LEVEL")}</span>
                    <span className="text-orange-400 font-bold font-mono drop-shadow-[0_0_15px_rgba(251,146,60,0.8)] text-5xl tracking-tighter">
                      {t("FLOOR")} {selectedFloor.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
              
             <div className="px-4">
               <input 
                  type="range" 
                  min="1" 
                  max={player.highestFloorUnlocked} 
                  value={selectedFloor} 
                  onChange={(e) => {
                    const floor = Number(e.target.value);
                    setSelectedFloor(floor);
                    if (floor >= player.highestFloorUnlocked) {
                      setPlayer(p => ({ ...p, isFarmActive: false }));
                    }
                  }}
                  className="w-full accent-orange-500 hover:accent-orange-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
               />
               <div className="flex justify-between text-xs font-mono text-slate-500 mt-4 px-1">
                 <span>{t("MIN")}: 01</span>
                 <span>{t("MAX")}: {player.highestFloorUnlocked.toString().padStart(2, '0')}</span>
               </div>
             </div>
          </div>

          {/* Botão de Farm */}
          <div className="flex flex-col items-center justify-center border border-slate-800 bg-slate-950/40 p-5 rounded-xl">
            <div className="flex items-center justify-between w-full gap-4">
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> {t("RECURSO: MODO FARM (AUTO)")}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 max-w-[280px] md:max-w-md">
                  {t("Reinicia o combate automaticamente ao vencer/perder quando a Auto-Batalha estiver ativada. Impede eventos aleatórios.")}
                </span>
              </div>
              
              {selectedFloor < player.highestFloorUnlocked ? (
                <button
                  onClick={() => setPlayer(p => ({ ...p, isFarmActive: !p.isFarmActive }))}
                  className={`px-4 py-2 rounded-lg font-bold font-mono text-xs uppercase tracking-wider transition-all border cursor-pointer shrink-0 ${
                    player.isFarmActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {player.isFarmActive ? t('ATIVADO') : t('DESATIVADO')}
                </button>
              ) : (
                <span className="text-[10px] font-mono font-bold text-amber-500/70 border border-amber-500/20 bg-amber-950/20 px-2 py-1.5 rounded uppercase shrink-0">
                  {t("BLOQUEADO")}
                </span>
              )}
            </div>
            
            {selectedFloor >= player.highestFloorUnlocked && (
              <p className="text-[10px] text-amber-500/70 font-mono mt-3 w-full text-left">
                * {t("Conclua o Andar")} {selectedFloor} {t("para liberar a rotina de Farm.")}
              </p>
            )}
          </div>
          
          <button 
             onClick={() => handleStartDive(selectedFloor)}
             className="w-full bg-orange-600/20 hover:bg-orange-600/30 border-2 border-orange-500/50 text-orange-400 hover:text-orange-300 font-bold py-6 rounded-xl uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_35px_rgba(251,146,60,0.5)] cursor-pointer animate-pulse active:scale-95 flex items-center justify-center gap-3 text-lg"
          >
            <Flame className="w-6 h-6" />
            {selectedFloor === 1 ? t("Adentrar a Torre") : t("Subir ao próximo andar")}
          </button>
        </div>
      </div>
    </div>
  );
};
