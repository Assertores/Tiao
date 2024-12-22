import { ChangeEventHandler, ReactElement, useCallback, useState } from 'react'
import { useGame, useGameMenuActions } from '../GameContext'
import { GameComponent } from './GameComponent'
import { PlayerOrder } from '../../core/Player'

export function Main(): ReactElement {
  const game = useGame()

  return <div>{game ? <GameComponent game={game} /> : <MainMenu />}</div>
}

function MainMenu(): ReactElement {
  const { createGame, joinGame } = useGameMenuActions()
  const [gameId, setGameId] = useState<string>('')

  const onGameIdChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setGameId(event.target.value)
    },
    [],
  )

  return (
    <div>
      <button type="button" onClick={createGame}>
        Create new game
      </button>
      <input name="existing-game-id" value={gameId} onChange={onGameIdChange} />
      <button
        type="button"
        onClick={() => joinGame(gameId, PlayerOrder.Second)}
      >
        Join game
      </button>
    </div>
  )
}
