const fs = require('fs');
let code = fs.readFileSync('src/components/IntroSequence.tsx', 'utf8');

code = code.replace(/interface Props \{\n  onComplete: \(\) => void;\n  isContinue\?: boolean;\n\}\n\n/, '');
code = code.replace(/export const IntroSequence: React\.FC<Props> = \(\{ onComplete, isContinue \}\) => \{/, 
`import { useGameUIStore } from '../store/useGameUIStore';

export const IntroSequence: React.FC = () => {
  const { isContinueRun: isContinue, setScene } = useGameUIStore();
  const onComplete = () => setScene('hub');`);

fs.writeFileSync('src/components/IntroSequence.tsx', code);
