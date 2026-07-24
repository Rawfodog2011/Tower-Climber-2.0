const fs = require('fs');
let code = fs.readFileSync('src/components/MemoryFragmentScreen.tsx', 'utf8');

code = code.replace(/interface Props \{[\s\S]*?\}/, '');
code = code.replace(/export const MemoryFragmentScreen: React\.FC<Props> = \([\s\S]*?\) => \{/, `
import { usePlayerStore } from '../store/usePlayerStore';

export const MemoryFragmentScreen: React.FC<{ memoryKey: string, onComplete: () => void }> = ({ memoryKey, onComplete }) => {
  const { player } = usePlayerStore();
`);

fs.writeFileSync('src/components/MemoryFragmentScreen.tsx', code);
