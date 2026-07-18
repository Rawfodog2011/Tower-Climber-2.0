const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace("<option value=\"hp_lt_25\">HP < 25%</option>", "<option value=\"hp_lt_25\">HP &lt; 25%</option>");
content = content.replace("<option value=\"hp_lt_50\">HP < 50%</option>", "<option value=\"hp_lt_50\">HP &lt; 50%</option>");
content = content.replace("<option value=\"hp_lt_75\">HP < 75%</option>", "<option value=\"hp_lt_75\">HP &lt; 75%</option>");
content = content.replace("<option value=\"mp_lt_50\">EP < 50%</option>", "<option value=\"mp_lt_50\">EP &lt; 50%</option>");
content = content.replace("<option value=\"enemy_hp_lt_50\">HP Inimigo < 50%</option>", "<option value=\"enemy_hp_lt_50\">HP Inimigo &lt; 50%</option>");

fs.writeFileSync('src/App.tsx', content);
