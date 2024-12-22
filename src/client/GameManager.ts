import { Board } from '../core/Board'
import { Cell } from '../core/Cell'
import { Game } from '../core/Game'
import { JumpTarget } from '../core/JumpTarget'
import { Player, PlayerOrder } from '../core/Player'
import { Position } from '../core/Position'
import { Observable } from './Observable'

export class GameManager {
  public game: Observable<Game | undefined>
  public currentBoard: Observable<Board | undefined>
  public jumpHistory: Observable<{ jump: JumpTarget; board: Board }[]>
  public me: Observable<Player | undefined>

  constructor() {
    this.game = new Observable<Game | undefined>(undefined)
    this.currentBoard = new Observable<Board | undefined>(undefined)
    this.jumpHistory = new Observable<{ jump: JumpTarget; board: Board }[]>([])
    this.me = new Observable<Player | undefined>(undefined)
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
    if (!this.IsMyTurn()) {
      throw new Error('tryed to make a move eventhow its not his turn')
    }

    throw new Error('not implimented.')
  }

  public place(cell: Cell): Promise<void> {
    if (!this.IsMyTurn()) {
      throw new Error('tryed to place a stone eventhow its not his turn')
    }

    this.currentBoard.set(cell.place())
    return Promise.resolve()
  }

  public jump(target: JumpTarget): Promise<void> {
    if (!this.IsMyTurn()) {
      throw new Error('tryed to jump eventhow its not his turn')
    }

    const boardAfterJump = target.jump()
    this.currentBoard.set(boardAfterJump)

    const history = this.jumpHistory.value
    history.push({ jump: target, board: boardAfterJump })
    this.jumpHistory.set(history)

    return Promise.resolve()
  }

  // index is past end iterator
  public rollback(index: number): Promise<void> {
    if (!this.IsMyTurn()) {
      throw new Error('tryed rollback eventhow its not his turn')
    }
    if (index < 0 || index > this.jumpHistory.value.length) {
      throw new Error('index out of bound')
    }

    this.jumpHistory.set(this.jumpHistory.value.slice(0, index))
    this.currentBoard.set(this.jumpHistory.value[index - 1].board)
    return Promise.resolve()
  }

  public IsMyTurn(): boolean {
    if (!this.currentBoard.value) {
      return false
    }
    if (!this.me.value) {
      throw new Error('game exists but me is not assigned')
    }

    return this.currentBoard.value.activePlayer === this.me.value.playerOrder
  }
}
