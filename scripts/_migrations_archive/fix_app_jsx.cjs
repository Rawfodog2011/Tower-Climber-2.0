const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  "${k} [${v}/9]${bonusText}",
  "{k} [{v}/9]{bonusText}"
);

fs.writeFileSync('src/App.tsx', content);
