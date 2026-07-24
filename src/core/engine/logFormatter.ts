import { CombatEvent } from './combatEvents';

export function formatCombatEvent(event: CombatEvent): string | null {
  switch (event.type) {
    case 'TURN_STARTED':
      return `--- Rodada ${event.round} ---`;
    
    case 'ACTION_STARTED':
      return `[${event.actor === 'player' ? 'Jogador' : 'Inimigo'}] usou ${event.actionName}.`;
      
    case 'DAMAGE_APPLIED':
      return `[${event.target === 'player' ? 'Jogador' : 'Inimigo'}] recebeu ${event.amount} de dano${event.isCrit ? ' CRÍTICO!' : '.'}`;
      
    case 'HEAL_APPLIED':
      return `[${event.target === 'player' ? 'Jogador' : 'Inimigo'}] recuperou ${event.amount} HP.`;
      
    case 'MISS':
      return `[${event.target === 'player' ? 'Jogador' : 'Inimigo'}] errou o ataque.`;
      
    case 'DODGE':
      return `[${event.target === 'player' ? 'Jogador' : 'Inimigo'}] esquivou do ataque!`;
      
    case 'BLOCK':
      return `[${event.target === 'player' ? 'Jogador' : 'Inimigo'}] bloqueou o ataque!`;
      
    case 'STATUS_APPLIED':
      return `[${event.target === 'player' ? 'Jogador' : 'Inimigo'}] sofreu ${getStatusName(event.status.type)}.`;
      
    case 'STATUS_REMOVED':
      return `[${event.target === 'player' ? 'Jogador' : 'Inimigo'}] se livrou de ${event.statusType}.`;
      
    case 'STAGGER_BROKEN':
      return `[${event.target === 'player' ? 'Jogador' : 'Inimigo'}] teve a guarda QUEBRADA!`;
      
    case 'BOSS_ENRAGE_TRIGGERED':
      return `🚨 O BOSS ENTROU EM FÚRIA! STATUS AUMENTADOS! 🚨`;
      
    case 'LEVEL_UP':
      return `⬆️ LEVEL UP! Você alcançou o nível ${event.newLevel}!`;
      
    case 'FLEE_ATTEMPT':
      return event.success ? 'Você fugiu com sucesso!' : 'Falha ao tentar fugir!';
      
    case 'BOSS_PUZZLE_RESULT':
      return event.success 
        ? `🟢 PROTOCOLO CUMPRIDO! O chefe foi enfraquecido.` 
        : `🔴 PROTOCOLO FALHOU! O chefe sofreu upgrade!`;
        
    case 'MONSTER_STUNNED_SKIP':
      return `${event.monsterName} está atordoado e pulou o turno!`;
      
    case 'STAGGER_FAIL':
      return `${event.monsterName} tentou recuperar postura, mas falhou!`;
      
    case 'DEBUFF_RESISTED':
      return `[${event.target === 'player' ? 'Jogador' : 'Inimigo'}] resistiu ao debuff!`;
      
    case 'COMBAT_END':
      if (event.winner === 'player') return 'Vitória!';
      if (event.winner === 'flee') return 'Você escapou do combate.';
      if (event.winner === 'exhausted') return 'Exaustão: O combate terminou sem vencedores.';
      return 'Você foi derrotado.';

    // Events that don't produce logs:
    case 'MP_CONSUMED':
    case 'STAGGER_CHANGED':
    case 'STAGGER_RECOVERED':
    case 'PLAY_SOUND':
    case 'CAMERA_SHAKE':
    case 'WAIT':
    case 'COMBAT_START':
      return null;
  }
  return null;
}


function getStatusName(type: string): string {
  const map: Record<string, string> = {
    'stun': 'Atordoamento',
    'corrosion': 'Corrosão',
    'shock': 'Choque',
    'vuln': 'Vulnerabilidade',
    'regen': 'Regeneração',
    'strength': 'Força'
  };
  return map[type] || type;
}
