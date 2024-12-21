import 'dotenv/config'
import * as os from 'os'

import express from 'express'
import { game } from './game'

if (!process.env.EXPRESS_DATA_FOLDER) {
  throw new Error('Missing env variable "EXPRESS_DATA_FOLDER"')
}
if (!process.env.EXPRESS_PORT) {
  throw new Error('Missing env variable "EXPRESS_PORT"')
}

const api = express()

api.use('/api/v1/game', game)

const port: number = Number(process.env.EXPRESS_PORT)
const host: string = process.env.EXPRESS_HOST ?? 'localhost'

console.log(`Running server on HOST='${host}' and PORT='${port}'`)

api.listen(port, host)
