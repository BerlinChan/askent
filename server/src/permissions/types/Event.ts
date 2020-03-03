import { rule, deny } from 'graphql-shield'
import { getAuthedUser } from '../../utils'
import { isAuthedAdmin, isAuthedAudience } from './User'

export const isEventOwner = rule({ cache: 'contextual' })(
  async ({ id }, args, ctx) => {
    const userId = getAuthedUser(ctx)?.id
    const owner = await ctx.prisma.event.findOne({ where: { id } }).owner()

    return userId === owner.id
  },
)

export const isEventOwnerByArgId = rule({ cache: 'strict' })(
  async (parent, { eventId }, ctx) => {
    const userId = getAuthedUser(ctx)?.id
    const owner = await ctx.prisma.event
      .findOne({ where: { id: eventId } })
      .owner()

    return userId === owner.id
  },
)

export default {
  Query: {
    eventsByMe: isAuthedAdmin,
    checkEventCodeExist: isAuthedAdmin,
    isEventAudience: isAuthedAudience,
  },
  Mutation: {
    createEvent: isAuthedAdmin,
    updateEvent: isEventOwnerByArgId,
    deleteEvent: isEventOwnerByArgId,
    joinEvent: isAuthedAudience,
  },
  Event: {
    owner: isEventOwner,
    audiences: isEventOwner,
    createdAt: isEventOwner,
    updatedAt: isEventOwner,
    questions: isEventOwner,
  },
}
