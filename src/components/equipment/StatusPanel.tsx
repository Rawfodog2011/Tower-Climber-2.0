import React from 'react';
import { Player } from '../../types';
import { useTranslation } from '../../core/engine/translation';
import { CLASSES } from '../../core/entities/classes';

interface Props {
  player: Player;
  stats: { hp: number, mp: number, atk: number, def: number, spd: number };
}

export const StatusPanel: React.FC<Props> = ({ player, stats }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex flex-col gap-6">
      
      {/* Pilot Info Box */}
      <div className="border border-slate-700/50 bg-slate-900/60 p-4 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500" />
        <h2 className="text-[10px] font-mono tracking-[0.2em] text-cyan-600 uppercase mb-4">{t("Registro do Piloto")}</h2>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 border border-cyan-800/50 bg-cyan-950/30 flex items-center justify-center">
            <span className="font-mono text-cyan-400 font-bold">{t("L")}{player.level}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-slate-200 text-sm tracking-wider">{t("OPERATIVO N7")}</span>
            <span className="font-mono text-slate-500 text-[10px] uppercase">{t("Classe Ativa")}: {CLASSES[player.currentClassId] ? t(CLASSES[player.currentClassId].name) : player.currentClassId}</span>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
            <span>EXP</span>
            <span>{player.currentXp.toLocaleString()}</span>
          </div>
          <div className="w-full h-1 bg-slate-900 border border-slate-800">
            <div className="h-full bg-cyan-600 w-1/3" /> {/* Example progress */}
          </div>
        </div>
      </div>

      {/* Stats List */}
      <div className="border border-slate-700/50 bg-slate-900/60 p-4 flex-1 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500" />
        <h2 className="text-[10px] font-mono tracking-[0.2em] text-cyan-600 uppercase mb-4">{t("Leitura de Sistemas")}</h2>
        
        <div className="flex flex-col gap-3">
          {[
            { label: 'Integridade (HP)', value: stats.hp, color: 'text-emerald-400', bar: 'bg-emerald-500' },
            { label: 'Energia (EP)', value: stats.mp, color: 'text-cyan-400', bar: 'bg-cyan-500' },
            { label: 'Tensão (ATK)', value: stats.atk, color: 'text-orange-400', bar: 'bg-orange-500' },
            { label: 'Mitigação (DEF)', value: stats.def, color: 'text-blue-400', bar: 'bg-blue-500' },
            { label: 'Frequência (SPD)', value: stats.spd, color: 'text-yellow-400', bar: 'bg-yellow-500' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">{t(stat.label)}</span>
                <span className={`font-mono text-sm font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <div className="w-full h-0.5 bg-slate-800">
                <div className={`h-full ${stat.bar}`} style={{ width: `${Math.min(100, (stat.value / 200) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
