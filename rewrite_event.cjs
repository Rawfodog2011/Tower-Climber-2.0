const fs = require('fs');
let code = fs.readFileSync('src/pages/EventScene.tsx', 'utf8');

code = code.replace(/interface Props \{[\s\S]*?\}/, '');
code = code.replace(/export const EventScene: React\.FC<Props> = \([\s\S]*?\) => \{/, `
import { useExplorationStore } from '../store/useExplorationStore';
import { useExploration } from '../hooks/useExploration';

export const EventScene: React.FC = () => {
  const { activeEvent, eventLog, selectedFloor, setSelectedFloor } = useExplorationStore();
  const { handleEventOption, handleStartDive, handleReturnToHub } = useExploration();
`);

fs.writeFileSync('src/pages/EventScene.tsx', code);
