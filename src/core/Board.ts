import { Cell } from './Cell'
import { JumpTarget } from './JumpTarget'
import { PlayerOrder } from './Player'
import { Position } from './Position'

export interface BoardMemento {
  readonly size: Position
  readonly cells: { content: PlayerOrder; position: Position }[]
}

export interface Board {
  readonly size: Position
  readonly activePlayer: PlayerOrder

  get(position: Position): Cell
  jumpTargets(player: PlayerOrder, position: Position): JumpTarget[]
  endTurn(nextPlayer?: PlayerOrder): string
  replay(
    content: Position[] | string,
    nextActivePlayer: PlayerOrder,
  ): { board: Board; score: number }
  serialization(): BoardMemento
}

// NOTE: check `implementers/ConcreteBoard.ts` for use
export interface BoardFactory {
  deserialization(memento: BoardMemento, activePlayer: PlayerOrder): Board
}
