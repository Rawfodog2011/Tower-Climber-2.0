const fs = require('fs');
let code = fs.readFileSync('src/components/TimelineClosureScreen.tsx', 'utf8');

code = code.replace(/interface Props \{[\s\S]*?\}/, '');
code = code.replace(/export const TimelineClosureScreen: React\.FC<Props> = \([\s\S]*?\) => \{/, `
import { usePlayerStore } from '../store/usePlayerStore';
import { useExplorationStore } from '../store/useExplorationStore';

export const TimelineClosureScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { player } = usePlayerStore();
  const { justCompletedAll } = useExplorationStore();
`);

fs.writeFileSync('src/components/TimelineClosureScreen.tsx', code);
