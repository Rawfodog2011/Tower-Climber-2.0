const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

// 1. Add import for calculateMatrixPower
code = code.replace(
  `import { NEURAL_MATRIX_DATABASE } from '../entities/neuralMatrix';`,
  `import { NEURAL_MATRIX_DATABASE, calculateMatrixPower } from '../entities/neuralMatrix';`
);

// 2. Add calculateMatrixPower to processTurn
const processTurnStart = `export function processTurn(
  player: Player,
  state: CombatState,
  action: CombatAction,
  currentFloor: number
): { nextState: CombatState; combatResult?: CombatResult } {
  const pStats = calculatePlayerStats(player);`;

const processTurnNewStart = `export function processTurn(
  player: Player,
  state: CombatState,
  action: CombatAction,
  currentFloor: number
): { nextState: CombatState; combatResult?: CombatResult } {
  const pStats = calculatePlayerStats(player);
  const matrixPower = calculateMatrixPower(player.unlockedNodes || [], NEURAL_MATRIX_DATABASE);
  const activeMechanics = matrixPower.activeMechanics;`;

code = code.replace(processTurnStart, processTurnNewStart);

// 3. Update skill cost logic for overclock_termodinamico
const skillCheckStart = `      if (state.anomaly && state.anomaly.id === 'emp_field') {
        epCost = 0;
      }

      if (nextState.playerMp < epCost) {
        logs.push(\`Energia Insuficiente para usar \${skill.name}! Atacando normalmente.\`);
        nextState.monsterHp = executeAttack('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered, activeMechanics);
        staggerDmg = 25;
      } else if (nextState.cooldowns[skill.id] > 0) {`;

const skillCheckNew = `      if (state.anomaly && state.anomaly.id === 'emp_field') {
        epCost = 0;
      }

      const useHpForSkill = activeMechanics.includes('overclock_termodinamico');

      if (useHpForSkill && nextState.playerHp <= epCost) {
        logs.push(\`[Overclock Termodinâmico] Integridade Insuficiente para usar \${skill.name}! Atacando normalmente.\`);
        nextState.monsterHp = executeAttack('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered, activeMechanics);
        staggerDmg = 25;
      } else if (!useHpForSkill && nextState.playerMp < epCost) {
        logs.push(\`Energia Insuficiente para usar \${skill.name}! Atacando normalmente.\`);
        nextState.monsterHp = executeAttack('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered, activeMechanics);
        staggerDmg = 25;
      } else if (nextState.cooldowns[skill.id] > 0) {`;

// Replace first occurrence of executeAttack in the file to add activeMechanics parameter
code = code.replace(
  `function executeAttack(attackerName: string, atk: number, def: number, targetHp: number, logs: string[], attackerStatuses: import('../../types').StatusEffect[] = [], targetStatuses: import('../../types').StatusEffect[] = [], attackerLvl: number = 1, defenderLvl: number = 1, anomaly?: import('../../types').CombatAnomaly, isPlayerAttacking: boolean = false, isTargetStaggered: boolean = false): number {`,
  `function executeAttack(attackerName: string, atk: number, def: number, targetHp: number, logs: string[], attackerStatuses: import('../../types').StatusEffect[] = [], targetStatuses: import('../../types').StatusEffect[] = [], attackerLvl: number = 1, defenderLvl: number = 1, anomaly?: import('../../types').CombatAnomaly, isPlayerAttacking: boolean = false, isTargetStaggered: boolean = false, activeMechanics: string[] = []): number {`
);

// We need to replace ALL executeAttack calls to include activeMechanics where applicable
code = code.replace(/executeAttack\('Jogador'/g, "executeAttack('Jogador'");
// I will just use regex to replace all `executeAttack('Jogador', ...)` inside processTurn to pass activeMechanics.
code = code.replace(/executeAttack\('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered\)/g,
                    `executeAttack('Jogador', pStats.atk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered, activeMechanics)`);

code = code.replace(/executeAttack\('Jogador \(Skill\)', skillAtk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered\)/g,
                    `executeAttack('Jogador (Skill)', skillAtk, mStats.def, nextState.monsterHp, logs, nextState.playerStatuses, nextState.monsterStatuses, player.level, currentFloor, state.anomaly, true, nextState.isMonsterStaggered, activeMechanics)`);

code = code.replace(/executeAttack\(nextState.monster.name, atkToUse, pStats.def, nextState.playerHp, logs, nextState.monsterStatuses, nextState.playerStatuses, currentFloor, player.level, state.anomaly, false\)/g,
                    `executeAttack(nextState.monster.name, atkToUse, pStats.def, nextState.playerHp, logs, nextState.monsterStatuses, nextState.playerStatuses, currentFloor, player.level, state.anomaly, false, false, activeMechanics)`);

fs.writeFileSync('src/core/engine/combat.ts', code);
console.log('Injected step 1');
