import {
  objectType,
  extendType,
  enumType,
  stringArg,
  idArg,
  arg,
  subscriptionField,
  booleanArg,
} from 'nexus'
import { User, RoleName } from '@prisma/client'
import { getAuthedUser, TokenPayload } from '../utils'
import { withFilter } from 'apollo-server-express'
import { Context } from '../context'
import { ReviewStatus } from '../models/Question'
import { Op } from 'sequelize'
import { QuestionModelStatic } from '../models/Question'
import { UserModelStatic } from '../models/User'

enum AudienceRole {
  All,
  ExcludeAuthor,
  OnlyAuthor,
}
export const ReviewStatusEnum = enumType({
  name: 'ReviewStatus',
  members: ReviewStatus,
})
export const Question = objectType({
  name: 'Question',
  definition(t) {
    t.id('id')
    t.string('content')
    t.field('reviewStatus', { type: 'ReviewStatus' })
    t.boolean('star')
    t.boolean('top')

    t.field('event', {
      type: 'Event',
      async resolve({ id }, args, ctx) {
        const question = await ctx.db.Question.findOne({ where: { id } })
        return question.getEvent()
      },
    })
    t.field('author', {
      type: 'User',
      async resolve({ id }, args, ctx) {
        const question = await ctx.db.Question.findOne({ where: { id } })
        return question.getAuthor()
      },
    })

    t.boolean('voted', {
      resolve(root, args, ctx) {
        return getVoted(ctx, root.id)
      },
    })
    t.int('voteCount', {
      async resolve({ id }, _args, ctx) {
        const question = await ctx.db.Question.findOne({ where: { id } })
        return question.countVotedUsers()
      },
    })

    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('deletedAt', { type: 'DateTime', nullable: true })

    // t.list.field('votedUsers', {
    //   type: 'User',
    //   resolve: async (root, args, ctx) => {
    //     const question = await ctx.db.Question.findOne({ where: { id: root.id } })
    //     return question.getVotedUsers()
    //   },
    // })
  },
})
export const QuestionPaged = objectType({
  name: 'QuestionPaged',
  definition(t) {
    t.implements('IPagedType')
    t.list.field('list', { type: 'Question' })
  },
})

export const questionQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('questionsByEvent', {
      type: 'QuestionPaged',
      args: {
        eventId: idArg({ required: true }),
        pagination: arg({ type: 'PaginationInputType', required: true }),
        // TODO: where: arg({ type: 'QuestionWhereInput' }),
        // TODO: orderBy: arg({ type: 'QuestionOrderByInput' }),
      },
      resolve: async (root, { eventId, pagination }, ctx) => {
        const { offset, limit } = pagination
        const totalCount = await ctx.db.Question.count({
          where: { eventId },
        })
        const questions = await ctx.db.Question.findAll({
          where: { eventId: eventId },
          ...pagination,
        })

        return {
          list: questions,
          hasNextPage: offset + limit < totalCount,
          totalCount,
          ...pagination,
        }
      },
    })
    t.field('liveQuestionsByEvent', {
      type: 'QuestionPaged',
      args: {
        eventId: idArg({ required: true }),
        pagination: arg({ type: 'PaginationInputType', required: true }),
        // TODO: orderBy: arg({ type: 'QuestionOrderByInput' }),
      },
      resolve: async (root, { eventId, pagination }, ctx) => {
        const { offset, limit } = pagination
        const userId = getAuthedUser(ctx)?.id as string
        const totalCount = await ctx.db.Question.count({
          where: {
            eventId,
            [Op.or]: [
              { reviewStatus: ReviewStatus.Publish },
              {
                [Op.and]: [
                  { author: { id: userId } },
                  { reviewStatus: ReviewStatus.Review },
                ],
              },
            ],
          },
        })
        const questions = await ctx.db.Question.findAll({
          where: {
            event: { id: eventId },
            [Op.or]: [
              { reviewStatus: ReviewStatus.Publish },
              {
                [Op.and]: [
                  { author: { id: userId } },
                  { reviewStatus: ReviewStatus.Review },
                ],
              },
            ],
          },
          ...pagination,
        })

        return {
          list: questions,
          hasNextPage: offset + limit < totalCount,
          totalCount,
          ...pagination,
        }
      },
    })
    t.field('questionsByMe', {
      type: 'QuestionPaged',
      args: {
        pagination: arg({ type: 'PaginationInputType', required: true }),
        // TODO: orderBy: arg({ type: 'QuestionOrderByInput' }),
      },
      resolve: async (root, { pagination }, ctx) => {
        const { offset, limit } = pagination
        const userId = getAuthedUser(ctx)?.id as string
        const totalCount = await ctx.db.Question.count({
          where: {
            author: { id: userId },
            [Op.or]: [
              { reviewStatus: ReviewStatus.Publish },
              { reviewStatus: ReviewStatus.Review },
            ],
          },
        })
        const questions = await ctx.db.Question.findAll({
          where: {
            author: { id: userId },
            [Op.or]: [
              { reviewStatus: ReviewStatus.Publish },
              { reviewStatus: ReviewStatus.Review },
            ],
          },
          ...pagination,
        })

        return {
          list: questions,
          hasNextPage: offset + limit < totalCount,
          totalCount,
          ...pagination,
        }
      },
    })
    t.field('wallQuestionsByEvent', {
      type: 'QuestionPaged',
      args: {
        eventId: idArg({ required: true }),
        star: booleanArg(),
        pagination: arg({ type: 'PaginationInputType', required: true }),
        // TODO: orderBy: arg({ type: 'QuestionOrderByInput' }),
      },
      resolve: async (root, { eventId, star, pagination }, ctx) => {
        const { offset, limit } = pagination
        const totalCount = await ctx.db.Question.count({
          where: Object.assign(
            {
              eventId,
              reviewStatus: ReviewStatus.Publish,
            },
            typeof star === 'boolean' ? { star } : {},
          ),
        })
        const questions = await ctx.db.Question.findAll({
          where: Object.assign(
            {
              eventId,
              reviewStatus: ReviewStatus.Publish,
            },
            typeof star === 'boolean' ? { star } : {},
          ),
          ...pagination,
        })

        return {
          list: questions,
          hasNextPage: offset + limit < totalCount,
          totalCount,
          ...pagination,
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
        const userId = getAuthedUser(ctx)?.id as string
        const event = await ctx.db.Event.findOne({
          where: { id: eventId },
          include: [{ association: 'owner', attributes: ['id'] }],
        })
        const author = await ctx.db.User.findOne({
          where: { id: userId },
        })
        const newQuestion = await ctx.db.Question.create({
          reviewStatus: event?.moderation
            ? ReviewStatus.Review
            : ReviewStatus.Publish,
          content,
        })
        newQuestion.setEvent(event)
        newQuestion.setAuthor(author)

        ctx.pubsub.publish('QUESTION_ADDED', {
          eventId,
          questionEventOwnerId: event?.owner?.id,
          authorId: author.id,
          toRoles:
            newQuestion.reviewStatus === ReviewStatus.Review
              ? [RoleName.ADMIN, RoleName.AUDIENCE, AudienceRole.OnlyAuthor]
              : newQuestion.reviewStatus === ReviewStatus.Publish
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
        reviewStatus: arg({ type: 'ReviewStatus', required: true }),
      },
      resolve: async (root, { questionId, reviewStatus }, ctx) => {
        const prevQuestion = await ctx.db.Question.findOne({
          where: { id: questionId },
          include: [
            {
              association: 'event',
              attributes: ['id'],
              include: [{ association: 'owner', attributes: ['id'] }],
            },
            { association: 'author', attributes: ['id'] },
          ],
        })

        await ctx.db.Question.update(
          Object.assign(
            { reviewStatus },
            reviewStatus === ReviewStatus.Archive
              ? { top: false }
              : reviewStatus === ReviewStatus.Review
              ? { top: false, star: false }
              : {},
          ),
          { where: { id: questionId } },
        )
        const updateQuestion = await ctx.db.Question.findOne({
          where: { id: questionId },
        })

        if (
          reviewStatus === ReviewStatus.Archive ||
          reviewStatus === ReviewStatus.Review
        ) {
          // remove for ExcludeAuthor
          ctx.pubsub.publish('QUESTION_REMOVED', {
            eventId: prevQuestion?.event?.id,
            authorId: prevQuestion?.author?.id,
            toRoles: [
              RoleName.AUDIENCE,
              AudienceRole.ExcludeAuthor,
              RoleName.WALL,
            ],
            questionRemoved: updateQuestion,
          })
        } else if (reviewStatus === ReviewStatus.Publish) {
          // add for ExcludeAuthor
          ctx.pubsub.publish('QUESTION_ADDED', {
            eventId: prevQuestion?.event?.id,
            questionEventOwnerId: prevQuestion?.event?.owner?.id,
            authorId: prevQuestion?.author?.id,
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
          eventId: prevQuestion?.event?.id,
          authorId: prevQuestion?.author?.id,
          toRoles: [RoleName.AUDIENCE, AudienceRole.OnlyAuthor],
          questionUpdated: updateQuestion,
        })
        // update for admin
        ctx.pubsub.publish('QUESTION_REMOVED', {
          eventId: prevQuestion?.event?.id,
          authorId: prevQuestion?.author?.id,
          toRoles: [RoleName.ADMIN],
          questionRemoved: prevQuestion,
        })
        ctx.pubsub.publish('QUESTION_ADDED', {
          eventId: prevQuestion?.event?.id,
          questionEventOwnerId: prevQuestion?.event?.owner?.id,
          authorId: prevQuestion?.author?.id,
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
        const question = await ctx.db.Question.findOne({
          where: { id: questionId },
          attributes: ['id'],
          include: [
            { association: 'event', attributes: ['id'] },
            { association: 'author', attributes: ['id'] },
          ],
        })

        await ctx.db.Question.update({ content }, { where: { id: questionId } })
        const updateQuestion = await ctx.db.Question.findOne({
          where: { id: questionId },
        })

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: question?.event?.id,
          authorId: question?.author?.id,
          toRoles:
            updateQuestion.reviewStatus === ReviewStatus.Review
              ? [RoleName.ADMIN, RoleName.AUDIENCE, AudienceRole.OnlyAuthor]
              : updateQuestion.reviewStatus === ReviewStatus.Publish
              ? [
                  RoleName.ADMIN,
                  RoleName.AUDIENCE,
                  AudienceRole.All,
                  RoleName.WALL,
                ]
              : updateQuestion.reviewStatus === ReviewStatus.Archive
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
        const question = await ctx.db.Question.findOne({
          where: { id: questionId },
          attributes: ['id'],
          include: [
            { association: 'event', attributes: ['id'] },
            { association: 'author', attributes: ['id'] },
          ],
        })

        await ctx.db.Question.update({ star }, { where: { id: questionId } })
        const updateQuestion = await ctx.db.Question.findOne({
          where: { id: questionId },
        })

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: question?.event?.id,
          authorId: question?.author?.id,
          toRoles:
            updateQuestion.reviewStatus === ReviewStatus.Review
              ? [RoleName.ADMIN, RoleName.AUDIENCE, AudienceRole.OnlyAuthor]
              : updateQuestion.reviewStatus === ReviewStatus.Publish
              ? [
                  RoleName.ADMIN,
                  RoleName.AUDIENCE,
                  AudienceRole.All,
                  RoleName.WALL,
                ]
              : updateQuestion.reviewStatus === ReviewStatus.Archive
              ? [RoleName.ADMIN]
              : [],
          questionUpdated: updateQuestion,
        })

        return updateQuestion
      },
    })
    t.field('updateQuestionTop', {
      type: 'Question',
      description: 'Top a question. Can only top one question at a time.',
      args: {
        questionId: idArg({ required: true }),
        top: booleanArg({ required: true }),
      },
      resolve: async (root, { questionId, top }, ctx) => {
        const question = await ctx.db.Question.findOne({
          where: { id: questionId },
          attributes: ['id'],
          include: [{ association: 'event', attributes: ['id'] }],
        })

        let prevTopQuestions: Array<QuestionModelStatic> = []
        if (top) {
          // cancel preview top questions
          prevTopQuestions = (
            await ctx.db.Question.findAll({
              where: { top: true, eventId: question.event?.id },
            })
          ).map((item: QuestionModelStatic) => ({
            ...item,
            top: false,
          }))
          await ctx.db.Question.update(
            { top: false },
            { where: { top: true, eventId: question.event?.id } },
          )
        }

        await ctx.db.Question.update({ top }, { where: { id: questionId } })
        const updateQuestion = await ctx.db.Question.findOne({
          where: { id: questionId },
        })

        const shouldPub = [updateQuestion].concat(prevTopQuestions)
        shouldPub.forEach((questionItem: QuestionModelStatic) =>
          ctx.pubsub.publish('QUESTION_UPDATED', {
            eventId: question?.event?.id,
            toRoles: [
              RoleName.ADMIN,
              RoleName.AUDIENCE,
              AudienceRole.All,
              RoleName.WALL,
            ],
            questionUpdated: questionItem,
          }),
        )

        return updateQuestion
      },
    })
    t.field('deleteQuestion', {
      type: 'ID',
      description: 'Delete a question by id.',
      args: {
        questionId: idArg({ required: true }),
      },
      resolve: async (root, { questionId }, ctx) => {
        const question = await ctx.db.Question.findOne({
          where: { id: questionId },
          attributes: ['id', 'reviewStatus'],
          include: [
            { association: 'event', attributes: ['id'] },
            { association: 'author', attributes: ['id'] },
          ],
        })
        await ctx.db.Question.destroy({
          where: { id: questionId },
        })

        ctx.pubsub.publish('QUESTION_REMOVED', {
          eventId: question?.event?.id,
          authorId: question?.author?.id,
          toRoles:
            question.reviewStatus === ReviewStatus.Review
              ? [RoleName.ADMIN, RoleName.AUDIENCE, AudienceRole.OnlyAuthor]
              : question.reviewStatus === ReviewStatus.Publish
              ? [
                  RoleName.ADMIN,
                  RoleName.AUDIENCE,
                  AudienceRole.All,
                  RoleName.WALL,
                ]
              : question.reviewStatus === ReviewStatus.Archive
              ? [RoleName.ADMIN]
              : [],
          questionRemoved: question,
        })

        return questionId
      },
    })
    t.field('deleteAllReviewQuestions', {
      type: 'Int',
      description: 'Delete all Review questions by event.',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { eventId }, ctx) => {
        const shouldDelete = await ctx.db.Question.findAll({
          where: { eventId, reviewStatus: ReviewStatus.Review },
          attributes: ['id', 'reviewStatus'],
          include: [{ association: 'author', attributes: ['id'] }],
        })
        const count = await ctx.db.Question.destroy({
          where: { eventId, reviewStatus: ReviewStatus.Review },
        })

        shouldDelete.forEach(
          (delQuestion: QuestionModelStatic & { author: { id: string } }) =>
            ctx.pubsub.publish('QUESTION_REMOVED', {
              eventId,
              authorId: delQuestion?.author?.id,
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
        const event = await ctx.db.Event.findOne({
          where: { id: eventId },
          attributes: ['id'],
          include: [
            {
              association: 'owner',
              attributes: ['id'],
            },
          ],
        })
        const shouldUpdate = (
          await ctx.db.Question.findAll({
            where: {
              eventId,
              reviewStatus: ReviewStatus.Review,
            },
            include: [{ association: 'author', attributes: ['id'] }],
          })
        ).map((questionItem: QuestionModelStatic) => ({
          ...questionItem,
          reviewStatus: ReviewStatus.Publish,
        }))
        const count = await ctx.db.Question.update(
          { reviewStatus: ReviewStatus.Publish },
          {
            where: {
              eventId,
              reviewStatus: ReviewStatus.Review,
            },
          },
        )

        shouldUpdate.forEach(
          (questionItem: QuestionModelStatic & { author: { id: string } }) => {
            ctx.pubsub.publish('QUESTION_ADDED', {
              eventId,
              questionEventOwnerId: event?.owner?.id,
              authorId: questionItem?.author?.id,
              toRoles: [
                RoleName.AUDIENCE,
                AudienceRole.ExcludeAuthor,
                RoleName.WALL,
              ],
              questionAdded: questionItem,
            })
            ctx.pubsub.publish('QUESTION_UPDATED', {
              eventId,
              authorId: questionItem?.author?.id,
              toRoles: [RoleName.AUDIENCE, AudienceRole.OnlyAuthor],
              questionUpdated: questionItem,
            })
            // update for admin
            ctx.pubsub.publish('QUESTION_REMOVED', {
              eventId,
              authorId: questionItem?.author?.id,
              toRoles: [RoleName.ADMIN],
              questionRemoved: questionItem,
            })
            ctx.pubsub.publish('QUESTION_ADDED', {
              eventId,
              questionEventOwnerId: event?.owner?.id,
              authorId: questionItem?.author?.id,
              toRoles: [RoleName.ADMIN],
              questionAdded: questionItem,
            })
          },
        )

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
        const userId = getAuthedUser(ctx)?.id as string
        const user = await ctx.db.User.findOne({ where: { id: userId } })
        const question = await ctx.db.Question.findOne({
          where: { id: questionId },
          include: [{ association: 'event', attributes: ['id'] }],
        })

        if (await getVoted(ctx, questionId)) {
          await question.removeVotedUser(user)
        } else {
          await question.addVotedUser(user)
        }

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: question?.event?.id,
          toRoles: [
            RoleName.ADMIN,
            RoleName.AUDIENCE,
            AudienceRole.All,
            RoleName.WALL,
          ],
          questionUpdated: question,
        })

        return question
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
        const {
          eventId,
          questionEventOwnerId,
          authorId,
          toRoles,
          questionAdded,
        } = payload

        if (
          eventId === args.eventId &&
          toRoles.includes(role) &&
          roles.includes(role)
        ) {
          switch (role) {
            case RoleName.ADMIN:
              return id === questionEventOwnerId
            case RoleName.AUDIENCE:
              if (toRoles.includes(AudienceRole.All)) {
                return true
              }
              if (toRoles.includes(AudienceRole.ExcludeAuthor)) {
                return id !== authorId
              } else if (toRoles.includes(AudienceRole.OnlyAuthor)) {
                return id === authorId
              }
            case RoleName.WALL:
              return questionAdded.reviewStatus === ReviewStatus.Publish
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
        const { eventId, authorId, toRoles } = payload

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
              if (toRoles.includes(AudienceRole.ExcludeAuthor)) {
                return id !== authorId
              } else if (toRoles.includes(AudienceRole.OnlyAuthor)) {
                return id === authorId
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
        const { eventId, authorId, toRoles } = payload

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
              if (toRoles.includes(AudienceRole.ExcludeAuthor)) {
                return id !== authorId
              } else if (toRoles.includes(AudienceRole.OnlyAuthor)) {
                return id === authorId
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
  const userId = getAuthedUser(ctx)?.id as string
  const question = await ctx.db.Question.findOne({ where: { id: questionId } })
  if (!userId) return false
  const user = await ctx.db.User.findOne({ where: { id: userId } })

  return question.hasVotedUser(user)
}
