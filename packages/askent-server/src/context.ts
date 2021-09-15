import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import { getAuthedUser, TokenPayload } from './utils'

// TODO: subscription manager use Redis,https://typegraphql.com/docs/subscriptions.html#triggering-subscription-topics

export interface Context extends ExpressContext {
  user: TokenPayload | undefined
}

export function createContext({
  req,
  res,
}: ExpressContext): Context {
  const user = getAuthedUser(req)
  return { user, req, res }
}
