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
import { Question as QuestionType, User, RoleName } from '@prisma/client'
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
    t.model.star()
    t.model.archived()
    t.model.published()
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
    t.list.field('questionsByMeAudience', {
      type: 'Question',
      args: {
        // TODO: pagination
        eventId: idArg({ required: true }),
      },
      resolve: (root, { eventId }, ctx) => {
        const userId = getAuthedUser(ctx)?.id

        return ctx.prisma.question.findMany({
          where: {
            author: { id: userId },
            event: { id: eventId },
            archived: false,
          },
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
      resolve: (root, args, ctx) => {
        return ctx.prisma.question.findMany({
          where: {
            event: { id: args.eventId },
            star: args.star,
            archived: args.archived,
            published: args.published,
            top: args.top,
            OR: [
              { author: { name: { contains: args.searchString } } },
              { content: { contains: args.searchString } },
            ],
          },
        })
      },
    })
    t.list.field('liveQuestionsByEvent', {
      type: 'Question',
      args: { eventId: idArg({ required: true }) },
      resolve: async (root, { eventId }, ctx) => {
        const userId = getAuthedUser(ctx)?.id
        const liveQuestions = await ctx.prisma.question.findMany({
          where: {
            event: { id: eventId },
            OR: [{ author: { id: userId } }, { published: true }],
            archived: false,
          },
        })

        return liveQuestions
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
            published: !event?.moderation,
            content,
            event: { connect: { id: eventId } },
            author: { connect: { id: userId } },
          },
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
        const findQuestion = await ctx.prisma.question.findOne({
          where: { id: questionId },
          include: { event: true },
        })

        // can only top one question at a time
        let topQuestion: Array<QuestionType> = []
        if (top) {
          topQuestion = await ctx.prisma.question.findMany({
            where: { top: true },
          })
          topQuestion = topQuestion.map(item => ({ ...item, top: false }))
          await ctx.prisma.question.updateMany({
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
        const currentTopQuestion = await ctx.prisma.question.update({
          where: { id: questionId },
          data: question,
        })
        const updateQuestions = [currentTopQuestion].concat(topQuestion)

        if (published === true || archived === false) {
          ctx.pubsub.publish('QUESTION_ADDED', {
            eventId: findQuestion?.event.id,
            questionAdded: currentTopQuestion,
          })
        } else {
          ctx.pubsub.publish('QUESTIONS_UPDATED', {
            eventId: findQuestion?.event.id,
            questionsUpdated: updateQuestions,
          })
        }

        return updateQuestions
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

        ctx.pubsub.publish('QUESTIONS_REMOVED', {
          eventId: findQuestion?.event.id,
          questionsRemoved: [delQuestion],
        })

        return delQuestion
      },
    })
    t.field('deleteAllUnpublishedQuestions', {
      type: 'Int',
      description: 'Delete all unpublished questions by event.',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { eventId }, ctx) => {
        const shouldDelete = await ctx.prisma.question.findMany({
          where: { event: { id: eventId }, published: false },
        })
        const { count } = await ctx.prisma.question.deleteMany({
          where: { event: { id: eventId }, published: false },
        })

        ctx.pubsub.publish('QUESTIONS_REMOVED', {
          eventId,
          questionsRemoved: shouldDelete,
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
        const shouldUpdate = await ctx.prisma.question.findMany({
          where: { event: { id: eventId }, published: false },
        })
        const { count } = await ctx.prisma.question.updateMany({
          where: { event: { id: eventId }, published: false },
          data: { published: true },
        })

        shouldUpdate
          .map(question => ({ ...question, published: true }))
          .forEach(question =>
            ctx.pubsub.publish('QUESTION_ADDED', {
              eventId,
              questionAdded: question,
            }),
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

        ctx.pubsub.publish('QUESTIONS_UPDATED', {
          eventId: updateQuestion.event.id,
          questionsUpdated: [updateQuestion],
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
        if (payload.eventId === args.eventId && roles.includes(role)) {
          switch (role) {
            case 'ADMIN':
              const owner = await ctx.prisma.question
                .findOne({ where: { id: payload.questionAdded.id } })
                .event()
                .owner()
              return id === owner.id
            case 'AUDIENCE':
              const author = await ctx.prisma.question
                .findOne({ where: { id: payload.questionAdded.id } })
                .author()
              return id === author.id || payload.questionAdded.published
            case 'WALL':
              return payload.questionAdded.published
            default:
              return false
          }
        } else {
          return false
        }
      },
    ),
    resolve: (payload, args, ctx) => {
      return payload.questionAdded
    },
  },
)
export const questionUpdatedSubscription = subscriptionField<
  'questionsUpdated'
>('questionsUpdated', {
  type: 'Question',
  list: true,
  args: { eventId: idArg({ required: true }) },
  subscribe: withFilter(
    (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTIONS_UPDATED']),
    (payload, args, ctx) => payload.eventId === args.eventId,
  ),
  resolve: payload => {
    return payload.questionsUpdated
  },
})
export const questionRemovedSubscription = subscriptionField<
  'questionsRemoved'
>('questionsRemoved', {
  type: 'Question',
  list: true,
  args: { eventId: idArg({ required: true }) },
  subscribe: withFilter(
    (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTIONS_REMOVED']),
    (payload, args, ctx) => payload.eventId === args.eventId,
  ),
  resolve: payload => {
    return payload.questionsRemoved
  },
})

const ERROR_MESSAGE = {
  noQuestionId: (questionId: string) => `No question for id: ${questionId}`,
}

async function getVoted(ctx: Context, questionId: string) {
  const userId = getAuthedUser(ctx)?.id
  if (!userId) return false
  const audiences: User[] = await ctx.prisma.question
    .findOne({ where: { id: questionId } })
    .votedUsers({ where: { id: userId } })

  return Boolean(audiences.length)
}
