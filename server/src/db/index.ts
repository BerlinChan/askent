import { Sequelize } from 'sequelize'
import config from './config'

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
)

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync()
}

export default sequelize
