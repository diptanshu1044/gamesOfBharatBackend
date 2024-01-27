//Imports
import { app } from "./app.js"
import { connectDB } from "./database/connectDB.js"
import { config } from "dotenv"

//DB and Server Connection
config({ path: './env' })
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5174, () => {
      console.log(`App is running on port ${process.env.PORT}`)
    })
  })
  .catch(err => {
    console.error('Mongo connection failed', err);
  })