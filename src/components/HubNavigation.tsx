import React, { useRef } from 'react';
import { Shield, Activity, Flame, Cpu, Settings, Fingerprint, Zap, Trophy, ChevronLeft, ChevronRight, User, Crosshair, ShoppingCart, Briefcase, BookOpen, Lock, BrainCircuit } from 'lucide-react';
import { Player } from '../types';
import { useTranslation } from '../core/engine/translation';

interface Props {
  hubTab: string;
  setHubTab: (tab: any) => void;
  player: Player;
}

export const HubNavigation: React.FC<Props> = ({ hubTab, setHubTab, player }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
    { id: 'conquistas', label: t('Parede de Troféus'), icon: Trophy, color: 'purple' }
  ];

  const getColorClasses = (id: string, color: string) => {
    if (hubTab === id) {
      return `bg-${color}-900/40 text-${color}-400 border-${color}-500/50 shadow-[0_0_15px_rgba(var(--${color}-500-rgb),0.2)]`;
    }
    return `text-slate-400 hover:bg-slate-800 hover:text-${color}-200 border-transparent`;
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
              onClick={() => setHubTab(tab.id)} 
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
    </div>
  );
};
