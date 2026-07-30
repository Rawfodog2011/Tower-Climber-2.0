import React, { useState, Suspense, lazy } from 'react';
import { HubNavigation } from '../components/HubNavigation';
import { HubSettingsModal } from '../components/HubSettingsModal';
import { PlayerProfilePanel } from '../components/PlayerProfilePanel';
import { ExpeditionPanel } from '../components/ExpeditionPanel';
import { EquipmentTerminal } from '../components/equipment/EquipmentTerminal';
import { NeuralMatrix } from '../components/NeuralMatrix';
import { ForgePanel } from '../components/ForgePanel';
import { WeldingBenchPanel } from '../components/WeldingBenchPanel';
import { MemoryArchivePanel } from '../components/MemoryArchivePanel';
import { ContractsPanel } from '../components/ContractsPanel';
import { BlackMarketPanel } from '../components/BlackMarketPanel';
import { AdaptationsPanel } from '../components/AdaptationsPanel';
import { AutoBattlePanel } from '../components/AutoBattlePanel';

// Lazy-loaded panels for initial load bundle optimization
const RelicsPanel = lazy(() => import('../components/RelicsPanel').then(m => ({ default: m.RelicsPanel })));
const BestiaryPanel = lazy(() => import('../components/BestiaryPanel').then(m => ({ default: m.BestiaryPanel })));
const AchievementsPanel = lazy(() => import('../components/AchievementsPanel').then(m => ({ default: m.AchievementsPanel })));
const QuantumPrestigePanel = lazy(() => import('../components/QuantumPrestigePanel').then(m => ({ default: m.QuantumPrestigePanel })));

const PanelLoadingFallback = () => (
  <div className="system-panel p-12 flex flex-col items-center justify-center font-mono text-cyan-400 min-h-[300px]">
    <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-3"></div>
    <div className="text-xs tracking-widest uppercase animate-pulse">Carregando Painel...</div>
  </div>
);

// Hooks and Stores
import { useGameUIStore } from '../store/useGameUIStore';
import { useExplorationStore } from '../store/useExplorationStore';
import { getSectorForFloor } from '../core/math/worldScaling';
import { AssetDictionary } from '../core/assets';

export const HubScene: React.FC = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { hubTab, setHubTab } = useGameUIStore();
    const { selectedFloor } = useExplorationStore();

    const sector = getSectorForFloor(selectedFloor);
    const Background = AssetDictionary.backgrounds[sector.hazard] || AssetDictionary.backgrounds.none;

    return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-[-1] opacity-40">
        <Background />
      </div>
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8 relative z-10">
        <HubNavigation onOpenSettings={() => setIsSettingsOpen(true)} />
        
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start w-full">
        {/* Tab Contents */}
        <div className="w-full">
          <Suspense fallback={<PanelLoadingFallback />}>
            {hubTab === 'perfil' && (
              <PlayerProfilePanel />
            )}
            {hubTab === 'expedicao' && (
               <ExpeditionPanel />
            )}
            {hubTab === 'geral' && (
              <EquipmentTerminal />
            )}
            {hubTab === 'habilidades' && (
               <NeuralMatrix />
            )}
            {hubTab === 'forja' && (
               <ForgePanel />
            )}
            {hubTab === 'soldagem' && (
               <WeldingBenchPanel />
            )}
            {hubTab === 'reliquias' && (
               <RelicsPanel />
            )}
            {hubTab === 'bestiario' && (
               <BestiaryPanel />
            )}
            {hubTab === 'memorias' && (
               <MemoryArchivePanel />
            )}
            {hubTab === 'contratos' && (
               <ContractsPanel />
            )}
            {hubTab === 'mercado' && (
               <BlackMarketPanel />
            )}
            {hubTab === 'adaptacoes' && (
               <AdaptationsPanel />
            )}
            {hubTab === 'auto' && (
               <AutoBattlePanel />
            )}
            {hubTab === 'conquistas' && (
               <AchievementsPanel />
            )}
            {hubTab === 'prestagio' && (
               <QuantumPrestigePanel />
            )}
          </Suspense>
        </div>
      </div>
      {isSettingsOpen && <HubSettingsModal onClose={() => setIsSettingsOpen(false)} />}
      </div>
    </div>
  );
};
