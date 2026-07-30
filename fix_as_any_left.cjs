const fs = require('fs');
let code = fs.readFileSync('src/components/TimelineClosureScreen.tsx', 'utf8');
code = code.replace(/\{t\(\(rewards as any\)\.epilogueHint\)\}/g, "{t(rewards.epilogueHint)}");
fs.writeFileSync('src/components/TimelineClosureScreen.tsx', code);

let code2 = fs.readFileSync('src/components/HubNavigation.tsx', 'utf8');
code2 = code2.replace(/setHubTab\(tab\.id as any\);/g, "setHubTab(tab.id as import('../store/useGameUIStore').HubTab);");
fs.writeFileSync('src/components/HubNavigation.tsx', code2);
