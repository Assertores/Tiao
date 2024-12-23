import { Board, BoardFactory, BoardMemento } from '../Board'
import { CanPlaceResult, Cell } from '../Cell'
import { JumpTarget } from '../JumpTarget'
import { PlayerOrder } from '../Player'
import { comparePositions, Position } from '../Position'
import { MutableBoard } from './MutableBoard'
import { CellView, ConcreteCell, OutOfBoundCell } from './ConcreteCell'
import { ConcreteJumpTarget, JumpTargetView } from './ConcreteJumpTarget'

class ConcreteBoard implements MutableBoard {
  private cells: Cell[]
  private moves: Position[]

  public constructor(
    readonly size: Position,
    private _activePlayer: PlayerOrder,
    cells?: Cell[],
    moves?: Position[],
  ) {
    this.moves = moves ? moves : []
    this.cells = []
    for (let i = 0; i < size.x * size.y; i++) {
      this.cells.push(
        new (this.moves.length === 0 ? ConcreteCell : CellView)(
          cells ? cells[i].content : undefined,
          cells
            ? cells[i].position
            : { x: i % size.x, y: Math.floor(i / size.x) },
          this,
        ),
      )
    }
  }

  get activePlayer() {
    return this._activePlayer
  }

  get(position: Position): Cell {
    if (!this.isInBound(position)) {
      return new OutOfBoundCell(undefined, position, this)
    }

    return this.cells[position.x + position.y * this.size.x]
  }

  jumpTargets(player: PlayerOrder, position: Position): JumpTarget[] {
    const result: JumpTarget[] = []
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x == position.x && y == position.y) {
          continue
        }
        const current = this.get({ x: position.x + x, y: position.y + y })
        if (current.content === undefined) {
          continue
        }
        if (current.content === player) {
          continue
        }
        const target = this.get({
          x: position.x + 2 * x,
          y: position.y + 2 * y,
        })
        if (target.content !== undefined) {
          continue
        }
        if (!this.isInBound(target.position)) {
          continue
        }

        // NOTE: you can only continue with the stone you started jumping
        const isValidJump =
          player === this.activePlayer &&
          (this.moves.length === 0 ||
            comparePositions(position, this.moves[this.moves.length - 1]))

        result.push(
          new (isValidJump ? ConcreteJumpTarget : JumpTargetView)(
            position,
            target.position,
            current.position,
            this,
          ),
        )
      }
    }
    return result
  }

  endTurn(nextPlayer?: PlayerOrder): string {
    const result = JSON.stringify(this.moves)
    this.moves = []
    if (nextPlayer !== undefined) {
      this._activePlayer = nextPlayer
    }

    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = new ConcreteCell(
        this.cells[i].content,
        this.cells[i].position,
        this,
      )
    }
    return result
  }

  replay(
    content: Position[] | string,
    nextActivePlayer: PlayerOrder,
  ): { board: Board; score: number } {
    let moves: Position[] = []
    if (typeof content === 'string') {
      try {
        moves = JSON.parse(content) as Position[]
      } catch (ex) {
        console.error('Error trying to parse replay() moves', ex)
      }
    } else {
      moves = content
    }

    if (moves.length === 0) {
      throw new Error('json does not contain moves.')
    }

    let score = 0
    let result: Board = this
    if (moves.length === 1) {
      result = result.get(moves[0]).place()
    } else {
      for (let i = 1; i < moves.length; i++) {
        const jumpTargets = result.jumpTargets(this.activePlayer, moves[i - 1])

        const target = jumpTargets.find((element: JumpTarget) =>
          comparePositions(element.destination, moves[i]),
        )
        if (!target) {
          throw new Error('player made invalid jump.')
        }

        result = target.jump()
        score++
      }
    }

    // thorws away the generated moves data
    result.endTurn(nextActivePlayer)
    return { board: result, score }
  }

  serialization(): BoardMemento {
    return {
      size: this.size,
      cells: this.cells
        .filter((element) => element.content !== undefined)
        .map(({ content, position }) => ({
          content: content as PlayerOrder,
          position,
        })),
    }
  }

  copy(): MutableBoard {
    return new ConcreteBoard(
      this.size,
      this.activePlayer,
      this.cells,
      this.moves,
    )
  }

  add(player: PlayerOrder, position: Position): void {
    this.cells[position.x + position.y * this.size.x] = new ConcreteCell(
      player,
      position,
      this,
    )
  }

  clear(position: Position): void {
    this.cells[position.x + position.y * this.size.x] = new ConcreteCell(
      undefined,
      position,
      this,
    )
  }

  record(origin: Position, target?: Position): void {
    if (target) {
      if (this.moves.length === 0) {
        this.moves = [origin, target]
      } else {
        this.moves.push(target)
      }
    } else {
      this.moves = [origin]
    }

    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = new CellView(
        this.cells[i].content,
        this.cells[i].position,
        this,
      )
    }
  }

  isInBound(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x < this.size.x &&
      position.y < this.size.y
    )
  }
}

export class ConcreteBoardFactory implements BoardFactory {
  deserialization(memento: BoardMemento, activePlayer: PlayerOrder): Board {
    if (memento.size.x < 0 || memento.size.y < 0) {
      throw new Error('Board size is negativ.')
    }

    const result = new ConcreteBoard(memento.size, activePlayer)

    memento.cells.forEach(
      (element: { content: PlayerOrder; position: Position }) => {
        if (!result.isInBound(element.position)) {
          throw new Error('Cell is out of bound')
        }

        result.add(element.content, element.position)
      },
    )

    return result
  }
}
