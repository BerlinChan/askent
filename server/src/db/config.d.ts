import { Dialect } from 'sequelize'

declare const config: {
  dialect: Dialect
  host: string
  port: number
  username: string
  password: string
  database: string
}

export default config
