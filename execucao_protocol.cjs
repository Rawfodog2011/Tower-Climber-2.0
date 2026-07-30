const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

const turnLogicEnd = `    if (nextState.playerHp > 0) executePlayerAction();
    if (nextState.monsterHp > 0) executeMonsterAction();
  } else if (state.monster.spd > pStats.spd) {
    if (nextState.monsterHp > 0) executeMonsterAction();
    if (nextState.playerHp > 0) executePlayerAction();
  } else {
    // Speed tie, random order or player first
    if (random() > 0.5) {
      if (nextState.playerHp > 0) executePlayerAction();
      if (nextState.monsterHp > 0) executeMonsterAction();
    } else {
      if (nextState.monsterHp > 0) executeMonsterAction();
      if (nextState.playerHp > 0) executePlayerAction();
    }
  }`;

const newTurnLogicEnd = `    if (nextState.playerHp > 0) executePlayerAction();
    if (nextState.monsterHp > 0) executeMonsterAction();
  } else if (state.monster.spd > pStats.spd) {
    if (nextState.monsterHp > 0) executeMonsterAction();
    if (nextState.playerHp > 0) executePlayerAction();
  } else {
    // Speed tie, random order or player first
    if (random() > 0.5) {
      if (nextState.playerHp > 0) executePlayerAction();
      if (nextState.monsterHp > 0) executeMonsterAction();
    } else {
      if (nextState.monsterHp > 0) executeMonsterAction();
      if (nextState.playerHp > 0) executePlayerAction();
    }
  }
  
  // Protocolo de Execução
  if (activeMechanics.includes('protocolo_execucao') && nextState.monsterHp > 0 && nextState.monsterHp <= mStats.hp * 0.10) {
     logs.push(\`💀 [Protocolo de Execução] Alvo com Integridade Crítica. Exterminado.\`);
     nextState.monsterHp = 0;
  }
  `;

code = code.replace(turnLogicEnd, newTurnLogicEnd);
fs.writeFileSync('src/core/engine/combat.ts', code);
console.log('Injected execution protocol');
