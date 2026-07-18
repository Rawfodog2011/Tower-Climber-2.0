const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldState = `      achievements: [],
      gameStats: { monstersKilled: 0, puzzlesSolved: 0, bossesDefeated: 0 }`;

const newState = `      achievements: [],
      gameStats: { monstersKilled: 0, puzzlesSolved: 0, bossesDefeated: 0 },
      autoBattleRules: [],
      isAutoBattleActive: false`;

content = content.replace(oldState, newState);

// Also we should add a fallback for loaded save games so they don't break
const oldSaveFallback = `      saved.learnedSkills = Object.keys(SKILLS_DATABASE);

      return saved;`;

const newSaveFallback = `      saved.learnedSkills = Object.keys(SKILLS_DATABASE);
      if (!saved.autoBattleRules) saved.autoBattleRules = [];
      if (saved.isAutoBattleActive === undefined) saved.isAutoBattleActive = false;

      return saved;`;

content = content.replace(oldSaveFallback, newSaveFallback);

fs.writeFileSync('src/App.tsx', content);
