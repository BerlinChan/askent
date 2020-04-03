import { PubSub } from 'apollo-server'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import { DeepstreamClient } from '@deepstream/client'
import deepstreamClient from './deepstream'
import { getAuthedUser } from './utils'
import { TokenPayload } from './utils'

// TODO: subscription manager use Redis, https://github.com/davidyaha/graphql-redis-subscriptions
const pubsub = new PubSub()

export interface Context extends ExpressContext {
  pubsub: PubSub
  deepstreamClient: DeepstreamClient
  user: TokenPayload | undefined
}

export function createContext({
  req,
  res,
  connection,
}: ExpressContext): Context {
  const user = getAuthedUser(req)
  return { pubsub, deepstreamClient, user, req, res, connection }
}
