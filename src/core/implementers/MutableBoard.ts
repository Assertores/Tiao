import { Board } from '../Board'
import { Player } from '../Player'
import { Position } from '../Position'

export interface MutableBoard extends Board {
  copy(): MutableBoard
  add(player: Player, position: Position): void
  clear(position: Position): void
}
