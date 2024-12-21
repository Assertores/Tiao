import { Board } from './Board'
import { PlayerOrder } from './Player'
import { Position } from './Position'

export interface JumpTarget {
  readonly player: PlayerOrder
  readonly origin: Position
  readonly destination: Position
  readonly victim: Position

  jump(): Board
}
