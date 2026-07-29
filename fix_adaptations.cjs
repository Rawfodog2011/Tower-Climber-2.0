const fs = require('fs');
let code = fs.readFileSync('src/components/AdaptationsPanel.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../store/usePlayerStore';

export const AdaptationsPanel: React.FC = () => {
  const { player } = usePlayerStore();`;

code = code.replace(/interface Props \{[\s\S]*?\}[\s\S]*?export const AdaptationsPanel: React\.FC<Props> = \(\{[\s\S]*?\}\) => \{/, replacement);

fs.writeFileSync('src/components/AdaptationsPanel.tsx', code);
