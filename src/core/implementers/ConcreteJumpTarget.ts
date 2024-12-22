import { Board } from '../Board'
import { JumpTarget } from '../JumpTarget'
import { Position } from '../Position'
import { MutableBoard } from './MutableBoard'

export class ConcreteJumpTarget implements JumpTarget {
  public constructor(
    readonly origin: Position,
    readonly destination: Position,
    readonly victim: Position,
    private board: MutableBoard,
  ) {}

  jump(): Board {
    const board = this.board.copy()
    board.clear(this.origin)
    board.clear(this.victim)
    board.add(this.board.activePlayer, this.destination)
    board.record(this.origin, this.destination)
    return board
  }
}

export class JumpTargetView implements JumpTarget {
  public constructor(
    readonly origin: Position,
    readonly destination: Position,
    readonly victim: Position,
    private board: Board,
  ) {}

  jump(): Board {
    throw new Error('This jump can not be taken')
  }
}
