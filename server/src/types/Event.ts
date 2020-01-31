import {
  objectType,
  extendType,
  stringArg,
  arg,
  idArg,
  booleanArg,
} from 'nexus'
import { getAdminUserId, getAudienceUserId } from '../utils'
import { Context } from '../context'
import { Event as EventType } from '@prisma/photon'
import { connect } from 'http2'

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

    t.list.field('questionAllPublished', {
      type: 'Question',
      resolve: async (root, args, ctx) => {
        const findAllQuestions = await ctx.photon.events
          .findOne({ where: { id: root.id } })
          .questions()
        return findAllQuestions.filter(item => item.published)
      },
    })
    t.int('audienceCount', {
      resolve: async ({ id }, args, ctx) => {
        const audiences = await ctx.photon.events
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
        const event = await ctx.photon.events.findOne({
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
        const userId = getAdminUserId(ctx)
        return ctx.photon.events.findMany({
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
        const events = await ctx.photon.events.findMany({
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
        const audienceId = getAudienceUserId(ctx)
        const audiences = await ctx.photon.events
          .findOne({ where: { id: eventId } })
          .audiences()

        return Boolean(audiences.find(user => user.id === audienceId))
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
        const userId = getAdminUserId(ctx)
        return ctx.photon.events.create({
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
        const findEvent = await ctx.photon.events.findOne({
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

        return ctx.photon.events.update({
          where: { id: args.eventId },
          data: event,
        })
      },
    })
    t.field('deleteEvent', {
      type: 'Event',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, args, ctx) => {
        await checkEventExist(ctx, args.eventId as string)
        return ctx.photon.events.delete({ where: { id: args.eventId } })
      },
    })
    t.field('joinEvent', {
      type: 'Event',
      description: `加入活动。`,
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: async (root, { eventId }, ctx) => {
        const userId = getAudienceUserId(ctx)
        const event = await ctx.photon.events.update({
          where: { id: eventId },
          data: { audiences: { connect: { id: userId } } },
        })

        return event
      },
    })
  },
})

async function checkEventCodeExist(ctx: Context, code: string) {
  return Boolean(await ctx.photon.events.findOne({ where: { code } }))
}

async function checkEventExist(
  ctx: Context,
  eventId: EventType['id'],
): Promise<boolean> {
  const findEvent = await ctx.photon.events.findOne({
    where: { id: eventId },
  })
  if (!findEvent) {
    throw new Error(`No event for id: ${eventId}`)
  }
  return true
}
