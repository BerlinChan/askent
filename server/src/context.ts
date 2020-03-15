import { PubSub } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import db, { ModelType } from './models'
import sequelize from './db'
const {
  createContext: createDataloaderContext,
} = require('dataloader-sequelize')

export const dataloaderContext = createDataloaderContext(sequelize)

const pubsub = new PubSub()

export interface Context extends ExpressContext {
  db: ModelType
  pubsub: PubSub
}

// TODO: n+1 query problem: https://github.com/mickhansen/graphql-sequelize/tree/master/examples/graphql-yoga

export function createContext({
  req,
  res,
  connection,
}: ExpressContext): Context {
  return { db, pubsub, req, res, connection }
}
