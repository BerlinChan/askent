import {
  objectType,
  extendType,
  stringArg,
  idArg,
  arg,
  subscriptionField,
  booleanArg,
} from 'nexus'
import { User, RoleName, QuestionReviewStatus } from '@prisma/client'
import { getAuthedUser, TokenPayload } from '../utils'
import { withFilter } from 'apollo-server-express'
import { Context } from '../context'

export const Question = objectType({
  name: 'Question',
  definition(t) {
    t.model.id()
    t.model.event()
    t.model.author()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.content()
    t.model.reviewStatus()
    t.model.star()
    t.model.top()
    // t.model.votedUsers()

    t.boolean('voted', {
      resolve: (root, args, ctx) => {
        return getVoted(ctx, root.id)
      },
    })
    t.int('voteCount', {
      async resolve({ id }, _args, ctx) {
        const users = await ctx.prisma.question
          .findOne({ where: { id } })
          .votedUsers()

        return users?.length || 0
      },
    })
  },
})
export const PagedQuestion = objectType({
  name: 'PagedQuestion',
  definition(t) {
    t.implements('IPagedType')
    t.list.field('list', { type: 'Question' })
  },
})
enum AudienceRole {
  All,
  ExcludeAuthor,
  OnlyAuthor,
}

export const questionQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.questions({ ordering: true, filtering: true })

    t.field('questionsByEvent', {
      type: 'PagedQuestion',
      args: {
        eventId: idArg({ required: true }),
        pagination: arg({ type: 'PaginationInputType', required: true }),
        where: arg({ type: 'QuestionWhereInput' }),
        orderBy: arg({ type: 'QuestionOrderByInput' }),
      },
      resolve: async (root, args, ctx) => {
        const allQuestions = await ctx.prisma.question.findMany({
          where: {
            ...args.where,
            event: { id: args.eventId },
          },
        })
        const totalCount = allQuestions.length
        const { first, skip } = args.pagination
        const questions = await ctx.prisma.question.findMany({
          where: {
            ...args.where,
            event: { id: args.eventId },
          },
          orderBy: args.orderBy,
          ...args.pagination,
        })

        return {
          list: questions,
          hasNextPage: first + skip < totalCount,
          totalCount,
          first,
          skip,
        }
      },
    })
    t.field('liveQuestionsByEvent', {
      type: 'PagedQuestion',
      args: {
        eventId: idArg({ required: true }),
        pagination: arg({ type: 'PaginationInputType', required: true }),
        orderBy: arg({ type: 'QuestionOrderByInput' }),
      },
      resolve: async (root, { eventId, pagination, orderBy }, ctx) => {
        const userId = getAuthedUser(ctx)?.id
        const allQuestions = await ctx.prisma.question.findMany({
          where: {
            event: { id: eventId },
            OR: [
              { reviewStatus: QuestionReviewStatus.PUBLISH },
              {
                AND: [
                  { author: { id: userId } },
                  { reviewStatus: QuestionReviewStatus.REVIEW },
                ],
              },
            ],
          },
        })
        const totalCount = allQuestions.length
        const { first, skip } = pagination
        const questions = await ctx.prisma.question.findMany({
          where: {
            event: { id: eventId },
            OR: [
              { reviewStatus: QuestionReviewStatus.PUBLISH },
              {
                AND: [
                  { author: { id: userId } },
                  { reviewStatus: QuestionReviewStatus.REVIEW },
                ],
              },
            ],
          },
          orderBy,
          ...pagination,
        })

        return {
          list: questions,
          hasNextPage: first + skip < totalCount,
          totalCount,
          first,
          skip,
        }
      },
    })
    t.field('questionsByMe', {
      type: 'PagedQuestion',
      args: {
        pagination: arg({ type: 'PaginationInputType', required: true }),
        orderBy: arg({ type: 'QuestionOrderByInput' }),
      },
      resolve: async (root, { pagination, orderBy }, ctx) => {
        const userId = getAuthedUser(ctx)?.id
        const allQuestions = await ctx.prisma.question.findMany({
          where: {
            author: { id: userId },
            OR: [
              { reviewStatus: QuestionReviewStatus.PUBLISH },
              { reviewStatus: QuestionReviewStatus.REVIEW },
            ],
          },
        })
        const totalCount = allQuestions.length
        const { first, skip } = pagination
        const questions = await ctx.prisma.question.findMany({
          where: {
            author: { id: userId },
            OR: [
              { reviewStatus: QuestionReviewStatus.PUBLISH },
              { reviewStatus: QuestionReviewStatus.REVIEW },
            ],
          },
          orderBy,
          ...pagination,
        })

        return {
          list: questions,
          hasNextPage: first + skip < totalCount,
          totalCount,
          first,
          skip,
        }
      },
    })
    t.field('wallQuestionsByEvent', {
      type: 'PagedQuestion',
      args: {
        eventId: idArg({ required: true }),
        star: booleanArg(),
        pagination: arg({ type: 'PaginationInputType', required: true }),
        orderBy: arg({ type: 'QuestionOrderByInput' }),
      },
      resolve: async (root, args, ctx) => {
        const allQuestions = await ctx.prisma.question.findMany({
          where: {
            event: { id: args.eventId },
            star: args.star,
            reviewStatus: QuestionReviewStatus.PUBLISH,
          },
        })
        const totalCount = allQuestions.length
        const { first, skip } = args.pagination
        const questions = await ctx.prisma.question.findMany({
          where: {
            event: { id: args.eventId },
            star: args.star,
            reviewStatus: QuestionReviewStatus.PUBLISH,
          },
          orderBy: args.orderBy,
          ...args.pagination,
        })

        return {
          list: questions,
          hasNextPage: first + skip < totalCount,
          totalCount,
          first,
          skip,
        }
      },
    })
  },
})

export const questionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createQuestion', {
      type: 'Question',
      description: 'Create question',
      args: {
        eventId: idArg({ required: true }),
        content: stringArg({ required: true }),
      },
      resolve: async (root, { eventId, content }, ctx) => {
        const userId = getAuthedUser(ctx)?.id
        const event = await ctx.prisma.event.findOne({
          where: { id: eventId },
        })
        const newQuestion = await ctx.prisma.question.create({
          data: {
            reviewStatus: event?.moderation
              ? QuestionReviewStatus.REVIEW
              : QuestionReviewStatus.PUBLISH,
            content,
            event: { connect: { id: eventId } },
            author: { connect: { id: userId } },
          },
        })

        ctx.pubsub.publish('QUESTION_ADDED', {
          eventId,
          toRoles:
            newQuestion.reviewStatus === QuestionReviewStatus.REVIEW
              ? [RoleName.ADMIN, RoleName.AUDIENCE, AudienceRole.OnlyAuthor]
              : newQuestion.reviewStatus === QuestionReviewStatus.PUBLISH
              ? [
                  RoleName.ADMIN,
                  RoleName.AUDIENCE,
                  AudienceRole.All,
                  RoleName.WALL,
                ]
              : [],
          questionAdded: newQuestion,
        })

        return newQuestion
      },
    })
    t.field('updateQuestionReviewStatus', {
      type: 'Question',
      description: 'Update a question review status.',
      args: {
        questionId: idArg({ required: true }),
        reviewStatus: arg({ type: 'QuestionReviewStatus', required: true }),
      },
      resolve: async (root, { questionId, reviewStatus }, ctx) => {
        const prevQuestion = await ctx.prisma.question.findOne({
          where: { id: questionId },
          include: { event: true },
        })

        const updateQuestion = await ctx.prisma.question.update({
          where: { id: questionId },
          data: Object.assign(
            { reviewStatus },
            reviewStatus === QuestionReviewStatus.ARCHIVE
              ? { top: false }
              : reviewStatus === QuestionReviewStatus.REVIEW
              ? { top: false, star: false }
              : {},
          ),
        })

        if (
          reviewStatus === QuestionReviewStatus.ARCHIVE ||
          reviewStatus === QuestionReviewStatus.REVIEW
        ) {
          // remove for ExcludeAuthor
          ctx.pubsub.publish('QUESTION_REMOVED', {
            eventId: prevQuestion?.event.id,
            toRoles: [
              RoleName.AUDIENCE,
              AudienceRole.ExcludeAuthor,
              RoleName.WALL,
            ],
            questionRemoved: updateQuestion,
          })
        } else if (reviewStatus === QuestionReviewStatus.PUBLISH) {
          // add for ExcludeAuthor
          ctx.pubsub.publish('QUESTION_ADDED', {
            eventId: prevQuestion?.event.id,
            toRoles: [
              RoleName.AUDIENCE,
              AudienceRole.ExcludeAuthor,
              RoleName.WALL,
            ],
            questionAdded: updateQuestion,
          })
        }
        // update for OnlyAuthor
        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: prevQuestion?.event.id,
          toRoles: [RoleName.AUDIENCE, AudienceRole.OnlyAuthor],
          questionUpdated: updateQuestion,
        })
        // update for admin
        ctx.pubsub.publish('QUESTION_REMOVED', {
          eventId: prevQuestion?.event.id,
          toRoles: [RoleName.ADMIN],
          questionRemoved: prevQuestion,
        })
        ctx.pubsub.publish('QUESTION_ADDED', {
          eventId: prevQuestion?.event.id,
          toRoles: [RoleName.ADMIN],
          questionAdded: updateQuestion,
        })

        return updateQuestion
      },
    })
    t.field('updateQuestionContent', {
      type: 'Question',
      description: 'Update a question content.',
      args: {
        questionId: idArg({ required: true }),
        content: stringArg({ required: true }),
      },
      resolve: async (root, { content, questionId }, ctx) => {
        const questionEvent = await ctx.prisma.question
          .findOne({
            where: { id: questionId },
          })
          .event()

        const updateQuestion = await ctx.prisma.question.update({
          where: { id: questionId },
          data: { content },
        })

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: questionEvent?.id,
          toRoles:
            updateQuestion.reviewStatus === QuestionReviewStatus.REVIEW
              ? [RoleName.ADMIN, RoleName.AUDIENCE, AudienceRole.OnlyAuthor]
              : updateQuestion.reviewStatus === QuestionReviewStatus.PUBLISH
              ? [
                  RoleName.ADMIN,
                  RoleName.AUDIENCE,
                  AudienceRole.All,
                  RoleName.WALL,
                ]
              : updateQuestion.reviewStatus === QuestionReviewStatus.ARCHIVE
              ? [RoleName.ADMIN]
              : [],
          questionUpdated: updateQuestion,
        })

        return updateQuestion
      },
    })
    t.field('updateQuestionStar', {
      type: 'Question',
      description: 'Update a question star.',
      args: {
        questionId: idArg({ required: true }),
        star: booleanArg({ required: true }),
      },
      resolve: async (root, { questionId, star }, ctx) => {
        const questionEvent = await ctx.prisma.question
          .findOne({
            where: { id: questionId },
          })
          .event()

        const updateQuestion = await ctx.prisma.question.update({
          where: { id: questionId },
          data: { star },
        })

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: questionEvent?.id,
          toRoles:
            updateQuestion.reviewStatus === QuestionReviewStatus.REVIEW
              ? [RoleName.ADMIN, RoleName.AUDIENCE, AudienceRole.OnlyAuthor]
              : updateQuestion.reviewStatus === QuestionReviewStatus.PUBLISH
              ? [
                  RoleName.ADMIN,
                  RoleName.AUDIENCE,
                  AudienceRole.All,
                  RoleName.WALL,
                ]
              : updateQuestion.reviewStatus === QuestionReviewStatus.ARCHIVE
              ? [RoleName.ADMIN]
              : [],
          questionUpdated: updateQuestion,
        })

        return updateQuestion
      },
    })
    t.list.field('updateQuestionTop', {
      type: 'Question',
      description: 'Top a question. Can only top one question at a time.',
      args: {
        questionId: idArg({ required: true }),
        top: booleanArg({ required: true }),
      },
      resolve: async (root, { questionId, top }, ctx) => {
        const questionEvent = await ctx.prisma.question
          .findOne({
            where: { id: questionId },
          })
          .event()

        // can only top one question at a time
        const prevTopQuestions = (
          await ctx.prisma.question.findMany({
            where: { top: true, event: { id: questionEvent?.id } },
          })
        ).map(item => ({
          ...item,
          top: false,
        }))
        await ctx.prisma.question.updateMany({
          where: { top: true, event: { id: questionEvent?.id } },
          data: { top: false },
        })

        const updateQuestion = await ctx.prisma.question.update({
          where: { id: questionId },
          data: { top },
        })

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: questionEvent?.id,
          toRoles: [
            RoleName.ADMIN,
            RoleName.AUDIENCE,
            AudienceRole.All,
            RoleName.WALL,
          ],
          questionUpdated: updateQuestion,
        })

        return [updateQuestion].concat(prevTopQuestions)
      },
    })
    t.field('deleteQuestion', {
      type: 'Question',
      description: 'Delete a question by id.',
      args: {
        questionId: idArg({ required: true }),
      },
      resolve: async (root, { questionId }, ctx) => {
        const findQuestion = await ctx.prisma.question.findOne({
          where: { id: questionId },
          include: { event: true },
        })
        const delQuestion = await ctx.prisma.question.delete({
          where: { id: questionId },
        })

        ctx.pubsub.publish('QUESTION_REMOVED', {
          eventId: findQuestion?.event.id,
          toRoles:
            delQuestion.reviewStatus === QuestionReviewStatus.REVIEW
              ? [RoleName.ADMIN, RoleName.AUDIENCE, AudienceRole.OnlyAuthor]
              : delQuestion.reviewStatus === QuestionReviewStatus.PUBLISH
              ? [
                  RoleName.ADMIN,
                  RoleName.AUDIENCE,
                  AudienceRole.All,
                  RoleName.WALL,
                ]
              : delQuestion.reviewStatus === QuestionReviewStatus.ARCHIVE
              ? [RoleName.ADMIN]
              : [],
          questionRemoved: delQuestion,
        })

        return delQuestion
      },
    })
    t.field('deleteAllReviewQuestions', {
      type: 'Int',
      description: 'Delete all Review questions by event.',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { eventId }, ctx) => {
        const shouldDelete = await ctx.prisma.question.findMany({
          where: {
            event: { id: eventId },
            reviewStatus: QuestionReviewStatus.REVIEW,
          },
        })
        const { count } = await ctx.prisma.question.deleteMany({
          where: {
            event: { id: eventId },
            reviewStatus: QuestionReviewStatus.REVIEW,
          },
        })

        shouldDelete.forEach(delQuestion =>
          ctx.pubsub.publish('QUESTION_REMOVED', {
            eventId,
            toRoles: [
              RoleName.ADMIN,
              RoleName.AUDIENCE,
              AudienceRole.OnlyAuthor,
            ],
            questionRemoved: delQuestion,
          }),
        )

        return count
      },
    })
    t.field('publishAllReviewQuestions', {
      type: 'Int',
      description: 'Delete all Review questions by event.',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { eventId }, ctx) => {
        const shouldUpdate = (
          await ctx.prisma.question.findMany({
            where: {
              event: { id: eventId },
              reviewStatus: QuestionReviewStatus.REVIEW,
            },
          })
        ).map(question => ({
          ...question,
          reviewStatus: QuestionReviewStatus.PUBLISH,
        }))
        const { count } = await ctx.prisma.question.updateMany({
          where: {
            event: { id: eventId },
            reviewStatus: QuestionReviewStatus.REVIEW,
          },
          data: { reviewStatus: QuestionReviewStatus.PUBLISH },
        })

        shouldUpdate.forEach(question => {
          ctx.pubsub.publish('QUESTION_ADDED', {
            eventId,
            toRoles: [
              RoleName.AUDIENCE,
              AudienceRole.ExcludeAuthor,
              RoleName.WALL,
            ],
            questionAdded: question,
          })
          ctx.pubsub.publish('QUESTION_UPDATED', {
            eventId,
            toRoles: [RoleName.AUDIENCE, AudienceRole.OnlyAuthor],
            questionUpdated: question,
          })
          // update for admin
          ctx.pubsub.publish('QUESTION_REMOVED', {
            eventId,
            toRoles: [RoleName.ADMIN],
            questionRemoved: question,
          })
          ctx.pubsub.publish('QUESTION_ADDED', {
            eventId,
            toRoles: [RoleName.ADMIN],
            questionAdded: question,
          })
        })

        return count
      },
    })
    t.field('voteQuestion', {
      type: 'Question',
      description: 'Vote a question.',
      args: {
        questionId: idArg({ required: true }),
      },
      resolve: async (root, { questionId }, ctx) => {
        const userId = getAuthedUser(ctx)?.id
        const voted = await getVoted(ctx, questionId)

        const updateQuestion = await ctx.prisma.question.update({
          where: { id: questionId },
          include: { event: true },
          data: {
            votedUsers: voted
              ? { disconnect: { id: userId } }
              : { connect: { id: userId } },
          },
        })

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: updateQuestion.event.id,
          toRoles: [
            RoleName.ADMIN,
            RoleName.AUDIENCE,
            AudienceRole.All,
            RoleName.WALL,
          ],
          questionUpdated: updateQuestion,
        })

        return updateQuestion
      },
    })
  },
})

export const questionAddedSubscription = subscriptionField<'questionAdded'>(
  'questionAdded',
  {
    type: 'Question',
    args: {
      eventId: idArg({ required: true }),
      role: arg({ type: 'RoleName', required: true }),
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_ADDED']),
      async (payload, args, ctx) => {
        const { id, roles } = ctx.connection.context as TokenPayload
        const role: RoleName = args.role
        const { eventId, toRoles, questionAdded } = payload

        if (
          eventId === args.eventId &&
          toRoles.includes(role) &&
          roles.includes(role)
        ) {
          switch (role) {
            case RoleName.ADMIN:
              const owner = await ctx.prisma.question
                .findOne({ where: { id: questionAdded.id } })
                .event()
                .owner()
              return id === owner.id
            case RoleName.AUDIENCE:
              if (toRoles.includes(AudienceRole.All)) {
                return true
              }
              const author = await ctx.prisma.question
                .findOne({ where: { id: questionAdded.id } })
                .author()
              if (toRoles.includes(AudienceRole.ExcludeAuthor)) {
                return id !== author.id
              } else if (toRoles.includes(AudienceRole.OnlyAuthor)) {
                return id === author.id
              }
            case RoleName.WALL:
              return questionAdded.reviewStatus === QuestionReviewStatus.PUBLISH
            default:
              return false
          }
        } else {
          return false
        }
      },
    ),
    resolve: (payload, args, ctx) => payload.questionAdded,
  },
)
export const questionUpdatedSubscription = subscriptionField<'questionUpdated'>(
  'questionUpdated',
  {
    type: 'Question',
    args: {
      eventId: idArg({ required: true }),
      role: arg({ type: 'RoleName', required: true }),
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_UPDATED']),
      async (payload, args, ctx) => {
        const { id, roles } = ctx.connection.context as TokenPayload
        const role: RoleName = args.role
        const { eventId, toRoles, questionUpdated } = payload

        if (
          eventId === args.eventId &&
          toRoles.includes(role) &&
          roles.includes(role)
        ) {
          switch (role) {
            case RoleName.AUDIENCE:
              if (toRoles.includes(AudienceRole.All)) {
                return true
              }
              const author = await ctx.prisma.question
                .findOne({ where: { id: questionUpdated.id } })
                .author()
              if (toRoles.includes(AudienceRole.ExcludeAuthor)) {
                return id !== author.id
              } else if (toRoles.includes(AudienceRole.OnlyAuthor)) {
                return id === author.id
              }
            default:
              return true
          }
        } else {
          return false
        }
      },
    ),
    resolve: payload => payload.questionUpdated,
  },
)
export const questionRemovedSubscription = subscriptionField<'questionRemoved'>(
  'questionRemoved',
  {
    type: 'Question',
    args: {
      eventId: idArg({ required: true }),
      role: arg({ type: 'RoleName', required: true }),
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_REMOVED']),
      async (payload, args, ctx) => {
        const { id, roles } = ctx.connection.context as TokenPayload
        const role: RoleName = args.role
        const { eventId, toRoles, questionRemoved } = payload

        if (
          eventId === args.eventId &&
          toRoles.includes(role) &&
          roles.includes(role)
        ) {
          switch (role) {
            case RoleName.AUDIENCE:
              if (toRoles.includes(AudienceRole.All)) {
                return true
              }
              const author = await ctx.prisma.question
                .findOne({ where: { id: questionRemoved.id } })
                .author()
              if (toRoles.includes(AudienceRole.ExcludeAuthor)) {
                return id !== author.id
              } else if (toRoles.includes(AudienceRole.OnlyAuthor)) {
                return id === author.id
              }
            default:
              return true
          }
        } else {
          return false
        }
      },
    ),
    resolve: payload => payload.questionRemoved,
  },
)

async function getVoted(ctx: Context, questionId: string) {
  const userId = getAuthedUser(ctx)?.id
  if (!userId) return false
  const audiences: User[] = await ctx.prisma.question
    .findOne({ where: { id: questionId } })
    .votedUsers({ where: { id: userId } })

  return Boolean(audiences.length)
}
