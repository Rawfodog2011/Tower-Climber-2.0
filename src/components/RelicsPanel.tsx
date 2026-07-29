import React from 'react';
import { Player } from '../types';
import { RELICS_DATABASE, getRelicUpgradeCost } from '../core/entities/relics';
import { useTranslation } from '../core/engine/translation';

import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useCrafting } from '../hooks/useCrafting';

export const RelicsPanel: React.FC = () => {
  const { player } = usePlayerStore();
  const { inventoryMessage } = useGameUIStore();
  const { handleUpgradeRelic } = useCrafting();
  const { t } = useTranslation();

  return (
    <div className="system-panel" id="relics-panel">
      <div className="border-b border-rose-500/20 bg-rose-950/40 px-4 py-3 flex justify-between items-center" id="relics-header">
        <span className="font-bold text-rose-400 tracking-widest uppercase text-sm">{t("Relíquias Passivas")}</span>
        {inventoryMessage && (
          <span className={`text-xs px-2 py-0.5 rounded font-mono uppercase tracking-wider border ${inventoryMessage.type === 'error' ? 'bg-red-950/50 text-red-400 border-red-900' : 'bg-emerald-950/50 text-emerald-400 border-emerald-900'}`} id="relics-inv-msg">
            {t(inventoryMessage.text)}
          </span>
        )}
      </div>
      <div className="p-4 space-y-4" id="relics-body">
        
        <div className="flex gap-4 mb-4" id="relics-currency">
          <div className="flex-1 bg-slate-900/60 p-3 rounded border border-rose-600/50 flex justify-between items-center shadow-[0_0_10px_rgba(244,63,94,0.1)]">
            <span className="text-rose-400 text-xs uppercase tracking-widest">{t("Estilhaços de Alma")}</span>
            <span className="text-white font-bold font-mono">{player.soulShards}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="relics-grid">
          {Object.values(RELICS_DATABASE).map(relic => {
            const currentLevel = player.relics[relic.id] || 0;
            const isMaxLevel = currentLevel >= relic.maxLevel;
            const cost = getRelicUpgradeCost(relic.id, currentLevel);
            const canUpgrade = !isMaxLevel && player.soulShards >= cost.shards && player.gold >= cost.gold;

            return (
              <div key={relic.id} className="bg-slate-900/60 p-4 rounded border border-rose-900/50 flex flex-col justify-between" id={`relic-card-${relic.id}`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-rose-300 uppercase tracking-wider text-sm">{t(relic.name)}</span>
                    <span className="text-rose-400/80 font-mono text-xs border border-rose-900/50 px-1.5 rounded">{t("Nv.")} {currentLevel}/{relic.maxLevel}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1 leading-relaxed">{t(relic.description)}</p>
                  <p className="text-[10px] text-emerald-400/80 font-mono tracking-wide mb-4">{t("Efeito Atual:")} +{parseInt(relic.baseEffectText) * currentLevel}% ({t(relic.baseEffectText)})</p>
                </div>
                
                <button
                  id={`btn-upgrade-relic-${relic.id}`}
                  onClick={() => handleUpgradeRelic(relic.id)}
                  disabled={!canUpgrade}
                  className={`w-full py-2 rounded border border-rose-500/30 text-xs uppercase font-bold tracking-wider transition-all flex justify-between items-center px-3 ${canUpgrade ? 'bg-rose-950/50 text-rose-400 hover:bg-rose-900/60 hover:shadow-[0_0_10px_rgba(244,63,94,0.4)] cursor-pointer' : 'bg-slate-800/50 text-slate-500 cursor-not-allowed opacity-60'}`}
                >
                  <span>{isMaxLevel ? t('Máximo') : t('Aprimorar')}</span>
                  {!isMaxLevel && (
                    <div className="font-mono text-[10px] text-right space-y-0.5 opacity-80">
                      <div>{cost.shards} {t('Almas')}</div>
                      <div>{cost.gold} G</div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
