const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace("import { Sword, Shield, Cpu, Zap, Crosshair } , Activity, Flame, Crosshair as CrosshairIcon, Terminal } from 'lucide-react';", "import { Sword, Shield, Cpu, Zap, Crosshair, Activity, Flame, Crosshair as CrosshairIcon, Terminal } from 'lucide-react';");
fs.writeFileSync('src/App.tsx', content);
