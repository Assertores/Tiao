import 'dotenv/config'

import cors from 'cors'
import express, { ErrorRequestHandler, Request, Response } from 'express'
import ViteExpress from 'vite-express'
import { createGameApi } from './game'
import { DataStorage } from './storage/DataStorage'

if (!process.env.EXPRESS_DATA_FOLDER) {
  throw new Error('Missing env variable "EXPRESS_DATA_FOLDER"')
}
if (!process.env.EXPRESS_PORT) {
  throw new Error('Missing env variable "EXPRESS_PORT"')
}

const storage = new DataStorage(process.env.EXPRESS_DATA_FOLDER)
const api = express()

const gameApi = createGameApi(storage)

api.use(cors())
api.use(express.json())

const errorRequestHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next,
): void | Promise<void> => {
  if (err) {
    res.status(err.status).json({ status: err.status, message: err.message })
  } else {
    next()
  }
}
api.use(errorRequestHandler)
api.use('/api/v1/game', gameApi)

const port: number = Number(process.env.EXPRESS_PORT)
const host: string = process.env.EXPRESS_HOST ?? 'localhost'

console.log(`Running server on HOST='${host}' and PORT='${port}'`)

const server = api.listen(port, host)
ViteExpress.bind(api, server)
