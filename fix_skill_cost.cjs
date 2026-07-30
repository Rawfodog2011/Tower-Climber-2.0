const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

const targetToReplace = `      if (nextState.playerMp < epCost) {
        logs.push(\`Energia Insuficiente para usar \${skill.name}! Atacando normalmente.\`);
        nextState.monsterHp = executeAttack('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered, activeMechanics);
        staggerDmg = 25;
      } else if (nextState.cooldowns[skill.id] > 0) {`;

const newCode = `      const useHpForSkill = activeMechanics.includes('overclock_termodinamico');

      if (useHpForSkill && nextState.playerHp <= epCost) {
        logs.push(\`[Overclock Termodinâmico] Integridade Insuficiente para usar \${skill.name}! Atacando normalmente.\`);
        nextState.monsterHp = executeAttack('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered, activeMechanics);
        staggerDmg = 25;
      } else if (!useHpForSkill && nextState.playerMp < epCost) {
        logs.push(\`Energia Insuficiente para usar \${skill.name}! Atacando normalmente.\`);
        nextState.monsterHp = executeAttack('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered, activeMechanics);
        staggerDmg = 25;
      } else if (nextState.cooldowns[skill.id] > 0) {`;

if(code.includes(`      if (nextState.playerMp < epCost) {`)) {
    code = code.replace(targetToReplace, newCode);
    console.log("Found and replaced skill check!");
} else {
    console.log("Could not find skill check block.");
}

// And fix the mp reduction:
const mpReduceOld = `        nextState.playerMp -= epCost;
        nextState.adaptationTrackers.epSpent += epCost;
        nextState.adaptationTrackers.skillsUsed += 1;`;
const mpReduceNew = `        if (useHpForSkill) {
          nextState.playerHp -= epCost;
          logs.push(\`[Overclock Termodinâmico] Drenou \${epCost} HP para energizar a habilidade!\`);
        } else {
          nextState.playerMp -= epCost;
        }
        nextState.adaptationTrackers.epSpent += epCost;
        nextState.adaptationTrackers.skillsUsed += 1;`;
code = code.replace(mpReduceOld, mpReduceNew);

fs.writeFileSync('src/core/engine/combat.ts', code);
