const fs = require('fs');
let code = fs.readFileSync('src/components/ExpeditionPanel.tsx', 'utf8');

code = code.replace(/interface Props \{[\s\S]*?\}/, '');
code = code.replace(/export const ExpeditionPanel: React\.FC<Props> = \([\s\S]*?\) => \{/, `
import { usePlayerStore } from '../store/usePlayerStore';
import { useExplorationStore } from '../store/useExplorationStore';
import { useExploration } from '../hooks/useExploration';

export const ExpeditionPanel: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();
  const { selectedFloor, setSelectedFloor } = useExplorationStore();
  const { handleStartDive } = useExploration();
`);

fs.writeFileSync('src/components/ExpeditionPanel.tsx', code);
