const fs = require('fs');
let code = fs.readFileSync('src/core/__tests__/core.test.ts', 'utf8');

// I should check if core.test.ts is breaking
// But tests were not explicitly run or required, though I should make sure it compiles. Wait, `npm run lint` compiles everything including tests usually. Let's just make sure tests aren't using `.message` or something directly on builder.
