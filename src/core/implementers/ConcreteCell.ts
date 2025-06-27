import { Board } from '../Board'
import { CanPlaceResult, Cell, CellContent } from '../Cell'
import { PlayerOrder } from '../Player'
import { Position } from '../Position'
import { MutableBoard } from './MutableBoard'

function neighboringPositions(position: Position): Position[] {
  return [
    { x: position.x + 1, y: position.y },
    { x: position.x, y: position.y + 1 },
    { x: position.x - 1, y: position.y },
    { x: position.x, y: position.y - 1 },
  ]
}

export class ConcreteCell implements Cell {
  public constructor(
    readonly content: CellContent,
    readonly position: Position,
    private board: MutableBoard,
  ) {}

  place(): Board {
    const canPlaceResult = this.canPlace(this.board.activePlayer)
    if (canPlaceResult !== CanPlaceResult.Success) {
      throw new Error(`Tried to place on an invalid cell: ${canPlaceResult}`)
    }

    const board = this.board.copy()
    board.add(this.board.activePlayer, this.position)
    board.record(this.position)
    return board
  }

  canPlace(playerColor: PlayerOrder): CanPlaceResult {
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

    // Checking for clusters with connected-component labelling
    const cluster = []
    const neighboringCells = [this.position]
    while (neighboringCells.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currentCell = neighboringCells.pop()! // The loop checks that the array has elements
      cluster.push(currentCell)
      const candidates = neighboringPositions(currentCell)
      candidates.forEach((position) => {
        if (this.board.get(position).content === playerColor) {
          neighboringCells.push(position)
        }
      })
    }
    if (cluster.length >= this.board.getMaxClusterSize()) {
      return CanPlaceResult.ExceedClusterSize
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
