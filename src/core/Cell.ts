import { Board } from './Board'
import { Player } from './Player'
import { Position } from './Position'

type CellContent = Player | undefined

export enum CanPlaceResult {
  Success = 'success',
  OutOfBound = 'out of bound',
  NonPlayableArea = 'non playable area',
  Boarder = 'boarder',
  Occupied = 'occupied',
}

export interface Cell {
  readonly position: Position
  readonly content: CellContent

  place(player: Player): Board
  canPlace(): CanPlaceResult
}
