const fs = require('fs');
let content = fs.readFileSync('src/core/entities/items.ts', 'utf-8');

content = content.replace(
  "import { Item, ClassDefinition, Rarity } from '../../types';",
  "import { Item, ClassDefinition, Rarity, Manufacturer } from '../../types';"
);

fs.writeFileSync('src/core/entities/items.ts', content);
