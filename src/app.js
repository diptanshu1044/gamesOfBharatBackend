//Imports
import express, { urlencoded, json } from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()

//Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(json({
  limit: '20kb',
}))

app.use(urlencoded({
  extended: true,
  limit: '20kb',
}))

app.use(express.static("./public"))

app.use(cookieParser())

//Route imports
import userRoute from './routes/user.routes.js'

//Routes
app.use('/api/v1/users', userRoute);

//Exports
export { app };