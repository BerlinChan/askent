import { rule, or } from 'graphql-shield'
import { getAuthedUser } from '../../utils'

export const isAuthedAdmin = rule({ cache: 'contextual' })(
  (parent, args, ctx) => {
    const getUser = getAuthedUser(ctx)
    return Boolean(getUser?.roles.includes('ADMIN') && getUser?.id)
  },
)
export const isAuthedAudience = rule({ cache: 'contextual' })(
  (parent, args, ctx) => {
    const getUser = getAuthedUser(ctx)
    return Boolean(getUser?.roles.includes('AUDIENCE') && getUser?.id)
  },
)

export default {
  Query: {
    me: or(isAuthedAudience, isAuthedAdmin),
  },
  Mutation: {
    updateUser: or(isAuthedAudience, isAuthedAdmin),
  },
}
