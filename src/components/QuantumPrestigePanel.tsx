import React, { useState } from 'react';
import { Player } from '../types';
import { Sparkles, Heart, Coins, Star, RefreshCw, Zap, Shield, Flame, Cpu, Award, Activity, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../core/engine/translation';

import { usePlayerStore } from '../store/usePlayerStore';


export interface QuantumUpgradeDef {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
  bonusText: (level: number) => string;
}

export const QUANTUM_UPGRADES: QuantumUpgradeDef[] = [
  {
    id: 'hp_boost', name: 'Vitalidade Quântica', description: 'Aumenta permanentemente o HP base em +50 por nível.', icon: Heart, baseCost: 1, costMultiplier: 1.5, maxLevel: 10, bonusText: (lvl) => '+' + (lvl * 50) + ' HP' },
  {
    id: 'atk_boost', name: 'Sobrecarga de Dano', description: 'Aumenta permanentemente o ATK base em +5 por nível.', icon: Zap, baseCost: 1, costMultiplier: 1.5, maxLevel: 10, bonusText: (lvl) => '+' + (lvl * 5) + ' ATK' },
  {
    id: 'gold_boost', name: 'Algoritmo de Riqueza', description: 'Aumenta o ganho de Ouro em +10% por nível.', icon: Coins, baseCost: 2, costMultiplier: 2.0, maxLevel: 5, bonusText: (lvl) => '+' + (lvl * 10) + '% Ouro' },
  {
    id: 'xp_boost', name: 'Aprendizado Acelerado', description: 'Aumenta o ganho de XP em +10% por nível.', icon: Star, baseCost: 2, costMultiplier: 2.0, maxLevel: 5, bonusText: (lvl) => '+' + (lvl * 10) + '% XP' }
];

export const QuantumPrestigePanel: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();
  const onUpdatePlayer = setPlayer;
  const { t } = useTranslation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const quantumLevel = player.quantumLevel || 0;
  const highestFloor = player.highestFloorUnlocked || 1;
  const abyssalDepth = player.highestAbyssalDepth || 0;
  const currentLevel = player.level || 1;

  // Cálculo da recompensa de Estilhaços de Alma pelo Reinício Quântico
  const shardsGain = Math.floor(highestFloor * 1.5) + Math.floor(currentLevel * 1.2) + (abyssalDepth * 15);
  const canPrestige = highestFloor >= 25 || currentLevel >= 25 || abyssalDepth > 0;

  const handlePrestige = () => {
    if (!canPrestige) return;

    const updatedPlayer: Player = {
      ...player,
      quantumLevel: quantumLevel + 1,
      soulShards: (player.soulShards || 0) + shardsGain,
      level: 1,
      currentXp: 0,
      highestFloorUnlocked: 1,
      gold: Math.max(500, Math.floor(player.gold * 0.2)),
      matrixPoints: 0,
    };

    onUpdatePlayer(updatedPlayer);
    setShowConfirmModal(false);
    
  };

  const buyUpgrade = (upgrade: QuantumUpgradeDef) => {
    const currentUpgrades = player.quantumUpgrades || {};
    const lvl = currentUpgrades[upgrade.id] || 0;
    if (lvl >= upgrade.maxLevel) return;

    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, lvl));
    if ((player.soulShards || 0) < cost) return;

    const updatedPlayer: Player = {
      ...player,
      soulShards: player.soulShards - cost,
      quantumUpgrades: {
        ...currentUpgrades,
        [upgrade.id]: lvl + 1
      }
    };

    onUpdatePlayer(updatedPlayer);
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal do Prestígio Quântico */}
      <div className="system-panel p-6 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 border border-purple-500/40 rounded-xl relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-widest font-bold">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>{t("Núcleo de Ressonância Temporal")}</span>
              <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded text-[10px]">
                Nível Quântico {quantumLevel}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-mono text-white tracking-wide">
              {t("Prestígio Quântico (Reinício Temporal)")}
            </h2>
            <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
              {t("Reinicie sua progressão de andares e níveis em troca de Estilhaços de Alma. Os Upgrades de Ressonância Quântica são permanentes e acumulam bônus massivos para todas as futuras explorações.")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <div className="bg-slate-900/90 border border-purple-900/60 p-3 rounded-lg text-center font-mono">
              <span className="text-[10px] text-purple-400/80 uppercase block">{t("Estilhaços de Alma")}</span>
              <span className="text-xl font-bold text-purple-300 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
                {player.soulShards || 0}
              </span>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!canPrestige}
              className={`px-5 py-3.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                canPrestige 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer active:scale-95' 
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${canPrestige ? 'animate-spin-slow' : ''}`} />
              <span>{t("Iniciar Reinício Quântico")}</span>
            </button>
          </div>
        </div>

        {!canPrestige && (
          <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center gap-2 text-xs text-amber-400 font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{t("Requisito: Alcance pelo menos o Andar 25 ou Nível 25 para desbloquear o Reinício Quântico.")}</span>
          </div>
        )}
      </div>

      {/* Árvore de Upgrades Quânticos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-mono text-sm border-b border-purple-900/40 pb-2">
          <span className="text-purple-300 font-bold uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            {t("Melhorias Meta-Permanentes")}
          </span>
          <span className="text-xs text-slate-400">
            {t("Estilhaços Disponíveis:")} <strong className="text-purple-300">{player.soulShards || 0}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUANTUM_UPGRADES.map((upgrade) => {
            const currentUpgrades = player.quantumUpgrades || {};
            const lvl = currentUpgrades[upgrade.id] || 0;
            const isMax = lvl >= upgrade.maxLevel;
            const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, lvl));
            const canAfford = (player.soulShards || 0) >= cost && !isMax;
            const IconComponent = upgrade.icon;

            return (
              <div 
                key={upgrade.id}
                className={`system-panel p-4 flex flex-col justify-between rounded-xl border transition-all ${
                  lvl > 0 
                    ? 'border-purple-500/50 bg-slate-950/80 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                    : 'border-slate-800 bg-slate-900/60 opacity-85'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg border ${lvl > 0 ? 'bg-purple-950/80 border-purple-500/60 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold font-mono text-sm text-slate-100">{t(upgrade.name)}</h3>
                        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-900 px-1.5 py-0.2 rounded">
                          Nv. {lvl} / {upgrade.maxLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                    {t(upgrade.description)}
                  </p>

                  <div className="bg-slate-900/90 p-2 rounded border border-slate-800 font-mono text-xs text-emerald-400 font-bold flex items-center justify-between">
                    <span>{t("Efeito Ativo:")}</span>
                    <span>{upgrade.bonusText(lvl)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => buyUpgrade(upgrade)}
                    disabled={!canAfford || isMax}
                    className={`w-full py-2 px-3 rounded font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                      isMax
                        ? 'bg-slate-800/80 text-slate-500 border border-slate-700 cursor-default'
                        : canAfford
                        ? 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.3)] cursor-pointer active:scale-95'
                        : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {isMax ? (
                      <span>{t("Nível Máximo Alcançado")}</span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t("Evoluir (-")} {cost} {t("Estilhaços)")}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Confirmação de Reinício Quântico */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="system-panel max-w-lg w-full bg-slate-900 border border-purple-500/80 p-6 rounded-xl space-y-5 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
            <div className="flex items-center gap-3 text-purple-400 font-mono">
              <RefreshCw className="w-6 h-6 animate-spin-slow" />
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">{t("Confirmar Reinício Quântico")}</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {t("Ao colapsar a linha temporal atual, seu personagem será resetado para o Nível 1 e o Andar 1. Em contrapartida, você receberá estilhaços para evoluir suas habilidades meta-permanentes.")}
            </p>

            <div className="bg-slate-950 p-4 rounded-lg border border-purple-900/60 font-mono space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{t("Nível Atual do Operador:")}</span>
                <span className="text-slate-200 font-bold">{currentLevel}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t("Maior Andar Conquistado:")}</span>
                <span className="text-slate-200 font-bold">{highestFloor}</span>
              </div>
              {abyssalDepth > 0 && (
                <div className="flex justify-between text-purple-400">
                  <span>{t("Profundidade Abissal:")}</span>
                  <span className="font-bold">Nível {abyssalDepth}</span>
                </div>
              )}
              <div className="pt-2 border-t border-purple-900/40 flex justify-between text-sm font-bold text-purple-300">
                <span>{t("Recompensa de Estilhaços:")}</span>
                <span className="flex items-center gap-1 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                  +{shardsGain}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded border border-slate-700 cursor-pointer"
              >
                {t("Cancelar")}
              </button>
              <button
                onClick={handlePrestige}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs rounded border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer"
              >
                {t("Executar Reinício")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
