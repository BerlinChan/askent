import { isAfter, isBefore, isEqual } from 'date-fns'
import {
  registerEnumType,
  ObjectType,
  Field,
  ID,
  InputType,
  Root,
  Resolver,
  Query,
  Arg,
  Ctx,
  Mutation,
  Subscription,
} from 'type-graphql'
import { getRepository } from 'typeorm'
import { plainToClass } from 'class-transformer'
import { getAuthedUser } from '../utils'
import { Context } from '../context'
import { User as UserEntity } from '../entity/User'
import { User } from './User'
import { IPagedType, PaginationInput } from './Pagination'
import {
  EventModel,
  EventSchema,
  QuestionSchema,
  QuestionModel,
} from '../model'
import { Question } from './Question'

export enum EventDateStatus {
  Active = 'Active',
  Upcoming = 'Upcoming',
  Past = 'Past',
}
registerEnumType(EventDateStatus, { name: 'EventDateStatus' })

@ObjectType()
export class Event {
  @Field(returns => ID)
  public _id!: string

  @Field(returns => ID)
  get id(): string {
    return this._id
  }

  @Field(returns => String)
  public code!: string

  @Field(returns => String)
  public name!: string

  @Field(returns => Date)
  public startAt!: Date

  @Field(returns => Date)
  public endAt!: Date

  @Field(returns => Boolean)
  public moderation!: boolean

  @Field(returns => EventDateStatus)
  get dateStatus(): EventDateStatus {
    const NOW = new Date()
    if (
      isAfter(NOW, new Date(this.startAt)) &&
      isBefore(NOW, new Date(this.endAt))
    ) {
      return EventDateStatus.Active
    } else if (
      isAfter(NOW, new Date(this.endAt)) ||
      isEqual(NOW, new Date(this.endAt))
    ) {
      return EventDateStatus.Past
    } else {
      // if (
      //   isBefore(NOW, new Date(this.startAt)) ||
      //   isEqual(NOW, new Date(this.startAt))
      // )
      return EventDateStatus.Upcoming
    }
  }

  @Field(returns => User)
  async owner(@Root() root: User): Promise<User> {
    const user = await getRepository(UserEntity).findOne(root.id)
    if (!user) {
      throw new Error()
    }

    return plainToClass(User, user)
  }

  @Field(returns => [ID])
  public audienceIds!: string[]

  @Field(returns => [User])
  async audiences(): Promise<User[]> {
    const audiences = await getRepository(UserEntity).findByIds(
      this.audienceIds,
    )

    return plainToClass(User, audiences)
  }

  @Field(returns => [Question])
  async questions(@Root() root: Event): Promise<QuestionSchema[]> {
    const questions = await QuestionModel.find({ eventId: root.id }).lean(true)

    return questions
  }

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}

@ObjectType({ implements: IPagedType })
export class EventPaged implements IPagedType {
  offset!: number
  limit!: number
  totalCount!: number
  hasNextPage!: boolean

  @Field(returns => [Event])
  public list!: EventSchema[]
}

@InputType()
export class UpdateEventInput implements Partial<Event> {
  @Field(returns => ID)
  public eventId!: string

  @Field({ nullable: true })
  public code?: string

  @Field({ nullable: true })
  public name?: string

  @Field({ nullable: true })
  public startAt?: Date

  @Field({ nullable: true })
  public endAt?: Date

  @Field({ nullable: true })
  public moderation?: boolean
}

@Resolver(of => Event)
export class EventResolver {
  @Query(returns => Event)
  async eventById(
    @Arg('eventId', returns => ID) eventId: string,
  ): Promise<EventSchema> {
    const event = await EventModel.findById(eventId).lean(true)
    if (!event) {
      throw new Error()
    }

    return event
  }

  @Query(returns => EventPaged, { description: 'Get all my events.' })
  async eventsByMe(
    @Arg('pagination', returns => PaginationInput) pagination: PaginationInput,
    @Arg('searchString', { nullable: true }) searchString: string,
    @Arg('dateStatusFilter', returns => EventDateStatus, { nullable: true })
    dateStatusFilter: EventDateStatus,
    @Ctx() ctx: Context,
  ): Promise<EventPaged> {
    const userId = getAuthedUser(ctx)?.id as string
    const { limit, offset } = pagination
    const NOW = new Date()
    const aggregations = [
      {
        $match: {
          $and: [
            { ownerId: userId }, // filter owner
            dateStatusFilter === EventDateStatus.Active // filter dateStatus
              ? { startAt: { $lt: NOW }, endAt: { $gt: NOW } }
              : dateStatusFilter === EventDateStatus.Upcoming
              ? { startAt: { $gte: NOW } }
              : dateStatusFilter === EventDateStatus.Past
              ? { endAt: { $lte: NOW } }
              : {},
            {
              $or: [
                // filter searchString
                { name: { $regex: new RegExp(searchString) } },
                { code: { $regex: new RegExp(searchString) } },
              ],
            },
          ],
        },
      },
    ]
    const [{ totalCount }] = await EventModel.aggregate([
      ...aggregations,
      { $count: 'totalCount' },
    ])
    const events = await EventModel.aggregate([
      ...aggregations,
      {
        // add dateWeight field
        $addFields: {
          dateWeight: {
            $cond: {
              if: {
                $and: [{ $lt: ['$startAt', NOW] }, { $gt: ['$endAt', NOW] }],
              },
              then: 3,
              else: {
                $cond: {
                  if: { $gte: ['$startAt', NOW] },
                  then: 2,
                  else: 1,
                },
              },
            },
          },
        },
      },
      { $sort: { dateWeight: -1 } }, // order by dateWeight
      { $skip: offset },
      { $limit: limit },
    ])

    return {
      list: events,
      hasNextPage: limit + offset < totalCount,
      totalCount,
      limit,
      offset,
    }
  }

  @Query(returns => [Event], { description: 'Get events by code.' })
  async eventsByCode(
    @Arg('code', { nullable: true, defaultValue: '' }) code: string,
  ): Promise<EventSchema[]> {
    const events = await EventModel.find({
      code: { $regex: new RegExp(code) },
    }).lean(true)

    return events
  }

  @Query(returns => Boolean, {
    description: 'Check if a event code has already exist.',
  })
  async checkEventCodeExist(
    @Arg('code') code: string,
    @Ctx() ctx: Context,
  ): Promise<boolean> {
    return await checkEventCodeExist(ctx, code)
  }

  @Query(returns => Boolean)
  async isEventAudience(
    @Arg('eventId', returns => ID) eventId: string,
    @Ctx() ctx: Context,
  ): Promise<boolean> {
    const audienceId = getAuthedUser(ctx)?.id as string
    const event = await EventModel.findOne({
      _id: eventId,
      audienceIds: { $all: [audienceId] },
    }).lean(true)

    return Boolean(event)
  }

  @Mutation(returns => Event)
  async createEvent(
    @Arg('code') code: string,
    @Arg('name') name: string,
    @Arg('startAt') startAt: Date,
    @Arg('endAt') endAt: Date,
    @Ctx() ctx: Context,
  ): Promise<EventSchema> {
    const userId = getAuthedUser(ctx)?.id as string
    const event = await EventModel.create({
      code,
      name,
      startAt,
      endAt,
      ownerId: userId,
    })

    return event
  }

  @Mutation(returns => Event)
  async updateEvent(
    @Arg('input') input: UpdateEventInput,
    @Ctx() ctx: Context,
  ): Promise<EventSchema> {
    const { eventId, ...update } = input
    const event = await EventModel.findByIdAndUpdate(eventId, update, {
      new: true,
      omitUndefined: true,
    }).lean(true)
    if (!event) {
      throw new Error()
    }

    return event
  }

  @Mutation(returns => ID)
  async deleteEvent(
    @Arg('eventId', returns => ID) eventId: string,
  ): Promise<string> {
    await EventModel.deleteOne({ _id: eventId })
    return eventId
  }

  @Mutation(returns => Event, { description: `加入活动。` })
  async joinEvent(
    @Arg('eventId', returns => ID) eventId: string,
    @Ctx() ctx: Context,
  ): Promise<EventSchema> {
    const audienceId = getAuthedUser(ctx)?.id as string
    const event = await EventModel.findByIdAndUpdate(
      eventId,
      { $push: { audienceIds: audienceId } },
      { new: true },
    ).lean(true)
    if (!event) {
      throw new Error()
    }

    return event
  }

  @Subscription(returns => Event, {
    topics: ['EVENT_UPDATED'],
    filter: ({ payload, args }) => payload.eventId === args.eventId,
  })
  eventUpdatedSubscription(
    @Root() payload: { eventId: string; eventUpdated: Event },
  ): Event {
    return payload.eventUpdated
  }
}

async function checkEventCodeExist(ctx: Context, code: string) {
  return Boolean(await EventModel.findOne({ code }).lean(true))
}
