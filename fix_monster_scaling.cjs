const fs = require('fs');
let code = fs.readFileSync('src/core/math/worldScaling.ts', 'utf8');

const replacement = `  return {
    // Monstro com HP reduzido para permitir vitórias fáceis no começo
    hp: Math.max(20, Math.floor(pStats.hp * 0.90 + floor * 8)),
    // Dano do inimigo reduzido para não pressionar demais
    atk: Math.floor(pStats.def * 0.85 + 5 + floor * 1.5),
    // Defesa ligeiramente reduzida
    def: Math.max(1, Math.floor(pStats.def * 0.25 + floor * 0.5)),
    // Velocidade
    spd: Math.max(5, Math.floor(pStats.spd * 0.80)),
    xpReward,
    goldReward,
  };`;

code = code.replace(/  return \{\n    \/\/ Monstro com HP e estatísticas para resistir a habilidades de burst e oferecer curva 50\/50\n    hp: Math\.max\(30, Math\.floor\(pStats\.hp \* 1\.25 \+ floor \* 15\)\),\n    \/\/ Dano do inimigo para pressionar o jogador\n    atk: Math\.floor\(pStats\.def \* 1\.15 \+ 10 \+ floor \* 2\.8\),\n    \/\/ Defesa proporcional\n    def: Math\.max\(1, Math\.floor\(pStats\.def \* 0\.35 \+ floor \* 0\.8\)\),\n    \/\/ Velocidade\n    spd: Math\.max\(5, Math\.floor\(pStats\.spd \* 0\.90\)\),\n    xpReward,\n    goldReward,\n  \};/, replacement);
fs.writeFileSync('src/core/math/worldScaling.ts', code);
