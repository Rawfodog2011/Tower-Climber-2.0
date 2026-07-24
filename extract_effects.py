import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

lines = content.splitlines()

# We will just write a function that finds all `useEffect` blocks.
def extract_all_use_effects(lines):
    effects = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith('useEffect(() => {'):
            start = i
            brace_count = 0
            paren_count = 0
            end = -1
            # Actually just look for `}, [something]);` at the same indentation
            for j in range(start, len(lines)):
                if re.match(r'^\s*\}, \[.*\]\);', lines[j]) or re.match(r'^\s*\}\);', lines[j]):
                    # Check brace counts to be sure? Not strictly necessary if formatting is consistent.
                    end = j
                    break
            if end != -1:
                effects.append((start, end))
                i = end
        i += 1
    return effects

effects = extract_all_use_effects(lines)

extracted_code = ""

for start, end in reversed(effects):
    extracted_code = "\n" + "\n".join(lines[start:end+1]) + "\n" + extracted_code
    for i in range(start, end+1):
        lines[i] = ""

print(f"Found {len(effects)} useEffects")

# Let's check triggerToast as well
start_toast = -1
end_toast = -1
for i, line in enumerate(lines):
    if line.strip() == "const triggerToast = (message: string) => {":
        start_toast = i
        for j in range(start_toast, len(lines)):
            if lines[j].strip() == "};":
                end_toast = j
                break
        break

if start_toast != -1:
    toast_code = "\n" + "\n".join(lines[start_toast:end_toast+1]) + "\n"
    for i in range(start_toast, end_toast+1):
        lines[i] = ""
    print("Found triggerToast")

with open('src/App.tsx', 'w') as f:
    f.write("\n".join(lines))

# We will create useGameEffects.ts
with open('src/hooks/useGameEffects.ts', 'w') as f:
    f.write("""import { useEffect } from 'react';
import { Player, CombatState } from '../types';
import { AudioManager } from '../core/engine/audio';
import { getSectorForFloor } from '../core/math/worldScaling';
import { getAvailableEvolutions, getClassEvolutionNarrative } from '../core/entities/classes';
import { unlockMemory } from '../core/engine/memoryCodex';
import { getAutoBattleAction } from '../core/engine/autoBattle';
import { random } from '../core/engine/rng';

export const useGameEffects = (
  player: any, setPlayer: any, scene: any, combatState: any, combatEndMessage: any, 
  combatSpeed: any, selectedFloor: any, playerCombatSkills: any, 
  handleCombatAction: any, handleStartDive: any, logContainerRef: any,
  combatLogFilter: any, prevPlayerHpRef: any, prevMonsterHpRef: any, 
  prevLogLengthRef: any, setEnrageFlash: any, setAttackerAnimating: any, 
  popupIdRef: any, setDmgPopups: any, setActiveMemoryKey: any, 
  setActiveEvolutionNarrative: any, inventoryMessage: any, 
  introStep: any, setToasts: any
) => {
""")
    if start_toast != -1:
        f.write(toast_code)
    f.write(extracted_code)
    f.write("\n  return { triggerToast };\n};\n")

