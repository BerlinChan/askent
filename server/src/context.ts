import { Photon } from '@prisma/photon'
import { PubSub } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'

const photon = new Photon()
const pubsub = new PubSub()

export interface Context extends ExpressContext {
  photon: Photon
  pubsub: PubSub
}

export function createContext({
  req,
  res,
  connection,
}: ExpressContext): Context {
  return { photon, pubsub, req, res, connection }
}
