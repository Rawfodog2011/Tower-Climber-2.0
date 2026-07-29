const fs = require('fs');
let code = fs.readFileSync('src/components/equipment/EquipmentTerminal.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../../store/usePlayerStore';
import { useGameUIStore } from '../../store/useGameUIStore';
import { useInventory } from '../../hooks/useInventory';
import { calculatePlayerStats } from '../../core/entities/player';
import { CLASSES } from '../../core/entities/classes';
import { canClassEquipItem } from '../../core/entities/items';
import { getItemIcon, getRarityStyle, getRarityGradient, renderManufacturerBadge } from '../uiUtils';

export const EquipmentTerminal: React.FC = () => {
  const { player } = usePlayerStore();
  const { inventoryMessage } = useGameUIStore();
  const { handleEquip, handleUnequip, handleAutoEquip } = useInventory();
  
  const stats = React.useMemo(() => calculatePlayerStats(player), [player]);
`;

code = code.replace(/interface Props \{[\s\S]*?\}[\s\S]*?export const EquipmentTerminal: React\.FC<Props> = \(\{[\s\S]*?\}\) => \{/, replacement);

fs.writeFileSync('src/components/equipment/EquipmentTerminal.tsx', code);
