import {rule, shield} from 'graphql-shield'
import {getUserId} from '../utils'

const rules = {
    isAuthenticatedUser: rule()((parent, args, context) => {
        const userId = getUserId(context)
        return Boolean(userId)
    }),
}

export const permissions = shield({
    Query: {
        // events: rules.isAuthenticatedUser,
    },
    Mutation: {
        createEvent: rules.isAuthenticatedUser,
        createQuestion: rules.isAuthenticatedUser,
    },
})
