import {
  objectType,
  extendType,
  stringArg,
  enumType,
  subscriptionField,
  arg,
  idArg,
  inputObjectType,
} from 'nexus'
import { getAuthedUser } from '../utils'
import { Context } from '../context'
import { withFilter } from 'apollo-server-express'
import sequelize, { Op } from 'sequelize'
import { EventDateStatusEnum } from '../models/Event'
import { dataloaderContext } from '../context'
const { EXPECTED_OPTIONS_KEY } = require('dataloader-sequelize')

export const EventDateStatus = enumType({
  name: 'EventDateStatus',
  members: Object.values(EventDateStatusEnum),
})
export const Event = objectType({
  name: 'Event',
  definition(t) {
    t.id('id')
    t.string('code')
    t.string('name')
    t.field('startAt', { type: 'DateTime' })
    t.field('endAt', { type: 'DateTime' })
    t.boolean('moderation')
    t.field('dateStatus', { type: 'EventDateStatus' })

    t.field('owner', {
      type: 'User',
      async resolve({ id }, args, ctx) {
        const event = await ctx.db.Event.findByPk(id, {
          [EXPECTED_OPTIONS_KEY]: dataloaderContext,
        })
        return event.getOwner({
          [EXPECTED_OPTIONS_KEY]: dataloaderContext,
        })
      },
    })
    t.list.field('audiences', {
      type: 'User',
      async resolve({ id }, args, ctx) {
        const event = await ctx.db.Event.findByPk(id, {
          [EXPECTED_OPTIONS_KEY]: dataloaderContext,
        })
        return event.getAudiences({
          [EXPECTED_OPTIONS_KEY]: dataloaderContext,
        })
      },
    })
    t.list.field('questions', {
      type: 'User',
      async resolve({ id }, args, ctx) {
        const event = await ctx.db.Event.findByPk(id, {
          [EXPECTED_OPTIONS_KEY]: dataloaderContext,
        })
        return event.getQuestions({
          [EXPECTED_OPTIONS_KEY]: dataloaderContext,
        })
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
export const UpdateEventInput = inputObjectType({
  name: 'UpdateEventInput',
  definition(t) {
    t.id('eventId', { required: true })
    t.string('code')
    t.string('name')
    t.field('startAt', { type: 'DateTime' })
    t.field('endAt', { type: 'DateTime' })
    t.boolean('moderation')
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
        pagination: arg({ type: 'PaginationInput', required: true }),
        dateStatusFilter: arg({ type: 'EventDateStatus' }),
      },
      resolve: async (
        root,
        { searchString, pagination, dateStatusFilter },
        ctx,
      ) => {
        const userId = getAuthedUser(ctx)?.id as string
        const { limit, offset } = pagination
        const option = {
          where: Object.assign(
            {
              [Op.and]: [
                { ownerId: userId },
                dateStatusFilter === EventDateStatusEnum.Active
                  ? sequelize.literal(
                      'NOW() BETWEEN `event`.`startAt` AND `event`.`endAt`',
                    )
                  : dateStatusFilter === EventDateStatusEnum.Upcoming
                  ? sequelize.literal('NOW() <= `event`.`startAt`')
                  : dateStatusFilter === EventDateStatusEnum.Past
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
        const {
          count: eventsCount,
          rows: events,
        } = await ctx.db.Event.findAndCountAll({
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
        input: arg({ type: 'UpdateEventInput', required: true }),
      },
      resolve: async (root, { input }, ctx) => {
        const { eventId, code, name, startAt, endAt, moderation } = input
        const event = await ctx.db.Event.findByPk(eventId)
        await event.update({
          code: code,
          name: name,
          startAt: startAt,
          endAt: endAt,
          moderation: moderation,
        })

        ctx.pubsub.publish('EVENT_UPDATED', {
          eventId,
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
