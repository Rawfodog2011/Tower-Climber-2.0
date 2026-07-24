export type CombatFsmStateId = 
  | 'Idle'
  | 'StartBattle'
  | 'StartRound'
  | 'PlayerTurn'
  | 'ResolvePlayerAction'
  | 'EnemyTurn'
  | 'ResolveEnemyAction'
  | 'ResolveEffects'
  | 'CheckDeaths'
  | 'ResolveVictory'
  | 'ResolveDefeat'
  | 'EndRound'
  | 'BattleFinished';

export interface CombatFsmContext {
  builder: any;
  player: any;
  currentFloor: number;
  action?: any;
  changeState(newState: CombatFsmStateId): void;
}

export interface CombatFsmState {
  enter?(context: CombatFsmContext): void;
  update(context: CombatFsmContext): void;
  exit?(context: CombatFsmContext): void;
}
