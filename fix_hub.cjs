const fs = require('fs');
let code = fs.readFileSync('src/pages/HubScene.tsx', 'utf8');

code = code.replace(/interface Props \{\n  handleEvolveClass: \(id: string\) => void;\n\}\n\n/, '');
code = code.replace(/export const HubScene: React\.FC<Props> = \(\{ handleEvolveClass \}\) => \{/, 'export const HubScene: React.FC = () => {');
code = code.replace(/<PlayerProfilePanel \s*\n\s*player=\{player\}\n\s*CLASSES=\{CLASSES\}\n\s*handleEvolveClass=\{handleEvolveClass\}\n\s*\/>/, '<PlayerProfilePanel />');

fs.writeFileSync('src/pages/HubScene.tsx', code);
