import { rule, or } from 'graphql-shield'
import { getAdminUserId ,getAudienceUserId} from '../../utils'
import { isAuthenticatedUser,isAuthenticatedAudience } from './User'
import { isEventOwnerByArgId } from './Event'

export const isQuestionAuthor = rule({ cache: 'contextual' })(
  async ({ id }, args, context) => {
    const userId = getAudienceUserId(context)
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
    const userId = getAdminUserId(context)
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
    questionsByMe: isAuthenticatedAudience,
    questionsByEvent: or(isAuthenticatedUser,isAuthenticatedAudience),
  },
  Mutation: {
    createQuestion: isAuthenticatedAudience,
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
