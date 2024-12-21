import { Board } from './Board'
import { Player } from './Player'

export interface Game {
  readonly id: string
  readonly turn: number
  readonly player: Player[]
  readonly history: Board[]
}
