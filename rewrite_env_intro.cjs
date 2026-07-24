const fs = require('fs');
let code = fs.readFileSync('src/pages/EnvIntroScene.tsx', 'utf8');

code = code.replace(/interface Props \{[\s\S]*?\}/, '');
code = code.replace(/export const EnvIntroScene: React\.FC<Props> = \([\s\S]*?\) => \{/, `
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { useExplorationStore } from '../store/useExplorationStore';
import { useExploration } from '../hooks/useExploration';

export const EnvIntroScene: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();
  const { introSector, setIntroSector, introStep, setIntroStep, setScene } = useGameUIStore();
  const { pendingDiveParams, setPendingDiveParams } = useExplorationStore();
  const { proceedWithDive } = useExploration();
`);

fs.writeFileSync('src/pages/EnvIntroScene.tsx', code);
