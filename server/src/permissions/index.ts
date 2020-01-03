import {rule, shield} from 'graphql-shield'
import {getUserId} from '../utils'

const rules = {
    isAuthenticatedUser: rule()((parent, args, context) => {
        const userId = getUserId(context)
        return Boolean(userId)
    }),
    isQuestionAuthor: rule()(async (parent, {questionId}, context) => {
        const userId = getUserId(context)
        const author = await context.photon.questions.findOne({where: {id: questionId}})
            .author()
        return userId === author.id
    }),
}

export const permissions = shield({
    Query: {
        events: rules.isAuthenticatedUser,
        questions: rules.isAuthenticatedUser,
        checkEventCodeExist: rules.isAuthenticatedUser,
    },
    Mutation: {
        createEvent: rules.isAuthenticatedUser,
        updateEvent: rules.isQuestionAuthor,
        deleteEvent: rules.isQuestionAuthor,
        createQuestion: rules.isAuthenticatedUser,
        updateQuestion: rules.isQuestionAuthor,
        deleteQuestion: rules.isQuestionAuthor,
    },
})
