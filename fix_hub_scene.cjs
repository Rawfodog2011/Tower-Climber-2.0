const fs = require('fs');
let code = fs.readFileSync('src/pages/HubScene.tsx', 'utf8');

if (!code.includes('import { HubSettingsModal }')) {
  code = code.replace(
    "import { HubNavigation } from '../components/HubNavigation';",
    "import { HubNavigation } from '../components/HubNavigation';\nimport { HubSettingsModal } from '../components/HubSettingsModal';\nimport { useState } from 'react';"
  );
  
  code = code.replace(
    "export const HubScene: React.FC = () => {",
    "export const HubScene: React.FC = () => {\n    const [isSettingsOpen, setIsSettingsOpen] = useState(false);"
  );
  
  code = code.replace(
    "<HubNavigation />",
    "<HubNavigation onOpenSettings={() => setIsSettingsOpen(true)} />"
  );
  
  const endOfReturn = "      </div>\n    </div>\n  );\n};";
  const newEndOfReturn = "      </div>\n      {isSettingsOpen && <HubSettingsModal onClose={() => setIsSettingsOpen(false)} />}\n    </div>\n  );\n};";
  
  code = code.replace(endOfReturn, newEndOfReturn);
  
  fs.writeFileSync('src/pages/HubScene.tsx', code);
}
