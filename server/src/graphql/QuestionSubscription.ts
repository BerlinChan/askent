import { idArg, arg, subscriptionField } from 'nexus'
import { TokenPayload } from '../utils'
import { withFilter } from 'apollo-server-express'
import { ReviewStatus } from '../models/Question'
import { RoleName } from '../models/Role'
import { AudienceRole } from './Role'

export const questionAddedSubscription = subscriptionField<'questionAdded'>(
  'questionAdded',
  {
    type: 'Question',
    args: {
      eventId: idArg({ required: true }),
      role: arg({ type: 'RoleName', required: true }),
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_ADDED']),
      async (payload, args, ctx) => {
        const { id, roles } = ctx.connection.context as TokenPayload
        const role: RoleName = args.role
        const {
          eventId,
          questionEventOwnerId,
          authorId,
          toRoles,
          questionAdded,
        } = payload

        if (
          eventId === args.eventId &&
          toRoles.includes(role) &&
          roles.includes(role)
        ) {
          switch (role) {
            case RoleName.Admin:
              if (toRoles.includes(RoleName.Admin)) {
                return id === questionEventOwnerId
              }
            case RoleName.Audience:
              if (toRoles.includes(AudienceRole.All)) {
                return true
              }
              if (toRoles.includes(AudienceRole.ExcludeAuthor)) {
                return id !== authorId
              } else if (toRoles.includes(AudienceRole.OnlyAuthor)) {
                return id === authorId
              }
            case RoleName.Wall:
              if (toRoles.includes(RoleName.Wall)) {
                return questionAdded.reviewStatus === ReviewStatus.Publish
              }
            default:
              return false
          }
        } else {
          return false
        }
      },
    ),
    resolve: (payload, args, ctx) => payload.questionAdded,
  },
)
export const questionUpdatedSubscription = subscriptionField<'questionUpdated'>(
  'questionUpdated',
  {
    type: 'Question',
    args: {
      eventId: idArg({ required: true }),
      role: arg({ type: 'RoleName', required: true }),
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_UPDATED']),
      async (payload, args, ctx) => {
        const { id, roles } = ctx.connection.context as TokenPayload
        const role: RoleName = args.role
        const { eventId, authorId, toRoles } = payload

        if (
          eventId === args.eventId &&
          toRoles.includes(role) &&
          roles.includes(role)
        ) {
          switch (role) {
            case RoleName.Admin:
              if (toRoles.includes(RoleName.Admin)) {
                return true
              }
            case RoleName.Audience:
              if (toRoles.includes(AudienceRole.All)) {
                return true
              }
              if (toRoles.includes(AudienceRole.ExcludeAuthor)) {
                return id !== authorId
              } else if (toRoles.includes(AudienceRole.OnlyAuthor)) {
                return id === authorId
              }
            case RoleName.Wall:
              if (toRoles.includes(RoleName.Wall)) {
                return true
              }
            default:
              return false
          }
        } else {
          return false
        }
      },
    ),
    resolve: payload => payload.questionUpdated,
  },
)
export const questionRemovedSubscription = subscriptionField<'questionRemoved'>(
  'questionRemoved',
  {
    type: 'ID',
    args: {
      eventId: idArg({ required: true }),
      role: arg({ type: 'RoleName', required: true }),
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_REMOVED']),
      async (payload, args, ctx) => {
        const { id, roles } = ctx.connection.context as TokenPayload
        const role: RoleName = args.role
        const { eventId, authorId, toRoles } = payload

        if (
          eventId === args.eventId &&
          toRoles.includes(role) &&
          roles.includes(role)
        ) {
          switch (role) {
            case RoleName.Admin:
              if (toRoles.includes(RoleName.Admin)) {
                return true
              }
            case RoleName.Audience:
              if (toRoles.includes(AudienceRole.All)) {
                return true
              }
              if (toRoles.includes(AudienceRole.ExcludeAuthor)) {
                return id !== authorId
              } else if (toRoles.includes(AudienceRole.OnlyAuthor)) {
                return id === authorId
              }
            case RoleName.Wall:
              if (toRoles.includes(RoleName.Wall)) {
                return true
              }
            default:
              return false
          }
        } else {
          return false
        }
      },
    ),
    resolve: payload => payload.questionRemoved,
  },
)
