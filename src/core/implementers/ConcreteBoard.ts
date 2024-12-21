import { Board, BoardFactory } from '../Board'
import { Cell } from '../Cell'
import { JumpTarget } from '../JumpTarget'
import { Player } from '../Player'
import { Position } from '../Position'
import { MutableBoard } from './MutableBoard'
import { ConcreteCell } from './ConcreteCell'
import { ConcreteJumpTarget } from './ConcreteJumpTarget'

class ConcreteBoard implements MutableBoard {
  readonly size: unknown

  get(position: Position): Cell {
    return new ConcreteCell(position, this)
  }

  jumpTargets(player: Player, position: Position): JumpTarget[] {
    return [new ConcreteJumpTarget(player, position, position, position, this)]
  }

  send(): void {}

  replay(): void {}

  serialization(board: Board): string {
    return ''
  }

  copy(): MutableBoard {
    return this
  }

  add(player: Player, position: Position): void {}

  clear(position: Position): void {}
}

export class ConcreteBoardFactory implements BoardFactory {
  deserialization(json: string): Board {
    return new ConcreteBoard()
  }
}
