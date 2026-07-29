const fs = require('fs');
let code = fs.readFileSync('src/components/BestiaryPanel.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../store/usePlayerStore';\n\nconst handleImageError`;
code = code.replace(/interface Props \{[\s\S]*?\}\n\nconst handleImageError/, replacement);

code = code.replace(/export const BestiaryPanel: React\.FC<Props> = \(\{ player \}\) => \{/, `export const BestiaryPanel: React.FC = () => {\n  const { player } = usePlayerStore();`);

fs.writeFileSync('src/components/BestiaryPanel.tsx', code);
