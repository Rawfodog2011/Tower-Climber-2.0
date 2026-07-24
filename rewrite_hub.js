const fs = require('fs');
let code = fs.readFileSync('src/pages/HubScene.tsx', 'utf8');

// Replace the props interface and the function signature
code = code.replace(/interface Props \{[\s\S]*?\}/, `interface Props {
  handleEvolveClass: (id: string) => void;
}`);

code = code.replace(/export const HubScene: React\.FC<Props> = \([\s\S]*?\) => \{/, `
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useExplorationStore } from '../store/useExplorationStore';
import { useInventory } from '../hooks/useInventory';
import { useExploration } from '../hooks/useExploration';
import { calculatePlayerStats } from '../core/entities/player';
import { useMemo } from 'react';

export const HubScene: React.FC<Props> = ({ handleEvolveClass }) => {
  const { player, setPlayer } = usePlayerStore();
  const { 
    hubTab, setHubTab, 
    activeEvolutionNarrative, setActiveEvolutionNarrative, 
    activeMemoryKey, setActiveMemoryKey,
    inventoryMessage 
  } = useGameUIStore();
  const { selectedFloor, setSelectedFloor, justCompletedAll } = useExplorationStore();

  const { handleAutoEquip } = useInventory();
  const { handleStartDive } = useExploration();
  const { triggerToast } = require('../components/Toast').useToast();

  const pStatsMemo = useMemo(() => calculatePlayerStats(player), [player]);

  const renderManufacturerBadge = (manufacturer: string) => {
    return <span className="text-xs text-slate-400 bg-slate-800 px-1 rounded">{manufacturer}</span>;
  };
`);

// The code already has imports for useInventory etc, but I should probably just completely rewrite the file content if that's safer, wait, let's see the full file.
