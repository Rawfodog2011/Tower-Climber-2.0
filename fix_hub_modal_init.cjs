const fs = require('fs');
let code = fs.readFileSync('src/components/HubSettingsModal.tsx', 'utf8');

code = code.replace(
  "const { sfxVolume, setSfxVolume, musicVolume, setMusicVolume, muted, setMuted, initAudio, playSfx } = useAudio();",
  "const { sfxVolume, setSfxVolume, musicVolume, setMusicVolume, muted, setMuted, init: initAudio, playSfx } = useAudio();"
);

fs.writeFileSync('src/components/HubSettingsModal.tsx', code);
