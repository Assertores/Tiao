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
    if (!this.game.value) {
      throw new Error('GameManager does not contain a valid game object')
    }
    if (!this.IsMyTurn()) {
      throw new Error('Tried to make a move out of turn')
    }

    const endTurnResult = this.currentBoard.value?.endTurn()
    const gameId = this.game.value.id

    const response = await axios.post<Game>(
      `${GAME_API_URL}/${gameId}/turn`,
      endTurnResult,
      { headers: { 'Content-Type': 'application/json' } },
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
      throw new Error('Tried to place a stone out of turn')
    }

    this.currentBoard.set(cell.place())
    this.hasPendingMoves.set(true)
    return Promise.resolve()
  }

  public async jump(target: JumpTarget): Promise<void> {
    if (!this.IsMyTurn()) {
      throw new Error('Tried to jump out of turn')
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
  // sending in a negative number will revert all actions and reset to the start of the round
  public async rollback(index: number): Promise<void> {
    if (!this.game.value) {
      throw new Error('GameManager does not contain a valid game object')
    }
    if (!this.IsMyTurn()) {
      throw new Error('Tried to rollback out of turn')
    }
    if (index < 0) {
      this.jumpHistory.set([])
      this.currentBoard.set(
        this.boardFactory.deserialization(
          this.game.value.currentBoard,
          computeActivePlayer(this.game.value).playerOrder,
        ),
      )
      return
    }
    if (index > this.jumpHistory.value.length) {
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
    setTimeout(() => void this.pollForNewGame(), POLLING_TIME)
    if (!this.game.value) {
      return Promise.resolve()
    }
    if (!this.currentBoard.value) {
      throw new Error('GameManager does not contain a valid Board object')
    }
    if (this.currentBoard.value.activePlayer !== this.myOrder) {
      await this.getGame(this.game.value.id)
    }
  }

  private async getGame(id: string): Promise<void> {
    const response = await axios.get<Game | undefined>(
      `${GAME_API_URL}/${id}`,
      {
        params: {
          turn: this.game.value?.turn,
        },
      },
    )

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
