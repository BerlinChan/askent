import { rule } from 'graphql-shield'
import { getAdminUserId, getAudienceUserId } from '../../utils'

export const isAuthenticatedUser = rule({ cache: 'contextual' })(
  (parent, args, ctx) => {
    const userId = getAdminUserId(ctx)
    return Boolean(userId)
  },
)
export const isAuthedAudienceUser = rule({ cache: 'contextual' })(
  (parent, args, ctx) => {
    const userId = getAudienceUserId(ctx)
    return Boolean(userId)
  },
)
export const isAuthenticatedAudience = rule({ cache: 'contextual' })(
  (parent, args, ctx) => {
    return Boolean(getAudienceUserId(ctx))
  },
)

export default {
  Query: {
    me: isAuthenticatedUser,
    meAudience: isAuthedAudienceUser,
  },
}
