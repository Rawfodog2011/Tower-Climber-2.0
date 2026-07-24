const fs = require('fs');
let code = fs.readFileSync('src/components/CharacterCreation.tsx', 'utf8');

code = code.replace(/interface CharacterCreationProps \{\n  onComplete: \(originId: string, name\?: string, avatar\?: string\) => void;\n\}\n\n/, '');

code = code.replace(/export function CharacterCreation\(\{ onComplete \}: CharacterCreationProps\) \{/, 
`import { usePlayerStore } from '../store/usePlayerStore';
import { useGameUIStore } from '../store/useGameUIStore';
import { Player } from '../types';

export function CharacterCreation() {
  const { setPlayer } = usePlayerStore();
  const { setScene } = useGameUIStore();
  
  const onComplete = (originId: string, name?: string, avatar?: string) => {
    setPlayer((prev: Player) => ({ ...prev, originId, name, avatar }));
    setScene('intro');
  };`);

fs.writeFileSync('src/components/CharacterCreation.tsx', code);
