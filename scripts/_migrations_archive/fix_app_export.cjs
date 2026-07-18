const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The file now has "export default \n\nfunction renderManufacturerBadge" or similar.
content = content.replace("export default \n", "");
content = content.replace("export default function renderManufacturerBadge", "function renderManufacturerBadge");
content = content.replace("function App() {", "export default function App() {");

fs.writeFileSync('src/App.tsx', content);
