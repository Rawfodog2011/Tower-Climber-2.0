import { Player } from '../../types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  secretDescription: string;
  rewardText: string;
  reward: { gold?: number; shards?: number };
  condition: (player: Player) => boolean;
}

export const ACHIEVEMENTS_DATABASE: Achievement[] = [
  {
    id: 'primeiro_sangue',
    name: 'Protocolo Inicial (First Blood)',
    description: 'Elimine sua primeira anomalia no complexo.',
    secretDescription: 'Apenas a primeira linha de código.',
    rewardText: '+100 Créditos',
    reward: { gold: 100 },
    condition: (player) => player.gameStats.monstersKilled >= 1
  },
  {
    id: 'cacador_veterano',
    name: 'Operador de Campo Especialista',
    description: 'Elimine 50 anomalias no complexo.',
    secretDescription: 'Um log de execução cheio de acertos.',
    rewardText: '+1 Matéria Escura',
    reward: { shards: 1 },
    condition: (player) => player.gameStats.monstersKilled >= 50
  },
  {
    id: 'maquina_mortifera',
    name: 'Exterminador Autônomo',
    description: 'Elimine 250 anomalias no complexo.',
    secretDescription: 'Uma máquina matando outras máquinas.',
    rewardText: '+3 Matérias Escuras',
    reward: { shards: 3 },
    condition: (player) => player.gameStats.monstersKilled >= 250
  },
  {
    id: 'engenheiro_torre',
    name: 'Hacker de Terminais',
    description: 'Descriptografe 3 sistemas antigos (Puzzles).',
    secretDescription: 'Nenhum firewall é capaz de parar você.',
    rewardText: '+3 Matérias Escuras',
    reward: { shards: 3 },
    condition: (player) => player.gameStats.puzzlesSolved >= 3
  },
  {
    id: 'assassino_reis',
    name: 'Derrubador de Titãs',
    description: 'Destrua um Chefe de Setor.',
    secretDescription: 'Os grandes servidores também caem.',
    rewardText: '+5 Matérias Escuras',
    reward: { shards: 5 },
    condition: (player) => player.gameStats.bossesDefeated >= 1
  },
  {
    id: 'alem_limite',
    name: 'Mergulho Profundo Nv. 1',
    description: 'Alcance a Profundeza 10.',
    secretDescription: 'O sinal da superfície já está fraco.',
    rewardText: '+500 Créditos, +1 Matéria Escura',
    reward: { gold: 500, shards: 1 },
    condition: (player) => player.highestFloorUnlocked >= 10
  },
  {
    id: 'mergulho_profundo_2',
    name: 'Mergulho Profundo Nv. 2',
    description: 'Alcance a Profundeza 25.',
    secretDescription: 'Você mal reconhece a arquitetura aqui embaixo.',
    rewardText: '+1500 Créditos, +3 Matérias Escuras',
    reward: { gold: 1500, shards: 3 },
    condition: (player) => player.highestFloorUnlocked >= 25
  },
  {
    id: 'capitalista_silicio',
    name: 'Capitalista de Silício',
    description: 'Acumule 5000 Créditos.',
    secretDescription: 'Dinheiro corporativo tem seu valor.',
    rewardText: '+2 Matérias Escuras',
    reward: { shards: 2 },
    condition: (player) => player.gold >= 5000
  },
  {
    id: 'arsenal_completo',
    name: 'Arsenal Full-Stack',
    description: 'Equipe todos os espaços corporais com hardware.',
    secretDescription: 'Mais máquina do que homem.',
    rewardText: '+500 Créditos, +1 Matéria Escura',
    reward: { gold: 500, shards: 1 },
    condition: (player) => {
      const eq = player.equipment;
      return !!(eq.weapon && eq.armor && eq.helmet && eq.pants && eq.boots && eq.bracers && eq.accessory1);
    }
  },
  {
    id: 'mestre_matriz',
    name: 'Overclock Sináptico',
    description: 'Gaste 5 Pontos de Matriz.',
    secretDescription: 'A mente conectada ao metal.',
    rewardText: '+1000 Créditos',
    reward: { gold: 1000 },
    condition: (player) => player.unlockedNodes.length >= 5
  },
  {
    id: 'adaptacao_maxima',
    name: 'Pico da Evolução Sintética',
    description: 'Alcance o nível 10 em uma Adaptação Biomecânica.',
    secretDescription: 'A carne é fraca. O aço é imortal.',
    rewardText: '+5 Matérias Escuras',
    reward: { shards: 5 },
    condition: (player) => Object.values(player.adaptations || {}).some(ad => ad.level >= 10)
  }
];

export function checkAchievements(player: Player): { unlocked: Achievement[], updatedPlayer: Player } {
  let unlocked: Achievement[] = [];
  let nextPlayer = { ...player, achievements: [...player.achievements] };

  for (const ach of ACHIEVEMENTS_DATABASE) {
    if (!nextPlayer.achievements.includes(ach.id)) {
      if (ach.condition(nextPlayer)) {
        unlocked.push(ach);
        nextPlayer.achievements.push(ach.id);
        if (ach.reward.gold) nextPlayer.gold += ach.reward.gold;
        if (ach.reward.shards) nextPlayer.soulShards += ach.reward.shards;
      }
    }
  }

  return { unlocked, updatedPlayer: nextPlayer };
}
