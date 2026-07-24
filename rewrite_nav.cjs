const fs = require('fs');
let code = fs.readFileSync('src/components/HubNavigation.tsx', 'utf8');

code = code.replace(/interface Props \{[\s\S]*?\}/, '');
code = code.replace(/export const HubNavigation: React\.FC<Props> = \([\s\S]*?\) => \{/, `
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';

export const HubNavigation: React.FC = () => {
  const { player } = usePlayerStore();
  const { hubTab, setHubTab } = useGameUIStore();
`);

fs.writeFileSync('src/components/HubNavigation.tsx', code);
