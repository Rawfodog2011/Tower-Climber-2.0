const fs = require('fs');
let code = fs.readFileSync('src/components/BlackMarketPanel.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../store/usePlayerStore';

export const BlackMarketPanel: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();`;

code = code.replace(/interface Props \{[\s\S]*?\}[\s\S]*?export const BlackMarketPanel: React\.FC<Props> = \(\{[\s\S]*?\}\) => \{/, replacement);

fs.writeFileSync('src/components/BlackMarketPanel.tsx', code);
