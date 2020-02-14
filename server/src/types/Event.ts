import {
  objectType,
  inputObjectType,
  interfaceType,
  extendType,
  stringArg,
  subscriptionField,
  arg,
  idArg,
  booleanArg,
} from 'nexus'
import { getAuthedUser } from '../utils'
import { Context } from '../context'
import { Event as EventType, QuestionReviewStatus } from '@prisma/client'
import { withFilter } from 'apollo-server-express'
import { DEFAULT_PAGE_SKIP, DEFAULT_PAGE_FIRST } from '../constant'

export const Event = objectType({
  name: 'Event',
  definition(t) {
    t.model.id()
    t.model.code()
    t.model.name()
    t.model.owner()
    t.model.audiences()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.startAt()
    t.model.endAt()
    t.model.moderation()
    t.model.questions()

    t.int('liveQuestionCount', {
      resolve: async (root, args, ctx) => {
        const questionsForLive = await ctx.prisma.question.findMany({
          where: {
            event: { id: root.id },
            reviewStatus: QuestionReviewStatus.PUBLISH,
          },
        })

        //TODO:aggregate count not yet implemented, https://github.com/prisma/prisma-client-js/issues/5
        return questionsForLive.length
      },
    })
    t.int('audienceCount', {
      resolve: async ({ id }, args, ctx) => {
        const audiences = await ctx.prisma.event
          .findOne({
            where: { id },
          })
          .audiences()

        return audiences.length
      },
    })
  },
})
export const PaginationInputType = inputObjectType({
  name: 'PaginationInputType',
  description: 'Pagination input type.',
  definition(t) {
    t.int('skip', {
      default: DEFAULT_PAGE_SKIP,
      required: true,
      description: 'Start from 0.',
    })
    t.int('first', { default: DEFAULT_PAGE_FIRST, required: true })
  },
})
export const IPagedType = interfaceType({
  name: 'IPagedType',
  definition(t) {
    t.int('skip')
    t.int('first')
    t.int('totalCount')
    t.boolean('hasNextPage')
    t.resolveType(() => null)
  },
})
export const PagedEvent = objectType({
  name: 'PagedEvent',
  definition(t) {
    t.implements('IPagedType')
    t.list.field('list', { type: 'Event' })
  },
})

export const eventQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.events({ ordering: true })

    t.field('eventById', {
      type: 'Event',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { eventId }, ctx) => {
        const event = await ctx.prisma.event.findOne({
          where: { id: eventId },
        })

        return event as EventType
      },
    })
    t.field('eventsByMe', {
      type: 'PagedEvent',
      description: 'Get all my events.',
      args: {
        searchString: stringArg(),
        pagination: arg({ type: 'PaginationInputType', required: true }),
        orderBy: arg({ type: 'EventOrderByInput' }),
      },
      resolve: async (root, { searchString, pagination, orderBy }, ctx) => {
        const userId = getAuthedUser(ctx)?.id
        // TODO: aggregation count
        const allEvents = await ctx.prisma.event.findMany({
          where: {
            owner: { id: userId },
            OR: [
              { name: { contains: searchString } },
              { code: { contains: searchString } },
            ],
          },
        })
        const totalCount = allEvents.length
        const { first, skip } = pagination
        const events = await ctx.prisma.event.findMany({
          where: {
            owner: { id: userId },
            OR: [
              { name: { contains: searchString } },
              { code: { contains: searchString } },
            ],
          },
          orderBy,
          ...pagination,
        })

        return {
          list: events,
          hasNextPage: first + skip < totalCount,
          totalCount,
          first,
          skip,
        }
      },
    })
    t.list.field('eventsByCode', {
      type: 'Event',
      description: 'Get events by code.',
      args: { code: stringArg() },
      resolve: async (root, { code }, ctx) => {
        const events = await ctx.prisma.event.findMany({
          where: { code: { contains: code } },
        })

        return events
      },
    })
    t.field('checkEventCodeExist', {
      type: 'Boolean',
      description: 'Check if a event code has already exist.',
      args: {
        code: stringArg({ required: true }),
      },
      resolve: async (root, { code }, ctx) => {
        return await checkEventCodeExist(ctx, code)
      },
    })
    t.field('isEventAudience', {
      type: 'Boolean',
      args: { eventId: idArg({ required: true }) },
      resolve: async (root, { eventId }, ctx) => {
        const audienceId = getAuthedUser(ctx)?.id
        const audiences = await ctx.prisma.event
          .findOne({ where: { id: eventId } })
          .audiences({ where: { id: audienceId } })

        return Boolean(audiences.length)
      },
    })
  },
})

export const eventMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createEvent', {
      type: 'Event',
      args: {
        code: stringArg({ required: true }),
        name: stringArg({ required: true }),
        startAt: arg({ type: 'DateTime', required: true }),
        endAt: arg({ type: 'DateTime', required: true }),
      },
      resolve: async (root, { code, name, startAt, endAt }, ctx) => {
        if (await checkEventCodeExist(ctx, code)) {
          throw new Error(`Code "${code}" has already exist.`)
        }
        const userId = getAuthedUser(ctx)?.id
        return ctx.prisma.event.create({
          data: {
            owner: { connect: { id: userId } },
            code,
            name,
            startAt,
            endAt,
          },
        })
      },
    })
    t.field('updateEvent', {
      type: 'Event',
      args: {
        eventId: idArg({ required: true }),
        code: stringArg({ nullable: true }),
        name: stringArg({ nullable: true }),
        startAt: arg({ type: 'DateTime', nullable: true }),
        endAt: arg({ type: 'DateTime', nullable: true }),
        moderation: booleanArg({ nullable: true }),
      },
      resolve: async (root, args, ctx) => {
        await checkEventExist(ctx, args.eventId)
        const findEvent = await ctx.prisma.event.findOne({
          where: { id: args.eventId },
          select: { code: true },
        })
        if (
          args.code &&
          args.code !== findEvent?.code &&
          (await checkEventCodeExist(ctx, args.code))
        ) {
          throw new Error(`Code "${args.code}" has already exist.`)
        }
        let event = Object.assign(
          {},
          args?.code ? { code: args?.code } : {},
          args?.name ? { name: args?.name } : {},
          args?.startAt ? { startAt: args?.startAt } : {},
          args?.endAt ? { codendAte: args?.endAt } : {},
          typeof args?.moderation === 'boolean'
            ? { moderation: args?.moderation }
            : {},
        )

        const updateEvent = ctx.prisma.event.update({
          where: { id: args.eventId },
          data: event,
        })

        ctx.pubsub.publish('EVENT_UPDATED', {
          eventId: args.eventId,
          eventUpdated: updateEvent,
        })

        return updateEvent
      },
    })
    t.field('deleteEvent', {
      type: 'Event',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, args, ctx) => {
        await checkEventExist(ctx, args.eventId as string)
        return ctx.prisma.event.delete({ where: { id: args.eventId } })
      },
    })
    t.field('joinEvent', {
      type: 'Event',
      description: `加入活动。`,
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { eventId }, ctx) => {
        const userId = getAuthedUser(ctx)?.id
        const updateEvent = await ctx.prisma.event.update({
          where: { id: eventId },
          data: { audiences: { connect: { id: userId } } },
        })

        ctx.pubsub.publish('EVENT_UPDATED', {
          eventId: eventId,
          eventUpdated: updateEvent,
        })

        return updateEvent
      },
    })
  },
})

export const eventUpdatedSubscription = subscriptionField<'eventUpdated'>(
  'eventUpdated',
  {
    type: 'Event',
    args: { eventId: idArg({ required: true }) },
    resolve: payload => {
      return payload.eventUpdated
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['EVENT_UPDATED']),
      (payload, args, ctx) => payload.eventId === args.eventId,
    ),
  },
)

async function checkEventCodeExist(ctx: Context, code: string) {
  return Boolean(await ctx.prisma.event.findOne({ where: { code } }))
}

async function checkEventExist(
  ctx: Context,
  eventId: EventType['id'],
): Promise<boolean> {
  const findEvent = await ctx.prisma.event.findOne({
    where: { id: eventId },
  })
  if (!findEvent) {
    throw new Error(`No event for id: ${eventId}`)
  }
  return true
}
