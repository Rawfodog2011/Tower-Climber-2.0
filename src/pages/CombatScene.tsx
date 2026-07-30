import React from 'react';
import { Shield, Zap, Flame, Droplet, Ban, Terminal, Info, Cpu, XCircle, Crosshair } from 'lucide-react';
import { Player } from '../types';
import { CombatState } from '../core/engine/combat';
import { useTranslation } from '../core/engine/translation';
import { getSectorForFloor } from '../core/math/worldScaling';

import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useExplorationStore } from '../store/useExplorationStore';
import { useCombatStore } from '../store/useCombatStore';
import { useExploration } from '../hooks/useExploration';
import { useCombatLogic } from '../hooks/useCombatLogic';
import { calculatePlayerStats } from '../core/entities/player';
import { getXpRequiredForNextLevel } from '../core/math/progression';
import { useMemo, useRef } from 'react';

export const CombatScene: React.FC = () => {
  const { player } = usePlayerStore();
  const { 
    showMonsterInfo, setShowMonsterInfo 
  } = useGameUIStore();
  const { 
    selectedFloor, setSelectedFloor 
  } = useExplorationStore();
  const {
    combatState, combatEndMessage, combatSpeed, setCombatSpeed,
    combatLogFilter, setCombatLogFilter, dmgPopups, attackerAnimating, isProcessingQueue: isAnimating
  } = useCombatStore();

  const { handleStartDive, handleReturnToHub } = useExploration();
  const { handleCombatAction } = useCombatLogic();
  

  const playerCombatSkills = useMemo(() => player.learnedSkills, [player.learnedSkills]);
  const pStatsMemo = useMemo(() => calculatePlayerStats(player), [player]);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  };
  const logContainerRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const requiredXp = getXpRequiredForNextLevel(player.level);
  const xpPercent = player.level >= 100 ? 100 : Math.min(100, (player.currentXp / requiredXp) * 100);


  return (
          <div className={`flex flex-col lg:flex-row gap-6 ${dmgPopups.some(p => p.type === 'crit') ? 'animate-screen-shake' : ''}`}>
            
            {/* Esquerda: Status do Jogador & Controles */}
            <div className="flex flex-col w-full lg:w-[35%] space-y-4">
              <div className={`system-panel p-4 flex flex-col items-center justify-center relative ${dmgPopups.some(p => p.target === 'player') ? 'animate-shake' : ''}`}>
                <div className="absolute top-2 left-2 text-cyan-500/50 font-mono text-[10px] tracking-widest">{player.name}</div>
                <div className="absolute top-2 right-2 text-yellow-500 font-mono text-xs font-bold tracking-widest">Nv. {player.level}</div>
                {combatState && (
                  <div className="w-full space-y-3 mt-4">
                    <div className="flex justify-between text-xs font-bold font-mono">
                      <span className="text-emerald-400">HP</span>
                      <span className="text-emerald-100">{Math.floor(combatState.playerHp)} / {pStatsMemo.hp}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded border border-slate-700 overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(combatState.playerHp / pStatsMemo.hp) * 100}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between text-xs font-bold font-mono mt-1">
                      <span className="text-indigo-400">EP (Energia)</span>
                      <span className="text-indigo-100">{Math.floor(combatState.playerMp)} / {pStatsMemo.mp}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded border border-slate-700 overflow-hidden">
                      <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${(combatState.playerMp / pStatsMemo.mp) * 100}%` }}></div>
                    </div>

                                        <div className="flex justify-between text-xs font-bold font-mono mt-1">
                      <span className="text-slate-400">Escudo</span>
                      <span className="text-slate-100">{Math.floor((combatState.playerShield) || 0)}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded border border-slate-700 overflow-hidden">
                      <div className="bg-slate-400 h-full transition-all duration-300" style={{ width: `${Math.min(100, ((combatState.playerShield) || 0 / (pStatsMemo.hp * 0.5)) * 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold font-mono mt-1">
                      <span className="text-yellow-500/80">XP</span>
                      <span className="text-yellow-100/80">{player.level >= 100 ? 'MÁX' : `${Math.floor(player.currentXp)} / ${requiredXp}`}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded border border-slate-700 overflow-hidden">
                      <div className="bg-yellow-500/80 h-full transition-all duration-300" style={{ width: `${xpPercent}%` }}></div>
                    </div>

                    {combatState.playerStatuses && combatState.playerStatuses.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2 p-2 bg-slate-950/50 rounded border border-slate-800">
                        {combatState.playerStatuses.map((s, i) => (
                          <div key={i} className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold ${s.type==='overheat'?'bg-orange-500/20 text-orange-400':s.type==='corrosion'?'bg-green-500/20 text-green-400':s.type==='stun'?'bg-slate-500/20 text-slate-400':'bg-yellow-500/20 text-yellow-400'}`}>
                            {s.type==='overheat'?<Flame className="w-3 h-3" />:s.type==='corrosion'?<Droplet className="w-3 h-3" />:s.type==='stun'?<Ban className="w-3 h-3" />:<Zap className="w-3 h-3" />}
                            <span>{s.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="system-panel flex-1 flex flex-col">
                <div className="tech-panel-header px-4 py-2 flex items-center justify-between">
                  <span className="font-bold text-cyan-50 tracking-widest uppercase text-sm">Painel de Comando</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-cyan-500/50 uppercase">Speed:</span>
                    <button onClick={() => setCombatSpeed('normal')} className={`text-[10px] font-mono px-1.5 rounded ${combatSpeed === 'normal' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-500 hover:text-cyan-400'}`}>1x</button>
                    <button onClick={() => setCombatSpeed('fast')} className={`text-[10px] font-mono px-1.5 rounded ${combatSpeed === 'fast' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-500 hover:text-cyan-400'}`}>2x</button>
                  </div>
                </div>
                
                {combatState && combatState.isActive ? (
                  <>
                    <button 
                      onClick={() => handleCombatAction({ type: 'attack' })}
                      disabled={player.isAutoBattleActive || !!combatState.playerStatuses?.some(s => s.type === 'stun') || isAnimating}
                      className={`w-full bg-slate-900 hover:bg-slate-800 border-2 border-cyan-900/50 hover:border-cyan-400 text-cyan-50 font-bold py-4 px-4 rounded transition-all flex justify-between items-center group mb-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] ${(player.isAutoBattleActive || !!combatState.playerStatuses?.some(s => s.type === 'stun')) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <Crosshair className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:text-cyan-400 transition-colors" />
                        <div className="flex flex-col text-left">
                          <span className="uppercase tracking-widest text-sm text-cyan-300 group-hover:text-cyan-100">{t("Ataque Básico")}</span>
                          <span className="text-[10px] font-mono font-normal mt-0.5 opacity-60 text-cyan-500">
                            {t("Dano Base:")} ~{Math.floor(pStatsMemo.atk)}
                          </span>
                        </div>
                      </div>
                    </button>
                    
                    {playerCombatSkills.map((skill, index) => {
                      const isUpgraded = (player.skillUpgrades)?.includes(skill.id);
                      const finalMultiplier = isUpgraded ? skill.multiplier * 1.5 : skill.multiplier;
                      const cd = combatState.cooldowns[skill.id] || 0;
                      const noMp = combatState.playerMp < skill.mpCost;
                      const isStunned = !!combatState.playerStatuses?.some(s => s.type === 'stun');
                      const isDesligado = cd > 0 || noMp || player.isAutoBattleActive || isStunned;
                      const estVal = Math.floor(skill.type === 'damage' ? pStatsMemo.atk * finalMultiplier : skill.type === 'heal' ? pStatsMemo.hp * finalMultiplier : 0);
                      
                      return (
                        <button 
                          key={skill.id}
                          onClick={() => handleCombatAction({ type: 'skill', skillId: skill.id })}
                          disabled={isDesligado}
                          className={`w-full relative overflow-hidden bg-slate-900 border-2 text-left py-3 px-4 rounded transition-all flex justify-between items-center group mb-2 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] ${isDesligado ? 'border-red-900/30 text-slate-600 opacity-60 cursor-not-allowed' : 'border-slate-700 hover:border-indigo-400 text-indigo-100 cursor-pointer'}`}
                        >
                          {cd > 0 && (
                            <div className="absolute inset-0 bg-red-950/20 pointer-events-none"></div>
                          )}
                          
                          <div className="flex items-center gap-3 relative z-10">
                            <Zap className={`w-5 h-5 ${isDesligado ? 'text-red-900/50' : 'text-current opacity-80 group-hover:opacity-100'}`} />
                            <div className="flex flex-col">
                              <span className="uppercase tracking-widest text-sm">{skill.name}</span>
                              <span className="text-[10px] font-mono font-normal mt-0.5 opacity-60 flex items-center gap-2">
                                <span>{skill.type === 'damage' ? `PWR:${Math.round(finalMultiplier * 100)}%` : skill.type === 'heal' ? `HEAL:${Math.round(finalMultiplier * 100)}%` : 'BUFF'}</span>
                                {skill.type !== 'buff' && (
                                  <>
                                    <span className="opacity-50">|</span>
                                    <span className={skill.type === 'damage' ? 'text-red-400/90' : 'text-emerald-400/90'}>~{estVal} {skill.type === 'damage' ? 'dano' : 'HP'}</span>
                                  </>
                                )}
                                <span className="opacity-50">|</span>
                                <span>CD:{isUpgraded ? Math.max(1, skill.cooldown - 1) : skill.cooldown}</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="relative z-10">
                            {isDesligado ? (
                              <span className="text-red-500/80 text-2xl font-bold font-mono drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]">
                                {cd}
                              </span>
                            ) : (
                              <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${noMp ? 'border-cyan-900/50 text-cyan-800/50' : 'border-indigo-500/30 bg-indigo-950/50 text-indigo-300'}`}>
                                {skill.mpCost} EP
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                    
                    {player.isFarmActive && (
                      <button 
                        onClick={() => {
                          usePlayerStore.getState().setPlayer(p => ({ ...p, isFarmActive: false }));
                        }}
                        className="w-full bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 font-bold py-2 mt-4 rounded uppercase tracking-widest transition-all cursor-pointer text-xs"
                      >
                        {t("Parar Auto-Farm")}
                      </button>
                    )}
                    <div className="w-full text-center mt-3 text-[9px] font-mono text-cyan-500/40 uppercase tracking-widest border-t border-cyan-900/30 pt-2">
                      {t("[1] Atacar [2-9] Habilidades [ESC] Voltar")}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 p-4">
                    {combatEndMessage && (
                      <div className={`p-4 w-full border rounded ${combatEndMessage.isVictory ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-red-950/30 border-red-500/50'}`}>
                        <h4 className={`text-xl uppercase tracking-widest font-bold mb-2 ${combatEndMessage.isVictory ? 'text-emerald-400' : 'text-red-400'}`}>
                          {combatEndMessage.title}
                        </h4>
                        <p className="text-sm font-mono text-cyan-100">{combatEndMessage.subtitle}</p>
                      </div>
                    )}
                    {player.isFarmActive && player.isAutoBattleActive && (
                      <div className="text-xs w-full font-mono text-cyan-400 animate-pulse bg-cyan-950/20 border border-cyan-500/30 px-4 py-2 rounded flex items-center gap-2 mb-2">
                        <Cpu className="w-4 h-4 animate-spin-slow text-cyan-400" />
                        AUTO-FARM ATIVO: REINICIANDO EM INSTANTES...
                      </div>
                    )}
                    {player.isFarmActive && (
                      <button 
                        onClick={() => {
                          usePlayerStore.getState().setPlayer(p => ({ ...p, isFarmActive: false }));
                        }}
                        className="w-full bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-50 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer mb-2"
                      >
                        {t("Parar Auto-Farm")}
                      </button>
                    )}
                    <div className="flex flex-col gap-3 w-full">
                      {combatEndMessage?.isVictory && (
                        <button 
                          onClick={() => {
                            const nextF = selectedFloor + 1;
                            setSelectedFloor(nextF);
                            handleStartDive(nextF, false);
                          }}
                          className="w-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-50 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
                        >
                          Avançar (Andar {selectedFloor + 1})
                        </button>
                      )}
                      <button 
                        onClick={() => handleStartDive(selectedFloor, true)}
                        className="w-full bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-50 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                      >
                        Lutar Novamente (Andar {selectedFloor})
                      </button>
                      <button 
                        onClick={handleReturnToHub}
                        className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-600 text-slate-300 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(148,163,184,0.3)] cursor-pointer"
                      >
                        Voltar ao Hub
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Arena Central & Logs */}
            <div className="flex flex-col w-full lg:w-[65%] space-y-4">
              
              {/* Alerta de Anomalia e Chefes */}
              {combatState && combatState.monster.isBoss && (
                <div className="bg-red-950/40 border border-red-500/50 text-red-400 p-2 mb-4 rounded flex items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <span className="font-bold uppercase tracking-widest text-sm flex items-center gap-2"><span className="animate-pulse">⚠️</span> AMEAÇA CLASSE ÔMEGA DETECTADA</span>
                  <span className="font-mono text-xs opacity-80">PROBABILIDADE DE SOBREVIVÊNCIA: 12%</span>
                </div>
              )}
              {combatState && combatState.anomaly && (
                <div className="bg-yellow-950/40 border border-yellow-500/50 text-yellow-400 p-2 mb-4 rounded flex flex-col md:flex-row items-start md:items-center justify-between shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                  <div className="flex items-center gap-2 mb-1 md:mb-0">
                    <span className="animate-pulse">⚡</span>
                    <span className="font-bold uppercase tracking-widest text-sm">{combatState.anomaly.name}</span>
                  </div>
                  <span className="font-mono text-xs opacity-90 text-yellow-200/80">{combatState.anomaly.description}</span>
                </div>
              )}
              {/* Painel de Risco Ambiental do Setor */}
              {combatState && (
                <div className={`bg-slate-900/50 border ${
                  getSectorForFloor(selectedFloor).colorTheme === 'green' ? 'border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.05)]' : 
                  getSectorForFloor(selectedFloor).colorTheme === 'blue' ? 'border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.05)]' : 
                  'border-orange-500/30 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.05)]'
                } p-2 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-4`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${
                      getSectorForFloor(selectedFloor).colorTheme === 'green' ? 'bg-green-500' : 
                      getSectorForFloor(selectedFloor).colorTheme === 'blue' ? 'bg-blue-500' : 
                      'bg-orange-500'
                    }`} />
                    <span className="font-bold uppercase tracking-widest text-xs">{t(getSectorForFloor(selectedFloor).name)}</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-70">
                    {getSectorForFloor(selectedFloor).hazard === 'toxic_refinery' && t("Corrosão ativa")}
                    {getSectorForFloor(selectedFloor).hazard === 'frozen_datacore' && t("Baixas temperaturas")}
                    {getSectorForFloor(selectedFloor).hazard === 'plasma_furnace' && t("Superaquecimento")}
                    {getSectorForFloor(selectedFloor).hazard === 'toxic_refinery' && t("Radiação gama")}
                    {(getSectorForFloor(selectedFloor).hazard as string) === 'none' && t("Ambiente estável")}
                  </span>
                </div>
              )}

              {/* Arena Visual */}
              {combatState && (
                <div className="system-panel flex-1 relative overflow-hidden min-h-[300px]">
                  {/* Cenário de Fundo Animado Baseado no Setor */}
                  <div className={`absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay ${
                    getSectorForFloor(selectedFloor).colorTheme === 'green' ? 'bg-green-950' : 
                    getSectorForFloor(selectedFloor).colorTheme === 'blue' ? 'bg-blue-950' : 
                    'bg-orange-950'
                  }`}></div>
                  
                  {/* Efeito de Flash (Enfurecido ou Anomalia) */}
                  <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${combatState.isBossEnraged ? 'bg-red-500/10' : 'opacity-0'}`}></div>

                  <div className="absolute inset-0 flex items-center justify-between px-8 md:px-24">
                    
                    {/* Jogador Sprite (Placeholder Hero) */}
                    <div className="relative">
                      {dmgPopups.filter(p => p.target === 'player').map(p => (
                        <div key={p.id} className={`absolute -top-12 left-1/2 transform -translate-x-1/2 font-black font-mono text-2xl ${p.type === 'damage' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : p.type === 'heal' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]' : p.type === 'miss' ? 'text-slate-400' : 'text-yellow-400 text-3xl drop-shadow-[0_0_15px_rgba(250,204,21,1)] animate-crit-bounce'} z-50 pointer-events-none`}>
                          {p.type === 'heal' ? '+' : p.type === 'damage' || p.type === 'crit' ? '-' : ''}{p.amount}
                        </div>
                      ))}
                      
                      <div className={`w-24 h-24 bg-cyan-900/50 rounded-full border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-center ${dmgPopups.some(p => p.target === 'player') ? 'animate-shake animate-hit-flash' : ''} ${attackerAnimating.player ? 'animate-attack-right' : ''}`} style={attackerAnimating.player || dmgPopups.some(p => p.target === 'player') ? { animationDuration: combatSpeed === 'fast' ? '0.2s, 0.075s' : '0.4s, 0.15s' } : undefined}>
                        {player.avatar ? (
                          <img src={player.avatar} alt="Hero" className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                          <Terminal className="w-12 h-12 text-cyan-400" />
                        )}
                      </div>
                    </div>

                    {/* VS e Indicador de Turno */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-cyan-500/30 font-black italic text-4xl mb-4">VS</div>
                      <div className="w-8 h-8 rounded-full border border-cyan-900/50 flex items-center justify-center relative">
                         {(combatState.isPlayerTurn) ? (
                           <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                         ) : (
                           <div className="w-3 h-3 bg-red-500 rounded-full animate-ping shadow-[0_0_10px_rgba(239,68,68,1)]"></div>
                         )}
                      </div>
                    </div>

                    {/* Monstro Sprite */}
                    <div className="relative">
                      {dmgPopups.filter(p => p.target === 'monster').map(p => (
                        <div key={p.id} className={`absolute -top-12 left-1/2 transform -translate-x-1/2 font-black font-mono text-2xl ${p.type === 'damage' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : p.type === 'heal' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]' : p.type === 'miss' ? 'text-slate-400' : 'text-yellow-400 text-3xl drop-shadow-[0_0_15px_rgba(250,204,21,1)] animate-crit-bounce'} z-50 pointer-events-none`}>
                          {p.type === 'heal' ? '+' : p.type === 'damage' || p.type === 'crit' ? '-' : ''}{p.amount}
                        </div>
                      ))}
                      
                      <button 
                        onClick={() => setShowMonsterInfo(true)}
                        className="absolute -right-8 top-4 text-cyan-500/50 hover:text-cyan-400 bg-slate-900/80 p-1.5 rounded-full border border-cyan-900/50 hover:border-cyan-500 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all z-20"
                        title={t("Informações do Alvo")}
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      
                      <img 
                        src={`https://robohash.org/${combatState.monster.name}?set=set2&size=150x150`} 
                        onError={handleImageError} 
                        alt="Monster" 
                        className={`w-32 h-32 drop-shadow-[0_15px_15px_rgba(255,0,0,0.3)] ${dmgPopups.some(p => p.target === 'monster') ? 'animate-shake animate-hit-flash' : ''} ${attackerAnimating.monster ? 'animate-attack-left' : ''} ${combatState.isBossEnraged ? 'animate-pulse drop-shadow-[0_0_40px_rgba(255,0,0,1)]' : ''}`} 
                        style={(dmgPopups.some(p => p.target === 'monster') || attackerAnimating.monster) ? { animationDuration: combatSpeed === 'fast' ? '0.2s, 0.075s' : '0.4s, 0.15s' } : undefined}
                      />
                      
                      {/* Barras de Status do Monstro flutuantes */}
                      <div className="absolute top-28 w-24 space-y-1">
                        <div className="flex gap-1 justify-center flex-wrap mb-1 w-full">
                          {combatState.monsterStatuses?.map((s, i) => (
                            <div key={i} className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded font-bold cursor-help ${s.type==='overheat'?'bg-orange-500/20 text-orange-400 border border-orange-500/50':s.type==='corrosion'?'bg-green-500/20 text-green-400 border border-green-500/50':s.type==='stun'?'bg-slate-500/20 text-slate-400 border border-slate-500/50':'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'}`} title={t(s.type==='overheat'?'Superaquecimento: Sofre Dano Verdadeiro ao realizar ações.':s.type==='corrosion'?'Corrosão: Todos os ataques recebidos ignoram a DEF.':s.type==='stun'?'Atordoamento: Incapaz de realizar ações no próximo turno.':'Choque Elétrico: Sofre Dano Verdadeiro ao final do turno.')}>
                              {s.type==='overheat'?<Flame className="w-3 h-3" />:s.type==='corrosion'?<Droplet className="w-3 h-3" />:s.type==='stun'?<Ban className="w-3 h-3" />:<Zap className="w-3 h-3" />}
                              <span>{s.duration}</span>
                            </div>
                          ))}
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded border border-slate-700 overflow-hidden">
                          <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${(combatState.monsterHp / combatState.monster.stats.hp) * 100}%` }}></div>
                        </div>
                        {/* Barra de Stagger / Postura */}
                        <div className="w-full bg-slate-950 h-1.5 rounded border border-amber-900/60 overflow-hidden relative shadow-sm" title={combatState.isMonsterStaggered ? "💥 GUARDA QUEBRADA! Dano recebido +50%" : `Postura: ${combatState.monsterStagger}/${combatState.monsterMaxStagger}`}>
                          <div 
                            className={`h-full transition-all duration-300 ${combatState.isMonsterStaggered ? 'bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-gradient-to-r from-amber-600 to-amber-400'}`} 
                            style={{ width: `${Math.max(0, Math.min(100, (combatState.monsterStagger / combatState.monsterMaxStagger) * 100))}%` }}
                          />
                        </div>
                        <div className="text-center text-[10px] font-mono font-bold text-red-200 mt-1 uppercase tracking-widest bg-slate-900/80 rounded px-1 flex justify-between items-center">
                          <span className="truncate">{combatState.monster.name}</span>
                          {combatState.isMonsterStaggered && (
                            <span className="text-[8px] text-amber-400 font-extrabold animate-bounce ml-1">STAGGER!</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Registro de Combate (Logs) */}
              <div className="system-panel flex-1 flex flex-col min-h-[200px]">
                <div className="tech-panel-header px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-cyan-500/70" />
                    <span className="font-bold text-cyan-500/70 tracking-widest uppercase text-[10px]">Terminal de Registro</span>
                  </div>
                  <select 
                    className="bg-slate-900 border border-slate-700 text-cyan-300 text-[10px] rounded px-1 py-0.5 outline-none font-mono"
                    value={combatLogFilter}
                    onChange={(e) => setCombatLogFilter(e.target.value as 'all' | 'important')}
                  >
                    <option value="all">Tudo</option>
                    <option value="important">Eventos Importantes</option>
                  </select>
                </div>
                
                <div ref={logContainerRef} className="p-4 overflow-y-auto max-h-64 font-mono text-[11px] leading-relaxed space-y-1.5 flex-1 custom-scrollbar">
                  {combatState && combatState.logs.filter(log => {
                    if (combatLogFilter === 'all') return true;
                    const kw = ['[ANOMALIA', 'FÚRIA', 'CRÍTICO', 'Vitória', 'sucumbiu', 'derrotado', 'LEVEL UP', 'Turno', 'aplicou', 'ATORDOADO', 'PROTOCOLO', 'SOBRESCRITA', 'Curto-Circuito', 'Sinergia'];
                    return kw.some(k => log.includes(k));
                  }).map((log, i) => {
                    let logStyle = 'text-cyan-200/60';
                    let prefix = '';
                    
                    if (log.includes('Vitória')) {
                      logStyle = 'text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]';
                      prefix = '[WIN] ';
                    } else if (log.includes('derrotado') || log.includes('sucumbiu')) {
                      logStyle = 'text-red-400 font-bold drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]';
                      prefix = '[FATAL] ';
                    } else if (log.includes('LEVEL UP')) {
                      logStyle = 'text-amber-400 font-bold uppercase drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]';
                      prefix = '[SYS] ';
                    } else if (log.includes('--- Turno')) {
                      logStyle = 'text-cyan-500 mt-4 block font-bold border-b border-cyan-900/30 pb-1 mb-2 tracking-widest text-[10px] uppercase';
                    } else if (log.includes('usou')) {
                      logStyle = 'text-indigo-300';
                      prefix = '>> ';
                    } else if (log.includes('causou') || log.includes('dano')) {
                      logStyle = 'text-red-300/90';
                      prefix = '>> ';
                    } else if (log.includes('curou') || log.includes('recuperou')) {
                      logStyle = 'text-emerald-300/90';
                      prefix = '>> ';
                    } else if (log.includes('Loot:')) {
                      logStyle = 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.6)]';
                      prefix = '[LOOT] ';
                    } else {
                      prefix = '> ';
                    }
                    
                    return (
                      <div key={i} className={logStyle}>
                        {log.includes('--- Turno') ? log : <span className="opacity-70 mr-1 select-none">{prefix}</span>}
                        {log.includes('--- Turno') ? null : <span className="drop-shadow-[0_0_2px_rgba(34,211,238,0.2)]">{log}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
            
            {showMonsterInfo && combatState && (
              <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="system-panel max-w-md w-full border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                  <div className="border-b border-cyan-900/50 p-4 flex justify-between items-center bg-cyan-950/30">
                    <span className="font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-2">
                      <Info className="w-5 h-5" /> Base de Dados do Bestiário
                    </span>
                    <button onClick={() => setShowMonsterInfo(false)} className="text-slate-500 hover:text-rose-400 transition-colors">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                      <img src={`https://robohash.org/${combatState.monster.name}?set=set2&size=60x60`} alt="Target" className="w-16 h-16 bg-slate-900 rounded border border-slate-700" />
                      <div>
                        <div className="font-bold text-lg">{combatState.monster.name}</div>
                        <div className="text-xs font-mono text-cyan-500/70">{combatState.monster.loreEntry || t("Nenhuma informação adicional no banco de dados.")}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Fraquezas Físicas</div>
                        <div className="font-mono text-sm text-emerald-400">DEF Base: {combatState.monster.stats.def}</div>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Evasão / Agilidade</div>
                        <div className="font-mono text-sm text-yellow-400">AGI Base: {combatState.monster.stats.spd}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{t("Resumo de Atributos")}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-slate-900/30 px-3 py-2 rounded">
                          <span className="font-mono text-xs text-rose-400">{t("Ataque")} (ATK)</span>
                          <span className="text-xs font-bold text-rose-300">{combatState.monster.stats.atk}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/30 px-3 py-2 rounded">
                          <span className="font-mono text-xs text-emerald-400">{t("Defesa")} (DEF)</span>
                          <span className="text-xs font-bold text-emerald-300">{combatState.monster.stats.def}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/30 px-3 py-2 rounded">
                          <span className="font-mono text-xs text-yellow-400">{t("Velocidade")} (SPD)</span>
                          <span className="text-xs font-bold text-yellow-300">{combatState.monster.stats.spd}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
  );
};
