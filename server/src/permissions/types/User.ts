import { rule } from 'graphql-shield'
import { getUserId } from '../../utils'

export const isAuthenticatedUser = rule({ cache: 'contextual' })(
  (parent, args, context) => {
    const userId = getUserId(context)
    return Boolean(userId)
  },
)

export default {
  Query: {
    me: isAuthenticatedUser,
  },
}
