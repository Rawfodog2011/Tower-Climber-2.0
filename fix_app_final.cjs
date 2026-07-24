const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<TimelineClosureScreen onComplete=\{\(\) => setScene\('main_menu'\)\} \/>/g, '<TimelineClosureScreen />');
code = code.replace(/<TutorialOverlay\s+tutorialKey=\{pendingTutorials\[0\]\}\s+onComplete=\{\(\) => \{\s+setPlayer\(\(prev: Player\) => \(\{\s+\.\.\.prev,\s+completedTutorials: \[\.\.\.\(prev\.completedTutorials \|\| \[\]\), pendingTutorials\[0\]\]\s+\}\)\);\s+\}\}\s+\/>/g, '<TutorialOverlay tutorialKey={pendingTutorials[0]} />');

fs.writeFileSync('src/App.tsx', code);
