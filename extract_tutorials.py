with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

# Extract getPendingTutorials
pending_match = re.search(r'function getPendingTutorials.*?return pending;\n}', content, re.DOTALL)
if pending_match:
    pending_str = pending_match.group(0)
    content = content.replace(pending_str, '')

# Extract getTutorialName
name_match = re.search(r'function getTutorialName.*?return map\[key\] \|\| key;\n}', content, re.DOTALL)
if name_match:
    name_str = name_match.group(0)
    content = content.replace(name_str, '')

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/core/engine/tutorial.ts', 'w') as f:
    f.write("import { Player } from '../../types';\n\n")
    if pending_match:
        f.write(pending_str.replace("function getPendingTutorials", "export function getPendingTutorials") + "\n\n")
    if name_match:
        f.write(name_str.replace("function getTutorialName", "export function getTutorialName") + "\n")

