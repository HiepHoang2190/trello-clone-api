import express from 'express'
import { connectDB, getDB } from '~/config/mongodb'
import { env } from '~/config/environtment.js'
import {BoardModel} from '~/models/board.model'
connectDB()
  .then(() => console.log('Connected successfully to database server!'))
  .then(() => bootServer())
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

const bootServer = () => {
  const app = express()

  app.get('/test', async (req, res) => {
    let fakeData = {
      title:'lotusdev'
    }
    const newBoard = await BoardModel.createNew(fakeData)
    console.log(newBoard)
    res.end('<h1>Hello world!</h1><hr/>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello lotusdev, I'm running at ${env.APP_HOST}:${env.APP_PORT}/`)
  })
}


