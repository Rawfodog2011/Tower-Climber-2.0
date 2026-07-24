import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Extract renderManufacturerBadge
badge_match = re.search(r'function renderManufacturerBadge.*?\}\n', content, re.DOTALL)
if badge_match:
    content = content.replace(badge_match.group(0), '')

# Extract getActiveSets
sets_match = re.search(r'function getActiveSets.*?return counts;\n}', content, re.DOTALL)
if sets_match:
    content = content.replace(sets_match.group(0), '')

# Extract createDefaultPlayer
def_match = re.search(r'function createDefaultPlayer.*?return \{\n.*?\n  \};\n}', content, re.DOTALL)
if def_match:
    content = content.replace(def_match.group(0), '')

with open('src/App.tsx', 'w') as f:
    f.write(content)
