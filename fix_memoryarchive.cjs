const fs = require('fs');
let code = fs.readFileSync('src/components/MemoryArchivePanel.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../store/usePlayerStore';

export const MemoryArchivePanel: React.FC = () => {
  const { player } = usePlayerStore();`;

code = code.replace(/interface Props \{[\s\S]*?\}[\s\S]*?export const MemoryArchivePanel: React\.FC<Props> = \(\{[\s\S]*?\}\) => \{/, replacement);

fs.writeFileSync('src/components/MemoryArchivePanel.tsx', code);
