import { CombatEvent } from './combatEvents';

export function formatCombatEvent(event: CombatEvent): string | null {
  switch (event.type) {
    case 'TURN_STARTED':
      return `--- Turno ${event.round} ---`;
    case 'ACTION_STARTED':
      return `${event.actor === 'player' ? 'Jogador' : 'Inimigo'} usa ${event.actionName}!`;
    case 'DAMAGE_APPLIED':
      return `${event.source} ataca e causa ${event.amount} de dano! (HP alvo restante: ${event.newHp})`;
    case 'HEAL_APPLIED':
      return `${event.source} recupera ${event.amount} HP.`;
    case 'MISS':
      return `${event.attacker} errou o ataque em ${event.target === 'player' ? 'Jogador' : 'Inimigo'}.`;
    case 'DODGE':
      return `🛡️ [Filtro] ${event.target === 'player' ? 'Jogador' : 'Inimigo'} esquivou do ataque!`;
    case 'BLOCK':
      return `🛡️ [Bloqueio] Dano reduzido por defesa!`;
    case 'STATUS_APPLIED':
      return `[ANOMALIA] ${event.status.type.toUpperCase()} aplicado!`;
    case 'STATUS_REMOVED':
      return `${event.statusType.toUpperCase()} dissipou.`;
    case 'STAGGER_BROKEN':
      return `⚠️ GUARDA QUEBRADA! Postura rompida!`;
    case 'STAGGER_RECOVERED':
      return `🛡️ Guarda reerguida e recuperação de postura!`;
    case 'MP_CONSUMED':
      return null;
    case 'PLAY_SOUND':
    case 'CAMERA_SHAKE':
    case 'WAIT':
      return null;
    case 'COMBAT_END':
      if (event.winner === 'player') return `Vitória! O Inimigo foi derrotado.`;
      if (event.winner === 'monster') return `O jogador sucumbiu aos ferimentos...`;
      if (event.winner === 'flee') return `🏃 Retirada Tática... Você abandonou o combate!`;
      return `O combate se arrastou por tempo demais e os combatentes fugiram exaustos.`;
    case 'BOSS_ENRAGE_TRIGGERED':
      return `🔥 FÚRIA ACIONADA! O chefe entrou em modo de exterminação!`;
    case 'TEXT_MESSAGE':
      return event.text;
    case 'LEVEL_UP':
      return `🎉 LEVEL UP! O jogador atingiu o Nível ${event.newLevel}! 🎉`;
    default:
      return null;
  }
}
