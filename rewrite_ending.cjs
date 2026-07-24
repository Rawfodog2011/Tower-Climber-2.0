const fs = require('fs');
let code = fs.readFileSync('src/components/EndingScreen.tsx', 'utf8');

code = code.replace(/interface EndingScreenProps \{[\s\S]*?\}/, '');
code = code.replace(/export function EndingScreen\(\{ player, onContinue \}: EndingScreenProps\) \{/, `
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';

export function EndingScreen({ onContinue }: { onContinue: () => void }) {
  const { player } = usePlayerStore();
  const { setScene } = useGameUIStore();
`);

fs.writeFileSync('src/components/EndingScreen.tsx', code);
