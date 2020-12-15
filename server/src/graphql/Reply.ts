import {
  ObjectType,
  Field,
  ID,
  Resolver,
  Query,
  Arg,
  Ctx,
  Mutation,
  InputType,
  Root,
  Publisher,
  PubSub,
} from 'type-graphql'
import { Context } from '../context'
import { Question as QuestionEntity } from '../entity/Question'
import { Question } from './Question'
import { User } from './User'
import { User as UserEntity } from '../entity/User'
import { ReviewStatus, RoleName } from '../constant'
import { Reply as ReplyEntity } from '../entity/Reply'
import { getRepository, Repository } from 'typeorm'
import { IPagedType, PaginationInput } from './Pagination'
import { enc, MD5 } from 'crypto-js'
import { ReplyQueryMeta } from '../entity/ReplyQueryMeta'
import { ReplyRealtimeSearchPayload } from './ReplySubscription'

@ObjectType()
export class Reply {
  private replyRepository: Repository<ReplyEntity>

  constructor() {
    this.replyRepository = getRepository(ReplyEntity)
  }

  @Field((returns) => ID)
  public id!: string

  @Field()
  public content!: string

  @Field((returns) => ReviewStatus)
  public reviewStatus!: ReviewStatus

  @Field({ description: 'If author is a moderator of the event?' })
  public isModerator!: boolean

  @Field((returns) => Question)
  async question(@Root() root: Reply): Promise<QuestionEntity> {
    const question = await this.replyRepository
      .createQueryBuilder()
      .relation(ReplyEntity, 'question')
      .of(root.id)
      .loadOne()

    return question
  }

  @Field((returns) => User)
  async author(@Root() root: Reply): Promise<UserEntity> {
    const user = await this.replyRepository
      .createQueryBuilder()
      .relation(ReplyEntity, 'author')
      .of(root.id)
      .loadOne()

    return user
  }

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}

@ObjectType({ implements: IPagedType })
export class ReplyPaged implements IPagedType {
  offset!: number
  limit!: number
  totalCount!: number
  hasNextPage!: boolean

  @Field()
  public hash!: string

  @Field((returns) => [Reply])
  public list!: ReplyEntity[]
}

@InputType()
export class ReplyQueryInput {
  @Field((returns) => ID)
  public questionId!: string

  @Field((returns) => PaginationInput)
  public pagination!: PaginationInput
}

@Resolver((of) => Reply)
export class ReplyResolver {
  private questionRepository: Repository<QuestionEntity>
  private replyRepository: Repository<ReplyEntity>

  constructor() {
    this.questionRepository = getRepository(QuestionEntity)
    this.replyRepository = getRepository(ReplyEntity)
  }

  @Query((returns) => ReplyPaged)
  async repliesByQuestion(
    @Arg('input', (returns) => ReplyQueryInput) input: ReplyQueryInput,
    @Ctx() ctx: Context,
  ): Promise<ReplyPaged> {
    const userId = ctx.user?.id as string
    const { pagination } = input
    const { offset, limit } = pagination
    const { totalCount, list } = await findReplyAndCountAll(
      input,
      RoleName.Admin,
      userId,
    )
    const hash = await getReplyQueryHash(
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

  @Mutation((returns) => Reply)
  async createReply(
    @PubSub('REPLY_REALTIME_SEARCH')
    publish: Publisher<ReplyRealtimeSearchPayload>,
    @Arg('questionId', (returns) => ID) questionId: string,
    @Arg('content') content: string,
    @Ctx() ctx: Context,
  ): Promise<ReplyEntity> {
    const authorId = ctx.user?.id
    const question = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.event', 'event')
      .leftJoinAndSelect('event.owner', 'owner', 'owner.id = :authorId', {
        authorId,
      })
      .leftJoinAndSelect('event.guestes', 'guest', 'guest.id = :authorId', {
        authorId,
      })
      .where('question.id = :questionId', { questionId })
      .getOne()
    await this.questionRepository.increment({ id: questionId }, 'replyCount', 1)
    const reply = this.replyRepository.create({
      content,
      isModerator: Boolean(
        question?.event?.owner || question?.event?.guestes.length,
      ),
      question: { id: questionId },
      author: { id: authorId },
    })
    await this.replyRepository.save(reply)

    await publish({ questionId })

    return reply
  }

  @Mutation((returns) => Reply, {
    description: "Update a reply's content.",
  })
  async updateReplyContent(
    @PubSub('REPLY_REALTIME_SEARCH')
    publish: Publisher<ReplyRealtimeSearchPayload>,
    @Arg('replyId', (returns) => ID) replyId: string,
    @Arg('content') content: string,
  ): Promise<ReplyEntity> {
    await this.replyRepository.update(replyId, { content })
    const reply = await this.replyRepository.findOneOrFail(replyId, {
      relations: ['question'],
    })

    await publish({ questionId: reply.question.id })

    return reply
  }

  @Mutation((returns) => Reply, {
    description: "Update a reply's review status.",
  })
  async updateReplyReviewStatus(
    @PubSub('REPLY_REALTIME_SEARCH')
    publish: Publisher<ReplyRealtimeSearchPayload>,
    @Arg('replyId', (returns) => ID) replyId: string,
    @Arg('reviewStatus', (returns) => ReviewStatus) reviewStatus: ReviewStatus,
  ): Promise<ReplyEntity> {
    await this.replyRepository.update(replyId, { reviewStatus })
    const reply = await this.replyRepository.findOneOrFail(replyId, {
      relations: ['question'],
    })

    await publish({ questionId: reply.question.id })

    return reply
  }

  @Mutation((returns) => Reply, {
    description: 'Delete a reply by id.',
  })
  async deleteReply(
    @PubSub('REPLY_REALTIME_SEARCH')
    publish: Publisher<ReplyRealtimeSearchPayload>,
    @Arg('replyId', (returns) => ID) replyId: string,
  ): Promise<Pick<ReplyEntity, 'id'>> {
    const question = await this.replyRepository
      .createQueryBuilder()
      .relation(ReplyEntity, 'question')
      .of(replyId)
      .loadOne()
    await this.replyRepository.softDelete(replyId)

    await publish({ questionId: question.id })

    return { id: replyId }
  }
}

export async function findReplyAndCountAll(
  queryInput: ReplyQueryInput,
  asRole: RoleName,
  userId: string,
): Promise<{ list: ReplyEntity[]; totalCount: number }> {
  const replyRepository = getRepository(ReplyEntity)
  const { questionId, pagination } = queryInput
  const { offset, limit } = pagination

  if (asRole === RoleName.Admin) {
    const totalCount = await replyRepository
      .createQueryBuilder('reply')
      .innerJoin('reply.question', 'question', 'question.id = :questionId', {
        questionId,
      })
      .getCount()
    const list = await replyRepository
      .createQueryBuilder('reply')
      .innerJoin('reply.question', 'question', 'question.id = :questionId', {
        questionId,
      })
      .skip(offset)
      .take(limit)
      .getMany()

    return { totalCount, list }
  } else {
    return { totalCount: 0, list: [] }
  }
}

async function getReplyQueryHash(
  query: ReplyQueryInput & { userId: string; asRole: RoleName },
  replyList: ReplyEntity[],
) {
  const replyQueryMetaRepo = getRepository(ReplyQueryMeta)
  const hash = MD5(JSON.stringify(query)).toString(enc.Hex)
  const queryMeta = replyQueryMetaRepo.create({
    id: hash,
    query,
    list: JSON.stringify(
      replyList.map((item) => ({ id: item.id, updatedAt: item.updatedAt })),
    ),
  })
  await replyQueryMetaRepo.save(queryMeta)

  return hash
}
