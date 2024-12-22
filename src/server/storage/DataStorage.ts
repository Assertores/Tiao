import { mkdirSync, statSync } from 'node:fs'
import { join, normalize } from 'node:path'
import { Game } from '../../core/Game'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { v4 as uuidv4, validate } from 'uuid'
import { Position } from '../../core/Position'

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

  public async createGame(size: Position): Promise<Game> {
    const game: Game = {
      id: uuidv4(),
      turn: 0,
      winCondition: 15,
      players: [],
      currentBoard: {
        size,
        cells: [],
      },
    }

    const fileName = join(
      this.rootFolderPath,
      DataDirectory.Games,
      `${game.id}.json`,
    )
    await writeFile(fileName, JSON.stringify(game))

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
    await writeFile(fileName, JSON.stringify(game))
  }
}
