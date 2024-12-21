import { Board } from '../core/Board'
import { Cell } from '../core/Cell'
import { Game } from '../core/Game'
import { JumpTarget } from '../core/JumpTarget'
import { PlayerOrder } from '../core/Player'
import { Position } from '../core/Position'
import { Observable } from './Observable'

export class GameManager {
  public game: Observable<Game | undefined>
  public currentBoard: Observable<Board | undefined>

  constructor() {
    this.game = new Observable<Game | undefined>(undefined)
    this.currentBoard = new Observable<Board | undefined>(undefined)
  }

  public createGame(
    size: Position,
    winCondition: number,
    playerCount: number,
  ): Promise<void> {
    throw new Error('not implimented.')
  }

  public joinGame(id: string, playerOrder: PlayerOrder): Promise<void> {
    throw new Error('not implimented.')
  }

  public endTurn(): Promise<void> {
    throw new Error('not implimented.')
  }

  public place(cell: Cell): Promise<void> {
    throw new Error('not implimented.')
  }

  public jump(target: JumpTarget): Promise<void> {
    throw new Error('not implimented.')
  }
}
