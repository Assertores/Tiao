import { Cell } from './Cell'
import { JumpTarget } from './JumpTarget'
import { PlayerOrder } from './Player'
import { Position } from './Position'

export interface Board {
  readonly size: Position
  readonly activePlayer: PlayerOrder

  get(position: Position): Cell
  jumpTargets(position: Position): JumpTarget[]
  send(): void
  replay(): void
  serialization(): string
}

// NOTE: check `implementers/ConcreteBoard.ts` for use
export interface BoardFactory {
  deserialization(json: string, activePlayer: PlayerOrder): Board
}
