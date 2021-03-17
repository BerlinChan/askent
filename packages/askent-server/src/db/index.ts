import { createConnection } from 'typeorm'
import dotenv from 'dotenv'
import path from 'path'

// TODO https://github.com/Webtomizer/typeorm-loader

const dotenvResult = dotenv.config({ path: path.join(__dirname, '../../.env') })
if (dotenvResult.error) {
  throw dotenvResult.error
}
export async function connectPostgres() {
  try {
    await createConnection()
  } catch (error) {
    console.error(error)
  }
}
