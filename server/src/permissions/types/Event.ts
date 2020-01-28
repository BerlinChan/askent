import { rule } from 'graphql-shield'
import { getUserId } from '../../utils'
import { isAuthenticatedUser } from './User'

export const isEventOwner = rule({ cache: 'contextual' })(
  async ({ id }, args, context) => {
    const userId = getUserId(context)
    const owner = await context.photon.events.findOne({ where: { id } }).owner()

    return userId === owner.id
  },
)

export const isEventOwnerByArgId = rule({ cache: 'strict' })(
  async (parent, { eventId }, context) => {
    const userId = getUserId(context)
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
  },
  Mutation: {
    createEvent: isAuthenticatedUser,
    updateEvent: isEventOwnerByArgId,
    deleteEvent: isEventOwnerByArgId,
  },
  Event: {
    owner: isEventOwner,
    audiences: isEventOwner,
    createdAt: isEventOwner,
    updatedAt: isEventOwner,
    moderation: isEventOwner,
    questions: isEventOwner,
  },
}
