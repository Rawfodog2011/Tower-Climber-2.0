const fs = require('fs');
let code = fs.readFileSync('src/pages/PuzzleScene.tsx', 'utf8');

code = code.replace(/interface Props \{[\s\S]*?\}/, '');
code = code.replace(/export const PuzzleScene: React\.FC<Props> = \([\s\S]*?\) => \{/, `
import { useExplorationStore } from '../store/useExplorationStore';
import { useExploration } from '../hooks/useExploration';

export const PuzzleScene: React.FC = () => {
  const { activePuzzle } = useExplorationStore();
  const { handlePuzzleSelect, handleSkipPuzzle } = useExploration();
`);

fs.writeFileSync('src/pages/PuzzleScene.tsx', code);
