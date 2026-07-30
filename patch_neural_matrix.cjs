const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralMatrix.tsx', 'utf8');

const pentagonGroupsCode = `
  const pentagonGroups = useMemo(() => {
    const groups: Record<string, { nodes: string[], unlockedCount: number, centerX: number, centerY: number, radius: number, isComplete: boolean, name: string, color: string }> = {};
    nodes.forEach(node => {
      const pid = node.pentagonId || 'central';
      if (!groups[pid]) {
        groups[pid] = { nodes: [], unlockedCount: 0, centerX: 0, centerY: 0, radius: 0, isComplete: false, name: pid, color: node.themeColor || '#ffffff' };
      }
      groups[pid].nodes.push(node.id);
      if (unlockedNodes.includes(node.id)) {
        groups[pid].unlockedCount++;
      }
    });

    for (const pid in groups) {
      const g = groups[pid];
      g.isComplete = g.unlockedCount === g.nodes.length;
      
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      g.nodes.forEach(nid => {
        const n = NEURAL_MATRIX_DATABASE[nid];
        if (n) {
          minX = Math.min(minX, n.x);
          maxX = Math.max(maxX, n.x);
          minY = Math.min(minY, n.y);
          maxY = Math.max(maxY, n.y);
        }
      });
      g.centerX = (minX + maxX) / 2;
      g.centerY = (minY + maxY) / 2;
      g.radius = Math.max(maxX - g.centerX, maxY - g.centerY) + 80;
    }
    return groups;
  }, [unlockedNodes]);

  useEffect(() => {
`;

code = code.replace('useEffect(() => {', pentagonGroupsCode);

fs.writeFileSync('src/components/NeuralMatrix.tsx', code);
