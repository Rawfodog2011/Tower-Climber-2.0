import { SKILLS_DATABASE } from '../core/entities/skills';
import React from 'react';
import { Player } from '../types';
import { random } from '../core/engine/rng';
import { useTranslation } from '../core/engine/translation';

import { usePlayerStore } from '../store/usePlayerStore';

export const AutoBattlePanel: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();
  
  const playerCombatSkills = React.useMemo(() => {
    return player.learnedSkills.filter(id => !SKILLS_DATABASE[id]?.isPassive);
  }, [player.learnedSkills]);
  const { t } = useTranslation();

  return (
    <div className="system-panel" id="auto-battle-panel">
      <div className="border-b border-emerald-500/20 bg-emerald-950/40 px-4 py-3 flex justify-between items-center" id="auto-battle-header">
        <span className="font-bold text-emerald-400 tracking-widest uppercase text-sm">{t("Protocolos de Automação")}</span>
      </div>
      <div className="p-4 space-y-6" id="auto-battle-body">
        <div className="bg-slate-900/50 p-4 rounded border border-emerald-900/30 flex flex-col sm:flex-row justify-between items-center gap-4" id="auto-battle-toggle">
          <div>
            <h4 className="text-emerald-300 font-bold tracking-wide uppercase text-sm mb-1">{t("Auto-Batalha")}</h4>
            <p className="text-xs text-emerald-200/60 font-mono">{t("Permite que a IA da nave assume o controle durante confrontos, seguindo as diretrizes abaixo.")}</p>
          </div>
          <button 
            id="btn-toggle-autobattle"
            onClick={() => setPlayer(p => ({ ...p, isAutoBattleActive: !p.isAutoBattleActive }))}
            className={`shrink-0 px-6 py-2 rounded font-bold uppercase tracking-widest text-sm transition-all border ${player.isAutoBattleActive ? 'bg-emerald-600 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-emerald-700 hover:text-emerald-500'}`}
          >
            {player.isAutoBattleActive ? t('ATIVADO') : t('DESATIVADO')}
          </button>
        </div>

        <div className="space-y-4" id="auto-battle-rules-section">
          <div className="flex justify-between items-center">
            <h4 className="text-cyan-400 font-bold tracking-wide uppercase text-sm">{t("Diretrizes de Ação")}</h4>
            <button 
              id="btn-new-directive"
              onClick={() => {
                const newRule: import('../types').AutoBattleRule = { id: random().toString(36).substr(2, 9), condition: 'always', action: 'attack' };
                setPlayer(p => ({ ...p, autoBattleRules: [...(p.autoBattleRules || []), newRule] }));
              }}
              className="text-[10px] bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800 px-3 py-1 rounded uppercase tracking-widest transition-colors cursor-pointer"
            >
              {t("+ Nova Diretriz")}
            </button>
          </div>
          
          {!player.autoBattleRules || player.autoBattleRules.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-700 rounded bg-slate-900/30" id="no-directives-msg">
              <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">{t("Nenhuma diretriz definida. IA usará Ataque Básico.")}</span>
            </div>
          ) : (
            <div className="space-y-3" id="directives-list">
              {player.autoBattleRules.map((rule, idx) => (
                <div key={rule.id} className="bg-slate-900/80 p-3 rounded border border-slate-700 flex flex-col md:flex-row gap-3 items-center" id={`directive-rule-${rule.id}`}>
                  <span className="text-cyan-500/50 text-xs font-mono w-6 text-center">#{idx + 1}</span>
                  
                  <div className="flex-1 w-full flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400">{t("SE")}</span>
                    <select 
                      id={`select-condition-${rule.id}`}
                      value={rule.condition}
                      onChange={(e) => {
                        const rules = [...player.autoBattleRules];
                        rules[idx].condition = e.target.value as import('../types').AutoBattleCondition;
                        setPlayer(p => ({ ...p, autoBattleRules: rules }));
                      }}
                      className="bg-slate-950 text-emerald-300 border border-emerald-900/50 text-xs p-1.5 rounded outline-none w-full md:w-auto"
                    >
                      <option value="always">{t("Sempre")}</option>
                      <option value="hp_lt_25">HP &lt; 25%</option>
                      <option value="hp_lt_50">HP &lt; 50%</option>
                      <option value="hp_lt_75">HP &lt; 75%</option>
                      <option value="mp_lt_50">EP &lt; 50%</option>
                      <option value="enemy_hp_lt_50">{t("HP Inimigo < 50%")}</option>
                    </select>
                  </div>
                  
                  <div className="flex-1 w-full flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400">{t("FAZER")}</span>
                    <select 
                      id={`select-action-${rule.id}`}
                      value={rule.action}
                      onChange={(e) => {
                        const rules = [...player.autoBattleRules];
                        rules[idx].action = e.target.value;
                        setPlayer(p => ({ ...p, autoBattleRules: rules }));
                      }}
                      className="bg-slate-950 text-indigo-300 border border-indigo-900/50 text-xs p-1.5 rounded outline-none w-full md:w-auto"
                    >
                      <option value="attack">{t("Ataque Básico")}</option>
                      {playerCombatSkills.map(s => {
                        const skillDef = SKILLS_DATABASE[s];
                        return <option key={s} value={s}>{t(skillDef.name)}</option>;
                      })}
                    </select>
                  </div>
                  
                  <button 
                    id={`btn-remove-directive-${rule.id}`}
                    onClick={() => {
                      const rules = [...player.autoBattleRules];
                      rules.splice(idx, 1);
                      setPlayer(p => ({ ...p, autoBattleRules: rules }));
                    }}
                    className="shrink-0 text-red-400 hover:text-red-300 p-2 opacity-50 hover:opacity-100 transition-opacity"
                    title="Remover Diretriz"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-[10px] text-slate-500 font-mono text-center">{t("As diretrizes são avaliadas de cima para baixo. A primeira que for verdadeira será executada.")}</p>
        </div>
      </div>
    </div>
  );
};
