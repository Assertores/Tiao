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
    if (this.board.get(this.origin).content !== this.board.activePlayer) {
      throw new Error(
        'a JumpTarget was constructed that is impossible to be executed.',
      )
    }
    if (!this.board.getConcrete(this.destination).canJumpTo()) {
      throw new Error('tried to jump to a cell that is not empty')
    }

    const board = this.board.copy()
    board.clear(this.origin)
    board.clear(this.victim)
    board.add(this.board.activePlayer, this.destination)
    board.record(this.origin, this.destination)
    return board
  }
}
