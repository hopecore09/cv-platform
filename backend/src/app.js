import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'  
import routes from './routes/index.js'

dotenv.config() 

const app = express()

console.log('📦 DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET')

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}))
app.use(express.json())
app.use('/api', routes)

export default app