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
  public jumpHistory: Observable<{ jump: JumpTarget; board: Board }[]>

  constructor() {
    this.game = new Observable<Game | undefined>(undefined)
    this.currentBoard = new Observable<Board | undefined>(undefined)
    this.jumpHistory = new Observable<{ jump: JumpTarget; board: Board }[]>([])
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
    this.currentBoard.set(cell.place())
    return Promise.resolve()
  }

  public jump(target: JumpTarget): Promise<void> {
    const boardAfterJump = target.jump()
    this.currentBoard.set(boardAfterJump)

    const history = this.jumpHistory.value
    history.push({ jump: target, board: boardAfterJump })
    this.jumpHistory.set(history)

    return Promise.resolve()
  }

  // index is past end iterator
  public rollback(index: number): Promise<void> {
    if (index < 0 || index > this.jumpHistory.value.length) {
      throw new Error('index out of bound')
    }

    this.jumpHistory.set(this.jumpHistory.value.slice(0, index))
    this.currentBoard.set(this.jumpHistory.value[index - 1].board)
    return Promise.resolve()
  }
}
