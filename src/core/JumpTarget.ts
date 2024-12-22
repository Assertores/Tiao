import { Board } from './Board'
import { Position } from './Position'

export interface JumpTarget {
  readonly origin: Position
  readonly destination: Position
  readonly victim: Position

  jump(): Board
}
