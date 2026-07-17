import React, { useState } from 'react';
import { BookOpen, Lock, Unlock, BrainCircuit, Terminal, Search, HelpCircle, ChevronRight, Eye } from 'lucide-react';
import { Player } from '../types';
import { ORIGINS } from '../core/entities/origins';
import { CLASSES } from '../core/entities/classes';
import { getMemoryFragment } from '../core/entities/memories';
import { loadMemoryArchive } from '../core/engine/memoryArchive';
import { useTranslation } from '../core/engine/translation';

interface Props {
  player: Player;
}

export const MemoryArchivePanel: React.FC<Props> = ({ player }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOriginId, setSelectedOriginId] = useState<string>('ciborgue_foragido');
  const [selectedFragmentKey, setSelectedFragmentKey] = useState<string | null>(null);
  const { t } = useTranslation();

  // Load the permanent unlocked memories
  const archive = loadMemoryArchive();
  const unlockedKeys = archive.unlockedKeys;

  // Total possible combinations (excluding tecno_aprendiz as it's the base class and doesn't have an evolution memory)
  const evolutionClasses = Object.values(CLASSES).filter(cls => cls.id !== 'tecno_aprendiz');
  const origins = Object.values(ORIGINS);

  const totalPossible = origins.length * evolutionClasses.length;
  const totalUnlockedCount = unlockedKeys.length;

  const getTierName = (level: number) => {
    switch (level) {
      case 10: return t('Tier I — Nível 10');
      case 40: return t('Tier II — Nível 40');
      case 70: return t('Tier III — Nível 70');
      case 100: return t('Tier IV — Nível 100');
      default: return `${t('Nível')} ${level}`;
    }
  };

  // Helper to get memory display info
  const getFragmentDisplayInfo = (originId: string, classId: string) => {
    const key = `${originId}:${classId}`;
    const isUnlocked = unlockedKeys.includes(key);

    if (isUnlocked) {
      const fragment = getMemoryFragment(originId, classId);
      return {
        key,
        isUnlocked: true,
        title: fragment.title,
        originFrame: fragment.originFrame,
        coreText: fragment.coreText,
        className: CLASSES[classId]?.name ? t(CLASSES[classId].name) : t('Desconhecida')
      };
    } else {
      return {
        key,
        isUnlocked: false,
        title: t('[FRAGMENTO NÃO RECUPERADO]'),
        originFrame: '',
        coreText: '',
        className: '???'
      };
    }
  };

  // Selected fragment details (if unlocked)
  const selectedFragment = selectedFragmentKey 
    ? getMemoryFragment(selectedFragmentKey.split(':')[0], selectedFragmentKey.split(':')[1]) 
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-500" />
            {t("Arquivo de Memórias")}
          </h2>
          <p className="text-purple-200/60 font-mono text-sm uppercase tracking-wider">{t("Descriptografia Mental de Linhas Temporais Passadas")}</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-purple-950/20 border border-purple-800/30 px-3 py-1.5 rounded font-mono text-xs text-purple-300 shrink-0">
            {t("Sementes Decriptadas")}: <span className="text-purple-400 font-bold">{totalUnlockedCount}</span> / {totalPossible}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={t("Buscar memória liberta...")}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors font-mono"
            />
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar: Origins list */}
        <div className="lg:col-span-3 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">{t("Selecione a Origem")}</span>
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar">
            {origins.map(origin => {
              const originUnlockedCount = unlockedKeys.filter(k => k.startsWith(`${origin.id}:`)).length;
              const isSelected = selectedOriginId === origin.id;

              return (
                <button
                  key={origin.id}
                  onClick={() => {
                    setSelectedOriginId(origin.id);
                    setSelectedFragmentKey(null);
                  }}
                  className={`w-full text-left p-3 rounded border text-xs font-mono transition-all uppercase tracking-wider shrink-0 lg:shrink-1 flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-purple-950/30 border-purple-500 text-purple-200 font-bold shadow-[0_0_10px_rgba(168,85,247,0.1)]'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <span className="block truncate text-[11px] font-bold">{t(origin.name)}</span>
                    <span className="text-[9px] text-slate-500 truncate lowercase">{t(origin.roleName)}</span>
                  </div>
                  {originUnlockedCount > 0 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/40 border border-purple-800/30 text-purple-400 font-bold shrink-0">
                      {originUnlockedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Memory fragments list */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">{t("Sementes de Consciência")}</span>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {[10, 40, 70, 100].map(level => {
              const levelClasses = evolutionClasses.filter(c => c.requiredLevel === level);
              const fragments = levelClasses.map(c => getFragmentDisplayInfo(selectedOriginId, c.id));
              
              // Filter based on search term if active
              const filteredFragments = fragments.filter(f => {
                if (!searchTerm) return true;
                if (!f.isUnlocked) return false;
                return t(f.title).toLowerCase().includes(searchTerm.toLowerCase()) || 
                       t(f.coreText).toLowerCase().includes(searchTerm.toLowerCase());
              });

              if (filteredFragments.length === 0) return null;

              return (
                <div key={level} className="space-y-1.5">
                  <div className="text-[9px] font-bold text-purple-400/80 uppercase tracking-widest border-b border-purple-900/20 pb-1 mb-2">
                    {getTierName(level)}
                  </div>
                  <div className="space-y-1.5">
                    {filteredFragments.map(frag => {
                      const isSelected = selectedFragmentKey === frag.key;
                      return (
                        <button
                          key={frag.key}
                          onClick={() => {
                            if (frag.isUnlocked) {
                              setSelectedFragmentKey(frag.key);
                            }
                          }}
                          disabled={!frag.isUnlocked}
                          className={`w-full text-left p-2.5 rounded border text-xs font-mono transition-all flex items-center justify-between gap-3 ${
                            !frag.isUnlocked 
                              ? 'bg-slate-950/10 border-dashed border-slate-900 text-slate-600 cursor-not-allowed select-none'
                              : isSelected
                                ? 'bg-purple-950/20 border-purple-500/60 text-purple-300'
                                : 'bg-slate-950/40 border-slate-800/60 text-slate-300 hover:border-purple-900/40 hover:text-purple-400'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {frag.isUnlocked ? (
                              <Unlock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                            )}
                            <div className="truncate">
                              <span className="font-bold truncate block">{t(frag.title)}</span>
                              <span className="text-[9px] text-slate-500 block uppercase">
                                {frag.isUnlocked ? `${t("Classe")}: ${t(frag.className)}` : t('Bloqueado')}
                              </span>
                            </div>
                          </div>
                          {frag.isUnlocked && (
                            <Eye className="w-3.5 h-3.5 text-purple-500/50 group-hover:text-purple-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Memory Viewer */}
        <div className="lg:col-span-5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">{t("Visualizador Neural")}</span>
          
          <div className="system-panel p-5 min-h-[350px] flex flex-col justify-between border-slate-800/80 bg-slate-950/30 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-purple-500/5 via-transparent to-transparent opacity-50" />
            
            {selectedFragment ? (
              <div className="space-y-4 relative z-10 animate-[fadeIn_0.3s_ease-out]">
                {/* Visualizer header */}
                <div className="flex items-center justify-between border-b border-purple-950 pb-2">
                  <div className="flex items-center gap-1.5 text-xs text-purple-400 font-bold">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{t("REGISTRO RECONSTITUÍDO")}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono font-bold">{t("100% DE INTEGRALIDADE")}</span>
                </div>

                {/* Metadata frame */}
                <div className="bg-purple-950/10 border border-purple-900/20 p-3 rounded text-[11px] leading-relaxed text-purple-300 font-mono italic whitespace-pre-wrap">
                  {t(selectedFragment.originFrame)}
                </div>

                {/* Core description */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">{t("Núcleo do Evento")}</h4>
                  <div className="bg-slate-950/80 border border-slate-900 p-4 rounded text-xs text-justify text-slate-300 leading-relaxed max-h-[220px] overflow-y-auto whitespace-pre-wrap font-sans">
                    {t(selectedFragment.coreText)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative z-10 text-slate-500 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-700 animate-pulse" />
                <div className="space-y-1">
                  <p className="font-mono text-xs uppercase tracking-widest font-bold">{t("Nenhum Fragmento Selecionado")}</p>
                  <p className="text-[10px] text-slate-600 max-w-xs leading-relaxed">
                    {t("Clique em qualquer memória decriptada ao lado para carregar e reler seus dados neurais históricos.")}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between text-[9px] text-slate-600 font-mono">
              <span>{t("CANAL DE MEMÓRIAS SEGURO")}</span>
              <span>{t("ESTÁVEL")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
