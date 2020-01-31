import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'

const prisma = new PrismaClient()
const pubsub = new PubSub()

export interface Context extends ExpressContext {
  prisma: PrismaClient
  pubsub: PubSub
}

export function createContext({
  req,
  res,
  connection,
}: ExpressContext): Context {
  return { prisma, pubsub, req, res, connection }
}
