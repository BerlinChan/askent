import { rule, or } from 'graphql-shield'
import { getUserId } from '../../utils'
import { isAuthenticatedUser, isEventOwnerByArgId } from './User'

export const isQuestionAuthor = rule({ cache: 'contextual' })(
  async ({ id }, args, context) => {
    const userId = getUserId(context)
    const questionAuthor = await context.photon.questions
      .findOne({
        where: { id },
      })
      .author()

    return userId === questionAuthor.id
  },
)

export const isQuestionEventOwner = rule({ cache: 'contextual' })(
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
)

export default {
  Query: {
    questionsByMe: isAuthenticatedUser,
    questionsByEvent: isAuthenticatedUser,
  },
  Mutation: {
    createQuestion: isAuthenticatedUser,
    deleteQuestion: or(isQuestionAuthor, isQuestionEventOwner),
    deleteAllUnpublishedQuestions: isEventOwnerByArgId,
    publishAllUnpublishedQuestions: isEventOwnerByArgId,
  },
  UpdateQuestionInputType: {
    content: or(isQuestionAuthor, isQuestionEventOwner),
    published: isQuestionEventOwner,
    star: isQuestionEventOwner,
    top: isQuestionEventOwner,
    archived: isQuestionEventOwner,
  },
}
