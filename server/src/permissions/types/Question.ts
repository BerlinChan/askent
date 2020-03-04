import { rule, or, not, and } from 'graphql-shield'
import { getAuthedUser } from '../../utils'
import { isAuthedAdmin, isAuthedAudience, isAuthedWall } from './User'
import { isEventOwnerByArgId } from './Event'

export const isQuestionAuthorByArg = rule({ cache: 'strict' })(
  async (root, args, ctx) => {
    const userId = getAuthedUser(ctx)?.id
    const question = await ctx.db.Question.findOne({
      where: { id: args.questionId },
      include: [{ association: 'author', attributes: ['id'] }],
    })

    return userId === question?.author.id
  },
)
export const isQuestionEventOwnerByArg = rule({ cache: 'strict' })(
  async (root, args, ctx) => {
    const userId = getAuthedUser(ctx)?.id
    const question = await ctx.db.Question.findOne({
      where: { id: args.questionId },
      include: [
        {
          association: 'event',
          attributes: ['id'],
          include: [{ association: 'owner', attributes: ['id'] }],
        },
      ],
    })

    return userId === question?.event?.owner.id
  },
)
export const isQuestionEventAudienceByArg = rule({ cache: 'strict' })(
  async (root, args, ctx) => {
    const userId = getAuthedUser(ctx)?.id
    const audience = await ctx.prisma.question
      .findOne({ where: { id: args.questionId } })
      .event()
      .audiences({ where: { id: userId } })

    return Boolean(audience.length)
  },
)
export const isQuestionTopByArg = rule({ cache: 'strict' })(
  async (root, args, ctx) => {
    const question = await ctx.db.Question.findOne({
      where: { id: args.questionId },
      attributes: ['top'],
    })

    return question.top
  },
)

export default {
  Query: {
    questionsByEvent: isAuthedAdmin,
    questionsByMe: isAuthedAudience,
    liveQuestionsByEvent: isAuthedAudience,
    wallQuestionsByEvent: isAuthedWall,
  },
  Mutation: {
    createQuestion: isAuthedAudience,
    updateQuestionReviewStatus: isQuestionEventOwnerByArg,
    updateQuestionContent: or(isQuestionAuthorByArg, isQuestionEventOwnerByArg),
    updateQuestionStar: isQuestionEventOwnerByArg,
    updateQuestionTop: isQuestionEventOwnerByArg,
    deleteQuestion: and(
      or(isQuestionAuthorByArg, isQuestionEventOwnerByArg),
      not(isQuestionTopByArg),
    ),
    deleteAllReviewQuestions: isEventOwnerByArgId,
    publishAllReviewQuestions: isEventOwnerByArgId,
    voteQuestion: isQuestionEventAudienceByArg,
  },
}
