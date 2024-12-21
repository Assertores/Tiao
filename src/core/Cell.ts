import { Board } from './Board'
import { PlayerOrder } from './Player'
import { Position } from './Position'

export type CellContent = PlayerOrder | undefined

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

  place(): Board
  canPlace(): CanPlaceResult
}
