import { rule, or } from 'graphql-shield'
import { getAdminUserId } from '../../utils'
import { isAuthenticatedUser, isAuthenticatedAudience } from './User'

export const isEventOwner = rule({ cache: 'contextual' })(
  async ({ id }, args, ctx) => {
    const userId = getAdminUserId(ctx)
    const owner = await ctx.prisma.event.findOne({ where: { id } }).owner()

    return userId === owner.id
  },
)

export const isEventOwnerByArgId = rule({ cache: 'strict' })(
  async (parent, { eventId }, ctx) => {
    const userId = getAdminUserId(ctx)
    const owner = await ctx.prisma.event
      .findOne({ where: { id: eventId } })
      .owner()

    return userId === owner.id
  },
)

export default {
  Query: {
    eventsByMe: isAuthenticatedUser,
    checkEventCodeExist: isAuthenticatedUser,
    isEventAudience: isAuthenticatedAudience,
  },
  Mutation: {
    createEvent: isAuthenticatedUser,
    updateEvent: isEventOwnerByArgId,
    deleteEvent: isEventOwnerByArgId,
    joinEvent: isAuthenticatedAudience,
  },
  Event: {
    owner: isEventOwner,
    audiences: isEventOwner,
    createdAt: isEventOwner,
    updatedAt: isEventOwner,
    questions: isEventOwner,
    liveQuestionCount: isAuthenticatedAudience,
    audienceCount: or(isEventOwner, isAuthenticatedAudience),
  },
}
