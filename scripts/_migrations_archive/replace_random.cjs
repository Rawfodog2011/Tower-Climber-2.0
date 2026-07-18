const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, depth) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('Math.random()')) return;

  const importPath = depth === 1 ? './rng' : '../engine/rng';
  
  // check if import already exists
  if (!content.includes(`import { random } from '${importPath}';`)) {
     // add import at top
     content = `import { random } from '${importPath}';\n` + content;
  }

  content = content.replace(/Math\.random\(\)/g, 'random()');
  fs.writeFileSync(filePath, content);
  console.log(`Patched ${filePath}`);
}

const engineFiles = fs.readdirSync('src/core/engine').filter(f => f.endsWith('.ts') && f !== 'rng.ts');
engineFiles.forEach(f => replaceInFile(path.join('src/core/engine', f), 1));

const entityFiles = fs.readdirSync('src/core/entities').filter(f => f.endsWith('.ts'));
entityFiles.forEach(f => replaceInFile(path.join('src/core/entities', f), 2));

const mathFiles = fs.readdirSync('src/core/math').filter(f => f.endsWith('.ts'));
mathFiles.forEach(f => replaceInFile(path.join('src/core/math', f), 2));

