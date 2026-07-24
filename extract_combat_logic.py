import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

lines = content.splitlines()

def find_func_bounds(lines, func_name):
    start_idx = -1
    for i, line in enumerate(lines):
        if line.startswith(f"  const {func_name} = "):
            start_idx = i
            break
    if start_idx == -1:
        return -1, -1
        
    brace_count = 0
    end_idx = -1
    for i in range(start_idx, len(lines)):
        line = lines[i]
        brace_count += line.count('{')
        brace_count -= line.count('}')
        if brace_count == 0 and ';' in line and line.strip().endswith('};'):
            end_idx = i
            break
    return start_idx, end_idx

start, end = find_func_bounds(lines, 'handleCombatAction')

if start != -1:
    extracted_code = "\n" + "\n".join(lines[start:end+1]) + "\n"
    for i in range(start, end+1):
        lines[i] = ""
    
    with open('src/hooks/useCombatLogic.ts', 'w') as f:
        f.write("""import { useCallback } from 'react';
import { Player, CombatState, CombatAction } from '../types';
import { processTurn } from '../core/engine/combat';
import { AudioManager } from '../core/engine/audio';

export const useCombatLogic = (
  player: any, setPlayer: any, combatState: any, setCombatState: any,
  setCombatEndMessage: any, setDmgPopups: any, popupIdRef: any,
  setEnrageFlash: any, setAttackerAnimating: any, triggerToast: any,
  selectedFloor: number
) => {
""")
        f.write(extracted_code)
        f.write("\n  return { handleCombatAction };\n};\n")
    
    # Write back App.tsx
    with open('src/App.tsx', 'w') as f:
        f.write("\n".join(lines))

