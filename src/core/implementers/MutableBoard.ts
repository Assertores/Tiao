import { Board } from '../Board'
import { PlayerOrder } from '../Player'
import { Position } from '../Position'
import { ConcreteCell } from './ConcreteCell'

export interface MutableBoard extends Board {
  copy(): MutableBoard
  add(player: PlayerOrder, position: Position): void
  clear(position: Position): void

  record(origin: Position, target?: Position): void

  getConcrete(position: Position): ConcreteCell
  isInBound(position: Position): boolean
}
