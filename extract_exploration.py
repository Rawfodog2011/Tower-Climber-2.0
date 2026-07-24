import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# We will just extract them using regex but since it failed before, let's use line numbers using splitlines().
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

funcs_to_extract = [
    'proceedWithDive',
    'handleStartDive',
    'generatePuzzle',
    'handlePuzzleSelect',
    'handleSkipPuzzle',
    'handleEventOption',
    'handleReturnToHub'
]

extracted_code = ""

for func in funcs_to_extract:
    start, end = find_func_bounds(lines, func)
    if start != -1:
        extracted_code += "\n" + "\n".join(lines[start:end+1]) + "\n"
        for i in range(start, end+1):
            lines[i] = ""

print(f"Extracted length: {len(extracted_code)}")

# Now we need to save the new App.tsx
with open('src/App.tsx', 'w') as f:
    f.write("\n".join(lines))

# And we will inject the extracted code into useExploration.ts
with open('src/hooks/useExploration.ts', 'r') as f:
    hook_content = f.read()

# Replace the body of useExploration with the extracted code
hook_content = hook_content.replace('  const handleReturnToHub = useCallback(() => {\n    setCombatState(null);\n    setActiveEvent(null);\n    setEventLog(null);\n    setActivePuzzle(null);\n    setScene(\'hub\');\n  }, [setCombatState, setActiveEvent, setEventLog, setActivePuzzle, setScene]);\n\n  return {\n    handleReturnToHub\n  };', extracted_code + '\n  return {\n    proceedWithDive,\n    handleStartDive,\n    handlePuzzleSelect,\n    handleSkipPuzzle,\n    handleEventOption,\n    handleReturnToHub\n  };\n')

with open('src/hooks/useExploration.ts', 'w') as f:
    f.write(hook_content)

