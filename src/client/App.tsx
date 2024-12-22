import { ReactElement } from 'react'
import { Game } from '../core/Game'
import { PlayerOrder } from '../core/Player'
import { GameComponent } from './components/GameComponent'

export function App(): ReactElement {
  const game: Game = {
    id: 'the game id',
    turn: 0,
    winCondition: 15,
    players: [
      { playerOrder: PlayerOrder.First, score: 0 },
      { playerOrder: PlayerOrder.Second, score: 2 },
    ],
    currentBoard: {
      size: { x: 10, y: 12 },
      cells: [
        { content: PlayerOrder.First, position: { x: 3, y: 4 } },
        { content: PlayerOrder.First, position: { x: 4, y: 4 } },
        { content: PlayerOrder.First, position: { x: 5, y: 4 } },
        { content: PlayerOrder.Second, position: { x: 6, y: 4 } },
        { content: PlayerOrder.Second, position: { x: 6, y: 5 } },
      ],
    },
  }
  return <GameComponent game={game} />
}
