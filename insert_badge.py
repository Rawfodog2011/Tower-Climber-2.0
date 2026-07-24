with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

code = """
  const renderManufacturerBadge = (manufacturer: string) => {
    return <span className="text-xs text-slate-400 bg-slate-800 px-1 rounded">{manufacturer}</span>;
  };
"""

for i in range(len(lines)):
    if '  const handleClassEvolution = (newClassId: string) => {' in lines[i]:
        lines.insert(i, code)
        break

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
