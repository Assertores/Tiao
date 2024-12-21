import { Board } from '../Board'
import { CanPlaceResult } from '../Cell'
import { JumpTarget } from '../JumpTarget'
import { Player } from '../Player'
import { Position } from '../Position'
import { MutableBoard } from './MutableBoard'

export class ConcreteJumpTarget implements JumpTarget {
  public constructor(
    readonly player: Player,
    readonly origin: Position,
    readonly destination: Position,
    readonly victim: Position,
    private board: MutableBoard,
  ) {}

  jump(): Board {
    if (this.board.get(this.origin).content !== this.player) {
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
    board.add(this.player, this.destination)
    return board
  }
}
