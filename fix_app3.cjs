const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<MainMenu\s+hasSaveFile=\{!!savedPlayerPreview\}\s+savedPlayerPreview=\{savedPlayerPreview\}\s+onContinue=\{\(\) => \{ setIsContinueRun\(true\); setScene\('hub'\); \}\}\s+onNewGame=\{\(\) => \{ setIsContinueRun\(false\); setScene\('character_creation'\); \}\}\s+currentLanguage=\{language\}\s+onLanguageChange=\{setLanguage\}\s+\/>/g, '<MainMenu />');

code = code.replace(/<CharacterCreation\s+onComplete=\{\(originId, name, avatar\) => \{\s+setPlayer\(\(prev: Player\) => \(\{...prev, originId, name, avatar\}\)\);\s+setScene\('intro'\);\s+\}\}\s+\/>/g, '<CharacterCreation />');

code = code.replace(/<IntroSequence onComplete=\{\(\) => setScene\('hub'\)\} isContinue=\{isContinueRun\} \/>/g, '<IntroSequence />');

code = code.replace(/<EndingScreen onContinue=\{\(\) => setScene\('timeline_closure'\)\} \/>/g, '<EndingScreen />');

// also remove `Player` import if no longer used.
// Let's leave it for now.

fs.writeFileSync('src/App.tsx', code);
