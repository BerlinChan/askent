'use strict'
const dotenv = require('dotenv')
const path = require('path')

const dotenvResult = dotenv.config({ path: path.join(__dirname, '../../.env') })
if (dotenvResult.error) {
  throw dotenvResult.error
}

const config = {
  dialect: process.env.DB_CONNECTOR,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}

module.exports = config
