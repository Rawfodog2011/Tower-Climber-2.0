import React, { useState } from 'react';
import { Player } from '../types';
import { generateRandomContracts, claimContractReward, claimAllCompletedContracts } from '../core/engine/contracts';
import { Briefcase, CheckCircle2, CircleDashed, TerminalSquare, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../core/engine/translation';
import { AudioManager } from '../core/engine/audio';

interface Props {
  player: Player;
  setPlayer: (p: Player) => void;
}

export const ContractsPanel: React.FC<Props> = ({ player, setPlayer }) => {
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const { t } = useTranslation();

  const handleGenerate = () => {
    if (player.contracts.length >= 5) {
      setMessage({ text: t('Painel de contratos cheio. Cumpra ou abandone contratos atuais.'), type: 'error' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const newContracts = generateRandomContracts(player.level);
    
    // Only take up to what fits in 5 slots max
    const slotsAvailable = 5 - player.contracts.length;
    const toAdd = newContracts.slice(0, slotsAvailable);
    
    setPlayer({
      ...player,
      contracts: [...player.contracts, ...toAdd]
    });
    setMessage({ text: t('Novos contratos baixados do terminal corporativo.'), type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleClaim = (id: string) => {
    const res = claimContractReward(player, id);
    if (res.success) {
      AudioManager.playSfx('event.contract_complete');
      setPlayer(res.updatedPlayer);
      setMessage({ text: t(res.message), type: 'success' });
    } else {
      setMessage({ text: t(res.message), type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleClaimAll = () => {
    const res = claimAllCompletedContracts(player);
    if (res.success) {
      AudioManager.playSfx('event.contract_complete');
      setPlayer(res.updatedPlayer);
      setMessage({ text: t(res.message), type: 'success' });
    } else {
      setMessage({ text: t(res.message), type: 'error' });
    }
    setTimeout(() => setMessage(null), 4000); // Mais tempo para ler o resumo consolidado
  };

  const handleAbandon = (id: string) => {
    setPlayer({
      ...player,
      contracts: player.contracts.filter(c => c.id !== id)
    });
  };

  const completedCount = player.contracts.filter(c => c.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-500" />
            {t("Central de Contratos")}
          </h2>
          <p className="text-blue-200/60 font-mono text-sm uppercase tracking-wider">{t("Mercenários e Freelancers")}</p>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={player.contracts.length >= 5}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest border transition-all ${
            player.contracts.length < 5 
              ? 'bg-blue-900/30 text-blue-400 border-blue-500/50 hover:bg-blue-800/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
              : 'bg-slate-900 text-slate-600 border-slate-700 cursor-not-allowed'
          }`}
        >
          <TerminalSquare className="w-4 h-4" /> {t("Buscar Ofertas")}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded border text-sm font-mono ${message.type === 'success' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50' : 'bg-red-900/30 text-red-400 border-red-500/50'}`}>
          {message.text}
        </div>
      )}

      {player.contracts.length === 0 ? (
        <div className="system-panel p-12 flex flex-col items-center justify-center text-slate-500 border-dashed">
          <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
          <p className="font-mono uppercase tracking-widest text-center whitespace-pre-line">
            {t("Nenhum contrato ativo.\nConecte-se à rede para buscar tarefas.")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedCount >= 2 && (
            <div className="flex justify-end animate-fade-in">
              <button
                onClick={handleClaimAll}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-2 border-emerald-500/50 hover:border-emerald-400 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
              >
                <CheckCircle2 className="w-4 h-4" />
                {t("Reivindicar Tudo")} ({completedCount} {t("concluídos")})
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {player.contracts.map((contract) => (
              <div key={contract.id} className={`system-panel p-5 relative overflow-hidden group ${contract.completed ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-700/50'}`}>
                {contract.completed && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full border-b border-l border-emerald-500/30"></div>
                )}
                
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div>
                    <div className="text-[10px] font-mono text-blue-400 mb-1 tracking-widest uppercase">[{contract.issuer}]</div>
                    <h3 className="font-bold text-slate-100">{t(contract.title)}</h3>
                  </div>
                  {contract.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <CircleDashed className="w-5 h-5 text-slate-500 animate-spin-slow" />
                  )}
                </div>
                
                <p className="text-xs text-slate-400 font-mono mb-4 min-h-[32px]">{t(contract.description)}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-slate-400">{t("Progresso")}</span>
                    <span className={contract.completed ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                      {contract.progress} / {contract.goal}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${contract.completed ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(100, (contract.progress / contract.goal) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{t("Recompensa")}</span>
                    <div className="flex items-center gap-2 text-xs font-bold text-yellow-400">
                      ${contract.reward.gold}
                      {contract.reward.materials?.common && <span className="text-slate-300 ml-1">+{contract.reward.materials.common} {t("Comum")}</span>}
                      {contract.reward.materials?.rare && <span className="text-blue-300 ml-1">+{contract.reward.materials.rare} {t("Raro")}</span>}
                      {contract.reward.materials?.epic && <span className="text-purple-300 ml-1">+{contract.reward.materials.epic} {t("Épico")}</span>}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {!contract.completed && (
                      <button 
                        onClick={() => handleAbandon(contract.id)}
                        className="text-[10px] font-mono uppercase text-red-400 hover:text-red-300 px-2 py-1 transition-colors font-bold tracking-wider"
                      >
                        {t("Abortar")}
                      </button>
                    )}
                    {contract.completed && (
                      <button 
                        onClick={() => handleClaim(contract.id)}
                        className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-400 border border-emerald-500/50 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                      >
                        {t("Receber")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
