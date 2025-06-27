import { Board } from './Board'
import { PlayerOrder } from './Player'
import { Position } from './Position'

export type CellContent = PlayerOrder | undefined

export enum CanPlaceResult {
  Success = 'success',
  OutOfBound = 'out of bound',
  NonPlayableArea = 'non playable area',
  Border = 'border',
  Occupied = 'occupied',
  AlreadyMadeMove = 'already made move',
  ExceedClusterSize = 'exceed cluster size',
}

export interface Cell {
  readonly position: Position
  readonly content: CellContent

  place(): Board
  canPlace(): CanPlaceResult
}
