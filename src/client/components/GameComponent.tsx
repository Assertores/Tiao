import { ReactElement } from 'react'
import { Game } from '../../core/Game'
import { BoardComponent } from './BoardComponent'
import { Board } from '../../core/Board'
import { ConcreteBoardFactory } from '../../core/implementers/ConcreteBoard'
import { PlayerOrder } from '../../core/Player'
import { useGame } from '../GameContext'

interface GameComponentProps {
  game: Game
}

export function GameComponent({ game }: GameComponentProps): ReactElement {
  const activePlayer: PlayerOrder = PlayerOrder.Second
  const boardFactory = new ConcreteBoardFactory()
  const board: Board = boardFactory.deserialization(
    game.currentBoard,
    activePlayer,
  )

  return (
    <div>
      <div>
        Turn [{game.turn}] of game id="{game.id}"
      </div>
      {Object.values(game.players).map((player) => (
        <div key={player.playerOrder}>
          Player {player.playerOrder} score: {player.score}/{game.winCondition}{' '}
          {player.playerOrder === activePlayer ? '<-- Currently playing' : null}
        </div>
      ))}
      <BoardComponent board={board} />
    </div>
  )
}
