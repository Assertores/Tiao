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
      return CanPlaceResult.Border
    }

    if (this.content) {
      return CanPlaceResult.Occupied
    }

    const record = new Set<Position>()

    record.clear()
    this.buildCluster({ x: this.position.x + 1, y: this.position.y }, record)
    if (record.size >= this.board.getMaxClusterSize()) {
      return CanPlaceResult.ExceedClusterSize
    }
    record.clear()
    this.buildCluster({ x: this.position.x, y: this.position.y + 1 }, record)
    if (record.size >= this.board.getMaxClusterSize()) {
      return CanPlaceResult.ExceedClusterSize
    }
    record.clear()
    this.buildCluster({ x: this.position.x - 1, y: this.position.y }, record)
    if (record.size >= this.board.getMaxClusterSize()) {
      return CanPlaceResult.ExceedClusterSize
    }
    record.clear()
    this.buildCluster({ x: this.position.x, y: this.position.y - 1 }, record)
    if (record.size >= this.board.getMaxClusterSize()) {
      return CanPlaceResult.ExceedClusterSize
    }

    return CanPlaceResult.Success
  }

  buildCluster(position: Position, record: Set<Position>): void {
    if (record.size >= this.board.getMaxClusterSize()) {
      return
    }
    if (this.board.get(position).content != this.content) {
      return
    }
    if (record.has(position)) {
      return
    }
    record.add(position)

    this.buildCluster({ x: position.x + 1, y: position.y }, record)
    this.buildCluster({ x: position.x, y: position.y + 1 }, record)
    this.buildCluster({ x: position.x - 1, y: position.y }, record)
    this.buildCluster({ x: position.x, y: position.y - 1 }, record)
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
