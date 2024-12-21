import { Board } from '../Board'
import { CanPlaceResult, Cell, CellContent } from '../Cell'
import { Player } from '../Player'
import { Position } from '../Position'
import { MutableBoard } from './MutableBoard'

export class ConcreteCell implements Cell {
  readonly content: CellContent

  public constructor(
    readonly position: Position,
    private board: MutableBoard,
  ) {}

  place(player: Player): Board {
    return this.board
  }

  canPlace(): CanPlaceResult {
    return CanPlaceResult.Success
  }
}
