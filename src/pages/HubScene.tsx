import React from 'react';
import { HubNavigation } from '../components/HubNavigation';
import { PlayerProfilePanel } from '../components/PlayerProfilePanel';
import { ExpeditionPanel } from '../components/ExpeditionPanel';
import { EquipmentTerminal } from '../components/equipment/EquipmentTerminal';
import { NeuralMatrix } from '../components/NeuralMatrix';
import { ForgePanel } from '../components/ForgePanel';
import { WeldingBenchPanel } from '../components/WeldingBenchPanel';
import { RelicsPanel } from '../components/RelicsPanel';
import { BestiaryPanel } from '../components/BestiaryPanel';
import { MemoryArchivePanel } from '../components/MemoryArchivePanel';
import { ContractsPanel } from '../components/ContractsPanel';
import { BlackMarketPanel } from '../components/BlackMarketPanel';
import { AdaptationsPanel } from '../components/AdaptationsPanel';
import { AutoBattlePanel } from '../components/AutoBattlePanel';
import { QuantumPrestigePanel } from '../components/QuantumPrestigePanel';

// Hooks and Stores
import { useGameUIStore } from '../store/useGameUIStore';

export const HubScene: React.FC = () => {
  
  const { hubTab, setHubTab } = useGameUIStore();
  

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8">
      <HubNavigation />
      
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start w-full">
        {/* Tab Contents */}
        <div className="w-full">
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
             <QuantumPrestigePanel />
          )}
        </div>
      </div>
    </div>
  );
};
