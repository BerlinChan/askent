import { rule, shield, or } from 'graphql-shield'
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
      const owner = await context.prisma.events
        .findOne({ where: { id: eventId } })
        .owner()

      return userId === owner.id
    },
  ),
  isQuestionAuthor: rule({ cache: 'strict' })(
    async (parent, { questionId }, context) => {
      const userId = getUserId(context)
      const questionAuthor = await context.prisma.questions
        .findOne({
          where: { id: questionId },
        })
        .author()

      return userId === questionAuthor.id
    },
  ),
  isQuestionEventOwner: rule({ cache: 'strict' })(
    async (parent, { questionId }, context) => {
      const userId = getUserId(context)
      const eventOwner = await context.prisma.questions
        .findOne({
          where: { id: questionId },
        })
        .event()
        .owner()

      return userId === eventOwner.id
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

    createQuestion: rules.isAuthenticatedUser,
    deleteQuestion: or(rules.isQuestionAuthor, rules.isQuestionEventOwner),
    deleteAllUnpublishedQuestions: rules.isEventAuthor,
    publishAllUnpublishedQuestions: rules.isEventAuthor,
  },
  UpdateQuestionInputType: {
    content: or(rules.isQuestionAuthor, rules.isQuestionEventOwner),
    published: rules.isQuestionEventOwner,
    star: rules.isQuestionEventOwner,
    top: rules.isQuestionEventOwner,
    archived: rules.isQuestionEventOwner,
  },
})
