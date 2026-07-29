const fs = require('fs');
let code = fs.readFileSync('src/components/RelicsPanel.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useCrafting } from '../hooks/useCrafting';

export const RelicsPanel: React.FC = () => {
  const { player } = usePlayerStore();
  const { inventoryMessage } = useGameUIStore();
  const { handleUpgradeRelic } = useCrafting();`;

code = code.replace(/interface Props \{[\s\S]*?\}[\s\S]*?export const RelicsPanel: React\.FC<Props> = \(\{[\s\S]*?\}\) => \{/, replacement);

fs.writeFileSync('src/components/RelicsPanel.tsx', code);
