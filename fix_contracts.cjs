const fs = require('fs');
let code = fs.readFileSync('src/components/ContractsPanel.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../store/usePlayerStore';

export const ContractsPanel: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();`;

code = code.replace(/interface Props \{[\s\S]*?\}[\s\S]*?export const ContractsPanel: React\.FC<Props> = \(\{[\s\S]*?\}\) => \{/, replacement);

fs.writeFileSync('src/components/ContractsPanel.tsx', code);
