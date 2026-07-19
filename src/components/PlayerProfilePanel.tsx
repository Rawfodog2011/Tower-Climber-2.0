import React, { useState, useEffect } from 'react';
import { Player, ClassDefinition } from '../types';
import { getAvailableEvolutions } from '../core/entities/classes';
import { calculatePlayerStats } from '../core/entities/player';
import { getXpRequiredForNextLevel } from '../core/math/progression';
import { SKILLS_DATABASE, canClassUseSkill } from '../core/entities/skills';
import { NEURAL_MATRIX_DATABASE } from '../core/entities/neuralMatrix';
import { ADAPTATIONS_DATABASE } from '../core/entities/adaptations';
import { Activity, Shield, Zap, Info, X } from 'lucide-react';
import { ORIGINS } from '../core/entities/origins';
import { useTranslation } from '../core/engine/translation';
import { useAudio } from '../core/engine/useAudio';

interface Props {
  player: Player;
  CLASSES: Record<string, ClassDefinition>;
  handleEvolveClass: (classId: string) => void;
}

export const PlayerProfilePanel: React.FC<Props> = ({ player, CLASSES, handleEvolveClass }) => {
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const stats = calculatePlayerStats(player);
  const { t } = useTranslation();
  const { playSfx } = useAudio();

  useEffect(() => {
    playSfx('ui.panel_open');
    return () => {
      playSfx('ui.panel_close');
    };
  }, [playSfx]);

  const handleToggleGlossary = (open: boolean) => {
    setIsGlossaryOpen(open);
    playSfx(open ? 'ui.panel_open' : 'ui.panel_close');
  };
  
  // Find all skills this class can use
  const availableSkills = Object.values(SKILLS_DATABASE).filter(skill => 
    canClassUseSkill(player.currentClassId, skill) || player.learnedSkills.includes(skill.id) || (player.unlockedNodes && player.unlockedNodes.some(nodeId => NEURAL_MATRIX_DATABASE[nodeId]?.skillId === skill.id))
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto">
      
      {/* Left Column: Core Status */}
      <div className="flex flex-col gap-6 w-full lg:w-[35%]">
        <div className="system-panel">
          <div className="tech-panel-header px-4 py-3 flex justify-between items-center">
            <span className="font-bold text-cyan-5 tracking-widest uppercase text-sm">{t("Status do Jogador")}</span>
            <span className="text-cyan-400 font-mono text-sm font-bold shadow-cyan-400/50">{t("Nv")} {player.level}</span>
          </div>
          
          <div className="p-4 space-y-4 text-sm font-mono">
            <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-cyan-900/50">
              <span className="text-cyan-200/60 uppercase text-xs tracking-wider">{t("Classe")}</span>
              <span className="text-emerald-400 font-bold uppercase">{t(CLASSES[player.currentClassId].name)}</span>
            </div>

            {player.originId && ORIGINS[player.originId] && (
              <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-cyan-900/50">
                <span className="text-cyan-200/60 uppercase text-xs tracking-wider">{t("Origem")}</span>
                <span className="text-cyan-400 font-bold uppercase">{t(ORIGINS[player.originId].name)}</span>
              </div>
            )}

            {/* XP Bar */}
            <div className="bg-slate-900/50 p-2 rounded border border-cyan-900/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-cyan-200/60 uppercase text-xs tracking-wider">XP</span>
                <span className="text-blue-400 text-[10px] font-bold">{player.currentXp} <span className="text-cyan-200/40">/</span> {getXpRequiredForNextLevel(player.level)}</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden flex relative border border-slate-700">
                <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${(player.currentXp / getXpRequiredForNextLevel(player.level)) * 100}%` }}></div>
                {/* Markings */}
                <div className="absolute inset-0 flex justify-between px-2">
                  <div className="w-px h-full bg-slate-900/80"></div>
                  <div className="w-px h-full bg-slate-900/80"></div>
                  <div className="w-px h-full bg-slate-900/80"></div>
                </div>
              </div>
            </div>

            {/* Gold */}
            <div className="flex justify-between items-center bg-amber-950/20 p-2 rounded border border-amber-500/20">
              <span className="text-amber-500/70 uppercase text-xs tracking-wider">{t("Ouro")}</span>
              <span className="text-amber-400 font-bold tracking-wider">{player.gold} <span className="text-amber-500/50 text-xs">{t("CRD")}</span></span>
            </div>
            
            <div className="pt-2">
              <span className="text-cyan-200/60 block mb-2 text-xs uppercase tracking-widest text-center">{t("Biometria e Atributos")}</span>
              
              {/* HP and EP Bars */}
              <div className="space-y-3 mb-4">
                {/* HP */}
                <div className="bg-slate-900/50 p-2 rounded border border-red-900/30 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-1 text-xs relative z-10">
                    <span className="text-red-400/80 uppercase tracking-wider">{t("HP (Integridade)")}</span>
                    <span className="text-red-400 font-bold">{stats.hp}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded overflow-hidden relative z-10 border border-red-950">
                    <div className="bg-red-600 h-full transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: `100%` }}></div>
                  </div>
                </div>
                
                {/* EP */}
                <div className="bg-slate-900/50 p-2 rounded border border-cyan-900/30 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-1 text-xs relative z-10">
                    <span className="text-cyan-400/80 uppercase tracking-wider">{t("EP (Energia)")}</span>
                    <span className="text-cyan-400 font-bold">{stats.mp}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded overflow-hidden relative z-10 border border-cyan-950">
                    <div className="bg-cyan-500 h-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `100%` }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['atk', 'def', 'spd'].map(stat => {
                  const val = stats[stat as keyof typeof stats];
                  const statLabels: Record<string, string> = { atk: 'T-ATK', def: 'DEF', spd: 'SPD' };
                  return (
                    <div key={stat} className="bg-slate-900/50 p-2 rounded border border-cyan-900/50 flex flex-col items-center justify-center">
                      <span className="text-cyan-500/60 uppercase text-[10px] tracking-widest mb-1">{t(statLabels[stat])}</span>
                      <span className="text-cyan-100 font-bold">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {player.originId && ORIGINS[player.originId] && (
          <div className="system-panel">
            <div className="tech-panel-header px-4 py-3 border-b border-cyan-500/20 bg-cyan-950/20">
              <span className="font-bold text-cyan-400 tracking-widest uppercase text-xs">{t("Biomarcador de Origem")}</span>
            </div>
            <div className="p-4 space-y-3 font-mono text-xs">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-900">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-cyan-400 font-bold uppercase">{t(ORIGINS[player.originId].traitName)}</span>
                  <span className="text-[9px] text-cyan-500/80 border border-cyan-500/20 px-1 rounded uppercase">{t("TRAÇO")}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{t(ORIGINS[player.originId].traitDescription)}</p>
              </div>
              <div className="p-2.5 bg-slate-950/40 rounded border border-slate-900">
                <span className="text-slate-500 uppercase block mb-1">{t("Registro Histórico")}</span>
                <p className="text-slate-400 text-[11px] leading-relaxed italic">{t(ORIGINS[player.originId].description)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Evolution Panel */}
        {getAvailableEvolutions(player.currentClassId, player.level).length > 0 && (
          <div className="system-panel">
            <div className="border-b border-cyan-500/20 bg-amber-950/40 px-4 py-3">
              <span className="font-bold text-amber-400 tracking-widest uppercase text-sm">{t("Evolução Disponível")}</span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-amber-200/70 font-mono">{t("Seu poder atingiu um novo patamar. Escolha seu caminho:")}</p>
              {getAvailableEvolutions(player.currentClassId, player.level).map(cls => (
                <button
                  key={cls.id}
                  onClick={() => handleEvolveClass(cls.id)}
                  className="w-full bg-amber-950/30 hover:bg-amber-900/50 border border-amber-500/50 text-amber-100 font-bold py-2 px-3 rounded uppercase tracking-wider transition-all text-sm text-left flex flex-col cursor-pointer hover:shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                >
                  <span>{t(cls.name)}</span>
                  <span className="text-[10px] text-amber-200/50 normal-case tracking-normal mt-1">{t(cls.description)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Skills */}
      <div className="flex flex-col gap-6 w-full lg:w-[65%]">
        <div className="system-panel h-full flex flex-col">
          <div className="tech-panel-header px-4 py-3 border-b border-indigo-500/30 bg-indigo-950/20 flex justify-between items-center">
            <span className="font-bold text-indigo-400 tracking-widest uppercase text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {t("Protocolos de Combate (Habilidades)")}
            </span>
            <button
              onClick={() => handleToggleGlossary(true)}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs font-mono uppercase tracking-widest bg-indigo-950/50 px-2 py-1 rounded border border-indigo-500/30 hover:border-indigo-500/80 transition-colors cursor-pointer"
            >
              <Info className="w-3 h-3" /> {t("Glossário de Status")}
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4">
             {availableSkills.map(skill => {
                 let sourceLabel = t('Protocolo de Classe');
                 let borderColor = 'border-cyan-900/50 hover:border-cyan-500/50';
                 let titleColor = 'text-cyan-300';
                 let tagColor = 'bg-cyan-950 text-cyan-400 border-cyan-900/50';
                 
                 const fromNeural = player.unlockedNodes?.some(nodeId => NEURAL_MATRIX_DATABASE[nodeId]?.skillId === skill.id);
                 const fromAdaptation = Object.values(ADAPTATIONS_DATABASE).some(def => def.isFusion && def.grantedSkillId === skill.id && player.learnedSkills.includes(skill.id));
                 
                 const isClassSkill = canClassUseSkill(player.currentClassId, skill);
                 
                 if (isClassSkill && fromNeural) {
                    sourceLabel = t('Protocolo Evoluído');
                    borderColor = 'border-transparent [background:linear-gradient(rgba(15,23,42,1),rgba(15,23,42,1))_padding-box,linear-gradient(to_right,#06b6d4,#f59e0b)_border-box]';
                    titleColor = 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400';
                    tagColor = 'bg-slate-900 text-cyan-100 border-transparent [background:linear-gradient(rgba(15,23,42,1),rgba(15,23,42,1))_padding-box,linear-gradient(to_right,#06b6d4,#f59e0b)_border-box]';
                 } else if (fromAdaptation) {
                    sourceLabel = t('Sinergia Biomecânica');
                    borderColor = 'border-purple-900/50 hover:border-purple-500/50';
                    titleColor = 'text-purple-300';
                    tagColor = 'bg-purple-950 text-purple-400 border-purple-900/50';
                 } else if (isClassSkill) {
                    sourceLabel = t('Protocolo de Classe');
                    borderColor = 'border-cyan-900/50 hover:border-cyan-500/50';
                    titleColor = 'text-cyan-300';
                    tagColor = 'bg-cyan-950 text-cyan-400 border-cyan-900/50';
                 } else if (fromNeural) {
                    sourceLabel = t('Matriz Neural');
                    borderColor = 'border-amber-900/50 hover:border-amber-500/50';
                    titleColor = 'text-amber-300';
                    tagColor = 'bg-amber-950 text-amber-400 border-amber-900/50';
                 } else {
                     sourceLabel = t('Habilidade Adquirida');
                     borderColor = 'border-indigo-900/50 hover:border-indigo-500/50';
                     titleColor = 'text-indigo-300';
                     tagColor = 'bg-indigo-950 text-indigo-400 border-indigo-900/50';
                 }
                 
                 return (
               <div key={skill.id} className={`bg-slate-900/60 p-4 rounded-xl border ${borderColor} transition-colors relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-slate-950/50 text-[8px] font-mono uppercase tracking-widest border-b border-l border-slate-800/50 text-slate-400">
                    {sourceLabel}
                  </div>
                  <div className="flex justify-between items-start mb-2 mt-2">
                    <h3 className={`font-bold ${titleColor} text-lg`}>{t(skill.name)}</h3>
                    <span className={`${tagColor} px-2 py-1 rounded text-xs font-mono font-bold border`}>
                      {t("CUSTO")}: {skill.mpCost} EP
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                    {t(skill.description)}
                  </p>
                  
                  <div className="flex gap-4">
                    {skill.cooldown > 0 && (
                      <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {t("CD")}: {skill.cooldown} {t("TURNOS")}
                      </span>
                    )}
                    
                    {skill.type === 'damage' && (
                      <span className="text-xs font-mono text-red-400/80 bg-red-950/30 px-2 py-1 rounded border border-red-900/50">
                        {t("DMG")}: {skill.multiplier * 100}% T-ATK
                      </span>
                    )}
                    {skill.type === 'heal' && (
                      <span className="text-xs font-mono text-emerald-400/80 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50">
                        {t("HEAL")}: {skill.multiplier * 100}% MAX HP
                      </span>
                    )}
                    {skill.applyStatus && (
                      <span className="text-xs font-mono text-purple-400/80 bg-purple-950/30 px-2 py-1 rounded border border-purple-900/50">
                        {t("APLICA")}: {t(skill.applyStatus.type.toUpperCase())}
                      </span>
                    )}
                  </div>
               </div>
             )})}
             
             {availableSkills.length === 0 && (
                <div className="h-32 flex items-center justify-center text-slate-500 font-mono text-sm border border-dashed border-slate-700 rounded-xl">
                  {t("Nenhum protocolo ativo encontrado.")}
                </div>
             )}
          </div>
        </div>
      </div>

      {isGlossaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="system-panel w-full max-w-2xl max-h-[90vh] flex flex-col relative border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <div className="flex justify-between items-center p-4 border-b border-indigo-500/30 bg-indigo-950/20">
              <h2 className="font-bold text-indigo-400 tracking-widest uppercase flex items-center gap-2">
                <Info className="w-5 h-5" /> 
                {t("Diretório de Anomalias & Status")}
              </h2>
              <button 
                onClick={() => handleToggleGlossary(false)}
                className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-emerald-900/50 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 text-xs font-mono uppercase tracking-widest rounded">
                    {t("Corrosão")}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {t("Dano persistente causado no início do turno (DoT). Normalmente retira 5% do HP Máximo ou um valor fixo da habilidade. Em zonas como a")} <span className="text-emerald-400 font-bold">{t("Refinaria Tóxica")}</span>{t(", a taxa de decomposição é")} <strong>{t("dobrada")}</strong>.
                </p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-red-900/50 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-red-950/50 border border-red-900/50 text-red-400 text-xs font-mono uppercase tracking-widest rounded">
                    {t("Sobreaquecimento")}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {t("Compromete a integridade estrutural do alvo. A entidade afetada recebe")} <strong>{t("30% a mais de dano")}</strong> {t("de todas as fontes. Em zonas termais extremas como a")} <span className="text-red-400 font-bold">{t("Fornalha de Plasma")}</span>{t(", a duração desse efeito é estendida.")}
                </p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-cyan-900/50 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-cyan-950/50 border border-cyan-900/50 text-cyan-400 text-xs font-mono uppercase tracking-widest rounded">
                    {t("Choque")}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {t("Causa pane elétrica nos sistemas de mira e locomoção. A entidade tem")} <strong>{t("30% de chance de falhar")}</strong> {t("e errar seu ataque no turno (\"Curto-Circuito\"). Além disso, os ataques recebidos por um alvo eletrizado causam")} <strong>{t("50% de dano adicional")}</strong> {t("(Sinergia de Choque).")}
                </p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-amber-900/50 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-amber-950/50 border border-amber-900/50 text-amber-400 text-xs font-mono uppercase tracking-widest rounded">
                    {t("Atordoamento")}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {t("Desativação completa e temporária dos sistemas primários. O alvo é forçado a")} <strong>{t("pular o próprio turno")}</strong>{t(", não realizando ataques nem ações defensivas.")}
                </p>
              </div>
            </div>
            
            <div className="p-4 border-t border-indigo-500/30 bg-indigo-950/20 text-center">
               <span className="text-xs text-indigo-400/60 font-mono">ARQUIVO // COMBAT_PROTOCOLS_V1.9</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
