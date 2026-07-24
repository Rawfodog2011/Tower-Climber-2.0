const fs = require('fs');
let file = fs.readFileSync('src/core/engine/combat.ts', 'utf8');
file = file.replace(
`      if (random() < fleeChance) {
        builder.endCombat('flee', null);
        context.changeState('BattleFinished');
        return;
      } else {`,
`      if (random() < fleeChance) {
        let updatedPlayer = { ...player };
        updatedPlayer.gold = Math.max(0, Math.floor(updatedPlayer.gold * 0.9));
        const combatResult = { winner: 'flee', updatedPlayer, logs: [] };
        builder.endCombat('flee', combatResult);
        context.combatResult = combatResult;
        context.changeState('BattleFinished');
        return;
      } else {`
);

file = file.replace(
`    if (builder.getState().round > 100) {
      builder.endCombat('exhausted', null);
      context.changeState('BattleFinished');
    } else {
      context.changeState('PlayerTurn');
    }
  }
}

class ResolveDefeatState implements FsmState {
  update(context: CombatFsmContext) {
    const { builder, player } = context;
    builder.endCombat('monster', null);
    
    const penalizedPlayer = applyDeathPenalty(player);
    (context as any).combatResult = { winner: 'monster', updatedPlayer: penalizedPlayer, logs: [], trackers: builder.getState().adaptationTrackers };
    
    context.changeState('BattleFinished');
  }
}`,
`    if (builder.getState().round > 100) {
      const combatResult = { winner: 'exhausted', updatedPlayer: player, logs: [] };
      builder.endCombat('exhausted', combatResult);
      context.combatResult = combatResult;
      context.changeState('BattleFinished');
    } else {
      context.changeState('PlayerTurn');
    }
  }
}

class ResolveDefeatState implements FsmState {
  update(context: CombatFsmContext) {
    const { builder, player } = context;
    
    const penalizedPlayer = applyDeathPenalty(player);
    const combatResult = { winner: 'monster', updatedPlayer: penalizedPlayer, logs: [], trackers: builder.getState().adaptationTrackers };
    
    builder.endCombat('monster', combatResult);
    context.combatResult = combatResult;
    
    context.changeState('BattleFinished');
  }
}`
);

file = file.replace(
`    const loot = { xp: xpReward, gold: goldReward, items: itemsDropped };
    builder.endCombat('player', loot);
    
    (context as any).combatResult = { winner: 'player', updatedPlayer, logs: [], loot, trackers: state.adaptationTrackers };
    
    context.changeState('BattleFinished');
  }
}`,
`    const loot = { xp: xpReward, gold: goldReward, items: itemsDropped };
    
    const combatResult = { winner: 'player', updatedPlayer, logs: [], loot, trackers: state.adaptationTrackers };
    builder.endCombat('player', combatResult);
    context.combatResult = combatResult;
    
    context.changeState('BattleFinished');
  }
}`
);

fs.writeFileSync('src/core/engine/combat.ts', file);
