import {
  objectType,
  extendType,
  stringArg,
  arg,
  idArg,
  booleanArg,
} from 'nexus'
import { getUserId } from '../utils'
import { Context } from '../context'
import { Event as EventType } from '@prisma/photon'

export const Event = objectType({
  name: 'Event',
  definition(t) {
    t.model.id()
    t.model.code()
    t.model.name()
    t.model.owner()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.startAt()
    t.model.endAt()
    t.model.questions()
    t.model.moderation()
  },
})
export const PubEvent = objectType({
  name: 'PubEvent',
  description: 'Event for public use.',
  definition(t) {
    t.id('id')
    t.string('code')
    t.string('name')
    t.field('startAt', { type: 'DateTime' })
    t.field('endAt', { type: 'DateTime' })

    t.list.field('publishedQuestions', {
      type: 'Question',
      resolve: async (root, args, ctx) => {
        const findAllQuestions = await ctx.photon.events
          .findOne({ where: { id: root.id } })
          .questions()
        return findAllQuestions.filter(item => item.published)
      },
    })
  },
})

export const eventQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('event', {
      type: 'Event',
      args: {
        eventId: idArg({ required: true }),
      },
      resolve: (root, { eventId }, context) => {
        return context.photon.events.findOne({
          where: { id: eventId },
        }) as Promise<EventType>
      },
    })
    t.list.field('events', {
      type: 'Event',
      description: 'Get all my events.',
      args: { searchString: stringArg() },
      resolve: async (root, args, context) => {
        const userId = getUserId(context)
        return context.photon.events.findMany({
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
    t.field('checkEventCodeExist', {
      type: 'Boolean',
      description: 'Check if a event code has already exist.',
      args: {
        code: stringArg({ required: true }),
      },
      resolve: async (root, { code }, context) => {
        return await checkEventCodeExist(context, code)
      },
    })
    t.list.field('pubEvents', {
      type: 'PubEvent',
      description: 'Get all public events.',
      args: { code: stringArg() },
      resolve: async (root, { code }, ctx) => {
        const events = await ctx.photon.events.findMany({
          where: { code: { contains: code } },
        })

        return events.map(event => ({
          id: event.id,
          code: event.code,
          name: event.name,
          startAt: event.startAt,
          endAt: event.endAt,
        }))
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
        const userId = getUserId(ctx)
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
      resolve: async (root, args, context) => {
        await checkEventExist(context, args.eventId)
        const findEvent = await context.photon.events.findOne({
          where: { id: args.eventId },
          select: { code: true },
        })
        if (
          args.code &&
          args.code !== findEvent?.code &&
          (await checkEventCodeExist(context, args.code))
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

        return context.photon.events.update({
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
      resolve: async (root, args, context) => {
        await checkEventExist(context, args.eventId as string)
        return context.photon.events.delete({ where: { id: args.eventId } })
      },
    })
  },
})

async function checkEventCodeExist(context: Context, code: string) {
  return Boolean(await context.photon.events.findOne({ where: { code } }))
}

async function checkEventExist(
  context: Context,
  eventId: EventType['id'],
): Promise<boolean> {
  const findEvent = await context.photon.events.findOne({
    where: { id: eventId },
  })
  if (!findEvent) {
    throw new Error(`No event for id: ${eventId}`)
  }
  return true
}
