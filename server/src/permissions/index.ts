import { rule, shield } from 'graphql-shield'
import { getUserId } from '../utils'

const rules = {
  isAuthenticatedUser: rule({ cache: 'contextual' })(
    (parent, args, context) => {
      const userId = getUserId(context)
      return Boolean(userId)
    },
  ),
  isEventAuthor: rule({ cache: 'strict' })(
    async (parent, { eventId }, context) => {
      const userId = getUserId(context)
      const owner = await context.photon.events
        .findOne({ where: { id: eventId } })
        .owner()

      return userId === owner.id
    },
  ),
  isQuestionOrEventAuthor: rule({ cache: 'strict' })(
    async (parent, { questionId }, context) => {
      const userId = getUserId(context)
      const question = await context.photon.questions.findOne({
        where: { id: questionId },
        include: { author: true, event: true },
      })
      const eventOwner = await context.photon.events
        .findOne({ where: { id: question.event.id } })
        .owner()

      return userId === question.author.id || userId === eventOwner.id
    },
  ),
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
    // TODO: only event owner can update published field
    createQuestion: rules.isAuthenticatedUser,
    updateQuestion: rules.isQuestionOrEventAuthor,
    deleteQuestion: rules.isQuestionOrEventAuthor,
  },
})
