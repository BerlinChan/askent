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
import { Op } from 'sequelize'

export const Event = objectType({
  name: 'Event',
  definition(t) {
    t.id('id')
    t.string('code')
    t.string('name')
    t.field('startAt', { type: 'DateTime' })
    t.field('endAt', { type: 'DateTime' })
    t.boolean('moderation')

    t.field('owner', {
      type: 'User',
      resolve: async (root, args, ctx) => {
        console.log(root)
        const event = await ctx.db.Event.findOne({ where: { id: root.id } })
        console.log(event)
        return event.getOwner()
      },
    })
    t.list.field('audiences', {
      type: 'User',
      resolve: async (root, args, ctx) => {
        const event = await ctx.db.Event.findOne({ where: { id: root.id } })
        return event.getAudiences()
      },
    })
    t.list.field('questions', {
      type: 'User',
      resolve: async (root, args, ctx) => {
        const event = await ctx.db.Event.findOne({ where: { id: root.id } })
        return event.getQuestions()
      },
    })

    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('deletedAt', { type: 'DateTime', nullable: true })
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
    t.field('eventById', {
      type: 'Event',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { eventId }, ctx) => {
        const event = await ctx.db.Event.findOne({
          where: { id: eventId },
        })

        return event
      },
    })
    t.field('eventsByMe', {
      type: 'PagedEvent',
      description: 'Get all my events.',
      args: {
        searchString: stringArg(),
        pagination: arg({ type: 'PaginationInputType', required: true }),
        // TODO: orderBy: arg({ type: 'EventOrderByInput' }),
      },
      resolve: async (root, { searchString, pagination }, ctx) => {
        const userId = getAuthedUser(ctx)?.id as string
        const eventsTotalCount = await ctx.db.Event.findAndCountAll({
          where: {
            owner: { id: userId },
            [Op.or]: [
              { name: { [Op.substring]: searchString } },
              { code: { [Op.substring]: searchString } },
            ],
          },
        })
        const { limit, offset } = pagination
        const events = await ctx.db.Event.findAll({
          where: {
            owner: { id: userId },
            [Op.or]: [
              { name: { [Op.substring]: searchString } },
              { code: { [Op.substring]: searchString } },
            ],
          },
          ...pagination,
        })

        return {
          list: events,
          hasNextPage: limit + offset < eventsTotalCount,
          totalCount: eventsTotalCount,
          limit,
          offset,
        }
      },
    })
    t.list.field('eventsByCode', {
      type: 'Event',
      description: 'Get events by code.',
      args: { code: stringArg() },
      resolve: async (root, { code }, ctx) => {
        const events = await ctx.db.Event.findAll({
          where: { code: { [Op.substring]: code } },
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
        const audienceId = getAuthedUser(ctx)?.id as string
        const event = await ctx.db.Event.findOne({ where: { id: eventId } })
        const audience = await ctx.db.User.findOne({
          where: { id: audienceId },
        })

        return event.hasAudience(audience)
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
        const userId = getAuthedUser(ctx)?.id as string
        const owner = await ctx.db.User.findOne({ where: { id: userId } })
        const event = await ctx.db.Event.create({ code, name, startAt, endAt })
        await event.setOwner(owner)

        return event
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
        const userId = getAuthedUser(ctx)?.id as string
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
  return Boolean(await ctx.db.Event.findOne({ where: { code } }))
}

async function checkEventExist(
  ctx: Context,
  eventId: EventType['id'],
): Promise<boolean> {
  const findEvent = await ctx.db.Event.findOne({
    where: { id: eventId },
  })
  if (!findEvent) {
    throw new Error(`No event for id: ${eventId}`)
  }
  return true
}
