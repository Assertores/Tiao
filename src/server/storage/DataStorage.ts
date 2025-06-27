import { mkdirSync, statSync } from 'node:fs'
import { join, normalize } from 'node:path'
import { Game } from '../../core/Game'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { v4 as uuidv4, validate } from 'uuid'
import { Position } from '../../core/Position'
import { Player, PlayerOrder } from '../../core/Player'

enum DataDirectory {
  Games = 'games',
}

export class DataStorage {
  get gamesStorage() {
    return join(this.rootFolderPath, DataDirectory.Games)
  }

  constructor(private readonly rootFolderPath: string) {
    const rootStat = statSync(normalize(rootFolderPath), {
      throwIfNoEntry: false,
    })

    if (!rootStat) {
      console.log(
        `Root data folder "${rootFolderPath}" not found. Initializing it...`,
      )
      mkdirSync(rootFolderPath, { recursive: true })
    } else if (!rootStat.isDirectory()) {
      throw new Error(
        `Specified root data folder "${rootFolderPath}" is not a directory. Aborting...`,
      )
    }

    Object.values(DataDirectory).forEach((folder) => {
      const folderPath = join(rootFolderPath, folder)
      const folderStat = statSync(folderPath, { throwIfNoEntry: false })
      if (!folderStat) {
        console.log(`Folder for '${folder}' not found. Initializing...`)
        mkdirSync(folderPath, { recursive: true })
      } else if (!folderStat.isDirectory())
        throw new Error(
          `Found existing "${folderPath}" that is not a directory. Aborting...`,
        )
    })
  }

  public async listGames(): Promise<Game[]> {
    const files = await readdir(this.gamesStorage)
    const gamesList = await Promise.all(
      files.map(async (fileName) => {
        const content = await readFile(fileName, { encoding: 'utf8' })

        return JSON.parse(content) as Game
      }),
    )
    return gamesList
  }

  public async createGame(
    size: Position,
    winCondition: number,
    playerCount: number,
  ): Promise<Game> {
    const MAX_PLAYER_COUNT = Object.keys(PlayerOrder).length
    if (playerCount > MAX_PLAYER_COUNT) {
      throw new Error(
        `Tried to create a game with ${playerCount.toFixed()} players, but max. amount of players is ${MAX_PLAYER_COUNT.toFixed()}`,
      )
    }
    const players: Record<PlayerOrder, Player> = {} as Record<
      PlayerOrder,
      Player
    >
    for (let i = 0; i < playerCount; i++) {
      const playerOrder = i as PlayerOrder
      players[playerOrder] = { playerOrder, score: 0 }
    }
    const game: Game = {
      id: uuidv4(),
      turn: 0,
      winCondition,
      players,
      currentBoard: { size, cells: [] },
    }

    const fileName = join(
      this.rootFolderPath,
      DataDirectory.Games,
      `${game.id}.json`,
    )
    await writeFile(fileName, JSON.stringify(game), { encoding: 'utf8' })

    return game
  }

  public async retrieveGame(id: string): Promise<Game | undefined> {
    if (!validate(id)) {
      throw new Error(`Invalid id="${id}" received`)
    }
    const fileName = join(
      this.rootFolderPath,
      DataDirectory.Games,
      `${id}.json`,
    )
    try {
      const content = await readFile(fileName, { encoding: 'utf8' })
      return JSON.parse(content) as Game
    } catch (ex) {
      console.error(ex)
      return undefined
    }
  }

  public async storeGame(game: Game): Promise<void> {
    if (!validate(game.id)) {
      throw new Error(`Invalid id="${game.id}" received`)
    }
    const fileName = join(
      this.rootFolderPath,
      DataDirectory.Games,
      `${game.id}.json`,
    )
    await writeFile(fileName, JSON.stringify(game), { encoding: 'utf8' })
  }
}
