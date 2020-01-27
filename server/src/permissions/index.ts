import { rule, shield, or } from 'graphql-shield'
import { getUserId } from '../utils'

const rules = {
  isAuthenticatedUser: rule({ cache: 'contextual' })(
    (parent, args, context) => {
      const userId = getUserId(context)
      return Boolean(userId)
    },
  ),
  isEventOwner: rule({ cache: 'contextual' })(async ({ id }, args, context) => {
    const userId = getUserId(context)
    const owner = await context.photon.events.findOne({ where: { id } }).owner()

    return userId === owner.id
  }),
  isEventOwnerByArgId: rule({ cache: 'strict' })(
    async (parent, { eventId }, context) => {
      const userId = getUserId(context)
      const owner = await context.photon.events
        .findOne({ where: { id: eventId } })
        .owner()

      return userId === owner.id
    },
  ),
  isQuestionAuthor: rule({ cache: 'contextual' })(
    async ({ id }, args, context) => {
      const userId = getUserId(context)
      const questionAuthor = await context.photon.questions
        .findOne({
          where: { id },
        })
        .author()

      return userId === questionAuthor.id
    },
  ),
  isQuestionEventOwner: rule({ cache: 'contextual' })(
    async ({ id }, args, context) => {
      const userId = getUserId(context)
      const eventOwner = await context.photon.questions
        .findOne({
          where: { id },
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
    eventsByMe: rules.isAuthenticatedUser,
    questionsByMe: rules.isAuthenticatedUser,
    questionsByEvent: rules.isAuthenticatedUser,
    checkEventCodeExist: rules.isAuthenticatedUser,
  },
  Mutation: {
    createEvent: rules.isAuthenticatedUser,
    updateEvent: rules.isEventOwnerByArgId,
    deleteEvent: rules.isEventOwnerByArgId,

    createQuestion: rules.isAuthenticatedUser,
    deleteQuestion: or(rules.isQuestionAuthor, rules.isQuestionEventOwner),
    deleteAllUnpublishedQuestions: rules.isEventOwnerByArgId,
    publishAllUnpublishedQuestions: rules.isEventOwnerByArgId,
  },
  Event: {
    owner: rules.isEventOwner,
    createdAt: rules.isEventOwner,
    updatedAt: rules.isEventOwner,
    moderation: rules.isEventOwner,
    questions: rules.isEventOwner,
  },
  UpdateQuestionInputType: {
    content: or(rules.isQuestionAuthor, rules.isQuestionEventOwner),
    published: rules.isQuestionEventOwner,
    star: rules.isQuestionEventOwner,
    top: rules.isQuestionEventOwner,
    archived: rules.isQuestionEventOwner,
  },
})
