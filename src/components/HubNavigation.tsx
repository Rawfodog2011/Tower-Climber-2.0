import React, { useRef } from 'react';
import { Shield, Activity, Flame, Cpu, Settings, Fingerprint, Zap, Trophy, ChevronLeft, ChevronRight, User, Crosshair, ShoppingCart, Briefcase, BookOpen, Lock, BrainCircuit, Sparkles } from 'lucide-react';
import { Player } from '../types';
import { useTranslation } from '../core/engine/translation';
import { useAudio } from '../core/engine/useAudio';




import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';

interface HubNavigationProps {
  onOpenSettings?: () => void;
}

export const HubNavigation: React.FC<HubNavigationProps> = ({ onOpenSettings }) => {
  const { player } = usePlayerStore();
  const { hubTab, setHubTab } = useGameUIStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { playSfx } = useAudio();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const tabs = [
    { id: 'expedicao', label: t('Expedição'), icon: Crosshair, color: 'orange' },
    { id: 'perfil', label: t('Painel do Jogador'), icon: User, color: 'emerald' },
    { id: 'geral', label: t('Equipamentos'), icon: Shield, color: 'cyan' },
    { id: 'habilidades', label: t('Matriz Neural'), icon: Activity, color: 'cyan' },
    { id: 'forja', label: t('Forja Arcana'), icon: Flame, color: 'amber' },
    { id: 'soldagem', label: t('Bancada de Soldagem'), icon: Cpu, color: 'indigo' },
    { id: 'reliquias', label: t('Sistema de Relíquias'), icon: Settings, color: 'rose' },
    { id: 'adaptacoes', label: t('Adaptações Biomec.'), icon: Fingerprint, color: 'blue' },
    { id: 'contratos', label: t('Central de Contratos'), icon: Briefcase, color: 'indigo' },
    { id: 'mercado', label: t('Rede Clandestina'), icon: ShoppingCart, color: 'red' },
    { id: 'auto', label: t('Módulos Auto'), icon: Zap, color: 'emerald' },
    { id: 'bestiario', label: t('Arquivo de Ameaças'), icon: BookOpen, color: 'red' },
    { id: 'memorias', label: t('Arquivo de Memórias'), icon: BrainCircuit, color: 'purple' },
    { id: 'prestagio', label: t('Prestígio Quântico'), icon: Sparkles, color: 'purple' },
    { id: 'conquistas', label: t('Parede de Troféus'), icon: Trophy, color: 'purple' }
  ];

  const colorStyles: Record<string, { active: string, inactive: string }> = {
    orange: { active: 'bg-orange-900/40 text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]', inactive: 'text-slate-400 hover:bg-slate-800 hover:text-orange-200 border-transparent' },
    emerald: { active: 'bg-emerald-900/40 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]', inactive: 'text-slate-400 hover:bg-slate-800 hover:text-emerald-200 border-transparent' },
    cyan: { active: 'bg-cyan-900/40 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]', inactive: 'text-slate-400 hover:bg-slate-800 hover:text-cyan-200 border-transparent' },
    amber: { active: 'bg-amber-900/40 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]', inactive: 'text-slate-400 hover:bg-slate-800 hover:text-amber-200 border-transparent' },
    indigo: { active: 'bg-indigo-900/40 text-indigo-400 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]', inactive: 'text-slate-400 hover:bg-slate-800 hover:text-indigo-200 border-transparent' },
    rose: { active: 'bg-rose-900/40 text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]', inactive: 'text-slate-400 hover:bg-slate-800 hover:text-rose-200 border-transparent' },
    blue: { active: 'bg-blue-900/40 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]', inactive: 'text-slate-400 hover:bg-slate-800 hover:text-blue-200 border-transparent' },
    red: { active: 'bg-red-900/40 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]', inactive: 'text-slate-400 hover:bg-slate-800 hover:text-red-200 border-transparent' },
    purple: { active: 'bg-purple-900/40 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]', inactive: 'text-slate-400 hover:bg-slate-800 hover:text-purple-200 border-transparent' },
  };

  const getColorClasses = (id: string, color: string) => {
    const style = colorStyles[color] || colorStyles.cyan;
    return hubTab === id ? style.active : style.inactive;
  };

  return (
    <div className="relative flex items-center w-full system-panel p-2 mb-2 lg:mb-4 border border-slate-800/50">
      <button 
        onClick={() => scroll('left')}
        className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-900/80 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors z-10 mx-1 shrink-0 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto no-scrollbar flex-1 px-1 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {tabs.map(tab => {
          const Icon = tab.icon;
          
          // Progression Lock Rules
          let isUnlocked = true;
          let lockMessage = '';

          if (tab.id === 'habilidades') {
            isUnlocked = player.level >= 10;
            lockMessage = 'Nível 10';
          } else if (tab.id === 'forja') {
            isUnlocked = player.level >= 5 || player.highestFloorUnlocked >= 5;
            lockMessage = 'Nível 5 ou Andar 5';
          } else if (tab.id === 'soldagem') {
            isUnlocked = player.level >= 8 || player.highestFloorUnlocked >= 8;
            lockMessage = 'Nível 8 ou Andar 8';
          } else if (tab.id === 'reliquias') {
            isUnlocked = player.level >= 12 || player.highestFloorUnlocked >= 10;
            lockMessage = 'Nível 12 ou Andar 10';
          } else if (tab.id === 'adaptacoes') {
            isUnlocked = player.level >= 3 || player.highestFloorUnlocked >= 3;
            lockMessage = 'Nível 3 ou Andar 3';
          } else if (tab.id === 'contratos') {
            isUnlocked = player.level >= 6 || player.highestFloorUnlocked >= 5;
            lockMessage = 'Nível 6 ou Andar 5';
          } else if (tab.id === 'mercado') {
            isUnlocked = player.level >= 15 || player.highestFloorUnlocked >= 15;
            lockMessage = 'Nível 15 ou Andar 15';
          } else if (tab.id === 'auto') {
            isUnlocked = player.level >= 20 || player.highestFloorUnlocked >= 20;
            lockMessage = 'Nível 20 ou Andar 20';
          } else if (tab.id === 'prestagio') {
            isUnlocked = player.level >= 25 || player.highestFloorUnlocked >= 25 || (player.quantumLevel || 0) > 0;
            lockMessage = 'Nível 25 ou Andar 25';
          } else if (tab.id === 'conquistas') {
            isUnlocked = player.level >= 4 || player.highestFloorUnlocked >= 3;
            lockMessage = 'Nível 4 ou Andar 3';
          }

          if (!isUnlocked) {
            return (
              <div 
                key={tab.id}
                title={`${t("Bloqueado: Requer")} ${t(lockMessage)}`}
                className="relative whitespace-nowrap px-4 py-2.5 rounded border border-slate-850 bg-slate-950/60 text-slate-600 flex items-center gap-2 cursor-not-allowed select-none opacity-40 hover:opacity-50 transition-all duration-200"
              >
                <Lock className="w-3 h-3 text-slate-700 shrink-0" />
                <Icon className="w-3.5 h-3.5 text-slate-750 shrink-0" /> 
                <span className="line-through decoration-slate-800 text-xs">{tab.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 font-mono tracking-normal normal-case shrink-0">
                  {t(lockMessage)}
                </span>
              </div>
            );
          }

          return (
            <button 
              key={tab.id}
              onClick={() => {
                setHubTab(tab.id as import('../store/useGameUIStore').HubTab);
                playSfx('ui.tab_switch');
              }} 
              onMouseEnter={() => playSfx('ui.hover')}
              className={`whitespace-nowrap px-4 py-2.5 rounded border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${getColorClasses(tab.id, tab.color)}`}
            >
              <Icon className="w-4 h-4 inline-block mr-2" /> 
              {tab.label}
            </button>
          );
        })}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-900/80 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors z-10 mx-1 shrink-0 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      {onOpenSettings && (
        <button
          onClick={onOpenSettings}
          className="ml-2 p-2 text-slate-400 hover:text-cyan-400 bg-slate-900/80 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors shrink-0 active:scale-95 flex items-center justify-center"
          title={t("Configurações e Salvamento")}
        >
          <Settings className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
