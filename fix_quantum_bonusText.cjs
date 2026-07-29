const fs = require('fs');
let code = fs.readFileSync('src/components/QuantumPrestigePanel.tsx', 'utf8');

code = code.replace(/maxLevel: number;\n\}/, 'maxLevel: number;\n  bonusText: (level: number) => string;\n}');

code = code.replace(/id: 'hp_boost'[\s\S]*?maxLevel: 10\n\s*\}/, `id: 'hp_boost', name: 'Vitalidade Quântica', description: 'Aumenta permanentemente o HP base em +50 por nível.', icon: Heart, baseCost: 1, costMultiplier: 1.5, maxLevel: 10, bonusText: (lvl) => '+' + (lvl * 50) + ' HP' }`);
code = code.replace(/id: 'atk_boost'[\s\S]*?maxLevel: 10\n\s*\}/, `id: 'atk_boost', name: 'Sobrecarga de Dano', description: 'Aumenta permanentemente o ATK base em +5 por nível.', icon: Zap, baseCost: 1, costMultiplier: 1.5, maxLevel: 10, bonusText: (lvl) => '+' + (lvl * 5) + ' ATK' }`);
code = code.replace(/id: 'gold_boost'[\s\S]*?maxLevel: 5\n\s*\}/, `id: 'gold_boost', name: 'Algoritmo de Riqueza', description: 'Aumenta o ganho de Ouro em +10% por nível.', icon: Coins, baseCost: 2, costMultiplier: 2.0, maxLevel: 5, bonusText: (lvl) => '+' + (lvl * 10) + '% Ouro' }`);
code = code.replace(/id: 'xp_boost'[\s\S]*?maxLevel: 5\n\s*\}/, `id: 'xp_boost', name: 'Aprendizado Acelerado', description: 'Aumenta o ganho de XP em +10% por nível.', icon: Star, baseCost: 2, costMultiplier: 2.0, maxLevel: 5, bonusText: (lvl) => '+' + (lvl * 10) + '% XP' }`);

fs.writeFileSync('src/components/QuantumPrestigePanel.tsx', code);
