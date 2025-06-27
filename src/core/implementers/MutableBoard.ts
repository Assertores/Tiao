import { Board } from '../Board'
import { PlayerOrder } from '../Player'
import { Position } from '../Position'

export interface MutableBoard extends Board {
  copy(): MutableBoard
  add(player: PlayerOrder, position: Position): void
  clear(position: Position): void

  record(origin: Position, target?: Position): void

  getMaxClusterSize(): number
}
