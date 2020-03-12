import { rule } from 'graphql-shield'
import { getAuthedUser } from '../../utils'
import { isAuthedAdmin, isAuthedAudience } from './User'

export const isEventOwner = rule({ cache: 'contextual' })(
  async ({ id }, args, ctx) => {
    const userId = getAuthedUser(ctx)?.id
    const event = await ctx.db.Event.findByPk(id, {
      include: [{ association: 'owner', attributes: ['id'] }],
    })

    return userId === event?.owner.id
  },
)

export const isEventOwnerByArgId = rule({ cache: 'strict' })(
  async (parent, { eventId }, ctx) => {
    const userId = getAuthedUser(ctx)?.id
    const event = await ctx.db.Event.findByPk(eventId, {
      include: [{ association: 'owner', attributes: ['id'] }],
    })

    return userId === event?.owner.id
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
