import { rule, or } from 'graphql-shield'
import { getAuthedUser } from '../../utils'
import { RoleName } from '../../models/Role'

export const isAuthedAdmin = rule({ cache: 'contextual' })(
  (parent, args, ctx) => {
    const getUser = getAuthedUser(ctx)
    return Boolean(getUser?.roles.includes(RoleName.Admin) && getUser?.id)
  },
)
export const isAuthedAudience = rule({ cache: 'contextual' })(
  (parent, args, ctx) => {
    const getUser = getAuthedUser(ctx)
    return Boolean(getUser?.roles.includes(RoleName.Audience) && getUser?.id)
  },
)
export const isAuthedWall = rule({ cache: 'contextual' })(
  (parent, args, ctx) => {
    const getUser = getAuthedUser(ctx)
    return Boolean(getUser?.roles.includes(RoleName.Wall) && getUser?.id)
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
