import { ReactElement } from 'react'
import { Game } from '../../core/Game'
import { BoardComponent } from './BoardComponent'
import { useCurrentGameBoard, useCurrentPlayer } from '../GameContext'

interface GameComponentProps {
  game: Game
}

export function GameComponent({ game }: GameComponentProps): ReactElement {
  const board = useCurrentGameBoard()
  const currentPlayer = useCurrentPlayer()

  return (
    <div>
      <div>
        Turn [{game.turn}] of game id="{game.id}"
      </div>
      {board ? (
        <div>
          {Object.values(game.players).map((player) => (
            <div key={player.playerOrder}>
              <span
                style={{
                  fontWeight:
                    currentPlayer.playerOrder === player.playerOrder
                      ? 'bold'
                      : 'normal',
                }}
              >
                Player {player.playerOrder}
              </span>{' '}
              score: {player.score}/{game.winCondition}{' '}
              {player.playerOrder === board.activePlayer
                ? '<-- Currently playing'
                : null}
            </div>
          ))}
          <BoardComponent board={board} />
        </div>
      ) : (
        <div>Error - No board found</div>
      )}
    </div>
  )
}
