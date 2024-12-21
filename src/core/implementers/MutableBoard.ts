import { Board } from '../Board'
import { Player } from '../Player'
import { Position } from '../Position'
import { ConcreteCell } from './ConcreteCell'

export interface MutableBoard extends Board {
  copy(): MutableBoard
  add(player: Player, position: Position): void
  clear(position: Position): void

  getConcrete(position: Position): ConcreteCell
}
