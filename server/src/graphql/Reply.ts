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
import { Reply as ReplyEntity } from '../entity/Reply'
import { Event } from './Event-type'
import { User } from './User'
import { getRepository, Repository, Like, OrderByCondition } from 'typeorm'
import { RoleName } from '../entity/Role'
import { QuestionQueryMeta } from '../entity/QuestionQueryMeta'
import { MD5, enc } from 'crypto-js'
import { QuestionRealtimeSearchPayload } from './QuestionSubscription'

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

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}

@Resolver((of) => Reply)
export class ReplyResolver {
  private userRepository: Repository<UserEntity>
  private eventRepository: Repository<EventEntity>
  private questionRepository: Repository<QuestionEntity>
  private replyRepository: Repository<ReplyEntity>

  constructor() {
    this.userRepository = getRepository(UserEntity)
    this.eventRepository = getRepository(EventEntity)
    this.questionRepository = getRepository(QuestionEntity)
    this.replyRepository = getRepository(ReplyEntity)
  }

  @Query((returns) => [Reply])
  async repliesByQuestion(
    @Arg('questionId', (returns) => ID) questionId: string,
    @Ctx() ctx: Context,
  ): Promise<ReplyEntity[]> {
    const replies = await this.replyRepository.find({
      question: { id: questionId },
    })

    return replies
  }

  @Mutation((returns) => Reply)
  async createReply(
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
    const reply = this.replyRepository.create({
      content,
      isModerator: Boolean(
        question?.event?.owner || question?.event?.guestes.length,
      ),
      question: { id: questionId },
      author: { id: authorId },
    })

    await this.replyRepository.save(reply)

    return reply
  }
}
