const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace("const logsEndRef = useRef<HTMLDivElement>(null);\n", "");
content = content.replace("<div ref={logsEndRef} />", "");
fs.writeFileSync('src/App.tsx', content);
