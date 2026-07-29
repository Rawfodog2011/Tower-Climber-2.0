const fs = require('fs');
let code = fs.readFileSync('src/components/ForgePanel.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useInventory } from '../hooks/useInventory';
import { useCrafting } from '../hooks/useCrafting';
import { getRarityStyle, getRarityGradient, getItemIcon, renderManufacturerBadge } from './uiUtils';

export const ForgePanel: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();
  const { inventoryMessage } = useGameUIStore();
  const { handleDismantle, handleSell, handleDismantleBatch, handleSellBatch } = useInventory();
  const { handleCraft, handleConvertMaterials } = useCrafting();
`;

code = code.replace(/interface Props \{[\s\S]*?\}[\s\S]*?export const ForgePanel: React\.FC<Props> = \(\{[\s\S]*?\}\) => \{/, replacement);
fs.writeFileSync('src/components/ForgePanel.tsx', code);
