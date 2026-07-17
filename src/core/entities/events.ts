import { random } from '../engine/rng';
import { Player } from '../../types';
import { addXpAndLevelUp } from './player';

export interface EventOption {
  label: string;
  action: (player: Player, floor: number) => { message: string; updatedPlayer: Player; canContinue: boolean; triggerPuzzle?: boolean };
}

export interface TowerEvent {
  id: string;
  title: string;
  description: string;
  options: EventOption[];
}

export const EVENTS_DATABASE: TowerEvent[] = [
  {
    id: 'terminal_restauracao',
    title: 'Estação de Repouso Biomecânica',
    description: 'Um terminal de manutenção de androides abandonado, mas ainda conectado à rede elétrica. A cápsula de suspensão emite um brilho de estase.',
    options: [
      {
        label: 'Sincronizar (Restaurar Sistemas)',
        action: (player) => {
          const xpBonus = player.level * 80;
          let p = addXpAndLevelUp(player, xpBonus);
          return {
            message: `A cápsula injeta nano-reparadores no seu traje. Sistema recalibrado com sucesso (Restaurado). +${xpBonus} XP obtidos por baixar dados residuais!`,
            updatedPlayer: p,
            canContinue: true
          };
        }
      },
      {
        label: 'Ignorar a Cápsula',
        action: (player) => ({ message: 'O fluido parece oxidado. Você prefere não arriscar e prossegue.', updatedPlayer: player, canContinue: true })
      }
    ]
  },
  {
    id: 'mecanismo_antigo',
    title: 'Servidor Corrompido',
    description: 'Um bastidor de servidores emite faíscas. A trava de segurança de uma caixa de armazenamento está ativa, exigindo calibração manual.',
    options: [
      {
        label: 'Tentar Invadir (Bypass de Segurança)',
        action: (player) => {
          return {
            message: 'Iniciando diagnóstico das frequências do sistema de segurança...',
            updatedPlayer: player,
            canContinue: false,
            triggerPuzzle: true
          };
        }
      },
      {
        label: 'Não Arriscar Curto-Circuito',
        action: (player) => ({ message: 'A tensão oscila de forma imprevisível. Você recua antes que a segurança frite seus circuitos.', updatedPlayer: player, canContinue: true })
      }
    ]
  },
  {
    id: 'comerciante_errante',
    title: 'Drone de Contrabando',
    description: 'Um robô de carga modificado desce do teto através de cabos magnéticos. Seu display frontal projeta ofertas não-registradas no sistema principal.',
    options: [
      {
        label: 'Comprar Caixa de Componentes (1000 Créditos)',
        action: (player) => {
          if (player.gold >= 1000) {
            return {
              message: 'Transação confirmada no Block-chain local. O drone cospe 5 Fragmentos e 2 Essências antes de subir.',
              updatedPlayer: {
                ...player,
                gold: player.gold - 1000,
                materials: { ...player.materials, common: player.materials.common + 5, rare: player.materials.rare + 2 }
              },
              canContinue: true
            };
          } else {
            return {
              message: 'O display exibe [FUNDO INSUFICIENTE]. O drone aciona os propulsores e desaparece no teto escuro.',
              updatedPlayer: player,
              canContinue: true
            };
          }
        }
      },
      {
        label: 'Ignorar Transação',
        action: (player) => ({ message: 'Você recusa o handshake de conexão. O drone retrai seus cabos e some.', updatedPlayer: player, canContinue: true })
      }
    ]
  },
  {
    id: 'cache_armamento',
    title: 'Cache de Suprimentos Militar',
    description: 'Um container com selo da Kinetix semi-aberto após um desmoronamento. Há traços de radiação ao redor.',
    options: [
      {
        label: 'Saquear Rápido (-10% XP Atual, +Materiais Épicos)',
        action: (player) => {
          const xpLoss = Math.floor(player.currentXp * 0.10);
          return {
            message: `A radiação corrompe parte da sua memória de combate (Perdeu ${xpLoss} XP), mas você conseguiu resgatar 1 Núcleo Épico!`,
            updatedPlayer: {
              ...player,
              currentXp: Math.max(0, player.currentXp - xpLoss),
              materials: { ...player.materials, epic: player.materials.epic + 1 }
            },
            canContinue: true
          };
        }
      },
      {
        label: 'Evitar Radiação',
        action: (player) => ({ message: 'Seus sensores alertam risco letal de radiação. Você dá a volta com segurança.', updatedPlayer: player, canContinue: true })
      }
    ]
  }
];

export function getRandomEvent(lastEventId?: string): TowerEvent {
  let available = EVENTS_DATABASE;
  if (lastEventId) {
    available = available.filter(e => e.id !== lastEventId);
  }
  return available[Math.floor(random() * available.length)];
}
