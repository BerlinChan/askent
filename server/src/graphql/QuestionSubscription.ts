import { idArg, arg, stringArg, subscriptionField, intArg } from 'nexus'
import { TokenPayload } from '../utils'
import { withFilter } from 'apollo-server-express'
import {
  getQuestionOrderQueryObj,
  getQuestionsQueryOption,
  getQuestionsAudienceQueryOption,
  getQuestionsWallQueryOption,
} from './Question'
import { ReviewStatusEnum } from '../models/Question'
import { RoleNameEnum } from '../models/Role'
import { AudienceRoleEnum } from './Role'
import { QuestionOrderEnum, QuestionFilterEnum } from './FilterOrder'
import { NexusGenEnums } from 'nexus-typegen'
import { Context } from 'vm'

export const questionAddedSubscription = subscriptionField<'questionAdded'>(
  'questionAdded',
  {
    type: 'Question',
    description:
      '作为 asRole 订阅 eventId，按筛选排序条件计算，若 added 项在其 limit+1 中，则在查询范围中，可推送之',
    args: {
      eventId: idArg({
        required: true,
        description: 'Subscription which event?',
      }),
      asRole: arg({
        type: 'RoleName',
        required: true,
        description: "Subscriber's role.",
      }),
      questionFilter: arg({
        type: 'QuestionFilter',
        default: ReviewStatusEnum.Publish,
      }),
      searchString: stringArg(),
      order: arg({
        type: 'QuestionOrder',
        default: QuestionOrderEnum.Popular,
      }),
      limit: intArg({
        default: 0,
      }),
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_ADDED']),
      async (payload, args, ctx) => {
        const { id, roles } = ctx.connection.context as TokenPayload
        const asRole: RoleNameEnum = args.asRole
        const {
          eventId,
          questionEventOwnerId,
          authorId,
          toRoles,
          questionAdded,
        } = payload

        if (
          eventId === args.eventId && // 订阅该活动
          toRoles.includes(asRole) && // 发布角色 包含 订阅者角色
          roles.includes(asRole) // 用户角色 包含 订阅者角色
        ) {
          switch (asRole) {
            case RoleNameEnum.Admin:
              if (toRoles.includes(RoleNameEnum.Admin)) {
                return (
                  id === questionEventOwnerId &&
                  (await isInFilteredPagedResult(
                    ctx,
                    args.eventId,
                    questionAdded.id,
                    args.order,
                    args.questionFilter,
                    args.searchString,
                    args.limit,
                  ))
                )
              }
            case RoleNameEnum.Audience:
              if (toRoles.includes(AudienceRoleEnum.All)) {
                return await isInAudienceFilteredPagedResult(
                  ctx,
                  args.eventId,
                  id,
                  questionAdded.id,
                  args.order,
                  args.limit,
                )
              } else if (toRoles.includes(AudienceRoleEnum.ExcludeAuthor)) {
                return (
                  id !== authorId &&
                  (await isInAudienceFilteredPagedResult(
                    ctx,
                    args.eventId,
                    id,
                    questionAdded.id,
                    args.order,
                    args.limit,
                  ))
                )
              } else if (toRoles.includes(AudienceRoleEnum.OnlyAuthor)) {
                return (
                  id === authorId &&
                  (await isInAudienceFilteredPagedResult(
                    ctx,
                    args.eventId,
                    id,
                    questionAdded.id,
                    args.order,
                    args.limit,
                  ))
                )
              }
            case RoleNameEnum.Wall:
              if (toRoles.includes(RoleNameEnum.Wall)) {
                return (
                  questionAdded.reviewStatus === ReviewStatusEnum.Publish &&
                  (await isInWallFilteredPagedResult(
                    ctx,
                    args.eventId,
                    questionAdded.id,
                    args.order,
                    args.limit,
                  ))
                )
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
      asRole: arg({ type: 'RoleName', required: true }),
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_UPDATED']),
      async (payload, args, ctx) => {
        const { id, roles } = ctx.connection.context as TokenPayload
        const asRole: RoleNameEnum = args.asRole
        const { eventId, authorId, toRoles } = payload

        if (
          eventId === args.eventId &&
          toRoles.includes(asRole) &&
          roles.includes(asRole)
        ) {
          switch (asRole) {
            case RoleNameEnum.Admin:
              if (toRoles.includes(RoleNameEnum.Admin)) {
                return true
              }
            case RoleNameEnum.Audience:
              if (toRoles.includes(AudienceRoleEnum.All)) {
                return true
              }
              if (toRoles.includes(AudienceRoleEnum.ExcludeAuthor)) {
                return id !== authorId
              } else if (toRoles.includes(AudienceRoleEnum.OnlyAuthor)) {
                return id === authorId
              }
            case RoleNameEnum.Wall:
              if (toRoles.includes(RoleNameEnum.Wall)) {
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
      asRole: arg({ type: 'RoleName', required: true }),
    },
    subscribe: withFilter(
      (root, args, ctx) => ctx.pubsub.asyncIterator(['QUESTION_REMOVED']),
      async (payload, args, ctx) => {
        const { id, roles } = ctx.connection.context as TokenPayload
        const asRole: RoleNameEnum = args.asRole
        const { eventId, authorId, toRoles } = payload

        if (
          eventId === args.eventId &&
          toRoles.includes(asRole) &&
          roles.includes(asRole)
        ) {
          switch (asRole) {
            case RoleNameEnum.Admin:
              if (toRoles.includes(RoleNameEnum.Admin)) {
                return true
              }
            case RoleNameEnum.Audience:
              if (toRoles.includes(AudienceRoleEnum.All)) {
                return true
              }
              if (toRoles.includes(AudienceRoleEnum.ExcludeAuthor)) {
                return id !== authorId
              } else if (toRoles.includes(AudienceRoleEnum.OnlyAuthor)) {
                return id === authorId
              }
            case RoleNameEnum.Wall:
              if (toRoles.includes(RoleNameEnum.Wall)) {
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

async function isInFilteredPagedResult(
  ctx: Context,
  eventId: string,
  questionAddedId: string,
  order: QuestionOrderEnum,
  questionFilter: NexusGenEnums['QuestionFilter'] | null | undefined,
  searchString: string | null | undefined,
  limit: number,
) {
  const orderedList = await ctx.db.Question.findAll({
    ...getQuestionsQueryOption(eventId, questionFilter, searchString),
    order: getQuestionOrderQueryObj(order),
    limit: limit + 1,
    attributes: ['id'],
    raw: true,
  })

  return Boolean(
    orderedList.find((item: { id: string }) => item.id === questionAddedId),
  )
}
async function isInAudienceFilteredPagedResult(
  ctx: Context,
  eventId: string,
  userId: string,
  questionAddedId: string,
  order: QuestionOrderEnum,
  limit: number,
) {
  const orderedList = await ctx.db.Question.findAll({
    ...getQuestionsAudienceQueryOption(eventId, userId),
    order: getQuestionOrderQueryObj(order),
    limit: limit + 1,
    attributes: ['id'],
    raw: true,
  })

  return Boolean(
    orderedList.find((item: { id: string }) => item.id === questionAddedId),
  )
}
async function isInWallFilteredPagedResult(
  ctx: Context,
  eventId: string,
  questionAddedId: string,
  order: QuestionOrderEnum,
  limit: number,
) {
  const orderedList = await ctx.db.Question.findAll({
    ...getQuestionsWallQueryOption(eventId),
    order: getQuestionOrderQueryObj(order),
    limit: limit + 1,
    attributes: ['id'],
    raw: true,
  })
  return Boolean(
    orderedList.find((item: { id: string }) => item.id === questionAddedId),
  )
}
