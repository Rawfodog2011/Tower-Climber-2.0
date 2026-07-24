const fs = require('fs');
let code = fs.readFileSync('src/components/TimelineClosureScreen.tsx', 'utf8');

code = code.replace(/onComplete\(\);/, "setScene('main_menu');");

fs.writeFileSync('src/components/TimelineClosureScreen.tsx', code);
