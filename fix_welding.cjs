const fs = require('fs');
let code = fs.readFileSync('src/components/WeldingBenchPanel.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../store/usePlayerStore';
import { useCrafting } from '../hooks/useCrafting';
import { getRarityStyle } from './uiUtils';

export const WeldingBenchPanel: React.FC = () => {
  const { player } = usePlayerStore();
  const { handleSocketModule, handleUnsocketModule, handleMergeChips } = useCrafting();
`;

code = code.replace(/interface Props \{[\s\S]*?\}[\s\S]*?export const WeldingBenchPanel: React\.FC<Props> = \(\{[\s\S]*?\}\) => \{/, replacement);

code = code.replace(/const renderStatModifiers = propRenderStatModifiers \|\| /, 'const renderStatModifiers = ');

fs.writeFileSync('src/components/WeldingBenchPanel.tsx', code);
