const fs = require('fs');
let code = fs.readFileSync('src/components/IntroSequence.tsx', 'utf8');

code = code.replace(/interface IntroSequenceProps \{\n  onComplete: \(\) => void;\n  isContinue\?: boolean;\n\}\n\n/, '');

code = code.replace(/export function IntroSequence\(\{ onComplete, isContinue \}: IntroSequenceProps\) \{/, 
`import { useGameUIStore } from '../store/useGameUIStore';

export function IntroSequence() {
  const { isContinueRun: isContinue, setScene } = useGameUIStore();
  const onComplete = () => setScene('hub');`);

fs.writeFileSync('src/components/IntroSequence.tsx', code);
