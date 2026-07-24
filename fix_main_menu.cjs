const fs = require('fs');
let code = fs.readFileSync('src/components/MainMenu.tsx', 'utf8');

code = code.replace(/export function MainMenu\(\{[\s\S]*?\}\: \{[\s\S]*?\}\) \{/, 
`import { useGameUIStore } from '../store/useGameUIStore';

export function MainMenu() {
  const { savedPlayerPreview, setScene, setIsContinueRun } = useGameUIStore();
  const hasSaveFile = !!savedPlayerPreview;
  const { language, setLanguage } = useTranslation();
  const currentLanguage = language;
  const onLanguageChange = setLanguage;
  const onContinue = () => { setIsContinueRun(true); setScene('hub'); };
  const onNewGame = () => { setIsContinueRun(false); setScene('character_creation'); };`);

fs.writeFileSync('src/components/MainMenu.tsx', code);
