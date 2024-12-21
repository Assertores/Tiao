import { Board } from '../Board'
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
    return this.board
  }
}
