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
    if (!this.canPlace()) {
      throw new Error("tried to place on an spot that can't be placed on.")
    }

    const board = this.board.copy()
    board.add(this.board.activePlayer, this.position)
    board.record(this.position)
    return board
  }

  canPlace(): CanPlaceResult {
    if (
      this.position.x < 0 ||
      this.position.y < 0 ||
      this.position.x >= this.board.size.x ||
      this.position.y >= this.board.size.y
    ) {
      return CanPlaceResult.OutOfBound
    }

    // TODO: add playable type check

    if (!this.board.isInBound(this.position)) {
      return CanPlaceResult.Boarder
    }

    if (this.content) {
      return CanPlaceResult.Occupied
    }

    return CanPlaceResult.Success
  }

  public canJumpTo(): boolean {
    const canJumpToTarget = this.canPlace()
    return (
      canJumpToTarget != CanPlaceResult.Boarder &&
      canJumpToTarget != CanPlaceResult.Success
    )
  }
}
