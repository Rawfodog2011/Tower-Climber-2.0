const fs = require('fs');
let code = fs.readFileSync('src/components/TimelineClosureScreen.tsx', 'utf8');

code = code.replace(/export const TimelineClosureScreen: React\.FC<\{ onComplete: \(\) => void \}> = \(\{ onComplete \}\) => \{/, 
`import { useGameUIStore } from '../store/useGameUIStore';

export const TimelineClosureScreen: React.FC = () => {
  const { setScene } = useGameUIStore();`);

code = code.replace(/onClick=\{onComplete\}/, "onClick={() => setScene('main_menu')}");
fs.writeFileSync('src/components/TimelineClosureScreen.tsx', code);
