import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import db, { ModelType } from './models'

const prisma = new PrismaClient()
const pubsub = new PubSub()

export interface Context extends ExpressContext {
  db: ModelType
  prisma: PrismaClient
  pubsub: PubSub
}

// TODO: n+1 query problem: https://github.com/mickhansen/graphql-sequelize/tree/master/examples/graphql-yoga

export function createContext({
  req,
  res,
  connection,
}: ExpressContext): Context {
  return { db, prisma, pubsub, req, res, connection }
}
