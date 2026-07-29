const fs = require('fs');
let code = fs.readFileSync('src/components/AutoBattlePanel.tsx', 'utf8');

const replacement = `import { usePlayerStore } from '../store/usePlayerStore';
import { SKILLS_DATABASE } from '../core/entities/skills';

export const AutoBattlePanel: React.FC = () => {
  const { player, setPlayer } = usePlayerStore();
  
  const playerCombatSkills = React.useMemo(() => {
    return player.learnedSkills.filter(id => !SKILLS_DATABASE[id]?.isPassive);
  }, [player.learnedSkills]);`;

code = code.replace(/interface Props \{[\s\S]*?\}[\s\S]*?export const AutoBattlePanel: React\.FC<Props> = \(\{[\s\S]*?\}\) => \{/, replacement);

fs.writeFileSync('src/components/AutoBattlePanel.tsx', code);
