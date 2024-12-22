import { ReactElement } from 'react'
import { GameManagerProvider } from './GameContext'
import { Main } from './components/Main'

export function App(): ReactElement {
  return (
    <GameManagerProvider>
      <Main />
    </GameManagerProvider>
  )
}
