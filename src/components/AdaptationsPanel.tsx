import React from 'react';
import { Fingerprint } from 'lucide-react';
import { Player } from '../types';
import { ADAPTATIONS_DATABASE } from '../core/entities/adaptations';
import { useTranslation } from '../core/engine/translation';

import { usePlayerStore } from '../store/usePlayerStore';

export const AdaptationsPanel: React.FC = () => {
  const { player } = usePlayerStore();
  const { t } = useTranslation();

  return (
    <div className="system-panel overflow-hidden mb-4" id="adaptations-panel">
      <div className="border-b border-blue-500/20 bg-blue-950/40 px-4 py-3 flex items-center gap-2" id="adaptations-header">
        <Fingerprint className="text-blue-400 w-4 h-4" />
        <span className="font-bold text-blue-400 tracking-widest uppercase text-sm">{t("Protocolos de Adaptação Biomecânica")}</span>
      </div>
      <div className="p-4 space-y-4" id="adaptations-body">
        <p className="text-xs text-blue-200/70 font-mono mb-4">
          {t("Seu traje evolui passivamente com a repetição de ações em combate.")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="adaptations-grid">
          {Object.values(ADAPTATIONS_DATABASE).map(def => {
            const isUnlocked = player.adaptations && player.adaptations[def.id];
            if (def.isFusion && !isUnlocked) return null;

            const state = player.adaptations?.[def.id] || { level: 0, exp: 0 };
            const reqExp = def.expFormula(state.level);
            const progress = state.level === def.maxLevel ? 100 : (state.exp / reqExp) * 100;
            const borderColor = def.isFusion ? 'border-purple-500/50' : 'border-blue-500/20';
            const hoverColor = def.isFusion ? 'hover:border-purple-500' : 'hover:border-blue-500/50';
            const textColor = def.isFusion ? 'text-purple-200' : 'text-blue-200';
            const barColor = def.isFusion ? 'bg-purple-500' : 'bg-blue-500';
            const barBg = def.isFusion ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400';
            
            return (
              <div key={def.id} className={`bg-slate-900/50 border ${borderColor} p-4 relative overflow-hidden flex flex-col group ${hoverColor} transition-colors`} id={`adaptation-card-${def.id}`}>
                {def.isFusion && (
                   <div className="absolute top-0 right-0 px-2 py-0.5 bg-purple-900/50 text-[8px] font-mono text-purple-300 uppercase tracking-widest border-b border-l border-purple-500/30" id={`adaptation-fusion-${def.id}`}>
                     {t("Sinergia")}
                   </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold ${textColor} text-sm tracking-widest uppercase pr-10`}>{t(def.name)}</h4>
                  <span className={`text-xs font-mono ${barBg} px-2 py-1`}>
                    {state.level === def.maxLevel ? t('Nv. Máx') : `${t('Nv.')} ${state.level}/${def.maxLevel}`}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4 flex-grow">{t(def.description)}</p>
                
                <div className="mt-auto">
                  <div className={`flex justify-between text-[10px] ${def.isFusion ? 'text-purple-300/70' : 'text-blue-300/70'} font-mono mb-1`}>
                    <span>{t("Proficiência")}</span>
                    <span>{state.level === def.maxLevel ? t('MÁXIMO') : `${Math.floor(state.exp)} / ${reqExp}`}</span>
                  </div>
                  <div className={`w-full bg-slate-950 border ${def.isFusion ? 'border-purple-900' : 'border-blue-900'} h-2`}>
                    <div className={`${barColor} h-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
