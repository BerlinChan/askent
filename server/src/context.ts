import { PubSub } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import db, { ModelType } from './models'
import sequelize from './db'
const {
  createContext: createDataloaderContext,
} = require('dataloader-sequelize')

// TODO: n+1 query problem: https://github.com/mickhansen/graphql-sequelize/tree/master/examples/graphql-yoga
export const dataloaderContext = createDataloaderContext(sequelize)

// TODO: support multiple subscription manager instances, https://github.com/davidyaha/graphql-redis-subscriptions
const pubsub = new PubSub()

export interface Context extends ExpressContext {
  db: ModelType
  pubsub: PubSub
}

export function createContext({
  req,
  res,
  connection,
}: ExpressContext): Context {
  return { db, pubsub, req, res, connection }
}
