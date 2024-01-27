import { connect } from 'mongoose'
import { DB_NAME } from '../constants.js'

export const connectDB = async() => {
  try {
    const res = await connect(`${process.env.MONGO_URL}/${DB_NAME}`)
    console.log(`Mongo Connected: ${res.connection.host}`)
  } catch(err) {
    console.log(`MongoDb Error: ${err}`)
    process.exit(1)
  }
}