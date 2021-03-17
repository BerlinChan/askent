import {
  ID,
  Root,
  Resolver,
  Query,
  Arg,
  Ctx,
  Mutation,
  Subscription,
  ResolverFilterData,
  PubSub,
  Publisher,
  ResolverInterface,
  FieldResolver,
} from 'type-graphql'
import { getRepository, Repository, Like, Brackets } from 'typeorm'
import { Context } from '../context'
import { User as UserEntity } from '../entity/User'
import { User } from './User'
import { Event, EventPaged, UpdateEventInput } from './EventType'
import { EventDateStatus, SubscriptionTopics } from '../constant'
import { PaginationInput } from './Pagination'
import { Event as EventEntity } from '../entity/Event'
import { Question as QuestionEntity } from '../entity/Question'
import { Question } from './Question'

@Resolver((of) => Event)
export class EventResolver implements ResolverInterface<Event> {
  private userRepository: Repository<UserEntity>
  private eventRepository: Repository<EventEntity>

  constructor() {
    this.userRepository = getRepository(UserEntity)
    this.eventRepository = getRepository(EventEntity)
  }

  @FieldResolver((returns) => User)
  async owner(@Root() root: Event): Promise<UserEntity> {
    const user = await this.eventRepository
      .createQueryBuilder()
      .relation(EventEntity, 'owner')
      .of(root.id)
      .loadOne()

    return user
  }

  @FieldResolver((returns) => [User])
  audiences(@Root() root: Event): Promise<UserEntity[]> {
    return this.eventRepository
      .createQueryBuilder()
      .relation(EventEntity, 'audiences')
      .of(root.id)
      .loadMany()
  }

  @FieldResolver((returns) => [User])
  guestes(@Root() root: Event): Promise<UserEntity[]> {
    return this.eventRepository
      .createQueryBuilder()
      .relation(EventEntity, 'guestes')
      .of(root.id)
      .loadMany()
  }

  @FieldResolver((returns) => [Question])
  async questions(@Root() root: Event): Promise<QuestionEntity[]> {
    const questions = await this.eventRepository
      .createQueryBuilder()
      .relation(EventEntity, 'questions')
      .of(root.id)
      .loadMany()

    return questions
  }

  @Query((returns) => Event)
  async eventById(
    @Arg('eventId', (returns) => ID) eventId: string,
  ): Promise<EventEntity> {
    const event = await this.eventRepository.findOneOrFail(eventId)

    return event
  }

  @Query((returns) => EventPaged, { description: 'Get all my events.' })
  async eventsByMe(
    @Arg('pagination', (returns) => PaginationInput)
    pagination: PaginationInput,
    @Arg('searchString', { nullable: true }) searchString: string,
    @Arg('dateStatusFilter', (returns) => EventDateStatus, { nullable: true })
    dateStatusFilter: EventDateStatus,
    @Ctx() ctx: Context,
  ): Promise<EventPaged> {
    const ownerId = ctx.user?.id as string
    const { limit, offset } = pagination
    const options = [
      dateStatusFilter === EventDateStatus.Active
        ? 'NOW() BETWEEN "event"."startAt" AND "event"."endAt"'
        : dateStatusFilter === EventDateStatus.Upcoming
        ? 'NOW() <= "event"."startAt"'
        : dateStatusFilter === EventDateStatus.Past
        ? 'NOW() >= "event"."endAt"'
        : '',
      `"event"."name" LIKE '%${searchString}%' OR "event"."code" LIKE '%${searchString}%'`,
    ]

    const totalCount = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoin('event.owner', 'owner', 'owner.id = :ownerId', { ownerId })
      .where(options[0])
      .andWhere(
        new Brackets((qb) => {
          qb.where(options[1])
        }),
      )
      .getCount()
    const list = await this.eventRepository
      .createQueryBuilder('event')
      .addSelect(
        `CASE
          WHEN NOW() BETWEEN "event"."startAt" AND "event"."endAt" THEN 3
          WHEN NOW() <= "event"."startAt" THEN 2
          WHEN NOW() >= "event"."endAt" THEN 1
          ELSE 0
        END`,
        'weight', // order weight
      )
      .innerJoin('event.owner', 'owner', 'owner.id = :ownerId', { ownerId })
      .where(options[0])
      .andWhere(
        new Brackets((qb) => {
          qb.where(options[1])
        }),
      )
      .skip(offset)
      .take(limit)
      .orderBy({
        weight: 'DESC',
        'event.startAt': 'DESC',
        'event.endAt': 'ASC',
      })
      .getMany()

    return {
      list,
      hasNextPage: limit + offset < totalCount,
      totalCount,
      limit,
      offset,
    }
  }

  @Query((returns) => [Event], { description: 'Get events by code.' })
  async eventsByCode(
    @Arg('code', { nullable: true, defaultValue: '' }) code: string,
  ): Promise<EventEntity[]> {
    const events = await this.eventRepository.find({
      code: Like(`%${code}%`),
    })

    return events
  }

  @Query((returns) => Boolean, {
    description: 'Check if a event code has already exist.',
  })
  async checkEventCodeExist(
    @Arg('code') code: string,
    @Ctx() ctx: Context,
  ): Promise<boolean> {
    return await checkEventCodeExist(ctx, code)
  }

  @Query((returns) => Boolean)
  async isEventAudience(
    @Arg('eventId', (returns) => ID) eventId: string,
    @Ctx() ctx: Context,
  ): Promise<boolean> {
    const audienceId = ctx.user?.id as string
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect(
        'event.audiences',
        'audience',
        'audience.id = :audienceId',
        { audienceId },
      )
      .where('event.id = :eventId', { eventId })
      .getOne()

    return Boolean(event)
  }

  @Mutation((returns) => Event)
  async createEvent(
    @Arg('code') code: string,
    @Arg('name') name: string,
    @Arg('startAt') startAt: Date,
    @Arg('endAt') endAt: Date,
    @Ctx() ctx: Context,
  ): Promise<EventEntity> {
    const ownerId = ctx.user?.id as string
    const owner = await this.userRepository.findOneOrFail(ownerId)
    const event = this.eventRepository.create({
      code,
      name,
      startAt,
      endAt,
      owner,
    })
    await this.eventRepository.save(event)

    return event
  }

  @Mutation((returns) => Event)
  async updateEvent(
    @PubSub(SubscriptionTopics.EVENT_UPDATED)
    publish: Publisher<{ eventId: string; eventUpdated: EventEntity }>,
    @Arg('input') input: UpdateEventInput,
    @Ctx() ctx: Context,
  ): Promise<EventEntity> {
    const { eventId, ...update } = input
    await this.eventRepository.update(eventId, update)
    const event = await this.eventRepository.findOneOrFail(eventId)

    await publish({
      eventId,
      eventUpdated: event,
    })

    return event
  }

  @Mutation((returns) => Event)
  async deleteEvent(
    @Arg('eventId', (returns) => ID) eventId: string,
  ): Promise<Pick<Event, 'id'>> {
    await this.eventRepository.delete(eventId)

    return { id: eventId }
  }

  @Mutation((returns) => ID, { description: `加入活动。` })
  async joinEvent(
    @Arg('eventId', (returns) => ID) eventId: string,
    @Ctx() ctx: Context,
  ): Promise<string> {
    const audienceId = ctx.user?.id as string
    await this.eventRepository
      .createQueryBuilder()
      .relation(UserEntity, 'attendedEvents')
      .of(audienceId)
      .add(eventId)

    return eventId
  }

  @Mutation((returns) => User)
  async addGuest(
    @Arg('eventId', (returns) => ID) eventId: string,
    @Arg('email') email: string,
  ): Promise<UserEntity> {
    const guest = await this.userRepository.findOneOrFail({ email })
    await this.eventRepository
      .createQueryBuilder()
      .relation(EventEntity, 'guestes')
      .of(eventId)
      .add(guest)

    return guest
  }

  @Mutation((returns) => ID)
  async removeGuest(
    @Arg('eventId', (returns) => ID) eventId: string,
    @Arg('guestId', (returns) => ID) guestId: string,
  ): Promise<String> {
    await this.eventRepository
      .createQueryBuilder()
      .relation(EventEntity, 'guestes')
      .of(eventId)
      .remove(guestId)

    return guestId
  }

  @Subscription((returns) => Event, {
    topics: SubscriptionTopics.EVENT_UPDATED,
    filter: ({
      payload,
      args,
      context,
    }: ResolverFilterData<
      { eventId: string; eventUpdated: Event },
      any,
      Context
    >) => payload.eventId === args.eventId,
  })
  eventUpdated(
    @Root() payload: { eventId: string; eventUpdated: Event },
    @Arg('eventId', (returns) => ID) eventId: string,
    @Ctx() ctx: Context,
  ): Event {
    return payload.eventUpdated
  }
}

async function checkEventCodeExist(ctx: Context, code: string) {
  return Boolean(await getRepository(EventEntity).findOne({ code }))
}
