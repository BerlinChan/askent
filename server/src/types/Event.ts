import {
  objectType,
  extendType,
  stringArg,
  subscriptionField,
  arg,
  idArg,
  booleanArg,
} from 'nexus'
import { getAuthedUser } from '../utils'
import { Context } from '../context'
import { Event as EventType } from '@prisma/client'
import { withFilter } from 'apollo-server-express'

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
        const userId = getAuthedUser(ctx)?.id
        const questionsForLive = await ctx.prisma.question.findMany({
          where: {
            event: { id: root.id },
            OR: [{ author: { id: userId } }, { published: true }],
            archived: false,
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

export const eventQuery = extendType({
  type: 'Query',
  definition(t) {
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
    t.list.field('eventsByMe', {
      type: 'Event',
      description: 'Get all my events.',
      args: { searchString: stringArg() },
      resolve: async (root, args, ctx) => {
        const userId = getAuthedUser(ctx)?.id
        return ctx.prisma.event.findMany({
          where: {
            owner: { id: userId },
            OR: [
              { name: { contains: args.searchString } },
              { code: { contains: args.searchString } },
            ],
          },
        })
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
