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
import { usePlayerStore } from '../store/usePlayerStore';
import { useInventory } from '../hooks/useInventory';
import { useCrafting } from '../hooks/useCrafting';
import { calculatePlayerStats } from '../core/entities/player';
import { CLASSES } from '../core/entities/classes';
import { canClassEquipItem } from '../core/entities/items';
import { getRarityStyle, getRarityGradient, getItemIcon, renderManufacturerBadge } from '../components/uiUtils';

export const HubScene: React.FC = () => {
  const { hubTab, setHubTab, inventoryMessage } = useGameUIStore();
  const { player, setPlayer } = usePlayerStore();
  
  const stats = React.useMemo(() => calculatePlayerStats(player), [player]);

  const { 
    handleAutoEquip, handleEquip, handleUnequip, 
    handleDismantle, handleSell, handleDismantleBatch, handleSellBatch 
  } = useInventory();

  const { 
    handleCraft, handleConvertMaterials, handleUpgradeRelic, 
    handleSocketModule, handleMergeChips, handleUnsocketModule 
  } = useCrafting();

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8">
      <HubNavigation />
      
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start w-full">
        {/* Tab Contents */}
        <div className="w-full">
          {hubTab === 'perfil' && <PlayerProfilePanel />}
          {hubTab === 'expedicao' && <ExpeditionPanel />}
          {hubTab === 'geral' && (
            <EquipmentTerminal 
              player={player}
              stats={stats}
              CLASSES={CLASSES}
              inventoryMessage={inventoryMessage}
              handleEquip={handleEquip}
              handleUnequip={handleUnequip}
              handleAutoEquip={handleAutoEquip}
              canClassEquipItem={canClassEquipItem}
              getItemIcon={getItemIcon}
              getRarityStyle={getRarityStyle}
              getRarityGradient={getRarityGradient}
              renderManufacturerBadge={renderManufacturerBadge}
            />
          )}
          {hubTab === 'habilidades' && <NeuralMatrix player={player} setPlayer={setPlayer} />}
          {hubTab === 'forja' && (
            <ForgePanel 
              player={player}
              setPlayer={setPlayer}
              handleCraft={handleCraft}
              handleConvertMaterials={handleConvertMaterials}
              handleDismantle={handleDismantle}
              handleSell={handleSell}
              handleDismantleBatch={handleDismantleBatch}
              handleSellBatch={handleSellBatch}
              inventoryMessage={inventoryMessage}
              getRarityStyle={getRarityStyle}
              getRarityGradient={getRarityGradient}
              getItemIcon={getItemIcon}
              renderManufacturerBadge={renderManufacturerBadge}
            />
          )}
          {hubTab === 'soldagem' && (
            <WeldingBenchPanel 
              player={player}
              setPlayer={setPlayer}
              handleSocketModule={handleSocketModule}
              handleUnsocketModule={handleUnsocketModule}
              handleMergeChips={handleMergeChips}
              inventoryMessage={inventoryMessage}
              getRarityStyle={getRarityStyle}
              getItemIcon={getItemIcon}
            />
          )}
          {hubTab === 'reliquias' && (
            <RelicsPanel 
              player={player}
              handleUpgradeRelic={handleUpgradeRelic}
              inventoryMessage={inventoryMessage}
            />
          )}
          {hubTab === 'bestiario' && <BestiaryPanel player={player} />}
          {hubTab === 'memorias' && <MemoryArchivePanel player={player} setPlayer={setPlayer} />}
          {hubTab === 'contratos' && <ContractsPanel player={player} setPlayer={setPlayer} />}
          {hubTab === 'mercado' && <BlackMarketPanel player={player} setPlayer={setPlayer} />}
          {hubTab === 'adaptacoes' && <AdaptationsPanel player={player} setPlayer={setPlayer} />}
          {hubTab === 'auto' && <AutoBattlePanel player={player} setPlayer={setPlayer} />}
          {hubTab === 'conquistas' && <QuantumPrestigePanel player={player} setPlayer={setPlayer} />}
        </div>
      </div>
    </div>
  );
};
