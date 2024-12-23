import axios from 'axios'
import { Board, BoardFactory } from '../core/Board'
import { Cell, CellContent } from '../core/Cell'
import { computeActivePlayer, Game } from '../core/Game'
import { JumpTarget } from '../core/JumpTarget'
import { Player, PlayerOrder } from '../core/Player'
import { Position } from '../core/Position'
import { Observable } from './Observable'
import { SERVER_BASE_URL } from './settings'
import { ConcreteBoardFactory } from '../core/implementers/ConcreteBoard'

const GAME_API_URL = `${SERVER_BASE_URL}/api/v1/game`
const POLLING_TIME = 1000

export class GameManager {
  public game: Observable<Game | undefined>
  public currentBoard: Observable<Board | undefined>
  public jumpHistory: Observable<{ jump: JumpTarget; board: Board }[]>
  public hasPendingMoves: Observable<boolean>
  private boardFactory: BoardFactory
  private myOrder: CellContent

  constructor() {
    this.game = new Observable<Game | undefined>(undefined)
    this.currentBoard = new Observable<Board | undefined>(undefined)
    this.jumpHistory = new Observable<{ jump: JumpTarget; board: Board }[]>([])
    this.hasPendingMoves = new Observable<boolean>(false)
    this.boardFactory = new ConcreteBoardFactory()
  }

  get me(): Player | undefined {
    if (this.myOrder === undefined) {
      return undefined
    }

    return this.game.value?.players[this.myOrder]
  }

  public async createGame(
    size: Position,
    winCondition: number,
    playerCount: number,
  ): Promise<void> {
    const response = await axios.post<Game>(GAME_API_URL, {
      size,
      winCondition,
      playerCount,
    })
    if (response.status !== 201) {
      return Promise.resolve()
    }
    const game = response.data
    this.jumpHistory.set([])
    this.currentBoard.set(
      this.boardFactory.deserialization(
        game.currentBoard,
        computeActivePlayer(game).playerOrder,
      ),
    )
    this.myOrder = this.currentBoard.value?.activePlayer

    this.game.set(game)
    await this.pollForNewGame()
  }

  public async joinGame(id: string, playerOrder: PlayerOrder): Promise<void> {
    await this.getGame(id)
    this.myOrder = playerOrder
    await this.pollForNewGame()
  }

  public async endTurn(): Promise<void> {
    if (!this.IsMyTurn()) {
      throw new Error('tried to make a move eventhow its not his turn')
    }

    const endTurnResult = this.currentBoard.value?.endTurn()

    const response = await axios.post<Game>(
      GAME_API_URL + '/' + this.game.value?.id + '/turn',
      endTurnResult,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status !== 200) {
      return Promise.resolve()
    }

    this.hasPendingMoves.set(false)

    const game = response.data
    this.jumpHistory.set([])
    this.currentBoard.set(
      this.boardFactory.deserialization(
        game.currentBoard,
        computeActivePlayer(game).playerOrder,
      ),
    )
    this.game.set(game)
  }

  public async place(cell: Cell): Promise<void> {
    if (!this.IsMyTurn()) {
      throw new Error('tried to place a stone eventhow its not his turn')
    }

    this.currentBoard.set(cell.place())
    this.hasPendingMoves.set(true)
    return Promise.resolve()
  }

  public async jump(target: JumpTarget): Promise<void> {
    if (!this.IsMyTurn()) {
      throw new Error('tried to jump eventhow its not his turn')
    }

    const boardAfterJump = target.jump()
    this.currentBoard.set(boardAfterJump)

    const history = this.jumpHistory.value
    history.push({ jump: target, board: boardAfterJump })
    this.jumpHistory.set(history)
    this.hasPendingMoves.set(true)

    return Promise.resolve()
  }

  // index is past end iterator
  public async rollback(index: number): Promise<void> {
    if (!this.IsMyTurn()) {
      throw new Error('tried rollback eventhow its not his turn')
    }
    if (index < 0 || index > this.jumpHistory.value.length) {
      throw new Error('index out of bound')
    }

    this.jumpHistory.set(this.jumpHistory.value.slice(0, index))
    this.currentBoard.set(this.jumpHistory.value[index - 1].board)
    return Promise.resolve()
  }

  public IsMyTurn(): boolean {
    if (!this.game.value || !this.currentBoard.value) {
      return false
    }
    if (this.myOrder === undefined) {
      throw new Error('game exists but me is not assigned')
    }

    return this.currentBoard.value.activePlayer === this.myOrder
  }

  private async pollForNewGame(): Promise<void> {
    setTimeout(this.pollForNewGame.bind(this), POLLING_TIME)
    if (!this.game.value) {
      return Promise.resolve()
    }
    if (this.currentBoard.value!.activePlayer !== this.myOrder) {
      await this.getGame(this.game.value.id)
    }
  }

  private async getGame(id: string): Promise<void> {
    const response = await axios.get<Game>(GAME_API_URL + '/' + id, {
      headers: {
        turn: this.game.value ? this.game.value.turn : -1,
      },
    })

    if (response.status !== 200) {
      return Promise.resolve()
    }

    const game = response.data
    if (!game) {
      return Promise.resolve()
    }
    
    this.jumpHistory.set([])
    this.currentBoard.set(
      this.boardFactory.deserialization(
        game.currentBoard,
        computeActivePlayer(game).playerOrder,
      ),
    )
    this.game.set(game)
  }
}
