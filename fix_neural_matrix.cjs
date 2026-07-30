const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../store/usePlayerStore';

export const NeuralMatrix: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();`;

code = code.replace(/interface NeuralMatrixProps \{[\s\S]*?\}[\s\S]*?export const NeuralMatrix: React\.FC<NeuralMatrixProps> = \(\{[\s\S]*?\}\) => \{/, replacement);

fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
