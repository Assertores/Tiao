import { Board } from './Board'
import { Player } from './Player'
import { Position } from './Position'

export enum CellType {
  Normal = 'normal',
  Border = 'border'
}

type CellContent = Player | undefined

export interface Cell {
  readonly position: Position
  readonly type: CellType
  readonly content: CellContent
  readonly parentBoard: Board

  place(player: Player): Board
  canPlace(): boolean
}
