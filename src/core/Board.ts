import { Cell } from './Cell'
import { JumpTarget } from './JumpTarget'
import { PlayerOrder } from './Player'
import { Position } from './Position'

export interface Board {
  readonly size: Position

  get(position: Position): Cell
  jumpTargets(player: PlayerOrder, position: Position): JumpTarget[]
  send(): void
  replay(): void
  serialization(board: Board): string
}

// NOTE: check `implementers/ConcreteBoard.ts` for use
export interface BoardFactory {
  deserialization(json: string): Board
}
