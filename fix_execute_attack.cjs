const fs = require('fs');
let code = fs.readFileSync('src/core/engine/combat.ts', 'utf8');

const attackStart = `function executeAttack(attackerName: string, atk: number, def: number, targetHp: number, logs: string[], attackerStatuses: import('../../types').StatusEffect[] = [], targetStatuses: import('../../types').StatusEffect[] = [], attackerLvl: number = 1, defenderLvl: number = 1, anomaly?: import('../../types').CombatAnomaly, isPlayerAttacking: boolean = false, isTargetStaggered: boolean = false, activeMechanics: string[] = []): number {`;

// 1. Sobrecarga de materia (+50% DMG done if player, +15% true damage taken if player)
const dmgCalcOld = `  const dmg = calculateDamage({ 
     baseAtk: atk, 
     baseDef: finalDef, 
     additivePercentModifiers: additivePercent, 
     multiplicativeIndependentModifiers: independentMultipliers
  });`;

const dmgCalcNew = `  // Neural Matrix Mechanics
  if (isPlayerAttacking && activeMechanics.includes('sobrecarga_materia')) {
    independentMultipliers.push(1.5); // 50% mais dano
  }

  let dmg = calculateDamage({ 
     baseAtk: atk, 
     baseDef: finalDef, 
     additivePercentModifiers: additivePercent, 
     multiplicativeIndependentModifiers: independentMultipliers
  });

  if (!isPlayerAttacking && activeMechanics.includes('sobrecarga_materia')) {
    const trueDamage = Math.floor(dmg * 0.15);
    dmg += trueDamage;
    logs.push(\`⚠️ [Sobrecarga de Matéria] Dano verdadeiro adicional recebido (\${trueDamage})!\`);
  }`;

code = code.replace(dmgCalcOld, dmgCalcNew);

// 2. Protocolo de execucao (targetHp < 10% -> 0)
const hpCalcOld = `  const newHp = Math.max(0, targetHp - dmg);
  logs.push(\`\${attackerName} ataca e causa \${dmg} de dano! (HP alvo restante: \${newHp})\`);
  return newHp;
}`;

const hpCalcNew = `  let newHp = Math.max(0, targetHp - dmg);
  logs.push(\`\${attackerName} ataca e causa \${dmg} de dano! (HP alvo restante: \${newHp})\`);

  if (isPlayerAttacking && activeMechanics.includes('protocolo_execucao') && newHp > 0) {
    // We don't have max monster HP directly in executeAttack, but we can assume if it's super low or we can check the total. 
    // Wait, executeAttack only receives targetHp. I need maxHp to calculate 10%.
    // I can modify executeAttack to receive maxHp, OR I can just pass maxTargetHp to executeAttack.
    // Let's change the parameter list of executeAttack? Or just assume 10% of CURRENT targetHp? The prompt says "10% de HP".
  }
  return newHp;
}`;
// I will just add maxTargetHp to executeAttack and replace all calls. Or I can do it in processTurn.
// Actually, doing it in processTurn is safer since we have mStats.hp right there.
fs.writeFileSync('src/core/engine/combat.ts', code);
