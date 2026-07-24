import re

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

# Insert imports at the top
imports = """import { HubScene } from './pages/HubScene';
import { CombatScene } from './pages/CombatScene';
import { EventScene } from './pages/EventScene';
import { PuzzleScene } from './pages/PuzzleScene';
import { EnvIntroScene } from './pages/EnvIntroScene';
"""
lines.insert(2, imports)

# We need to replace the big conditional blocks.
# Let's find the start of HubScene (line contains "{scene === 'hub' ? (")
# which is around line 1462 originally (now shifted due to imports).

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
