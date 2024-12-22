import { BoardMemento } from './Board'
import { Player } from './Player'

export interface Game {
  readonly id: string
  readonly turn: number
  readonly winCondition: number
  readonly players: Player[]
  readonly currentBoard: BoardMemento
}

export function computeActivePlayer(game: Game): Player {
  return game.players[game.turn % game.players.length]
}

export function computeNextActivePlayer(game: Game): Player {
  return game.players[(game.turn + 1) % game.players.length]
}

export function isWinConditionReached(game: Game): Player | undefined {
  for (let i = 0; i < game.players.length; i++) {
    if (game.players[i].score >= game.winCondition) {
      return game.players[i]
    }
  }
  return undefined
}
