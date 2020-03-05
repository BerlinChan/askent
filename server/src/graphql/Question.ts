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
import { ReviewStatus } from '../models/Question'
import { Op } from 'sequelize'
import { QuestionModelStatic } from '../models/Question'
import { RoleName } from '../models/Role'

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
        const question = await ctx.db.Question.findByPk(id)
        return question.getEvent()
      },
    })
    t.field('author', {
      type: 'User',
      async resolve({ id }, args, ctx) {
        const question = await ctx.db.Question.findByPk(id)
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
        const question = await ctx.db.Question.findByPk(id)
        return question.countVotedUsers()
      },
    })

    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('deletedAt', { type: 'DateTime', nullable: true })

    // t.list.field('votedUsers', {
    //   type: 'User',
    //   resolve: async (root, args, ctx) => {
    //     const question = await ctx.db.Question.findByPk(root.id)
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
        reviewStatus: arg({ type: 'ReviewStatus', list: true }),
        searchString: stringArg(),
        pagination: arg({ type: 'PaginationInputType', required: true }),
        // TODO: orderBy: arg({ type: 'QuestionOrderByInput' }),
      },
      resolve: async (
        root,
        { eventId, reviewStatus, searchString, pagination },
        ctx,
      ) => {
        const { offset, limit } = pagination
        const option = {
          where: {
            eventId,
            [Op.and]: [
              { [Op.or]: reviewStatus?.map(item => ({ reviewStatus: item })) },
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
        const option = {
          where: {
            authorId: userId,
            [Op.or]: [
              { reviewStatus: ReviewStatus.Publish },
              { reviewStatus: ReviewStatus.Review },
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
        const event = await ctx.db.Event.findByPk(eventId, {
          include: [{ association: 'owner', attributes: ['id'] }],
        })
        const author = await ctx.db.User.findByPk(userId)
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
              ? [RoleName.Admin, RoleName.Audience, AudienceRole.OnlyAuthor]
              : newQuestion.reviewStatus === ReviewStatus.Publish
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
        const prevQuestion = await ctx.db.Question.findByPk(questionId, {
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
        const updateQuestion = await ctx.db.Question.findByPk(questionId)

        if (
          reviewStatus === ReviewStatus.Archive ||
          reviewStatus === ReviewStatus.Review
        ) {
          // remove for ExcludeAuthor
          ctx.pubsub.publish('QUESTION_REMOVED', {
            eventId: prevQuestion?.event?.id,
            authorId: prevQuestion?.author?.id,
            toRoles: [
              RoleName.Audience,
              AudienceRole.ExcludeAuthor,
              RoleName.Wall,
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
              RoleName.Audience,
              AudienceRole.ExcludeAuthor,
              RoleName.Wall,
            ],
            questionAdded: updateQuestion,
          })
        }
        // update for OnlyAuthor
        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: prevQuestion?.event?.id,
          authorId: prevQuestion?.author?.id,
          toRoles: [RoleName.Audience, AudienceRole.OnlyAuthor],
          questionUpdated: updateQuestion,
        })
        // update for admin
        ctx.pubsub.publish('QUESTION_REMOVED', {
          eventId: prevQuestion?.event?.id,
          authorId: prevQuestion?.author?.id,
          toRoles: [RoleName.Admin],
          questionRemoved: prevQuestion,
        })
        ctx.pubsub.publish('QUESTION_ADDED', {
          eventId: prevQuestion?.event?.id,
          questionEventOwnerId: prevQuestion?.event?.owner?.id,
          authorId: prevQuestion?.author?.id,
          toRoles: [RoleName.Admin],
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
        const question = await ctx.db.Question.findByPk(questionId, {
          attributes: ['id'],
          include: [
            { association: 'event', attributes: ['id'] },
            { association: 'author', attributes: ['id'] },
          ],
        })

        await ctx.db.Question.update({ content }, { where: { id: questionId } })
        const updateQuestion = await ctx.db.Question.findByPk(questionId)

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: question?.event?.id,
          authorId: question?.author?.id,
          toRoles:
            updateQuestion.reviewStatus === ReviewStatus.Review
              ? [RoleName.Admin, RoleName.Audience, AudienceRole.OnlyAuthor]
              : updateQuestion.reviewStatus === ReviewStatus.Publish
              ? [
                  RoleName.Admin,
                  RoleName.Audience,
                  AudienceRole.All,
                  RoleName.Wall,
                ]
              : updateQuestion.reviewStatus === ReviewStatus.Archive
              ? [RoleName.Admin]
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
        const question = await ctx.db.Question.findByPk(questionId, {
          attributes: ['id'],
          include: [
            { association: 'event', attributes: ['id'] },
            { association: 'author', attributes: ['id'] },
          ],
        })

        await ctx.db.Question.update({ star }, { where: { id: questionId } })
        const updateQuestion = await ctx.db.Question.findByPk(questionId)

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: question?.event?.id,
          authorId: question?.author?.id,
          toRoles:
            updateQuestion.reviewStatus === ReviewStatus.Review
              ? [RoleName.Admin, RoleName.Audience, AudienceRole.OnlyAuthor]
              : updateQuestion.reviewStatus === ReviewStatus.Publish
              ? [
                  RoleName.Admin,
                  RoleName.Audience,
                  AudienceRole.All,
                  RoleName.Wall,
                ]
              : updateQuestion.reviewStatus === ReviewStatus.Archive
              ? [RoleName.Admin]
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
        const question = await ctx.db.Question.findByPk(questionId, {
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
        const updateQuestion = await ctx.db.Question.findByPk(questionId)

        const shouldPub = [updateQuestion].concat(prevTopQuestions)
        shouldPub.forEach((questionItem: QuestionModelStatic) =>
          ctx.pubsub.publish('QUESTION_UPDATED', {
            eventId: question?.event?.id,
            toRoles: [
              RoleName.Admin,
              RoleName.Audience,
              AudienceRole.All,
              RoleName.Wall,
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
        const question = await ctx.db.Question.findByPk(questionId, {
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
              ? [RoleName.Admin, RoleName.Audience, AudienceRole.OnlyAuthor]
              : question.reviewStatus === ReviewStatus.Publish
              ? [
                  RoleName.Admin,
                  RoleName.Audience,
                  AudienceRole.All,
                  RoleName.Wall,
                ]
              : question.reviewStatus === ReviewStatus.Archive
              ? [RoleName.Admin]
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
                RoleName.Admin,
                RoleName.Audience,
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
        const event = await ctx.db.Event.findByPk(eventId, {
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
                RoleName.Audience,
                AudienceRole.ExcludeAuthor,
                RoleName.Wall,
              ],
              questionAdded: questionItem,
            })
            ctx.pubsub.publish('QUESTION_UPDATED', {
              eventId,
              authorId: questionItem?.author?.id,
              toRoles: [RoleName.Audience, AudienceRole.OnlyAuthor],
              questionUpdated: questionItem,
            })
            // update for admin
            ctx.pubsub.publish('QUESTION_REMOVED', {
              eventId,
              authorId: questionItem?.author?.id,
              toRoles: [RoleName.Admin],
              questionRemoved: questionItem,
            })
            ctx.pubsub.publish('QUESTION_ADDED', {
              eventId,
              questionEventOwnerId: event?.owner?.id,
              authorId: questionItem?.author?.id,
              toRoles: [RoleName.Admin],
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
        const user = await ctx.db.User.findByPk(userId)
        const question = await ctx.db.Question.findByPk(questionId, {
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

  return question.hasVotedUser(user)
}
