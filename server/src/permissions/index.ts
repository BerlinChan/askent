import { rule, shield } from 'graphql-shield'
import { getUserId } from '../utils'

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const userId = getUserId(context)
    return Boolean(userId)
  }),
  isEventAuthor: rule()(async (parent, { eventId }, context) => {
    const userId = getUserId(context)
    const owner = await context.photon.events
      .findOne({ where: { id: eventId } })
      .owner()

    return userId === owner.id
  }),
  isQuestionAuthor: rule()(async (parent, { questionId }, context) => {
    const userId = getUserId(context)
    const author = await context.photon.questions
      .findOne({ where: { id: questionId } })
      .author()

    return userId === author.id
  }),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    events: rules.isAuthenticatedUser,
    questionsByMe: rules.isAuthenticatedUser,
    questionsByEvent: rules.isAuthenticatedUser,
    checkEventCodeExist: rules.isAuthenticatedUser,
  },
  Mutation: {
    createEvent: rules.isAuthenticatedUser,
    updateEvent: rules.isEventAuthor,
    deleteEvent: rules.isEventAuthor,
    createQuestion: rules.isAuthenticatedUser,
    updateQuestion: rules.isQuestionAuthor,
    deleteQuestion: rules.isQuestionAuthor,
  },
})
