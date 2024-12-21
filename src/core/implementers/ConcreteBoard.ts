import { Board, BoardFactory } from '../Board'
import { CanPlaceResult, Cell } from '../Cell'
import { JumpTarget } from '../JumpTarget'
import { PlayerOrder } from '../Player'
import { Position } from '../Position'
import { MutableBoard } from './MutableBoard'
import { ConcreteCell } from './ConcreteCell'
import { ConcreteJumpTarget } from './ConcreteJumpTarget'

class ConcreteBoard implements MutableBoard {
  private cells: ConcreteCell[]

  public constructor(
    readonly size: Position,
    cells?: ConcreteCell[],
  ) {
    this.cells = []
    for (let i = 0; i < size.x * size.y; i++) {
      this.cells.push(
        new ConcreteCell(
          cells ? cells[i].content : undefined,
          cells
            ? cells[i].position
            : { x: i % size.x, y: Math.floor(i / size.x) },
          this,
        ),
      )
    }
  }

  get(position: Position): Cell {
    return this.getConcrete(position)
  }

  jumpTargets(player: PlayerOrder, position: Position): JumpTarget[] {
    const result: JumpTarget[] = []
    for (let x = position.x - 1; x <= position.x + 1; x++) {
      for (let y = position.y - 1; y <= position.y + 1; y++) {
        if (x == position.x && y == position.y) {
          continue
        }
        const current = this.get({ x: position.x + x, y: position.y + y })
        if (!current.content) {
          continue
        }
        if (current.content === player) {
          continue
        }
        const target = this.getConcrete({
          x: position.x + 2 * x,
          y: position.y + 2 * y,
        })
        if (!target.canJumpTo()) {
          continue
        }

        result.push(
          new ConcreteJumpTarget(
            player,
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

  send(): void {}

  replay(): void {}

  serialization(): string {
    return JSON.stringify({
      cells: this.cells
        .filter((element) => element.content)
        .map(({ content, position }) => ({ content, position })),
      size: this.size,
    })
  }

  copy(): MutableBoard {
    return new ConcreteBoard(this.size, this.cells)
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

  getConcrete(position: Position): ConcreteCell {
    return this.cells[position.x + position.y * this.size.x]
  }

  isInBound(position: Position): boolean {
    return (
      position.x === 0 ||
      position.y === 0 ||
      position.x === this.size.x ||
      position.y === this.size.y
    )
  }
}

export class ConcreteBoardFactory implements BoardFactory {
  deserialization(json: string): Board {
    const state = JSON.parse(json)
    if (
      typeof state.size?.x !== 'number' ||
      typeof state.size?.y !== 'number'
    ) {
      throw new Error('Board has no size.')
    }
    if (state.size.x < 0 || state.size.y < 0) {
      throw new Error('Board size is negativ.')
    }

    const result = new ConcreteBoard(state.size)

    state.cells.forEach((element: any) => {
      if (
        typeof element?.position?.x !== 'number' ||
        typeof element?.position?.y !== 'number'
      ) {
        throw new Error('Cell has no position')
      }
      if(!result.isInBound(element.position)){
        throw new Error('Cell is out of bound')
      }
      if(!Object.values(PlayerOrder).includes(element.content)){
        throw new Error('Cell content is outside of PlayerOrder enum')
      }

      result.add(element.content, element.position)
    })

    return result
  }
}
