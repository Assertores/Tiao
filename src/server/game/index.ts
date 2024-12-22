import express, { Application, Request, Response } from 'express'
import { DataStorage } from '../storage/DataStorage'
import { Position } from '../../core/Position'
import { ConcreteBoardFactory } from '../../core/implementers/ConcreteBoard'
import {
  computeActivePlayer,
  computeNextActivePlayer,
  Game,
} from '../../core/Game'

interface CreateGameData {
  size: Position
  winCondition: number
  playerCount: number
}

export function createGameApi(storage: DataStorage): Application {
  const gameApi = express()

  gameApi.get('/', getGamesList)
  gameApi.post('/', createGame)
  gameApi.get('/:gameId', getGame)
  gameApi.post('/:gameId/turn', sendTurn)

  async function getGamesList(req: Request, res: Response): Promise<void> {
    const gamesList = await storage.listGames()
    res.status(200).json(gamesList)
  }

  async function createGame(req: Request, res: Response): Promise<void> {
    const data = req.body as CreateGameData
    const game = await storage.createGame(
      data.size,
      data.winCondition,
      data.playerCount,
    )
    res.status(201).json(game)
  }

  async function getGame(req: Request, res: Response): Promise<void> {
    const { gameId } = req.params
    try {
      const game = await storage.retrieveGame(gameId)
      if (!game) {
        res.sendStatus(404)
      } else {
        res.status(200).json(game)
      }
    } catch (ex) {
      if (ex instanceof Error) {
        res.status(400).send(ex.message)
      } else {
        console.error('Uncaught error on "getGame()"', ex)
        res.status(500).send(ex)
      }
    }
  }

  async function sendTurn(req: Request, res: Response): Promise<void> {
    const { gameId } = req.params
    try {
      const game = await storage.retrieveGame(gameId)
      if (!game) {
        res.sendStatus(404)
        return
      }
      const content = req.body
      const boardFactory = new ConcreteBoardFactory()
      const currentBoard = boardFactory
        .deserialization(
          game.currentBoard,
          computeActivePlayer(game).playerOrder,
        )
        // TODO: This might throw and we're doing nothing
        .replay(content, computeNextActivePlayer(game).playerOrder)

      const nextGame: Game = {
        ...game,
        turn: game.turn + 1,
        currentBoard: currentBoard.serialization(),
      }
      storage.storeGame(nextGame)
      res.status(200).json(nextGame)
    } catch (ex) {
      if (ex instanceof Error) {
        res.status(400).send(ex.message)
      } else {
        console.error('Uncaught error on "sendTurn()"', ex)
        res.status(500).send(ex)
      }
    }
  }

  return gameApi
}
