const fs = require('fs');
let code = fs.readFileSync('src/core/engine/logFormatter.ts', 'utf8');

code = code.replace(/event\.status\.name/g, 'getStatusName(event.status.type)');

code += `\n
function getStatusName(type: string): string {
  const map: Record<string, string> = {
    'stun': 'Atordoamento',
    'corrosion': 'Corrosão',
    'shock': 'Choque',
    'vuln': 'Vulnerabilidade',
    'regen': 'Regeneração',
    'strength': 'Força'
  };
  return map[type] || type;
}
`;

fs.writeFileSync('src/core/engine/logFormatter.ts', code);
