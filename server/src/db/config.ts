import dotenv from 'dotenv'
import path from 'path'
import { Dialect } from 'sequelize'

const dotenvResult = dotenv.config({ path: path.join(__dirname, '../.env') })
if (dotenvResult.error) {
  throw dotenvResult.error
}

const config = {
  dialect: process.env.DB_CONNECTOR as Dialect,
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DATABASE as string,
}

export default config
