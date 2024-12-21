import { existsSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { Game } from '../../core/Game'
import { readdir, readFile } from 'node:fs/promises'

enum DataDirectory {
  Games = 'games',
}

export class Storage {
  get gamesStorage() {
    return join(this.rootFolderPath, DataDirectory.Games)
  }

  constructor(private readonly rootFolderPath: string) {
    const rootStat = statSync(rootFolderPath, { throwIfNoEntry: false })

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
      const folderStat = statSync(folderPath)
      if (!folderStat) {
        console.log(`Folder for '${folder}' not found. Initializing...`)
        mkdirSync(folderPath, { recursive: true })
      } else if (!folderStat.isDirectory())
        throw new Error(
          `Found existing "${folderPath}" that is not a directory. Aborting...`,
        )
    })
  }

  public async loadGames(): Promise<Game[]> {
    const files = await readdir(this.gamesStorage)
    const gamesList = await Promise.all(
      files.map(async (fileName) => {
        const content = await readFile(fileName, { encoding: 'utf8' })

        return JSON.parse(content) as Game
      }),
    )
    return gamesList
  }
}
