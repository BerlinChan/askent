import { rule, or } from 'graphql-shield'
import { getAuthedUser } from '../../utils'
import { RoleName } from '@prisma/client'

export const isAuthedAdmin = rule({ cache: 'contextual' })(
  (parent, args, ctx) => {
    const getUser = getAuthedUser(ctx)
    return Boolean(getUser?.roles.includes(RoleName.ADMIN) && getUser?.id)
  },
)
export const isAuthedAudience = rule({ cache: 'contextual' })(
  (parent, args, ctx) => {
    const getUser = getAuthedUser(ctx)
    return Boolean(getUser?.roles.includes(RoleName.AUDIENCE) && getUser?.id)
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
