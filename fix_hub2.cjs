const fs = require('fs');
let code = fs.readFileSync('src/pages/HubScene.tsx', 'utf8');

code = code.replace(/import \{ Player \} from '\.\.\/types';\n/, '');
code = code.replace(/import \{ useTranslation \} from '\.\.\/core\/engine\/translation';\n/, '');
code = code.replace(/import \{ useExplorationStore \} from '\.\.\/store\/useExplorationStore';\n/, '');
code = code.replace(/import \{ useExploration \} from '\.\.\/hooks\/useExploration';\n/, '');
code = code.replace(/import \{ useInventory \} from '\.\.\/hooks\/useInventory';\n/, '');
code = code.replace(/import \{ calculatePlayerStats \} from '\.\.\/core\/entities\/player';\n/, '');
code = code.replace(/import \{ CLASSES \} from '\.\.\/core\/entities\/classes';\n/, '');
code = code.replace(/import \{ usePlayerStore \} from '\.\.\/store\/usePlayerStore';\n/, '');

code = code.replace(/  const \{ t \} = useTranslation\(\);\n/, '');
code = code.replace(/  const \{ player \} = usePlayerStore\(\);\n/, '');
code = code.replace(/  const \{ selectedFloor, setSelectedFloor \} = useExplorationStore\(\);\n/, '');
code = code.replace(/  const \{ handleStartDive \} = useExploration\(\);\n/, '');
code = code.replace(/  const pStatsMemo = useMemo\(\(\) => calculatePlayerStats\(player\), \[player\]\);\n/, '');
code = code.replace(/import React, \{ useMemo \} from 'react';/, "import React from 'react';");

fs.writeFileSync('src/pages/HubScene.tsx', code);
