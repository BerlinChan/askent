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
import { withFilter } from 'apollo-server-express'
import sequelize, { Op } from 'sequelize'
import { EventDateFilterEnum } from './FilterOrder'

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
      async resolve({ id }, args, ctx) {
        const event = await ctx.db.Event.findByPk(id)
        return event.getOwner()
      },
    })
    t.list.field('audiences', {
      type: 'User',
      async resolve({ id }, args, ctx) {
        const event = await ctx.db.Event.findByPk(id)
        return event.getAudiences()
      },
    })
    t.list.field('questions', {
      type: 'User',
      async resolve({ id }, args, ctx) {
        const event = await ctx.db.Event.findByPk(id)
        return event.getQuestions()
      },
    })

    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})
export const EventPaged = objectType({
  name: 'EventPaged',
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
      resolve: (root, { eventId }, ctx) => {
        return ctx.db.Event.findByPk(eventId)
      },
    })
    t.field('eventsByMe', {
      type: 'EventPaged',
      description: 'Get all my events.',
      args: {
        searchString: stringArg(),
        pagination: arg({ type: 'PaginationInputType', required: true }),
        dateFilter: arg({ type: 'EventDateFilter' }),
      },
      resolve: async (root, { searchString, pagination, dateFilter }, ctx) => {
        const userId = getAuthedUser(ctx)?.id as string
        const { limit, offset } = pagination
        const option = {
          where: Object.assign(
            {
              [Op.and]: [
                { ownerId: userId },
                dateFilter === EventDateFilterEnum.Active
                  ? sequelize.literal(
                      'NOW() BETWEEN `event`.`startAt` AND `event`.`endAt`',
                    )
                  : dateFilter === EventDateFilterEnum.Upcoming
                  ? sequelize.literal('NOW() <= `event`.`startAt`')
                  : dateFilter === EventDateFilterEnum.Past
                  ? sequelize.literal('NOW() >= `event`.`endAt`')
                  : undefined,
              ],
            },
            searchString
              ? {
                  [Op.or]: [
                    { name: { [Op.substring]: searchString } },
                    { code: { [Op.substring]: searchString } },
                  ],
                }
              : {},
          ),
        }
        const eventsCount = await ctx.db.Event.count(option)
        const events = await ctx.db.Event.findAll({
          ...option,
          ...pagination,
          order: [
            [
              sequelize.literal(
                'NOW() BETWEEN `event`.`startAt` AND `event`.`endAt`',
              ),
              'DESC',
            ],
            [sequelize.literal('NOW() <= `event`.`startAt`'), 'DESC'],
            [sequelize.literal('NOW() >= `event`.`endAt`'), 'DESC'],
            ['startAt', 'DESC'],
            ['endAt', 'ASC'],
          ],
        })

        return {
          list: events,
          hasNextPage: limit + offset < eventsCount,
          totalCount: eventsCount,
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
        const event = await ctx.db.Event.findByPk(eventId)
        const audience = await ctx.db.User.findByPk(audienceId)

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
        const owner = await ctx.db.User.findByPk(userId)
        const event = await ctx.db.Event.create({ code, name, startAt, endAt })
        await event.setOwner(owner)

        return event
      },
    })
    t.field('updateEvent', {
      type: 'Event',
      args: {
        eventId: idArg({ required: true }),
        code: stringArg(),
        name: stringArg(),
        startAt: arg({ type: 'DateTime' }),
        endAt: arg({ type: 'DateTime' }),
        moderation: booleanArg(),
      },
      resolve: async (root, args, ctx) => {
        const event = await ctx.db.Event.findByPk(args.eventId)
        if (
          args.code &&
          args.code !== event?.code &&
          (await checkEventCodeExist(ctx, args.code))
        ) {
          throw new Error(`Code "${args.code}" has already exist.`)
        }
        await event.update({
          code: args?.code,
          name: args?.name,
          startAt: args?.startAt,
          endAt: args?.endAt,
          moderation: args?.moderation,
        })

        ctx.pubsub.publish('EVENT_UPDATED', {
          eventId: args.eventId,
          eventUpdated: event,
        })

        return event
      },
    })
    t.field('deleteEvent', {
      type: 'ID',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { eventId }, ctx) => {
        await ctx.db.Event.destroy({ where: { id: eventId } })
        return eventId
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
        const event = await ctx.db.Event.findByPk(eventId)
        const audience = await ctx.db.User.findByPk(userId)
        await event.addAudience(audience)

        ctx.pubsub.publish('EVENT_UPDATED', {
          eventId: eventId,
          eventUpdated: event,
        })

        return event
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
  return Boolean(await ctx.db.Event.count({ where: { code } }))
}
