import React from 'react';
import { Player } from '../types';
import { Trophy, RefreshCw, Cpu, Activity, Clock, Zap } from 'lucide-react';
import { useTranslation } from '../core/engine/translation';

interface EndingScreenProps {
  player: Player;
  onContinue: () => void;
}

export function EndingScreen({ player, onContinue }: EndingScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>
      
      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-10 space-y-4 animate-[fadeIn_2s_ease-out]">
          <Cpu className="w-16 h-16 text-indigo-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">
            {t("Escalada Concluída")}
          </h1>
          <p className="text-indigo-200/70 uppercase tracking-[0.2em] text-sm">{t("Protocolo de Anomalia Desativado")}</p>
        </div>

        <div className="bg-slate-900/50 border border-indigo-500/30 p-8 rounded-lg shadow-2xl backdrop-blur-sm animate-[slideUp_1.5s_ease-out] mb-10">
          <p className="text-lg leading-relaxed mb-6 font-medium text-slate-300">
            {t("O Núcleo Matriz foi silenciado. As luzes da Torre começam a pulsar em uma frequência estável. A corrupção industrial que assolava os andares superiores dissipou-se.")}
          </p>
          <p className="text-lg leading-relaxed mb-8 font-medium text-slate-300">
            {t("Você ascendeu ao topo, superando aberrações biológicas e construtos de silício implacáveis. A rede principal agora obedece aos seus comandos de sobrescrita.")}
          </p>
          
          <div className="border-t border-indigo-900/50 pt-6 mt-6 font-mono">
            <h3 className="text-xs uppercase font-mono text-indigo-400 mb-4 tracking-widest text-center">{t("Registros da Jornada")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 rounded p-4 flex flex-col items-center justify-center border border-slate-800">
                <Clock className="w-5 h-5 text-slate-500 mb-2" />
                <span className="text-2xl font-mono text-white">{player.runStats?.totalTurns || 0}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 text-center">{t("Ciclos de Combate")}</span>
              </div>
              <div className="bg-slate-950 rounded p-4 flex flex-col items-center justify-center border border-slate-800">
                <Activity className="w-5 h-5 text-emerald-500 mb-2" />
                <span className="text-2xl font-mono text-white">{player.level}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 text-center">{t("Nível Atingido")}</span>
              </div>
              <div className="bg-slate-950 rounded p-4 flex flex-col items-center justify-center border border-slate-800">
                <Trophy className="w-5 h-5 text-amber-500 mb-2" />
                <span className="text-2xl font-mono text-white">{player.gameStats?.monstersKilled || 0}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 text-center">{t("Inimigos Eliminados")}</span>
              </div>
              <div className="bg-slate-950 rounded p-4 flex flex-col items-center justify-center border border-slate-800">
                <Zap className="w-5 h-5 text-indigo-500 mb-2" />
                <span className="text-2xl font-mono text-white">{player.gameStats?.bossesDefeated || 0}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 text-center">{t("Chefes Derrotados")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center animate-[fadeIn_3s_ease-out]">
          <button
            onClick={onContinue}
            className="flex items-center gap-3 px-8 py-4 bg-indigo-900 hover:bg-indigo-800 text-white rounded font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] border border-indigo-400 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            {t("Ativar Protocolo Sem Fim")}
          </button>
        </div>
      </div>
    </div>
  );
}
