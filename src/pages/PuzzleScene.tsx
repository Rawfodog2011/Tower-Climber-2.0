import React from 'react';
import { useTranslation } from '../core/engine/translation';




import { useExplorationStore } from '../store/useExplorationStore';
import { useExploration } from '../hooks/useExploration';

export const PuzzleScene: React.FC = () => {
  const { activePuzzle } = useExplorationStore();
  const { handlePuzzleSelect, handleSkipPuzzle } = useExploration();

  const { t } = useTranslation();

  return (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
            <div className="system-panel max-w-2xl w-full flex flex-col overflow-hidden">
              <div className="border-b border-rose-500/20 bg-rose-950/40 px-6 py-4 flex justify-between items-center">
                <span className="font-bold text-rose-50 tracking-widest uppercase text-lg">{t("Diagnóstico de Maquinário Instável")}</span>
                <span className="text-rose-400 font-mono text-sm border border-rose-900/50 px-2 py-1 rounded shadow-[0_0_10px_rgba(244,63,94,0.2)] animate-pulse">{t("ALERTA DE SISTEMA")}</span>
              </div>
              <div className="p-8 flex-1 flex flex-col items-center">
                <div className="w-full bg-slate-950/80 border border-cyan-500/30 rounded p-6 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] mb-8 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-rose-500 to-cyan-500 opacity-50"></div>
                  
                  <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-widest mb-4 border-b border-cyan-900 pb-2">{t("Sensores de Telemetria")}</h3>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-900 border border-slate-700 p-4 flex flex-col items-center justify-center rounded group hover:border-cyan-500 transition-colors">
                      <span className="text-slate-400 font-mono text-xs mb-1">{t("VIBRAÇÃO DO NÚCLEO")}</span>
                      <span className={`font-mono text-3xl font-bold ${activePuzzle.vibrationHz > 80 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                        {activePuzzle.vibrationHz} <span className="text-sm">Hz</span>
                      </span>
                    </div>
                    <div className="bg-slate-900 border border-slate-700 p-4 flex flex-col items-center justify-center rounded group hover:border-cyan-500 transition-colors">
                      <span className="text-slate-400 font-mono text-xs mb-1">{t("TEMPERATURA")}</span>
                      <span className={`font-mono text-3xl font-bold ${activePuzzle.temperatureC > 100 ? 'text-orange-500 animate-pulse' : 'text-blue-400'}`}>
                        {activePuzzle.temperatureC} <span className="text-sm">ºC</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded">
                    <p className="text-slate-300 font-mono text-xs leading-relaxed">
                      <span className="text-cyan-400 font-bold">{t("> MANUAL DE EMERGÊNCIA:")}</span><br/>
                      - {t("- Se VIBRAÇÃO > 80Hz E TEMPERATURA > 100ºC:")} <span className="text-rose-400 font-bold">{t("Usar Porta 2")}</span> ({t("Desvio de Calor")})<br/>
                      - {t("- Senão, se VIBRAÇÃO < 50Hz:")} <span className="text-emerald-400 font-bold">{t("Usar Porta 1")}</span> ({t("Injeção Direta")})<br/>
                      - {t("- Caso contrário:")} <span className="text-amber-400 font-bold">{t("Usar Porta 3")}</span> ({t("Fluxo Padrão")})
                    </p>
                  </div>
                </div>
                
                <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-center">{t("Selecione a Porta de Conexão:")}</h4>
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex gap-4 w-full">
                    {[1, 2, 3].map((port) => (
                      <button
                        key={port}
                        onClick={() => handlePuzzleSelect(port)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-cyan-400 text-white font-bold font-mono text-xl py-6 rounded transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] flex flex-col items-center justify-center gap-2"
                      >
                        <span className="text-slate-500 text-xs tracking-widest">{t("PORTA")}</span>
                        <span className="text-cyan-400">{port}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSkipPuzzle}
                    className="w-full bg-slate-950/80 hover:bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 font-bold font-mono text-xs uppercase tracking-widest py-3 rounded transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] mt-2"
                  >
                    {t("Ignorar Terminal")}
                  </button>
                </div>
              </div>
            </div>
          </div>
  );
};
