import { Player } from '../../types';

export function getPendingTutorials(player: Player): string[] {
  const completed = player.completedTutorials || [];
  const pending: string[] = [];
  
  if (!completed.includes('initial')) {
    pending.push('initial');
  }
  if ((player.level >= 3 || player.highestFloorUnlocked >= 3) && !completed.includes('adaptacoes')) {
    pending.push('adaptacoes');
  }
  if ((player.level >= 4 || player.highestFloorUnlocked >= 3) && !completed.includes('conquistas')) {
    pending.push('conquistas');
  }
  if ((player.level >= 5 || player.highestFloorUnlocked >= 5) && !completed.includes('forja')) {
    pending.push('forja');
  }
  if ((player.level >= 6 || player.highestFloorUnlocked >= 5) && !completed.includes('contratos')) {
    pending.push('contratos');
  }
  if ((player.level >= 8 || player.highestFloorUnlocked >= 8) && !completed.includes('soldagem')) {
    pending.push('soldagem');
  }
  if (player.level >= 10 && !completed.includes('habilidades')) {
    pending.push('habilidades');
  }
  if ((player.level >= 12 || player.highestFloorUnlocked >= 10) && !completed.includes('reliquias')) {
    pending.push('reliquias');
  }
  if ((player.level >= 15 || player.highestFloorUnlocked >= 15) && !completed.includes('mercado')) {
    pending.push('mercado');
  }
  if ((player.level >= 20 || player.highestFloorUnlocked >= 20) && !completed.includes('auto')) {
    pending.push('auto');
  }
  
  return pending;
}


export function getTutorialName(key: string): string {
  switch (key) {
    case 'initial': return 'Guia de Integração';
    case 'adaptacoes': return 'Painel de Adaptações';
    case 'conquistas': return 'Registro de Conquistas';
    case 'forja': return 'Forja de Equipamentos';
    case 'contratos': return 'Terminal de Contratos';
    case 'soldagem': return 'Módulo de Soldagem e Circuitos';
    case 'habilidades': return 'Matriz de Habilidades de Classe';
    case 'reliquias': return 'Dispositivo de Relíquias';
    case 'mercado': return 'Rede Mercantil Clandestina';
    case 'auto': return 'Auto-Combate e Auto-Farm';
    default: return 'Nova Tecnologia';
  }
}
