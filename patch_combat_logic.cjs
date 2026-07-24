const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCombatLogic.ts', 'utf8');

code = code.replace(/setCombatState\(nextState\);[\s\S]*/, 
`
    // Enqueue state sync first so that other internal variables (cooldowns, trackers, statuses) are updated behind the scenes.
    // The UI elements like HP and Logs are controlled by the queue progressively.
    // To ensure presentation state and logical state don't diverge, we apply non-visual state right away,
    // and rely on the queue to update visual HP, MP, Stagger, and Logs.
    
    // Instead of parsing here, we let the Combat Queue handle it.
    useCombatStore.getState().setActionQueue(prev => {
      const q = [...prev, ...queue];
      if (combatResult) {
         q.push({ type: 'COMBAT_END', winner: combatResult.winner, result: combatResult });
      }
      return q;
    });
    
    // We update the backend non-visual data (like statuses, cooldowns) immediately.
    // But we freeze HP/MP to their old values so the queue can animate them.
    setCombatState({
      ...nextState,
      playerHp: combatState.playerHp,
      monsterHp: combatState.monsterHp,
      playerMp: combatState.playerMp,
      monsterStagger: combatState.monsterStagger,
      logs: combatState.logs,
      round: combatState.round
    });

  }, [
    player, combatState, selectedFloor,
    setPlayer, setCombatState, setCombatEndMessage,
    triggerToast, setScene, setDmgPopups, setEnrageFlash, setAttackerAnimating
  ]);

  return { handleCombatAction };
};
`);

fs.writeFileSync('src/hooks/useCombatLogic.ts', code);
