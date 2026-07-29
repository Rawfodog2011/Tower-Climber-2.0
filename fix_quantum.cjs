const fs = require('fs');
let code = fs.readFileSync('src/components/QuantumPrestigePanel.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../store/usePlayerStore';

export const QuantumPrestigePanel: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();
  const onUpdatePlayer = setPlayer;`;

code = code.replace(/interface Props \{[\s\S]*?\}[\s\S]*?export const QuantumPrestigePanel: React\.FC<Props> = \(\{[\s\S]*?\}\) => \{/, replacement);
code = code.replace(/if \(onResetToFloor1\) \{\n\s*onResetToFloor1\(\);\n\s*\}/g, '');

fs.writeFileSync('src/components/QuantumPrestigePanel.tsx', code);
