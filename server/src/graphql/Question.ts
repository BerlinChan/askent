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
  Int,
  Publisher,
  PubSub,
} from 'type-graphql'
import { Context } from '../context'
import { User as UserEntity } from '../entity/User'
import { QuestionOrder, QuestionFilter } from './FilterOrder'
import { IPagedType, PaginationInput } from './Pagination'
import { ReviewStatus } from '../entity/Question'
import { Event as EventEntity } from '../entity/Event'
import { Question as QuestionEntity } from '../entity/Question'
import { Event } from './Event-type'
import { User } from './User'
import { getRepository, Repository, Like, OrderByCondition } from 'typeorm'
import { RoleName } from '../entity/Role'
import { QuestionQueryMeta } from '../entity/QuestionQueryMeta'
import { MD5, enc } from 'crypto-js'
import { QuestionRealtimeSearchPayload } from './QuestionSubscription'

registerEnumType(ReviewStatus, { name: 'ReviewStatus' })

@ObjectType()
export class Question {
  private questionRepository: Repository<QuestionEntity>

  constructor() {
    this.questionRepository = getRepository(QuestionEntity)
  }

  @Field((returns) => ID)
  public id!: string

  @Field()
  public content!: string

  @Field()
  public anonymous!: boolean

  @Field((returns) => ReviewStatus)
  public reviewStatus!: ReviewStatus

  @Field()
  public star!: boolean

  @Field()
  public top!: boolean

  @Field((returns) => Int)
  public voteUpCount!: number

  @Field((returns) => Event)
  async event(@Root() root: Question): Promise<EventEntity> {
    const event = await this.questionRepository
      .createQueryBuilder()
      .relation(QuestionEntity, 'event')
      .of(root.id)
      .loadOne()

    return event
  }

  @Field((returns) => User, { nullable: true })
  async author(@Root() root: Question): Promise<UserEntity | undefined> {
    if (!root.anonymous) {
      const user = await this.questionRepository
        .createQueryBuilder()
        .relation(QuestionEntity, 'author')
        .of(root.id)
        .loadOne()

      return user
    }
  }

  @Field((returns) => Boolean)
  voted(@Root() root: Question, @Ctx() ctx: Context): Promise<boolean> {
    return getVoted(ctx, root.id)
  }

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}

@ObjectType({ implements: IPagedType })
export class QuestionPaged implements IPagedType {
  offset!: number
  limit!: number
  totalCount!: number
  hasNextPage!: boolean

  @Field()
  public hash!: string

  @Field((returns) => [Question])
  public list!: QuestionEntity[]
}

@InputType()
export class QuestionQueryInput {
  @Field((returns) => ID)
  public eventId!: string

  @Field((returns) => QuestionFilter, {
    nullable: true,
    defaultValue: QuestionFilter.Publish,
  })
  public questionFilter: QuestionFilter = QuestionFilter.Publish

  @Field({ nullable: true, defaultValue: '' })
  public searchString: string = ''

  @Field((returns) => PaginationInput)
  public pagination!: PaginationInput

  @Field((returns) => QuestionOrder, {
    nullable: true,
    defaultValue: QuestionOrder.Popular,
  })
  public order: QuestionOrder = QuestionOrder.Popular
}

@InputType()
export class CreateQuestionInput implements Partial<Question> {
  @Field((returns) => ID)
  public eventId!: string

  @Field()
  public content!: string

  @Field({ nullable: true, defaultValue: false })
  public anonymous: boolean = false
}

@Resolver((of) => Question)
export class QuestionResolver {
  private userRepository: Repository<UserEntity>
  private eventRepository: Repository<EventEntity>
  private questionRepository: Repository<QuestionEntity>

  constructor() {
    this.userRepository = getRepository(UserEntity)
    this.eventRepository = getRepository(EventEntity)
    this.questionRepository = getRepository(QuestionEntity)
  }

  @Query((returns) => QuestionPaged, {
    description: 'Query question by event for Role.Admin.',
  })
  async questionsByEvent(
    @Arg('input', (returns) => QuestionQueryInput) input: QuestionQueryInput,
    @Ctx() ctx: Context,
  ): Promise<QuestionPaged> {
    const userId = ctx.user?.id as string
    const { pagination } = input
    const { offset, limit } = pagination
    const { totalCount, list } = await findQuestionAndCountAll(
      input,
      RoleName.Admin,
      userId,
    )
    const hash = await getQuestionQueryHash(
      { ...input, userId, asRole: RoleName.Admin },
      list,
    )

    return {
      list,
      hash,
      hasNextPage: offset + limit < totalCount,
      totalCount,
      ...pagination,
    }
  }

  @Query((returns) => QuestionPaged, {
    description: 'Query question by event for Role.Audience.',
  })
  async questionsByEventAudience(
    @Arg('input', (returns) => QuestionQueryInput) input: QuestionQueryInput,
    @Ctx() ctx: Context,
  ): Promise<QuestionPaged> {
    const userId = ctx.user?.id as string
    const { pagination } = input
    const { offset, limit } = pagination
    const { totalCount, list } = await findQuestionAndCountAll(
      input,
      RoleName.Audience,
      userId,
    )
    const hash = await getQuestionQueryHash(
      { ...input, userId, asRole: RoleName.Audience },
      list,
    )

    return {
      list,
      hash,
      hasNextPage: offset + limit < totalCount,
      totalCount,
      ...pagination,
    }
  }

  @Query((returns) => QuestionPaged, {
    description: 'Query question by event for Role.Wall.',
  })
  async questionsByEventWall(
    @Arg('input', (returns) => QuestionQueryInput) input: QuestionQueryInput,
    @Ctx() ctx: Context,
  ): Promise<QuestionPaged> {
    const userId = ctx.user?.id as string
    const { pagination } = input
    const { offset, limit } = pagination
    const { totalCount, list } = await findQuestionAndCountAll(
      input,
      RoleName.Wall,
      userId,
    )
    const hash = await getQuestionQueryHash(
      { ...input, userId, asRole: RoleName.Wall },
      list,
    )

    return {
      list,
      hash,
      hasNextPage: offset + limit < totalCount,
      totalCount,
      ...pagination,
    }
  }

  @Query((returns) => QuestionPaged, {
    description: 'Query question by event for Role.Wall.',
  })
  async questionsByMe(
    @Arg('pagination', (returns) => PaginationInput)
    pagination: PaginationInput,
    @Arg('eventId', (returns) => ID)
    eventId: string,
    @Ctx() ctx: Context,
  ): Promise<QuestionPaged> {
    const { offset, limit } = pagination
    const authorId = ctx.user?.id as string
    const totalCount = await this.questionRepository
      .createQueryBuilder('question')
      .innerJoin('question.author', 'author', 'author.id = :authorId', {
        authorId,
      })
      .innerJoin('question.event', 'event', 'event.id = :eventId', { eventId })
      .getCount()
    const list = await this.questionRepository
      .createQueryBuilder('question')
      .innerJoin('question.author', 'author', 'author.id = :authorId', {
        authorId,
      })
      .innerJoin('question.event', 'event', 'event.id = :eventId', { eventId })
      .skip(offset)
      .take(limit)
      .orderBy(getQuestionOrderByCondition(QuestionOrder.Recent))
      .getMany()

    return {
      list,
      hash: '',
      hasNextPage: offset + limit < totalCount,
      totalCount,
      ...pagination,
    }
  }

  @Mutation((returns) => Question, { description: 'Create question' })
  async createQuestion(
    @PubSub('QUESTION_REALTIME_SEARCH')
    publish: Publisher<QuestionRealtimeSearchPayload>,
    @Arg('input', (returns) => CreateQuestionInput) input: CreateQuestionInput,
    @Ctx() ctx: Context,
  ): Promise<QuestionEntity> {
    const { eventId, content, anonymous } = input
    const authorId = ctx.user?.id as string
    const author = await this.userRepository.findOneOrFail(authorId)
    const event = await this.eventRepository.findOneOrFail(eventId)
    const question = this.questionRepository.create({
      reviewStatus: event?.moderation
        ? ReviewStatus.Review
        : ReviewStatus.Publish,
      content,
      anonymous,
      author,
      event,
    })
    await this.questionRepository.save(question)

    await publish({ eventId })

    return question
  }

  @Mutation((returns) => Question, {
    description: 'Update a question review status.',
  })
  async updateQuestionReviewStatus(
    @PubSub('QUESTION_REALTIME_SEARCH')
    publish: Publisher<QuestionRealtimeSearchPayload>,
    @Arg('questionId', (returns) => ID) questionId: string,
    @Arg('reviewStatus', (returns) => ReviewStatus) reviewStatus: ReviewStatus,
  ): Promise<QuestionEntity> {
    await this.questionRepository.update(
      questionId,
      Object.assign(
        { reviewStatus },
        reviewStatus === ReviewStatus.Archive
          ? { top: false }
          : reviewStatus === ReviewStatus.Review
          ? { top: false, star: false }
          : {},
      ),
    )
    const question = await this.questionRepository.findOneOrFail(questionId, {
      relations: ['event'],
    })

    await publish({ eventId: question.event.id })

    return question
  }

  @Mutation((returns) => Question, {
    description: 'Update a question content.',
  })
  async updateQuestionContent(
    @PubSub('QUESTION_REALTIME_SEARCH')
    publish: Publisher<QuestionRealtimeSearchPayload>,
    @Arg('questionId', (returns) => ID) questionId: string,
    @Arg('content') content: string,
  ): Promise<QuestionEntity> {
    await this.questionRepository.update(questionId, { content })
    const question = await this.questionRepository.findOneOrFail(questionId, {
      relations: ['event'],
    })

    await publish({ eventId: question.event.id })

    return question
  }

  @Mutation((returns) => Question, { description: 'Update a question star.' })
  async updateQuestionStar(
    @PubSub('QUESTION_REALTIME_SEARCH')
    publish: Publisher<QuestionRealtimeSearchPayload>,
    @Arg('questionId', (returns) => ID) questionId: string,
    @Arg('star') star: boolean,
  ): Promise<QuestionEntity> {
    await this.questionRepository.update(questionId, { star })
    const question = await this.questionRepository.findOneOrFail(questionId, {
      relations: ['event'],
    })

    await publish({ eventId: question.event.id })

    return question
  }

  @Mutation((returns) => Question, {
    description: 'Top a question. Can only top one question at a time.',
  })
  async updateQuestionTop(
    @PubSub('QUESTION_REALTIME_SEARCH')
    publish: Publisher<QuestionRealtimeSearchPayload>,
    @Arg('questionId', (returns) => ID) questionId: string,
    @Arg('top') top: boolean,
  ): Promise<QuestionEntity> {
    const event = await this.questionRepository
      .createQueryBuilder()
      .relation(QuestionEntity, 'event')
      .of(questionId)
      .loadOne()

    if (top) {
      // cancel preview top questions
      await this.questionRepository.update({ event, top: true }, { top: false })
    }

    await this.questionRepository.update(questionId, { top })
    const question = await this.questionRepository.findOneOrFail(questionId)

    await publish({ eventId: event.id })

    return question
  }

  @Mutation((returns) => Question, {
    description: 'Delete a question by id.',
  })
  async deleteQuestion(
    @PubSub('QUESTION_REALTIME_SEARCH')
    publish: Publisher<QuestionRealtimeSearchPayload>,
    @Arg('questionId', (returns) => ID) questionId: string,
  ): Promise<Pick<QuestionEntity, 'id'>> {
    const event = await this.questionRepository
      .createQueryBuilder()
      .relation(QuestionEntity, 'event')
      .of(questionId)
      .loadOne()
    await this.questionRepository.softDelete(questionId)

    await publish({ eventId: event.id })

    return { id: questionId }
  }

  @Mutation((returns) => Int, {
    description: 'Delete all Review questions by event.',
  })
  async deleteAllReviewQuestions(
    @PubSub('QUESTION_REALTIME_SEARCH')
    publish: Publisher<QuestionRealtimeSearchPayload>,
    @Arg('eventId', (returns) => ID) eventId: string,
  ): Promise<number> {
    const event = await this.eventRepository.findOneOrFail(eventId)
    const { affected } = await this.questionRepository.softDelete({
      event,
      reviewStatus: ReviewStatus.Review,
    })

    await publish({ eventId })

    return Number(affected)
  }

  @Mutation((returns) => Int, {
    description: 'Publish all Review questions by event.',
  })
  async publishAllReviewQuestions(
    @PubSub('QUESTION_REALTIME_SEARCH')
    publish: Publisher<QuestionRealtimeSearchPayload>,
    @Arg('eventId', (returns) => ID) eventId: string,
  ): Promise<number> {
    const event = await this.eventRepository.findOneOrFail(eventId)
    const { affected } = await this.questionRepository.update(
      {
        event,
        reviewStatus: ReviewStatus.Review,
      },
      { reviewStatus: ReviewStatus.Publish },
    )

    await publish({ eventId })

    return Number(affected)
  }

  @Mutation((returns) => Question, { description: 'Vote a question.' })
  async voteUpQuestion(
    @PubSub('QUESTION_REALTIME_SEARCH')
    publish: Publisher<QuestionRealtimeSearchPayload>,
    @Arg('questionId', (returns) => ID) questionId: string,
    @Ctx() ctx: Context,
  ): Promise<QuestionEntity> {
    const userId = ctx.user?.id as string
    if (await getVoted(ctx, questionId)) {
      await this.questionRepository
        .createQueryBuilder()
        .relation(QuestionEntity, 'voteUpUsers')
        .of(questionId)
        .remove(userId)
      await this.questionRepository.increment(
        { id: questionId },
        'voteUpCount',
        -1,
      )
    } else {
      await this.questionRepository
        .createQueryBuilder()
        .relation(QuestionEntity, 'voteUpUsers')
        .of(questionId)
        .add(userId)
      await this.questionRepository.increment(
        { id: questionId },
        'voteUpCount',
        1,
      )
    }
    const question = await this.questionRepository.findOneOrFail(questionId, {
      relations: ['event'],
    })

    await publish({ eventId: question.event.id })

    return question
  }
}

async function getVoted(ctx: Context, questionId: string) {
  const userId = ctx.user?.id as string
  if (!userId) return false
  const question = await getRepository(QuestionEntity)
    .createQueryBuilder('question')
    .where({ id: questionId })
    .innerJoin('question.voteUpUsers', 'user', 'user.id = :userId', { userId })
    .getOne()

  return Boolean(question)
}

function getQuestionOrderByCondition(
  questionOrder: QuestionOrder,
): OrderByCondition {
  switch (questionOrder) {
    case QuestionOrder.Recent:
      return {
        'question.top': 'DESC',
        'question.createdAt': 'DESC',
        'question.voteUpCount': 'DESC',
      }
    case QuestionOrder.Oldest:
      return {
        'question.top': 'DESC',
        'question.createdAt': 'ASC',
        'question.voteUpCount': 'DESC',
      }
    case QuestionOrder.Starred:
      return {
        'question.top': 'DESC',
        'question.star': 'DESC',
        'question.createdAt': 'DESC',
      }
    default:
      // QuestionOrder.Popular:
      return {
        'question.top': 'DESC',
        'question.voteUpCount': 'DESC',
        'question.createdAt': 'DESC',
      }
  }
}

export async function findQuestionAndCountAll(
  queryInput: QuestionQueryInput,
  asRole: RoleName,
  userId: string,
): Promise<{ list: QuestionEntity[]; totalCount: number }> {
  const questionRepository = getRepository(QuestionEntity)
  const {
    eventId,
    pagination,
    questionFilter,
    searchString,
    order,
  } = queryInput
  const { offset, limit } = pagination

  if (asRole === RoleName.Admin) {
    const options = [
      ...(questionFilter === QuestionFilter.Review ? [] : [{ top: true }]),
      Object.assign(
        questionFilter === QuestionFilter.Starred
          ? { star: true }
          : { reviewStatus: questionFilter },
        { content: Like(`%${searchString}%`) },
      ),
    ]
    const totalCount = await questionRepository
      .createQueryBuilder('question')
      .innerJoin(
        'question.event',
        'event',
        'event.id = :eventId AND event.owner.id = :ownerId',
        {
          eventId,
          ownerId: userId,
        },
      )
      .where(options)
      .getCount()
    const list = await questionRepository
      .createQueryBuilder('question')
      .innerJoin(
        'question.event',
        'event',
        'event.id = :eventId AND event.owner.id = :ownerId',
        {
          eventId,
          ownerId: userId,
        },
      )
      .where(options)
      .skip(offset)
      .take(limit)
      .orderBy(getQuestionOrderByCondition(order))
      .getMany()

    return { totalCount, list }
  } else if (asRole === RoleName.Audience) {
    const options = [
      { top: true },
      { reviewStatus: ReviewStatus.Publish },
      { reviewStatus: ReviewStatus.Review, author: { id: userId } },
    ]
    const totalCount = await questionRepository
      .createQueryBuilder('question')
      .innerJoin('question.event', 'event', 'event.id = :eventId', {
        eventId,
      })
      .where(options)
      .getCount()
    const list = await questionRepository
      .createQueryBuilder('question')
      .innerJoin('question.event', 'event', 'event.id = :eventId', {
        eventId,
      })
      .where(options)
      .skip(offset)
      .take(limit)
      .orderBy(getQuestionOrderByCondition(order))
      .getMany()

    return { totalCount, list }
  } else {
    // asRole===RoleName.Wall
    const options = [{ top: true }, { reviewStatus: ReviewStatus.Publish }]
    const totalCount = await questionRepository
      .createQueryBuilder('question')
      .innerJoin('question.event', 'event', 'event.id = :eventId', { eventId })
      .where(options)
      .getCount()
    const list = await questionRepository
      .createQueryBuilder('question')
      .innerJoin('question.event', 'event', 'event.id = :eventId', { eventId })
      .where(options)
      .skip(offset)
      .take(limit)
      .orderBy(getQuestionOrderByCondition(order))
      .getMany()

    return { totalCount, list }
  }
}

async function getQuestionQueryHash(
  query: QuestionQueryInput & { userId: string; asRole: RoleName },
  questionList: QuestionEntity[],
) {
  const questionQueryMetaRepo = getRepository(QuestionQueryMeta)
  const hash = MD5(JSON.stringify(query)).toString(enc.Hex)
  const queryMeta = questionQueryMetaRepo.create({
    id: hash,
    query,
    list: JSON.stringify(
      questionList.map((item) => ({ id: item.id, updatedAt: item.updatedAt })),
    ),
  })
  await questionQueryMetaRepo.save(queryMeta)

  return hash
}
