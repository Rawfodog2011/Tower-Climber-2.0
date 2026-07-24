const fs = require('fs');
let code = fs.readFileSync('src/components/TutorialOverlay.tsx', 'utf8');

code = code.replace(/export const TutorialOverlay: React\.FC<Props> = \(\{ tutorialKey, onComplete \}\) => \{/, 
`import { usePlayerStore } from '../store/usePlayerStore';
import { Player } from '../types';

export const TutorialOverlay: React.FC<{ tutorialKey: string }> = ({ tutorialKey }) => {
  const { setPlayer } = usePlayerStore();
  const onComplete = () => {
    setPlayer((prev: Player) => ({
      ...prev,
      completedTutorials: [...(prev.completedTutorials || []), tutorialKey]
    }));
  };`);

fs.writeFileSync('src/components/TutorialOverlay.tsx', code);
