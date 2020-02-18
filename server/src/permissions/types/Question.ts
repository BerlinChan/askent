import { rule, or, not, and, deny } from 'graphql-shield'
import { getAuthedUser } from '../../utils'
import { isAuthedAdmin, isAuthedAudience, isAuthedWall } from './User'
import { isEventOwnerByArgId } from './Event'

export const isQuestionAuthor = rule({ cache: 'contextual' })(
  async ({ id }, args, ctx) => {
    const userId = getAuthedUser(ctx)?.id
    const questionAuthor = await ctx.prisma.question
      .findOne({
        where: { id },
      })
      .author()

    return userId === questionAuthor.id
  },
)
export const isQuestionAuthorByArg = rule({ cache: 'strict' })(
  async (root, args, ctx) => {
    const userId = getAuthedUser(ctx)?.id
    const questionAuthor = await ctx.prisma.question
      .findOne({
        where: { id: args.questionId },
      })
      .author()

    return userId === questionAuthor.id
  },
)
export const isQuestionEventOwner = rule({ cache: 'strict' })(
  async ({ id }, args, ctx) => {
    const userId = getAuthedUser(ctx)?.id
    const eventOwner = await ctx.prisma.question
      .findOne({
        where: { id },
      })
      .event()
      .owner()

    return userId === eventOwner.id
  },
)
export const isQuestionEventOwnerByArg = rule({ cache: 'strict' })(
  async (root, args, ctx) => {
    const userId = getAuthedUser(ctx)?.id
    const eventOwner = await ctx.prisma.question
      .findOne({
        where: { id: args.questionId },
      })
      .event()
      .owner()

    return userId === eventOwner.id
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
    const question = await ctx.prisma.question.findOne({
      where: { id: args.questionId },
    })

    return question.top
  },
)

export default {
  Query: {
    questions: deny,

    questionsByEvent: isAuthedAdmin,
    questionsByMeAudience: isAuthedAudience,
    liveQuestionsByEvent: isAuthedAudience,
    wallQuestionsByEvent: isAuthedWall,
  },
  Mutation: {
    createQuestion: isAuthedAudience,
    deleteQuestion: and(
      or(isQuestionAuthorByArg, isQuestionEventOwnerByArg),
      not(isQuestionTopByArg),
    ),
    deleteAllReviewQuestions: isEventOwnerByArgId,
    publishAllReviewQuestions: isEventOwnerByArgId,
    voteQuestion: isQuestionEventAudienceByArg,
  },
  UpdateQuestionInputType: {
    content: or(isQuestionAuthor, isQuestionEventOwner),
    reviewStatus: isQuestionEventOwner,
    star: isQuestionEventOwner,
    top: isQuestionEventOwner,
  },
}
