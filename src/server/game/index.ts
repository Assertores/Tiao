import express, { Request, Response } from 'express'

export const game = express()

game.get('/', getGamesList)
game.post('/', createGame)
game.get('/:gameId', getGame)
game.post('/:gameId/turn', sendTurn)

function getGamesList(req: Request, res: Response): void {
  res.send('getGamesList')
}

function createGame(req: Request, res: Response): void {
  res.send('createGame')
}

function getGame(req: Request, res: Response): void {
  res.send('getGame')
}

function sendTurn(req: Request, res: Response): void {
  res.send('sendTurn')
}
