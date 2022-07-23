import express from 'express'
import { connectDB, getDB } from '~/config/mongodb'
import { env } from '~/config/environtment.js'
import { apiV1 } from '~/routes/v1'
connectDB()
  .then(() => console.log('Connected successfully to database server!'))
  .then(() => bootServer())
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

const bootServer = () => {
  const app = express()

  // Enable req.body data
  app.use(express.json())
  
  //  Use APIs v1
  app.use('/v1',apiV1)
  // app.get('/test', async (req, res) => {
  
  //   res.end('<h1>Hello world!</h1><hr/>')
  // })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello lotusdev, I'm running at ${env.APP_HOST}:${env.APP_PORT}/`)
  })
}


