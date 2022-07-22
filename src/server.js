import express from 'express'
import { connectDB } from '~/config/mongodb'
import { env } from '~/config/environtment.js'

const app = express()

connectDB().catch(console.log)

app.get('/', (req, res) => {
  res.end('<h1>Hello world!</h1><hr/>')
})

app.listen(env.PORT, env.HOST, () => {
  console.log(`Hello lotusdev, I'm running at ${env.HOST}:${env.PORT}/`)
})
