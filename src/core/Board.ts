import { Cell } from './Cell'
import { JumpTarget } from './JumpTarget'
import { Player } from './Player'
import { Position } from './Position'

export interface Board {
  readonly size: unknown

  get(position: Position): Cell
  jumpTargets(player: Player, position: Position): JumpTarget[]
  send(): void
  replay(): void
  serialization(board: Board): string
}

export interface BoardFactory {
  deserialization(json: string): Board
}