import { Board } from '../Board'
import { CanPlaceResult, Cell, CellContent } from '../Cell'
import { PlayerOrder } from '../Player'
import { Position } from '../Position'
import { MutableBoard } from './MutableBoard'

export class ConcreteCell implements Cell {
  readonly content: CellContent

  public constructor(
    readonly position: Position,
    private board: MutableBoard,
  ) {}

  place(player: PlayerOrder): Board {
    if (!this.canPlace()) {
      throw new Error("tried to place on an spot that can't be placed on.")
    }

    const board = this.board.copy()
    board.add(player, this.position)
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

    if (
      this.position.x === 0 ||
      this.position.y === 0 ||
      this.position.x === this.board.size.x ||
      this.position.y === this.board.size.y
    ) {
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
