import { createConnection } from 'typeorm'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'

// TODO https://github.com/Webtomizer/typeorm-loader

const dotenvResult = dotenv.config({ path: path.join(__dirname, '../../.env') })
if (dotenvResult.error) {
  throw dotenvResult.error
}
const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env

export async function connectPostgres() {
  try {
    await createConnection()
  } catch (error) {
    console.error(error)
  }
}

export async function connectMongo() {
  try {
    await mongoose.connect(
      `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      },
    )
  } catch (error) {
    console.error(error)
  }
}
