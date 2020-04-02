import { PubSub } from 'apollo-server'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import { DeepstreamClient } from '@deepstream/client'
import deepstreamClient from './deepstream'

// TODO: subscription manager use Redis, https://github.com/davidyaha/graphql-redis-subscriptions
const pubsub = new PubSub()

export interface Context extends ExpressContext {
  pubsub: PubSub
  deepstreamClient: DeepstreamClient
}

export function createContext({
  req,
  res,
  connection,
}: ExpressContext): Context {
  return { pubsub, deepstreamClient, req, res, connection }
}
