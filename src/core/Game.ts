import { BoardMemento } from './Board'
import { Player, PlayerOrder } from './Player'

export interface Game {
  readonly id: string
  readonly turn: number
  readonly winCondition: number
  readonly players: Record<PlayerOrder, Player>
  readonly currentBoard: BoardMemento
}

export function computeActivePlayer(game: Game): Player {
  const playerCount = Object.keys(game.players).length
  const order = (game.turn % playerCount) as PlayerOrder
  return game.players[order]
}

export function computeNextActivePlayer(game: Game): Player {
  const playerCount = Object.keys(game.players).length
  const order = ((game.turn + 1) % playerCount) as PlayerOrder
  return game.players[order]
}

export function isWinConditionReached(game: Game): Player | undefined {
  Object.values(game.players).forEach((player) => {
    if (player.score >= game.winCondition) {
      return player
    }
  })
  return undefined
}
