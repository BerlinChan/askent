import { rule, or } from 'graphql-shield'
import { getAdminUserId, getAudienceUserId } from '../../utils'
import { isAuthenticatedUser, isAuthenticatedAudience } from './User'
import { isEventOwnerByArgId } from './Event'

export const isQuestionAuthor = rule({ cache: 'contextual' })(
  async ({ id }, args, context) => {
    const userId = getAudienceUserId(context)
    const questionAuthor = await context.prisma.questions
      .findOne({
        where: { id },
      })
      .author()

    return userId === questionAuthor.id
  },
)
export const isQuestionAuthorByArg = rule({ cache: 'strict' })(
  async (root, args, context) => {
    const userId = getAudienceUserId(context)
    const questionAuthor = await context.photon.questions
      .findOne({
        where: { id: args.questionId },
      })
      .author()

    return userId === questionAuthor.id
  },
)
export const isQuestionEventOwner = rule({ cache: 'contextual' })(
  async ({ id }, args, context) => {
    const userId = getAdminUserId(context)
    const eventOwner = await context.prisma.questions
      .findOne({
        where: { id },
      })
      .event()
      .owner()

    return userId === eventOwner.id
  },
)
export const isQuestionEventOwnerByArg = rule({ cache: 'strict' })(
  async (root, args, context) => {
    const userId = getAdminUserId(context)
    const eventOwner = await context.photon.questions
      .findOne({
        where: { id: args.questionId },
      })
      .event()
      .owner()

    return userId === eventOwner.id
  },
)
export const isQuestionEventAudienceByArg = rule({ cache: 'strict' })(
  async (root, args, context) => {
    const userId = getAudienceUserId(context)
    const audience = await context.photon.questions
      .findOne({ where: { id: args.questionId } })
      .event()
      .audiences({ where: { id: userId } })

    return Boolean(audience.length)
  },
)

export default {
  Query: {
    questionsByMe: isAuthenticatedAudience,
    questionsByEvent: or(isAuthenticatedUser, isAuthenticatedAudience),
  },
  Mutation: {
    createQuestion: isAuthenticatedAudience,
    deleteQuestion: or(isQuestionAuthorByArg, isQuestionEventOwnerByArg),
    deleteAllUnpublishedQuestions: isEventOwnerByArgId,
    publishAllUnpublishedQuestions: isEventOwnerByArgId,
    voteQuestion: isQuestionEventAudienceByArg,
  },
  UpdateQuestionInputType: {
    content: or(isQuestionAuthor, isQuestionEventOwner),
    published: isQuestionEventOwner,
    star: isQuestionEventOwner,
    top: isQuestionEventOwner,
    archived: isQuestionEventOwner,
  },
}
