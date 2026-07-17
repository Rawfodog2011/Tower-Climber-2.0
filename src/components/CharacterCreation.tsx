import React, { useState } from 'react';
import { ORIGINS, Origin } from '../core/entities/origins';
import { Shield, Zap, Sparkles, Target, Cpu, User, ArrowRight, Terminal } from 'lucide-react';
import { loadTimelineCodex } from '../core/engine/timelineCodex';
import { useTranslation } from '../core/engine/translation';

interface CharacterCreationProps {
  onComplete: (originId: string) => void;
}

export function CharacterCreation({ onComplete }: CharacterCreationProps) {
  const [selectedId, setSelectedId] = useState<string>('ciborgue_foragido');
  const [codex] = useState(() => loadTimelineCodex());
  const selectedOrigin = ORIGINS[selectedId];
  const { t } = useTranslation();

  const handleConfirm = () => {
    onComplete(selectedId);
  };

  const getStatColor = (val: number) => {
    if (val > 0) return 'text-emerald-400 font-bold';
    if (val < 0) return 'text-rose-400 font-bold';
    return 'text-slate-400';
  };

  const getOriginIcon = (id: string) => {
    switch (id) {
      case 'ciborgue_foragido':
        return <Shield className="w-6 h-6 text-cyan-400" />;
      case 'nomade_silicio':
        return <Zap className="w-6 h-6 text-amber-400" />;
      case 'quimico_sintetico':
        return <Sparkles className="w-6 h-6 text-emerald-400" />;
      case 'mercenario_elite':
        return <Target className="w-6 h-6 text-rose-400" />;
      default:
        return <Cpu className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 text-slate-100 font-sans z-50 flex flex-col overflow-y-auto">
      {/* Background Matrix/Grid Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(34, 211, 238, 0.4) 2px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 pointer-events-none"></div>

      {/* Outer wrapper */}
      <div className="max-w-6xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col flex-grow justify-center relative z-10">
        
        {/* Top Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-950/50 border border-cyan-500/30 px-3 py-1.5 rounded-full text-xs text-cyan-400 font-mono tracking-widest uppercase mb-4 animate-pulse">
            <Terminal className="w-3.5 h-3.5" /> {t("DIRETÓRIO DE REGISTRO DO EXPLORADOR")}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 tracking-tight">
            {t("Selecione sua Origem")}
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl mx-auto font-mono">
            {t("Seu código genético, implantes de hardware e background determinarão seus atributos de inicialização e diretivas únicas na subida do Pináculo.")}
          </p>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Origins List */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">
              {t("PERFIS DISPONÍVEIS")}
            </h3>
            {Object.values(ORIGINS)
              .filter((origin) => origin.id !== 'nucleo_matriz_origin' || codex.secretClassUnlocked)
              .map((origin) => {
                const isSelected = selectedId === origin.id;
                const isCompleted = !!codex.origins[origin.id]?.completed;
                const isSecret = origin.id === 'nucleo_matriz_origin';
                return (
                  <button
                    key={origin.id}
                    onClick={() => setSelectedId(origin.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-300 relative overflow-hidden group flex items-start gap-4 ${
                      isSecret
                        ? isSelected
                          ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                          : 'bg-slate-950/80 border-red-950/60 hover:border-red-700 hover:bg-red-950/20'
                        : isSelected 
                          ? 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Selected Indicator Bar */}
                    {isSelected && (
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isSecret ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                    )}

                    <div className={`p-3 rounded-md border ${
                      isSelected 
                        ? isSecret ? 'bg-red-950/50 border-red-500/30' : 'bg-cyan-950/50 border-cyan-500/30' 
                        : isSecret ? 'bg-black border-red-900/40' : 'bg-slate-950 border-slate-800'
                    }`}>
                      {getOriginIcon(origin.id)}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`font-bold text-base transition-colors ${
                          isSelected 
                            ? isSecret ? 'text-red-400 font-mono' : 'text-cyan-400' 
                            : isSecret ? 'text-red-500/80 group-hover:text-red-400 font-mono' : 'text-slate-200 group-hover:text-cyan-300'
                        }`}>
                          {t(origin.name)} {isSecret && <span className="text-[10px] text-red-500 font-bold tracking-widest uppercase ml-1 animate-pulse">[{t("REVERSO")}]</span>}
                        </h4>
                        {isCompleted && (
                          <span className="text-[9px] shrink-0 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider animate-pulse">
                            ● {t("CONCLUÍDO")}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-mono mt-0.5 ${isSecret ? 'text-red-400/60' : 'text-slate-400'}`}>{t(origin.roleName)}</p>
                      <p className="text-xs text-slate-400/80 mt-2 line-clamp-1">{t(origin.description)}</p>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Right Column: Origin Detail Screen */}
          <div className="lg:col-span-7 flex flex-col">
            {(() => {
              const isSelectedSecret = selectedOrigin.id === 'nucleo_matriz_origin';
              return (
                <div className={`system-panel bg-slate-900/30 border rounded-xl p-6 md:p-8 flex-grow flex flex-col justify-between relative overflow-hidden ${
                  isSelectedSecret ? 'border-red-950/80 shadow-[0_0_20px_rgba(239,68,68,0.05)]' : 'border-slate-800'
                }`}>
                  {/* Corner decorative borders */}
                  <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr ${isSelectedSecret ? 'border-red-500/30' : 'border-cyan-500/30'}`}></div>
                  <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl ${isSelectedSecret ? 'border-red-500/30' : 'border-cyan-500/30'}`}></div>

                  <div>
                    {/* Meta details */}
                    <div className={`flex items-center justify-between border-b pb-4 mb-6 ${isSelectedSecret ? 'border-red-950/60' : 'border-slate-800'}`}>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className={`text-2xl font-bold ${isSelectedSecret ? 'text-red-500 font-mono tracking-wider' : 'text-cyan-400'}`}>{t(selectedOrigin.name)}</h2>
                          {!!codex.origins[selectedOrigin.id]?.completed && (
                            <span className="text-[10px] bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                              ● {t("CONCLUÍDO")}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-mono uppercase tracking-widest ${isSelectedSecret ? 'text-red-500/60' : 'text-slate-500'}`}>{t(selectedOrigin.roleName)}</span>
                      </div>
                      <div className={`p-2.5 rounded-lg border ${isSelectedSecret ? 'bg-red-950/20 border-red-900/40' : 'bg-slate-950 border-slate-800'}`}>
                        {getOriginIcon(selectedOrigin.id)}
                      </div>
                    </div>

                    {/* Lore Narrative */}
                    <div className="mb-6">
                      <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <User className={`w-3.5 h-3.5 ${isSelectedSecret ? 'text-red-500' : 'text-cyan-500'}`} /> {t("HISTÓRIA & DIRETIVAS")}
                      </h4>
                      <p className={`text-slate-300 text-sm leading-relaxed font-sans p-4 rounded-lg italic border ${
                        isSelectedSecret ? 'bg-red-950/5 border-red-950/30 text-red-100/95 font-mono' : 'bg-slate-950/40 border-slate-900'
                      }`}>
                        "{t(selectedOrigin.lore)}"
                      </p>
                    </div>

                    {/* Modificadores de Atributos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">
                          {t("AJUSTES DE STATUS BASE")}
                        </h4>
                        <div className={`bg-slate-950/30 border rounded-lg p-4 space-y-2 ${isSelectedSecret ? 'border-red-950/40' : 'border-slate-900'}`}>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">{t("Vida Inicial (HP)")}</span>
                            <span className={getStatColor(selectedOrigin.statModifiers.hp || 0)}>
                              {selectedOrigin.statModifiers.hp ? (selectedOrigin.statModifiers.hp > 0 ? `+${selectedOrigin.statModifiers.hp}` : selectedOrigin.statModifiers.hp) : '0'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">{t("Energia de Rede (EP)")}</span>
                            <span className={getStatColor(selectedOrigin.statModifiers.mp || 0)}>
                              {selectedOrigin.statModifiers.mp ? (selectedOrigin.statModifiers.mp > 0 ? `+${selectedOrigin.statModifiers.mp}` : selectedOrigin.statModifiers.mp) : '0'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">{t("Poder de Ataque (ATK)")}</span>
                            <span className={getStatColor(selectedOrigin.statModifiers.atk || 0)}>
                              {selectedOrigin.statModifiers.atk ? (selectedOrigin.statModifiers.atk > 0 ? `+${selectedOrigin.statModifiers.atk}` : selectedOrigin.statModifiers.atk) : '0'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">{t("Defesa Integrada (DEF)")}</span>
                            <span className={getStatColor(selectedOrigin.statModifiers.def || 0)}>
                              {selectedOrigin.statModifiers.def ? (selectedOrigin.statModifiers.def > 0 ? `+${selectedOrigin.statModifiers.def}` : selectedOrigin.statModifiers.def) : '0'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">{t("Velocidade de Pulso (SPD)")}</span>
                            <span className={getStatColor(selectedOrigin.statModifiers.spd || 0)}>
                              {selectedOrigin.statModifiers.spd ? (selectedOrigin.statModifiers.spd > 0 ? `+${selectedOrigin.statModifiers.spd}` : selectedOrigin.statModifiers.spd) : '0'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Habilidade Racial / Traço Especial */}
                      <div>
                        <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">
                          {t("DISPOSITIVO / TRAÇO INERENTE")}
                        </h4>
                        <div className={`bg-gradient-to-br border rounded-lg p-4 h-full flex flex-col justify-between ${
                          isSelectedSecret 
                            ? 'from-red-950/20 to-slate-950 border-red-900/30' 
                            : 'from-cyan-950/20 to-slate-950 border-cyan-900/30'
                        }`}>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`p-1.5 rounded text-xs font-bold uppercase tracking-widest border ${
                                isSelectedSecret 
                                  ? 'bg-red-950 border-red-800/40 text-red-400' 
                                  : 'bg-cyan-950 border-cyan-800/40 text-cyan-400'
                              }`}>
                                {selectedOrigin.id === 'nomade_silicio' || selectedOrigin.id === 'ciborgue_foragido' || selectedOrigin.id === 'nucleo_matriz_origin' ? t('Passivo') : t('Ativo')}
                              </div>
                              <span className={`font-bold text-sm ${isSelectedSecret ? 'text-red-400 font-mono' : 'text-cyan-300'}`}>
                                {t(selectedOrigin.traitName)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed mt-2 font-mono">
                              {t(selectedOrigin.traitDescription)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirm / Initialize button */}
                  <div className={`mt-6 border-t pt-6 ${isSelectedSecret ? 'border-red-950/60' : 'border-slate-800/60'}`}>
                    <button
                      onClick={handleConfirm}
                      className={`w-full font-bold px-6 py-4 rounded-lg flex items-center justify-center gap-2 transition-all uppercase tracking-wider cursor-pointer ${
                        isSelectedSecret
                          ? 'bg-red-950/80 border border-red-500 text-red-200 hover:bg-red-900/80 shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_30px_rgba(239,68,68,0.45)]'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                      }`}
                    >
                      {isSelectedSecret ? t('CONECTAR AO BACKBONE DO PINÁCULO') : t('Sincronizar Arquivo de Origem e Iniciar Escalada')} <ArrowRight className={`w-5 h-5 ${isSelectedSecret ? 'text-red-400' : 'text-slate-950'}`} />
                    </button>
                  </div>

                </div>
              );
            })()}
          </div>

        </div>

      </div>
    </div>
  );
}
