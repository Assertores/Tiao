export enum PlayerOrder{
  First,
  Second
}

export interface Player {
  readonly playerOrder: PlayerOrder
}
