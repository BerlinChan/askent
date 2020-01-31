import { rule } from 'graphql-shield'
import { getAdminUserId } from '../../utils'
import { isAuthenticatedUser, isAuthenticatedAudience } from './User'

export const isEventOwner = rule({ cache: 'contextual' })(
  async ({ id }, args, context) => {
    const userId = getAdminUserId(context)
    const owner = await context.photon.events.findOne({ where: { id } }).owner()

    return userId === owner.id
  },
)

export const isEventOwnerByArgId = rule({ cache: 'strict' })(
  async (parent, { eventId }, context) => {
    const userId = getAdminUserId(context)
    const owner = await context.photon.events
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
  },
}
