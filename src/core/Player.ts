export enum PlayerOrder {
  First,
  Second,
}

export const PlayerOrderValues = Object.freeze(
  Object.values(PlayerOrder).filter((tag) => typeof tag === 'string') as [
    keyof typeof PlayerOrder,
  ],
)

export interface Player {
  readonly playerOrder: PlayerOrder
  readonly score: number
}
