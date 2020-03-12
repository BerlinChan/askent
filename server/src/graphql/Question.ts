import {
  objectType,
  extendType,
  enumType,
  stringArg,
  idArg,
  arg,
  booleanArg,
} from 'nexus'
import { getAuthedUser } from '../utils'
import { Context } from '../context'
import { AudienceRole } from './Role'
import { ReviewStatus as ReviewStatusEnum } from '../models/Question'
import { Op, Order } from 'sequelize'
import { QuestionModelStatic } from '../models/Question'
import { RoleName } from '../models/Role'
import { QuestionOrderEnum } from './FilterOrder'
import { NexusGenEnums } from 'nexus-typegen'

export const ReviewStatus = enumType({
  name: 'ReviewStatus',
  members: Object.values(ReviewStatusEnum),
})
export const Question = objectType({
  name: 'Question',
  definition(t) {
    t.id('id')
    t.string('content')
    t.field('reviewStatus', { type: 'ReviewStatus' })
    t.boolean('star')
    t.boolean('top')
    t.int('voteUpCount')

    t.field('event', {
      type: 'Event',
      async resolve({ id }, args, ctx) {
        const question = await ctx.db.Question.findByPk(id, {
          include: ['event'],
        })
        return question.event
      },
    })
    t.field('author', {
      type: 'User',
      async resolve({ id }, args, ctx) {
        const question = await ctx.db.Question.findByPk(id, {
          include: ['author'],
        })
        return question.author
      },
    })

    t.boolean('voted', {
      resolve(root, args, ctx) {
        return getVoted(ctx, root.id)
      },
    })

    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('deletedAt', { type: 'DateTime', nullable: true })

    // t.list.field('voteUpUsers', {
    //   type: 'User',
    //   resolve: async (root, args, ctx) => {
    //     const question = await ctx.db.Question.findByPk(root.id)
    //     return question.getVoteUpUsers()
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
      description: 'Query question by event for Role.Admin.',
      args: {
        eventId: idArg({ required: true }),
        filters: arg({
          type: 'QuestionFilter',
          list: true,
          required: true,
        }),
        searchString: stringArg(),
        pagination: arg({ type: 'PaginationInput', required: true }),
        order: arg({
          type: 'QuestionOrder',
          default: QuestionOrderEnum.Popular,
        }),
      },
      resolve: async (
        root,
        { eventId, filters, searchString, pagination, order },
        ctx,
      ) => {
        const { offset, limit } = pagination
        const option = {
          where: {
            eventId,
            [Op.and]: [
              {
                [Op.or]: filters
                  // only ReviewStatus type
                  .filter(filterItem =>
                    (Object.values(ReviewStatusEnum) as string[]).includes(
                      filterItem as string,
                    ),
                  )
                  .map(item => ({ reviewStatus: item })),
              },
              searchString
                ? {
                    [Op.or]: [
                      { content: { [Op.substring]: searchString } },
                      { '$author.name$': { [Op.substring]: searchString } },
                    ],
                  }
                : {},
            ],
          },
          include: searchString ? ['author'] : [],
        }
        const totalCount = await ctx.db.Question.count(option)
        const questions = await ctx.db.Question.findAll({
          ...option,
          ...pagination,
          order: getQuestionOrderQueryObj(
            order as NexusGenEnums['QuestionOrder'],
          ),
        })

        return {
          list: questions,
          hasNextPage: offset + limit < totalCount,
          totalCount,
          ...pagination,
        }
      },
    })
    t.field('questionsByEventAudience', {
      type: 'QuestionPaged',
      description: 'Query question by event for Role.Audience.',
      args: {
        eventId: idArg({ required: true }),
        pagination: arg({ type: 'PaginationInput', required: true }),
        order: arg({
          type: 'QuestionOrder',
          default: QuestionOrderEnum.Popular,
        }),
      },
      resolve: async (root, { eventId, pagination, order }, ctx) => {
        const { offset, limit } = pagination
        const userId = getAuthedUser(ctx)?.id as string
        const option = {
          where: {
            eventId,
            [Op.or]: [
              { reviewStatus: ReviewStatusEnum.Publish },
              {
                [Op.and]: [
                  { authorId: userId },
                  { reviewStatus: ReviewStatusEnum.Review },
                ],
              },
            ],
          },
        }
        const totalCount = await ctx.db.Question.count(option)
        const questions = await ctx.db.Question.findAll({
          ...option,
          ...pagination,
          order: getQuestionOrderQueryObj(
            order as NexusGenEnums['QuestionOrder'],
          ),
        })

        return {
          list: questions,
          hasNextPage: offset + limit < totalCount,
          totalCount,
          ...pagination,
        }
      },
    })
    t.field('questionsByEventWall', {
      type: 'QuestionPaged',
      description: 'Query question by event for Role.Wall.',
      args: {
        eventId: idArg({ required: true }),
        pagination: arg({ type: 'PaginationInput', required: true }),
        order: arg({
          type: 'QuestionOrder',
          default: QuestionOrderEnum.Popular,
        }),
      },
      resolve: async (root, { eventId, pagination, order }, ctx) => {
        const { offset, limit } = pagination
        const option = {
          where: {
            eventId,
            reviewStatus: ReviewStatusEnum.Publish,
          },
        }
        const totalCount = await ctx.db.Question.count(option)
        const questions = await ctx.db.Question.findAll({
          ...option,
          ...pagination,
          order: getQuestionOrderQueryObj(
            order as NexusGenEnums['QuestionOrder'],
          ),
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
        pagination: arg({ type: 'PaginationInput', required: true }),
        // TODO: orderBy: arg({ type: 'QuestionOrderByInput' }),
      },
      resolve: async (root, { pagination }, ctx) => {
        const { offset, limit } = pagination
        const userId = getAuthedUser(ctx)?.id as string
        const option = {
          where: {
            authorId: userId,
            [Op.or]: [
              { reviewStatus: ReviewStatusEnum.Publish },
              { reviewStatus: ReviewStatusEnum.Review },
            ],
          },
        }
        const totalCount = await ctx.db.Question.count(option)
        const questions = await ctx.db.Question.findAll({
          ...option,
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
        const authorId = getAuthedUser(ctx)?.id as string
        const event = await ctx.db.Event.findByPk(eventId)
        const author = await ctx.db.User.findByPk(authorId)
        const newQuestion = await ctx.db.Question.create({
          reviewStatus: event?.moderation
            ? ReviewStatusEnum.Review
            : ReviewStatusEnum.Publish,
          content,
        })
        await newQuestion.setEvent(event)
        await newQuestion.setAuthor(author)

        ctx.pubsub.publish('QUESTION_ADDED', {
          eventId,
          questionEventOwnerId: event?.ownerId,
          authorId,
          toRoles:
            newQuestion.reviewStatus === ReviewStatusEnum.Review
              ? [RoleName.Admin, RoleName.Audience, AudienceRole.OnlyAuthor]
              : newQuestion.reviewStatus === ReviewStatusEnum.Publish
              ? [
                  RoleName.Admin,
                  RoleName.Audience,
                  AudienceRole.All,
                  RoleName.Wall,
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
        const question = await ctx.db.Question.findByPk(questionId, {
          include: [{ association: 'event', attributes: ['ownerId'] }],
        })
        const prevReviewStatus = question.reviewStatus

        await question.update(
          Object.assign(
            { reviewStatus },
            reviewStatus === ReviewStatusEnum.Archive
              ? { top: false }
              : reviewStatus === ReviewStatusEnum.Review
              ? { top: false, star: false }
              : {},
          ),
        )

        switch (reviewStatus) {
          case ReviewStatusEnum.Review:
            // remove for ExcludeAuthor
            ctx.pubsub.publish('QUESTION_REMOVED', {
              eventId: question?.eventId,
              authorId: question?.authorId,
              toRoles: [
                RoleName.Audience,
                AudienceRole.ExcludeAuthor,
                RoleName.Wall,
              ],
              questionRemoved: questionId,
            })
            // update for OnlyAuthor
            ctx.pubsub.publish('QUESTION_UPDATED', {
              eventId: question?.eventId,
              authorId: question?.authorId,
              toRoles: [RoleName.Audience, AudienceRole.OnlyAuthor],
              questionUpdated: question,
            })
            break
          case ReviewStatusEnum.Archive:
            // remove for all Audience & Wall
            ctx.pubsub.publish('QUESTION_REMOVED', {
              eventId: question?.eventId,
              authorId: question?.authorId,
              toRoles: [RoleName.Audience, AudienceRole.All, RoleName.Wall],
              questionRemoved: questionId,
            })
            break
          case ReviewStatusEnum.Publish:
            switch (prevReviewStatus) {
              case ReviewStatusEnum.Review:
                // add for ExcludeAuthor
                ctx.pubsub.publish('QUESTION_ADDED', {
                  eventId: question?.eventId,
                  questionEventOwnerId: question?.event?.ownerId,
                  authorId: question?.authorId,
                  toRoles: [
                    RoleName.Audience,
                    AudienceRole.ExcludeAuthor,
                    RoleName.Wall,
                  ],
                  questionAdded: question,
                })
                // update for OnlyAuthor
                ctx.pubsub.publish('QUESTION_UPDATED', {
                  eventId: question?.eventId,
                  authorId: question?.authorId,
                  toRoles: [RoleName.Audience, AudienceRole.OnlyAuthor],
                  questionUpdated: question,
                })
                break
              case ReviewStatusEnum.Archive:
                // add for all Audience & Wall
                ctx.pubsub.publish('QUESTION_ADDED', {
                  eventId: question?.eventId,
                  questionEventOwnerId: question?.event?.ownerId,
                  authorId: question?.authorId,
                  toRoles: [RoleName.Audience, AudienceRole.All, RoleName.Wall],
                  questionAdded: question,
                })
                break
            }
            break
        }
        // update for admin
        ctx.pubsub.publish('QUESTION_REMOVED', {
          eventId: question?.eventId,
          authorId: question?.authorId,
          toRoles: [RoleName.Admin],
          questionRemoved: questionId,
        })
        ctx.pubsub.publish('QUESTION_ADDED', {
          eventId: question?.eventId,
          questionEventOwnerId: question?.event?.ownerId,
          authorId: question?.authorId,
          toRoles: [RoleName.Admin],
          questionAdded: question,
        })

        return question
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
        const question = await ctx.db.Question.findByPk(questionId)
        await question.update({ content })

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: question?.eventId,
          authorId: question?.authorId,
          toRoles:
            question.reviewStatus === ReviewStatusEnum.Review
              ? [RoleName.Admin, RoleName.Audience, AudienceRole.OnlyAuthor]
              : question.reviewStatus === ReviewStatusEnum.Publish
              ? [
                  RoleName.Admin,
                  RoleName.Audience,
                  AudienceRole.All,
                  RoleName.Wall,
                ]
              : question.reviewStatus === ReviewStatusEnum.Archive
              ? [RoleName.Admin]
              : [],
          questionUpdated: question,
        })

        return question
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
        const question = await ctx.db.Question.findByPk(questionId)
        await question.update({ star })

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: question?.eventId,
          authorId: question?.authorId,
          toRoles:
            question.reviewStatus === ReviewStatusEnum.Review
              ? [RoleName.Admin, RoleName.Audience, AudienceRole.OnlyAuthor]
              : question.reviewStatus === ReviewStatusEnum.Publish
              ? [
                  RoleName.Admin,
                  RoleName.Audience,
                  AudienceRole.All,
                  RoleName.Wall,
                ]
              : question.reviewStatus === ReviewStatusEnum.Archive
              ? [RoleName.Admin]
              : [],
          questionUpdated: question,
        })

        return question
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
        const question = await ctx.db.Question.findByPk(questionId)

        let prevTopQuestions: Array<QuestionModelStatic & { top: boolean }> = []
        if (top) {
          // cancel preview top questions
          prevTopQuestions = await ctx.db.Question.findAll({
            where: { top: true, eventId: question.eventId },
          })
          prevTopQuestions.forEach(questionItem => {
            questionItem.top = false
          })
          await ctx.db.Question.update(
            { top: false },
            { where: { top: true, eventId: question.eventId } },
          )
        }

        await question.update({ top })

        const shouldPub = prevTopQuestions.concat([question])
        shouldPub.forEach((questionItem: QuestionModelStatic) => {
          ctx.pubsub.publish('QUESTION_UPDATED', {
            eventId: question?.eventId,
            toRoles: [
              RoleName.Admin,
              RoleName.Audience,
              AudienceRole.All,
              RoleName.Wall,
            ],
            questionUpdated: questionItem,
          })
        })

        return question
      },
    })
    t.field('deleteQuestion', {
      type: 'ID',
      description: 'Delete a question by id.',
      args: {
        questionId: idArg({ required: true }),
      },
      resolve: async (root, { questionId }, ctx) => {
        const question = await ctx.db.Question.findByPk(questionId)
        await question.destroy()

        ctx.pubsub.publish('QUESTION_REMOVED', {
          eventId: question?.eventId,
          authorId: question?.authorId,
          toRoles:
            question.reviewStatus === ReviewStatusEnum.Review
              ? [RoleName.Admin, RoleName.Audience, AudienceRole.OnlyAuthor]
              : question.reviewStatus === ReviewStatusEnum.Publish
              ? [
                  RoleName.Admin,
                  RoleName.Audience,
                  AudienceRole.All,
                  RoleName.Wall,
                ]
              : question.reviewStatus === ReviewStatusEnum.Archive
              ? [RoleName.Admin]
              : [],
          questionRemoved: questionId,
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
          where: { eventId, reviewStatus: ReviewStatusEnum.Review },
          attributes: ['id', 'authorId'],
        })
        const count = await ctx.db.Question.destroy({
          where: { eventId, reviewStatus: ReviewStatusEnum.Review },
        })

        // TODO: replace by deleteAllReviewQuestions pubsub event
        shouldDelete.forEach(
          (
            delQuestion: QuestionModelStatic & { id: string; authorId: string },
          ) =>
            ctx.pubsub.publish('QUESTION_REMOVED', {
              eventId,
              authorId: delQuestion?.authorId,
              toRoles: [
                RoleName.Admin,
                RoleName.Audience,
                AudienceRole.OnlyAuthor,
              ],
              questionRemoved: delQuestion.id,
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
        const event = await ctx.db.Event.findByPk(eventId, {
          attributes: ['id', 'ownerId'],
          include: [
            {
              association: 'questions',
              where: { reviewStatus: ReviewStatusEnum.Review },
            },
          ],
        })
        const [count] = await ctx.db.Question.update(
          { reviewStatus: ReviewStatusEnum.Publish },
          {
            where: {
              eventId,
              reviewStatus: ReviewStatusEnum.Review,
            },
          },
        )

        event?.questions.forEach(
          (
            questionItem: QuestionModelStatic & {
              id: string
              authorId: string
              reviewStatus: ReviewStatusEnum
            },
          ) => {
            questionItem.reviewStatus = ReviewStatusEnum.Publish
            ctx.pubsub.publish('QUESTION_ADDED', {
              eventId,
              questionEventOwnerId: event?.ownerId,
              authorId: questionItem?.authorId,
              toRoles: [
                RoleName.Audience,
                AudienceRole.ExcludeAuthor,
                RoleName.Wall,
              ],
              questionAdded: questionItem,
            })
            ctx.pubsub.publish('QUESTION_UPDATED', {
              eventId,
              authorId: questionItem?.authorId,
              toRoles: [RoleName.Audience, AudienceRole.OnlyAuthor],
              questionUpdated: questionItem,
            })
            // update for admin
            ctx.pubsub.publish('QUESTION_REMOVED', {
              eventId,
              authorId: questionItem?.authorId,
              toRoles: [RoleName.Admin],
              questionRemoved: questionItem.id,
            })
            ctx.pubsub.publish('QUESTION_ADDED', {
              eventId,
              questionEventOwnerId: event?.ownerId,
              authorId: questionItem?.authorId,
              toRoles: [RoleName.Admin],
              questionAdded: questionItem,
            })
          },
        )

        return count
      },
    })
    t.field('voteUpQuestion', {
      type: 'Question',
      description: 'Vote a question.',
      args: {
        questionId: idArg({ required: true }),
      },
      resolve: async (root, { questionId }, ctx) => {
        const userId = getAuthedUser(ctx)?.id as string
        const user = await ctx.db.User.findByPk(userId)
        const question = await ctx.db.Question.findByPk(questionId)

        if (await getVoted(ctx, questionId)) {
          await question.removeVoteUpUser(user)
        } else {
          await question.addVoteUpUser(user)
        }
        await question.update({
          voteUpCount: await question.countVoteUpUsers(),
        })

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: question?.eventId,
          toRoles: [
            RoleName.Admin,
            RoleName.Audience,
            AudienceRole.All,
            RoleName.Wall,
          ],
          questionUpdated: question,
        })

        return question
      },
    })
  },
})

async function getVoted(ctx: Context, questionId: string) {
  const userId = getAuthedUser(ctx)?.id as string
  const question = await ctx.db.Question.findByPk(questionId)
  if (!userId) return false
  const user = await ctx.db.User.findByPk(userId)

  return question.hasVoteUpUser(user)
}

function getQuestionOrderQueryObj(
  questionOrder: NexusGenEnums['QuestionOrder'],
): Order {
  switch (questionOrder) {
    case QuestionOrderEnum.Recent:
      return [
        ['top', 'DESC'],
        ['createdAt', 'DESC'],
        ['voteUpCount', 'DESC'],
      ]
    case QuestionOrderEnum.Oldest:
      return [
        ['top', 'DESC'],
        ['createdAt', 'ASC'],
        ['voteUpCount', 'DESC'],
      ]
    default:
      // QuestionOrderEnum.Popular:
      return [
        ['top', 'DESC'],
        ['voteUpCount', 'DESC'],
        ['createdAt', 'DESC'],
      ]
  }
}
