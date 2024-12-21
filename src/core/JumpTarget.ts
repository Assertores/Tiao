import { Board } from './Board'
import { Player } from './Player'
import { Position } from './Position'

export interface JumpTarget {
  readonly player: Player
  readonly origin: Position
  readonly destination: Position
  readonly victim: Position

  jump(): Board
}
