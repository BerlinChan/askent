import {
  objectType,
  extendType,
  inputObjectType,
  stringArg,
  idArg,
  arg,
  booleanArg,
  subscriptionField,
} from 'nexus'
import {
  Question as QuestionType,
  User,
  QuestionCreateInput,
} from '@prisma/photon'
import { getUserId } from '../utils'
import { withFilter } from 'apollo-server-express'

export const Question = objectType({
  name: 'Question',
  definition(t) {
    t.model.id()
    t.model.event()
    t.model.author()
    t.model.username()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.content()
    t.model.star()
    t.model.archived()
    t.model.published()
    t.model.top()
    // t.model.votedUsers()

    t.int('voteCount', {
      async resolve({ id }, _args, ctx) {
        const users = await ctx.photon.questions
          .findOne({ where: { id } })
          .votedUsers()

        return users?.length || 0
      },
    })
  },
})
export const UpdateQuestionInputType = inputObjectType({
  name: 'UpdateQuestionInputType',
  definition(t) {
    t.id('questionId', { required: true })
    t.string('content')
    t.boolean('published')
    t.boolean('archived')
    t.boolean('star')
    t.boolean('top')
  },
})

export const questionQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('questionsByMe', {
      type: 'Question',
      args: {
        // TODO: pagination, refs: https://github.com/prisma/prisma2/blob/master/docs/photon/api.md#findmany
      },
      resolve: (root, args, context) => {
        return context.photon.questions.findMany({
          where: { author: { id: getUserId(context) } },
        })
      },
    })
    t.list.field('questionsByEvent', {
      type: 'Question',
      args: {
        eventId: idArg({ required: true }),
        searchString: stringArg(),
        star: booleanArg(),
        archived: booleanArg(),
        published: booleanArg(),
        top: booleanArg(),
      },
      resolve: (root, args, context) => {
        return context.photon.questions.findMany({
          where: {
            event: { id: args.eventId },
            star: args.star,
            archived: args.archived,
            published: args.published,
            top: args.top,
            OR: [
              { username: { contains: args.searchString } },
              { content: { contains: args.searchString } },
            ],
          },
        })
      },
    })
  },
})

export const questionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createQuestion', {
      type: 'Question',
      // TODO: 匿名用户分配临时用户，记录客户端唯一标识防止滥用
      description: '暂登录用户可用',
      args: {
        username: stringArg({ nullable: true }),
        content: stringArg({ required: true }),
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { username, content, eventId }, ctx) => {
        const userId = getUserId(ctx)
        const event = await ctx.photon.events.findOne({
          where: { id: eventId },
        })
        let question: QuestionCreateInput = {
          published: !event?.moderation,
          content,
          event: { connect: { id: eventId } },
        }
        if (userId) {
          const findUser = await ctx.photon.users.findOne({
            where: { id: userId },
          })
          question = {
            ...question,
            author: { connect: { id: userId } },
            username: findUser?.name,
          }
        } else if (username) {
          question.username = username
        }

        const newQuestion = await ctx.photon.questions.create({
          data: question,
        })

        ctx.pubsub.publish('QUESTION_ADDED', {
          eventId,
          questionAdded: newQuestion,
        })

        return newQuestion
      },
    })
    t.list.field('updateQuestion', {
      type: 'Question',
      description: 'Update a question. Can only top one question at a time.',
      args: {
        input: arg({ type: 'UpdateQuestionInputType', required: true }),
      },
      resolve: async (root, { input }, ctx) => {
        const { content, questionId, published, archived, star, top } = input
        const findQuestion = await ctx.photon.questions.findOne({
          where: { id: questionId },
          include: { event: true },
        })
        if (!findQuestion) {
          throw new Error(ERROR_MESSAGE.noQuestionId(questionId))
        }

        // can only top one question at a time
        let topQuestion: Array<QuestionType> = []
        if (top) {
          topQuestion = await ctx.photon.questions.findMany({
            where: { top: true },
          })
          topQuestion = topQuestion.map(item => ({ ...item, top: false }))
          await ctx.photon.questions.updateMany({
            where: { top: true },
            data: { top: false },
          })
        }

        let question = Object.assign(
          { content, published, archived, star, top },
          archived === true ? { top: false } : {},
          published === false
            ? { top: false, star: false, archived: false }
            : {},
        )
        const currentTopQuestion = await ctx.photon.questions.update({
          where: { id: questionId },
          data: question,
        })
        const response = [currentTopQuestion].concat(topQuestion)

        ctx.pubsub.publish('QUESTION_UPDATED', {
          eventId: findQuestion?.event.id,
          questionUpdated: response,
        })

        return response
      },
    })
    t.field('deleteQuestion', {
      type: 'Question',
      description: 'Delete a question by id.',
      args: {
        questionId: idArg({ required: true }),
      },
      resolve: async (root, { questionId }, ctx) => {
        const findQuestion = await ctx.photon.questions.findOne({
          where: { id: questionId },
          include: { event: true },
        })
        if (!findQuestion) {
          throw new Error(ERROR_MESSAGE.noQuestionId(questionId))
        }

        const response = await ctx.photon.questions.delete({
          where: { id: questionId },
        })

        ctx.pubsub.publish('QUESTION_DELETED', {
          eventId: findQuestion?.event.id,
          questionDeleted: response,
        })

        return response
      },
    })
    t.field('deleteAllUnpublishedQuestions', {
      type: 'Int',
      description: 'Delete all unpublished questions by event.',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { eventId }, ctx) => {
        const { count } = await ctx.photon.questions.deleteMany({
          where: { event: { id: eventId } },
        })

        return count
      },
    })
    t.field('publishAllUnpublishedQuestions', {
      type: 'Int',
      description: 'Delete all unpublished questions by event.',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { eventId }, ctx) => {
        const { count } = await ctx.photon.questions.updateMany({
          where: { event: { id: eventId } },
          data: { published: true },
        })

        return count
      },
    })
    t.field('voteQuestion', {
      type: 'Question',
      description: 'Vote for a question.',
      args: {
        questionId: idArg({ required: true }),
      },
      resolve: async (root, { questionId }, context) => {
        const userId = getUserId(context)
        const votedUsers: User[] = await context.photon.questions
          .findOne({ where: { id: questionId } })
          .votedUsers({ where: { id: userId } })
        return context.photon.questions.update({
          where: { id: questionId },
          data: {
            votedUsers: votedUsers.length
              ? { disconnect: { id: userId } }
              : { connect: { id: userId } },
          },
        })
      },
    })
  },
})

export const questionAddedSubscription = subscriptionField<'questionAdded'>(
  'questionAdded',
  {
    type: 'Question',
    args: { eventId: idArg({ required: true }) },
    resolve: (payload, args, context) => {
      return payload.questionAdded
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_ADDED']),
      (payload, args, context) => payload.eventId === args.eventId,
    ),
  },
)
export const questionUpdatedSubscription = subscriptionField<'questionUpdated'>(
  'questionUpdated',
  {
    type: 'Question',
    list: true,
    args: { eventId: idArg({ required: true }) },
    resolve: payload => {
      return payload.questionUpdated
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_UPDATED']),
      (payload, args, context) => payload.eventId === args.eventId,
    ),
  },
)
export const questionDeletedSubscription = subscriptionField<'questionDeleted'>(
  'questionDeleted',
  {
    type: 'Question',
    args: { eventId: idArg({ required: true }) },
    resolve: payload => {
      return payload.questionDeleted
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_DELETED']),
      (payload, args, context) => payload.eventId === args.eventId,
    ),
  },
)

const ERROR_MESSAGE = {
  noQuestionId: (questionId: string) => `No question for id: ${questionId}`,
}
