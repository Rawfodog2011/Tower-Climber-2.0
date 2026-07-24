const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove prop drilling from TimelineClosureScreen
code = code.replace(/<TimelineClosureScreen player=\{player\} justCompletedAll=\{justCompletedAll\} onComplete=\{\(\) => setScene\('main_menu'\)\} \/>/, '<TimelineClosureScreen onComplete={() => setScene(\'main_menu\')} />');
// Remove unused justCompletedAll import/usage
code = code.replace(/  const \{ justCompletedAll \} = useExplorationStore\(\);\n/, '');
code = code.replace(/import \{ useExplorationStore \} from '.\/store\/useExplorationStore';\n/, '');

// MemoryFragmentScreen
code = code.replace(/<MemoryFragmentScreen\s+player=\{player\}\s+memoryKey=\{activeMemoryKey\}\s+onComplete=\{\(\) => setActiveMemoryKey\(null\)\}\s+\/>/g, 
  `<MemoryFragmentScreen\n            memoryKey={activeMemoryKey}\n            onComplete={() => setActiveMemoryKey(null)}\n          />`);

fs.writeFileSync('src/App.tsx', code);
