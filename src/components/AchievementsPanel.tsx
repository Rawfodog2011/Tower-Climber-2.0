import React from 'react';
import { useTranslation } from '../core/engine/translation';
import { usePlayerStore } from '../store/usePlayerStore';
import { ACHIEVEMENTS_DATABASE } from '../core/engine/achievements';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

export const AchievementsPanel: React.FC = () => {
  const { player } = usePlayerStore();
  const { t } = useTranslation();

  const unlockedCount = player.achievements.length;
  const totalCount = ACHIEVEMENTS_DATABASE.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="system-panel" id="achievements-panel">
      <div className="border-b border-indigo-500/20 bg-indigo-950/40 px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-indigo-400 tracking-widest uppercase text-sm flex items-center gap-2">
          <Award className="w-5 h-5" />
          {t("Registro de Conquistas")}
        </span>
        <span className="font-mono text-xs font-bold text-indigo-300">
          {unlockedCount} / {totalCount} ({progress.toFixed(0)}%)
        </span>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded border border-slate-700 overflow-hidden mb-6">
          <div 
            className="bg-indigo-500 h-full transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACHIEVEMENTS_DATABASE.map(ach => {
            const isUnlocked = player.achievements.includes(ach.id);
            return (
              <div 
                key={ach.id} 
                className={`flex items-start gap-4 p-4 rounded border transition-all duration-300 ${
                  isUnlocked 
                    ? 'bg-slate-900/60 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                    : 'bg-slate-950 border-slate-800 opacity-60'
                }`}
              >
                <div className={`shrink-0 p-3 rounded ${
                  isUnlocked ? 'bg-indigo-950/50 text-indigo-400' : 'bg-slate-900 text-slate-600'
                }`}>
                  {isUnlocked ? <CheckCircle2 className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold truncate ${isUnlocked ? 'text-indigo-300' : 'text-slate-500'}`}>
                    {t(ach.name)}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {t(isUnlocked ? ach.description : ach.secretDescription)}
                  </p>
                  
                  <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Recompensa:</span>
                    <span className={`font-mono text-xs font-bold ${isUnlocked ? 'text-amber-400' : 'text-slate-600'}`}>
                      {t(ach.rewardText)}
                    </span>
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
