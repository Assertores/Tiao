import { Board } from '../Board'
import { CanPlaceResult, Cell, CellContent } from '../Cell'
import { Position } from '../Position'
import { MutableBoard } from './MutableBoard'

export class ConcreteCell implements Cell {
  public constructor(
    readonly content: CellContent,
    readonly position: Position,
    private board: MutableBoard,
  ) {}

  place(): Board {
    if (this.canPlace() !== CanPlaceResult.Success) {
      throw new Error("tried to place on an spot that can't be placed on.")
    }

    const board = this.board.copy()
    board.add(this.board.activePlayer, this.position)
    board.record(this.position)
    return board
  }

  canPlace(): CanPlaceResult {
    // TODO: add playable type check

    if (
      this.position.x === 0 ||
      this.position.y === 0 ||
      this.position.x === this.board.size.x - 1 ||
      this.position.y === this.board.size.y - 1
    ) {
      return CanPlaceResult.Boarder
    }

    if (this.content) {
      return CanPlaceResult.Occupied
    }

    return CanPlaceResult.Success
  }
}

export class CellView implements Cell {
  public constructor(
    readonly content: CellContent,
    readonly position: Position,
    private board: Board,
  ) {}

  place(): Board {
    return this.board
  }

  canPlace(): CanPlaceResult {
    return CanPlaceResult.AlreadyMadeMove
  }
}

export class OutOfBoundCell implements Cell {
  public constructor(
    readonly content: CellContent,
    readonly position: Position,
    private board: Board,
  ) {}

  place(): Board {
    return this.board
  }

  canPlace(): CanPlaceResult {
    return CanPlaceResult.OutOfBound
  }
}
