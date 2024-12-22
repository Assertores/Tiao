import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react'
import { GameManager } from './GameManager'
import { Game } from '../core/Game'
import { Board } from '../core/Board'
import { Position } from '../core/Position'

const gameManager: GameManager = new GameManager()
const GameContext = createContext<GameManager>(gameManager)

export function GameManagerProvider({
  children,
}: PropsWithChildren): ReactElement {
  return (
    <GameContext.Provider value={gameManager}>{children}</GameContext.Provider>
  )
}

export interface GameMenuActions {
  createGame: () => Promise<void>
  joinGame: GameManager['joinGame']
}

export function useGameMenuActions(): GameMenuActions {
  const gameManager = useContext(GameContext)

  const defaultSize: Position = { x: 11, y: 11 }
  const defaultWinCondition = 12
  const defaultPlayerCount = 2

  return Object.freeze({
    createGame: gameManager.createGame.bind(
      gameManager,
      defaultSize,
      defaultWinCondition,
      defaultPlayerCount,
    ),
    joinGame: gameManager.joinGame.bind(gameManager),
  })
}

export function useGame(): Game | undefined {
  const gameManager = useContext(GameContext)

  const [game, setGame] = useState<Game | undefined>(undefined)
  useEffect(() => {
    const token = gameManager.game.subscribe(() => {
      setGame(gameManager.game.value)
    })
    return () => token.destroy()
  }, [gameManager.game])

  return game
}

export function useCurrentGameBoard(): Board | undefined {
  const gameManager = useContext(GameContext)

  const [board, setBoard] = useState<Board | undefined>(undefined)

  useEffect(() => {
    const token = gameManager.currentBoard.subscribe(() => {
      setBoard(gameManager.currentBoard.value)
    })
    return () => token.destroy()
  }, [gameManager.currentBoard])

  return board
}
