const fs = require('fs');
let code = fs.readFileSync('src/components/PlayerProfilePanel.tsx', 'utf8');

code = code.replace(/interface Props \{\n  player: Player;\n  CLASSES: Record<string, ClassDefinition>;\n  handleEvolveClass: \(classId: string\) => void;\n\}\n\n/, '');

code = code.replace(/export const PlayerProfilePanel: React\.FC<Props> = \(\{ player, CLASSES, handleEvolveClass \}\) => \{/, 
`import { usePlayerStore } from '../store/usePlayerStore';
import { useClassEvolution } from '../hooks/useClassEvolution';
import { CLASSES } from '../core/entities/classes';

export const PlayerProfilePanel: React.FC = () => {
  const { player } = usePlayerStore();
  const { handleEvolveClass } = useClassEvolution();`);

// Remove unused import 'ClassDefinition' if needed, but it might be used somewhere. 
// Just in case:
code = code.replace(/import \{ Player, ClassDefinition \} from '\.\.\/types';/, "import { Player } from '../types';");

fs.writeFileSync('src/components/PlayerProfilePanel.tsx', code);
