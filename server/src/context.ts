import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import models, { ModelType } from './models'

const prisma = new PrismaClient()
const pubsub = new PubSub()

export interface Context extends ExpressContext {
  models: ModelType
  prisma: PrismaClient
  pubsub: PubSub
}

export function createContext({
  req,
  res,
  connection,
}: ExpressContext): Context {
  return { models, prisma, pubsub, req, res, connection }
}
