const fs = require('fs');
let code = fs.readFileSync('src/components/MainMenu.tsx', 'utf8');

if (!code.includes('import { SaveManager }')) {
  code = code.replace(
    "import { SystemVoiceSelector } from './SystemVoiceSelector';",
    "import { SystemVoiceSelector } from './SystemVoiceSelector';\nimport { SaveManager } from './SaveManager';"
  );
}

const voiceSelectorStr = `                  <SystemVoiceSelector />
                </div>`;
                
const saveManagerStr = `                  <SystemVoiceSelector />
                </div>
                
                <SaveManager glitchProgress={glitchProgress} />`;

if (!code.includes('<SaveManager')) {
  code = code.replace(voiceSelectorStr, saveManagerStr);
}

fs.writeFileSync('src/components/MainMenu.tsx', code);
